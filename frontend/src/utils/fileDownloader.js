import axios from 'axios';
import { getActiveApiUrl } from './mobileInit';

/**
 * Universal file download & share utility for Kisan Vision.
 * Handles Android WebView, Capacitor native APK, and desktop browsers seamlessly.
 */
export async function downloadOrShareReport({
  blob,
  dataUrl,
  htmlContent,
  fileName = 'KisanVision_Report.html',
  title = 'Kisan Vision Crop Advisory Report',
  text = 'Kisan Vision Smart Agriculture Advisory Report',
  mimeType = 'text/html'
}) {
  const result = { success: false, method: null, url: null, error: null };

  // 1. Try Native Web Share API with File (Supported in Android Chrome / WebView)
  if (blob && typeof navigator !== 'undefined' && navigator.canShare) {
    try {
      const file = new File([blob], fileName, { type: mimeType });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title,
          text,
          files: [file]
        });
        result.success = true;
        result.method = 'native_share_file';
        return result;
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // User closed or dismissed the share sheet
        result.success = true;
        result.method = 'user_dismissed_share';
        return result;
      }
      console.warn('Native file share failed:', err);
    }
  }

  // 2. Try Backend Download Endpoint (Triggers native Android DownloadManager)
  if (htmlContent) {
    try {
      const apiBase = getActiveApiUrl();
      const res = await axios.post(`${apiBase}/export-report`, {
        crop: title,
        html: htmlContent,
        fileName
      }, { timeout: 7000 });

      if (res.data?.success && res.data?.downloadUrl) {
        result.url = res.data.downloadUrl;
        result.success = true;
        result.method = 'backend_download';

        // Trigger native download via browser/system intent
        window.open(res.data.downloadUrl, '_system');
        return result;
      }
    } catch (err) {
      console.warn('Backend export failed, falling back:', err);
    }
  }

  // 3. Fallback: Standard HTML Anchor tag download (Works on desktop & supported browsers)
  try {
    const fileUrl = dataUrl || (blob ? URL.createObjectURL(blob) : null);
    if (fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = fileName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        try {
          document.body.removeChild(a);
          if (blob && !dataUrl) URL.revokeObjectURL(fileUrl);
        } catch (_) {}
      }, 500);

      result.success = true;
      result.method = 'anchor_download';
      return result;
    }
  } catch (err) {
    console.error('Anchor download failed:', err);
  }

  // 4. Fallback: Native Text/Link Share
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text });
      result.success = true;
      result.method = 'native_share_text';
      return result;
    } catch (err) {
      if (err.name === 'AbortError') {
        result.success = true;
        result.method = 'user_dismissed_share';
        return result;
      }
    }
  }

  result.error = 'No compatible download or share method found';
  return result;
}

/**
 * Triggers native system printing (allowing Save as PDF on Android & desktop)
 */
export function printHtmlReport(htmlContent) {
  try {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        window.print();
      } finally {
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch (_) {}
        }, 3000);
      }
    }, 400);
    return true;
  } catch (e) {
    console.warn('Print iframe failed, calling window.print()', e);
    window.print();
    return true;
  }
}
