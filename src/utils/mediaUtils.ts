import { RoomMedia } from '../types';

export const MAX_VIDEO_SIZE_MB = 50;
export const MAX_VIDEO_DURATION_SECONDS = 90;

export async function processUploadedImage(file: File, maxWidth = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () =>
        reject(new Error('Invalid image format. Please choose JPG, PNG, or WebP.'));
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const targetW = Math.round(img.width * scale);
        const targetH = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function processUploadedPanorama(file: File): Promise<string> {
  return processUploadedImage(file, 2048);
}

export async function probeVideoDuration(objectUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      resolve(duration);
    };
    video.onerror = () => resolve(0);
    video.src = objectUrl;
  });
}

export async function processUploadedVideo(file: File): Promise<string> {
  const sizeMb = file.size / (1024 * 1024);
  if (sizeMb > MAX_VIDEO_SIZE_MB) {
    throw new Error(
      `Video is ${sizeMb.toFixed(1)} MB. Please keep room tours under ${MAX_VIDEO_SIZE_MB} MB so Oroquieta students can load them fast on mobile data.`
    );
  }

  const probeUrl = URL.createObjectURL(file);
  const duration = await probeVideoDuration(probeUrl);
  if (duration > MAX_VIDEO_DURATION_SECONDS) {
    URL.revokeObjectURL(probeUrl);
    throw new Error(
      `Video is ${Math.round(duration)}s long. Please upload a walkthrough under ${MAX_VIDEO_DURATION_SECONDS} seconds for fast mobile loading.`
    );
  }

  // For smaller videos (< 2MB), convert to Data URL so it persists in localStorage
  if (file.size <= 2 * 1024 * 1024) {
    URL.revokeObjectURL(probeUrl);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onerror = () => resolve(URL.createObjectURL(file));
      reader.onload = () => {
        resolve((reader.result as string) || URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    });
  }

  // Larger videos use an in-memory Object URL for smooth instant playback
  return probeUrl;
}

export function createRoomMediaObject(
  type: 'video' | 'panorama',
  url: string,
  fileName?: string,
  caption?: string
): RoomMedia {
  return {
    type,
    url,
    fileName,
    caption:
      caption?.trim() ||
      (type === 'video' ? 'Owner Room Walkthrough Video' : 'Owner 360° Room Panorama'),
    uploadedAt: new Date().toISOString(),
  };
}
