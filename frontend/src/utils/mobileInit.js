import axios from 'axios';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

// Default Cloudflare Tunnel URL (accessible from anywhere: 4G, 5G, Wi-Fi without firewall issues)
export const DEFAULT_TUNNEL_API = 'https://funny-impose-integrity-quit.trycloudflare.com/api';

// Default LAN IP for development / local testing on same Wi-Fi
export const DEFAULT_LAN_API = 'http://10.223.59.130:5005/api';

// List of candidate endpoints for automatic failover and resilience
export const CANDIDATE_APIS = [
  'https://funny-impose-integrity-quit.trycloudflare.com/api',
  'http://10.223.59.130:5005/api',
  'http://192.168.29.252:5005/api',
  'http://10.0.2.2:5005/api',
  'http://localhost:5005/api'
];

let currentWorkingApi = DEFAULT_TUNNEL_API;

/**
 * Returns the currently active backend API URL.
 * Checks localStorage first, then native platform detection, then falls back to /api.
 */
export const getActiveApiUrl = () => {
  try {
    const saved = localStorage.getItem('kisan_backend_url');
    if (saved && saved.trim()) {
      // If running as native Android app, clear any stale dead tunnel or localhost
      if (saved.includes('serve-eventually-participated-que.trycloudflare.com') || saved.includes('agroxai.onrender.com')) {
        localStorage.removeItem('kisan_backend_url');
      } else {
        const clean = saved.trim().replace(/\/+$/, '');
        return clean.endsWith('/api') ? clean : `${clean}/api`;
      }
    }
  } catch (e) {
    // Ignore localStorage errors
  }

  // If running as native Android app, default to public Cloudflare tunnel or active working API
  if (Capacitor.isNativePlatform()) {
    return currentWorkingApi || DEFAULT_TUNNEL_API;
  }

  // In web browser dev/production
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl !== '/api') {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  return '/api';
};

/**
 * Saves a new backend server URL to localStorage.
 */
export const setActiveApiUrl = (url) => {
  if (!url || !url.trim()) {
    localStorage.removeItem('kisan_backend_url');
  } else {
    let clean = url.trim().replace(/\/+$/, '');
    localStorage.setItem('kisan_backend_url', clean);
    currentWorkingApi = clean.endsWith('/api') ? clean : `${clean}/api`;
  }
};

/**
 * Fast background check to select the quickest responding candidate endpoint
 */
export const autoDetectWorkingServer = async () => {
  if (!Capacitor.isNativePlatform()) return;
  for (const url of CANDIDATE_APIS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${url}/app-version`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        currentWorkingApi = url;
        console.log('[KisanVision] Connected to active server:', url);
        return url;
      }
    } catch (e) {
      // Continue checking next candidate
    }
  }
};

/**
 * Initializes mobile native features (Status Bar, Back Button, Axios Interceptors)
 */
export const initMobileApp = () => {
  // Run background server probe on app startup
  autoDetectWorkingServer().catch(() => {});

  // Global Axios Request Interceptor to dynamically route /api requests to active backend in native APK
  axios.interceptors.request.use((config) => {
    const activeBase = getActiveApiUrl();
    const baseUrlWithoutApi = activeBase.replace(/\/api\/?$/, '');

    // Inject token if available
    try {
      const token = localStorage.getItem('cv_token') || localStorage.getItem('token');
      if (token && !config.headers?.Authorization) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {}

    if (config.url) {
      // Intercept and replace dead/stale render URLs
      if (config.url.includes('agroxai.onrender.com') || config.url.includes('serve-eventually-participated-que.trycloudflare.com')) {
        config.url = config.url
          .replace(/https?:\/\/agroxai\.onrender\.com\/api/, activeBase)
          .replace(/https?:\/\/agroxai\.onrender\.com/, baseUrlWithoutApi)
          .replace(/https?:\/\/serve-eventually-participated-que\.trycloudflare\.com\/api/, activeBase)
          .replace(/https?:\/\/serve-eventually-participated-que\.trycloudflare\.com/, baseUrlWithoutApi);
      }
      
      // On mobile native APK, localhost/127.0.0.1 will fail, route to activeBase
      if (Capacitor.isNativePlatform()) {
        if (config.url.includes('localhost:5005') || config.url.includes('127.0.0.1:5005')) {
          config.url = config.url.replace(/https?:\/\/(localhost|127\.0\.0\.1):5005\/api/, activeBase)
                                 .replace(/https?:\/\/(localhost|127\.0\.0\.1):5005/, baseUrlWithoutApi);
        }
      }

      if (Capacitor.isNativePlatform() || (activeBase && activeBase !== '/api')) {
        if (config.url.startsWith('/api')) {
          config.url = `${baseUrlWithoutApi}${config.url}`;
        } else if (!config.url.startsWith('http://') && !config.url.startsWith('https://')) {
          config.url = `${activeBase}/${config.url.replace(/^\//, '')}`;
        }
      }
    }

    if (config.baseURL && (config.baseURL === '/api' || config.baseURL.startsWith('/api') || config.baseURL.includes('agroxai.onrender.com'))) {
      config.baseURL = activeBase;
    }

    return config;
  }, (error) => Promise.reject(error));

  // Global Axios Response Interceptor with Automatic Multi-Endpoint Failover
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;
      if (!config || config._retry || !Capacitor.isNativePlatform()) {
        return Promise.reject(error);
      }

      const isNetworkErr = !error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED';
      if (isNetworkErr) {
        config._retry = true;
        for (const candidate of CANDIDATE_APIS) {
          if (candidate !== currentWorkingApi) {
            try {
              const oldBase = currentWorkingApi;
              const newUrl = config.url.replace(oldBase, candidate);
              config.url = newUrl;
              config.baseURL = candidate;
              const res = await axios(config);
              currentWorkingApi = candidate;
              console.log('[KisanVision] Failover successful to:', candidate);
              return res;
            } catch (failoverErr) {
              // Try next candidate
            }
          }
        }
      }
      return Promise.reject(error);
    }
  );

  // Native Android specific setup
  if (Capacitor.isNativePlatform()) {
    // Configure dark status bar
    try {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      StatusBar.setBackgroundColor({ color: '#0A0F1E' }).catch(() => {});
    } catch (e) {}

    // Handle Android Hardware Back Button
    try {
      CapApp.addListener('backButton', ({ canGoBack }) => {
        const path = window.location.pathname;
        if (path === '/' || path === '/login') {
          CapApp.exitApp();
        } else {
          window.history.back();
        }
      });
    } catch (e) {}
  }
};
