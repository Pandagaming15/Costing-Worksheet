import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * Converts a Blob to a base64 string
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
}

export interface SaveFileOptions {
  blob: Blob;
  fileName: string;
  mimeType: string;
  title: string;
  text?: string;
}

/**
 * Saves or shares a file across:
 * 1. Capacitor Native Android/iOS (writes to cache/documents, then opens native Android file-share sheet to open in Word, WPS, Drive, or Save to Device)
 * 2. Mobile Browser Web Share API (navigator.share with File payload)
 * 3. Desktop/Web fallback (direct browser download via <a> tag)
 */
export async function saveOrShareFile(options: SaveFileOptions): Promise<{
  method: 'capacitor' | 'web-share' | 'download';
  success: boolean;
}> {
  const { blob, fileName, mimeType, title, text } = options;

  // 1. Capacitor Native Platform (Android APK)
  if (Capacitor.isNativePlatform()) {
    try {
      const base64Data = await blobToBase64(blob);

      // Save to Cache directory so it's shareable to other Android apps
      const writeResult = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      // Launch native Android chooser (lets user open in MS Word, WPS Office, Docs, Adobe, or Save to Device)
      await Share.share({
        title: title,
        text: text || `Sharing ${fileName}`,
        url: writeResult.uri,
        dialogTitle: `Open with or Save ${fileName}`,
      });

      return { method: 'capacitor', success: true };
    } catch (err) {
      console.warn('Capacitor native share failed, falling back to Web Share / Download:', err);
    }
  }

  // 2. Web Share API with File support (Android Chrome, iOS Safari, etc.)
  if (typeof navigator !== 'undefined' && 'canShare' in navigator && typeof File !== 'undefined') {
    try {
      const file = new File([blob], fileName, { type: mimeType });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: title,
          text: text || title,
        });
        return { method: 'web-share', success: true };
      }
    } catch (err: unknown) {
      // User cancelled share or abort error
      if ((err as Error)?.name === 'AbortError') {
        return { method: 'web-share', success: true };
      }
      console.warn('Web Share API error, using standard download:', err);
    }
  }

  // 3. Fallback: Standard browser download
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
    return { method: 'download', success: true };
  } catch (err) {
    console.error('File download failed:', err);
    return { method: 'download', success: false };
  }
}
