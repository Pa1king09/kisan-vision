package com.kisanvision.app;

import android.Manifest;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.util.ArrayList;
import java.util.Locale;

@CapacitorPlugin(
    name = "KisanSpeech",
    permissions = {
        @Permission(
            strings = { Manifest.permission.RECORD_AUDIO },
            alias = "recordAudio"
        )
    }
)
public class KisanSpeechPlugin extends Plugin {

    private SpeechRecognizer speechRecognizer;
    private TextToSpeech tts;
    private boolean ttsReady = false;
    private PluginCall activeListeningCall;
    private volatile boolean isExplicitlyStopping = false;
    private volatile boolean isListeningActive = false;

    @Override
    public void load() {
        super.load();
        initTts();
    }

    private void initTts() {
        try {
            tts = new TextToSpeech(getContext(), status -> {
                if (status == TextToSpeech.SUCCESS) {
                    ttsReady = true;
                    try {
                        tts.setSpeechRate(0.95f);
                        tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                            @Override
                            public void onStart(String utteranceId) {
                                JSObject ret = new JSObject();
                                ret.put("speaking", true);
                                notifyListeners("ttsState", ret);
                            }

                            @Override
                            public void onDone(String utteranceId) {
                                JSObject ret = new JSObject();
                                ret.put("speaking", false);
                                notifyListeners("ttsState", ret);
                            }

                            @Override
                            public void onError(String utteranceId) {
                                JSObject ret = new JSObject();
                                ret.put("speaking", false);
                                notifyListeners("ttsState", ret);
                            }
                        });
                    } catch (Exception ignored) {}
                }
            });
        } catch (Exception e) {
            ttsReady = false;
        }
    }

    @PluginMethod
    public void isAvailable(PluginCall call) {
        boolean speechAvailable = SpeechRecognizer.isRecognitionAvailable(getContext());
        JSObject ret = new JSObject();
        ret.put("speechRecognition", speechAvailable);
        ret.put("tts", true);
        ret.put("isNative", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void startListening(PluginCall call) {
        if (getPermissionState("recordAudio") != PermissionState.GRANTED) {
            requestPermissionForAlias("recordAudio", call, "recordAudioCallback");
            return;
        }
        startListeningInternal(call);
    }

    @PermissionCallback
    private void recordAudioCallback(PluginCall call) {
        if (getPermissionState("recordAudio") == PermissionState.GRANTED) {
            startListeningInternal(call);
        } else {
            JSObject ret = new JSObject();
            ret.put("error", "Microphone permission is required for voice input. Please allow microphone access in Android settings.");
            notifyListeners("speechError", ret);
            call.reject("Microphone permission is required for voice input. Please allow microphone access in Android settings.");
        }
    }

    private synchronized void cleanupRecognizer() {
        getActivity().runOnUiThread(() -> {
            try {
                if (speechRecognizer != null) {
                    speechRecognizer.setRecognitionListener(null);
                    speechRecognizer.cancel();
                    speechRecognizer.destroy();
                    speechRecognizer = null;
                }
            } catch (Exception ignored) {}
            isListeningActive = false;
            isExplicitlyStopping = false;
        });
    }

    private void startListeningInternal(PluginCall call) {
        final String language = call.getString("language", "en-IN");
        this.activeListeningCall = call;
        this.isExplicitlyStopping = false;
        this.isListeningActive = true;

        getActivity().runOnUiThread(() -> {
            try {
                // 1. Immediately stop any active TTS output so audio recording hardware is free
                if (tts != null) {
                    try {
                        tts.stop();
                    } catch (Exception ignored) {}
                }

                // 2. Clean up any existing recognizer before starting a new session
                boolean hadPrevious = false;
                if (speechRecognizer != null) {
                    try {
                        speechRecognizer.setRecognitionListener(null);
                        speechRecognizer.cancel();
                        speechRecognizer.destroy();
                    } catch (Exception ignored) {}
                    speechRecognizer = null;
                    hadPrevious = true;
                }

                if (!SpeechRecognizer.isRecognitionAvailable(getContext())) {
                    isListeningActive = false;
                    call.reject("Speech recognition service is not available on this device.");
                    activeListeningCall = null;
                    return;
                }

                // If a recognizer was just destroyed, post with 60ms delay to let the Android binder unbind cleanly
                long delay = hadPrevious ? 60L : 0L;
                new Handler(Looper.getMainLooper()).postDelayed(() -> {
                    try {
                        if (!isListeningActive || activeListeningCall == null) return;

                        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(getContext());
                        speechRecognizer.setRecognitionListener(new RecognitionListener() {
                            @Override
                            public void onReadyForSpeech(Bundle params) {
                                JSObject ret = new JSObject();
                                ret.put("status", "ready");
                                notifyListeners("speechReady", ret);
                            }

                            @Override
                            public void onBeginningOfSpeech() {
                                JSObject ret = new JSObject();
                                ret.put("status", "listening");
                                notifyListeners("speechStart", ret);
                            }

                            @Override
                            public void onRmsChanged(float rmsdB) {}

                            @Override
                            public void onBufferReceived(byte[] buffer) {}

                            @Override
                            public void onEndOfSpeech() {
                                JSObject ret = new JSObject();
                                ret.put("status", "end");
                                notifyListeners("speechEnd", ret);
                            }

                            @Override
                            public void onError(int error) {
                                isListeningActive = false;

                                // 1. User stopped or canceled recognition, or client abort — clean exit, NO error alert
                                if (isExplicitlyStopping || error == SpeechRecognizer.ERROR_CLIENT) {
                                    cleanupRecognizer();
                                    JSObject ret = new JSObject();
                                    ret.put("status", "cancelled");
                                    notifyListeners("speechEnd", ret);
                                    if (activeListeningCall != null) {
                                        JSObject resolveRet = new JSObject();
                                        resolveRet.put("text", "");
                                        resolveRet.put("cancelled", true);
                                        activeListeningCall.resolve(resolveRet);
                                        activeListeningCall = null;
                                    }
                                    return;
                                }

                                // 2. Silence / timeout / no speech — clean exit, NO error alert
                                if (error == SpeechRecognizer.ERROR_NO_MATCH || error == SpeechRecognizer.ERROR_SPEECH_TIMEOUT) {
                                    cleanupRecognizer();
                                    JSObject ret = new JSObject();
                                    ret.put("status", "end");
                                    notifyListeners("speechEnd", ret);
                                    if (activeListeningCall != null) {
                                        JSObject resolveRet = new JSObject();
                                        resolveRet.put("text", "");
                                        resolveRet.put("noSpeech", true);
                                        activeListeningCall.resolve(resolveRet);
                                        activeListeningCall = null;
                                    }
                                    return;
                                }

                                // 3. Busy recognizer — clean up and resolve silently without throwing fatal toast
                                if (error == SpeechRecognizer.ERROR_RECOGNIZER_BUSY) {
                                    cleanupRecognizer();
                                    JSObject ret = new JSObject();
                                    ret.put("status", "end");
                                    notifyListeners("speechEnd", ret);
                                    if (activeListeningCall != null) {
                                        JSObject resolveRet = new JSObject();
                                        resolveRet.put("text", "");
                                        resolveRet.put("busy", true);
                                        activeListeningCall.resolve(resolveRet);
                                        activeListeningCall = null;
                                    }
                                    return;
                                }

                                // Clean up recognizer before reporting any actual error
                                cleanupRecognizer();

                                // 4. Actionable hardware/permission errors
                                String message = null;
                                switch (error) {
                                    case SpeechRecognizer.ERROR_AUDIO:
                                        message = "Audio recording error. Please check microphone.";
                                        break;
                                    case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                                        message = "Microphone permission is required for voice input. Please allow microphone access in Android settings.";
                                        break;
                                    case SpeechRecognizer.ERROR_NETWORK:
                                    case SpeechRecognizer.ERROR_NETWORK_TIMEOUT:
                                        message = "Network error. Please check internet connection.";
                                        break;
                                    case SpeechRecognizer.ERROR_SERVER:
                                    case SpeechRecognizer.ERROR_SERVER_DISCONNECTED:
                                        message = "Speech server error. Please try again.";
                                        break;
                                    case SpeechRecognizer.ERROR_TOO_MANY_REQUESTS:
                                        message = "Speech server busy. Please try again in a moment.";
                                        break;
                                    default:
                                        message = null;
                                        break;
                                }

                                if (message != null) {
                                    JSObject ret = new JSObject();
                                    ret.put("error", message);
                                    ret.put("code", error);
                                    notifyListeners("speechError", ret);

                                    if (activeListeningCall != null) {
                                        activeListeningCall.resolve(ret);
                                        activeListeningCall = null;
                                    }
                                } else {
                                    JSObject ret = new JSObject();
                                    ret.put("status", "end");
                                    notifyListeners("speechEnd", ret);
                                    if (activeListeningCall != null) {
                                        JSObject resolveRet = new JSObject();
                                        resolveRet.put("text", "");
                                        resolveRet.put("status", "end");
                                        activeListeningCall.resolve(resolveRet);
                                        activeListeningCall = null;
                                    }
                                }
                            }

                            @Override
                            public void onResults(Bundle results) {
                                isListeningActive = false;
                                isExplicitlyStopping = false;
                                ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                                String transcript = "";
                                if (matches != null && !matches.isEmpty()) {
                                    transcript = matches.get(0);
                                }

                                JSObject ret = new JSObject();
                                ret.put("text", transcript);
                                notifyListeners("speechResult", ret);

                                if (activeListeningCall != null) {
                                    activeListeningCall.resolve(ret);
                                    activeListeningCall = null;
                                }

                                // Clean up immediately after results are received so the binder is 100% idle
                                cleanupRecognizer();
                            }

                            @Override
                            public void onPartialResults(Bundle partialResults) {
                                ArrayList<String> matches = partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                                if (matches != null && !matches.isEmpty()) {
                                    JSObject ret = new JSObject();
                                    ret.put("text", matches.get(0));
                                    ret.put("isPartial", true);
                                    notifyListeners("speechPartial", ret);
                                }
                            }

                            @Override
                            public void onEvent(int eventType, Bundle params) {}
                        });

                        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, language);
                        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, language);
                        intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
                        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);

                        speechRecognizer.startListening(intent);

                        JSObject ret = new JSObject();
                        ret.put("started", true);
                        notifyListeners("speechListening", ret);
                    } catch (Exception e) {
                        cleanupRecognizer();
                        if (activeListeningCall != null) {
                            activeListeningCall.reject("Failed to start speech recognition: " + e.getMessage());
                            activeListeningCall = null;
                        }
                    }
                }, delay);
            } catch (Exception e) {
                cleanupRecognizer();
                if (activeListeningCall != null) {
                    activeListeningCall.reject("Failed to start speech recognition: " + e.getMessage());
                    activeListeningCall = null;
                }
            }
        });
    }

    @PluginMethod
    public void stopListening(PluginCall call) {
        isExplicitlyStopping = true;
        isListeningActive = false;
        cleanupRecognizer();
        JSObject ret = new JSObject();
        ret.put("stopped", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void speak(PluginCall call) {
        String text = call.getString("text", "");
        if (text == null || text.trim().isEmpty()) {
            call.resolve();
            return;
        }
        final String language = call.getString("language", "en-IN");
        final String cleanText = text.replaceAll("[*_~`#\\[\\]\\(\\)>]", " ").replaceAll("\\s+", " ").trim();

        getActivity().runOnUiThread(() -> {
            try {
                if (tts == null) {
                    initTts();
                }
                if (tts != null) {
                    Locale locale = parseLocale(language);
                    try {
                        int avail = tts.isLanguageAvailable(locale);
                        if (avail >= TextToSpeech.LANG_AVAILABLE) {
                            tts.setLanguage(locale);
                        } else {
                            tts.setLanguage(Locale.ENGLISH);
                        }
                    } catch (Exception ex) {
                        tts.setLanguage(Locale.ENGLISH);
                    }

                    tts.stop();
                    tts.speak(cleanText, TextToSpeech.QUEUE_FLUSH, null, "KisanTTS_" + System.currentTimeMillis());

                    JSObject ret = new JSObject();
                    ret.put("success", true);
                    call.resolve(ret);
                } else {
                    call.reject("Text-to-speech engine unavailable.");
                }
            } catch (Exception e) {
                call.reject("TTS Error: " + e.getMessage());
            }
        });
    }

    @PluginMethod
    public void stopSpeaking(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            try {
                if (tts != null && tts.isSpeaking()) {
                    tts.stop();
                }
                JSObject ret = new JSObject();
                ret.put("stopped", true);
                call.resolve(ret);
            } catch (Exception e) {
                call.resolve();
            }
        });
    }

    private Locale parseLocale(String lang) {
        if (lang == null || lang.isEmpty()) return new Locale("en", "IN");
        if (lang.contains("-")) {
            String[] parts = lang.split("-");
            return new Locale(parts[0], parts[1]);
        } else if (lang.contains("_")) {
            String[] parts = lang.split("_");
            return new Locale(parts[0], parts[1]);
        }
        return new Locale(lang);
    }

    @Override
    protected void handleOnDestroy() {
        try {
            if (tts != null) {
                tts.stop();
                tts.shutdown();
                tts = null;
            }
            if (speechRecognizer != null) {
                speechRecognizer.destroy();
                speechRecognizer = null;
            }
        } catch (Exception ignored) {}
        super.handleOnDestroy();
    }
}
