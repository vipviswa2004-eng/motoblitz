import { supabase } from './supabase';

const BUCKET_NAME = 'products';

/**
 * Uploads a single product image to Supabase Storage bucket 'products'
 * Returns public URL string
 */
export async function uploadProductImage(file) {
  if (!file) throw new Error('No file provided');

  // If Supabase is connected
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `${Date.now()}_${cleanName}.${fileExt}`;
      const filePath = `catalog/${fileName}`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.warn('Supabase storage error (ensure bucket "products" exists as public):', error);
        // Fallback to local Base64 / object URL
        return await fileToBase64(file);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.warn('Upload catch fallback:', err);
      return await fileToBase64(file);
    }
  }

  // Fallback when Supabase is offline
  return await fileToBase64(file);
}

/**
 * Uploads multiple images with optional progress reporting
 */
export async function uploadMultipleProductImages(files, onProgress) {
  const fileList = Array.from(files);
  const urls = [];
  let completed = 0;

  for (const file of fileList) {
    const url = await uploadProductImage(file);
    urls.push(url);
    completed++;
    if (onProgress) {
      onProgress(Math.round((completed / fileList.length) * 100));
    }
  }

  return urls;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
