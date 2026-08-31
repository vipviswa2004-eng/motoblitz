/**
 * Cloudinary direct image upload (unsigned upload preset)
 * Configure VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'motoblitz_products';

/**
 * Upload a single File/Blob to Cloudinary and return the secure_url
 * @param {File} file
 * @param {Function} onProgress - optional progress callback (0-100)
 * @returns {Promise<{url: string, public_id: string}>}
 */
export async function uploadToCloudinary(file, onProgress) {
  if (!CLOUD_NAME) throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not set in .env');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'motoblitz/products');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({ url: data.secure_url, public_id: data.public_id });
      } else {
        reject(new Error('Cloudinary upload failed: ' + xhr.responseText));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during Cloudinary upload'));
    xhr.send(formData);
  });
}

/**
 * Upload multiple images and return array of { url, public_id }
 */
export async function uploadMultipleImages(files, onProgress) {
  const total = files.length;
  let completedCount = 0;

  const results = await Promise.all(
    Array.from(files).map(async (file) => {
      const result = await uploadToCloudinary(file, (progress) => {
        if (onProgress) {
          const overallProgress = Math.round(
            ((completedCount + progress / 100) / total) * 100
          );
          onProgress(overallProgress);
        }
      });
      completedCount++;
      return result;
    })
  );

  return results;
}

/**
 * Transforms a Cloudinary URL with auto quality, WebP format, and specific width
 */
export function optimizeCloudinaryUrl(url, { width = 600, quality = 'auto' } = {}) {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace(
    '/upload/',
    `/upload/f_auto,q_${quality},w_${width}/`
  );
}
