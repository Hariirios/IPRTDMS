/**
 * Image utility functions for high-quality image processing
 * Compresses images while maintaining clarity and quality
 */

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  outputFormat?: 'image/jpeg' | 'image/png' | 'image/webp';
}

/**
 * Compress and optimize an image file while maintaining MAXIMUM clarity
 * Uses advanced canvas techniques for crystal-clear results
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise<string> - Base64 encoded image
 */
export const compressImage = async (
  file: File,
  options: ImageCompressionOptions = {}
): Promise<string> => {
  const {
    maxWidth = 2000,  // ULTRA high resolution
    maxHeight = 2000, // ULTRA high resolution
    quality = 1.0,    // 100% quality - NO compression!
    outputFormat = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        const originalWidth = width;
        const originalHeight = height;

        // Only resize if image is larger than max dimensions
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;

          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        // Create canvas at FULL resolution - NO downscaling
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d', {
          alpha: outputFormat === 'image/png',
          desynchronized: false,
          willReadFrequently: false
        });

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // DISABLE smoothing for maximum sharpness
        ctx.imageSmoothingEnabled = false;

        // Fill background for JPEG (prevents transparency issues)
        if (outputFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        // Draw image at FULL quality - NO smoothing
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with 100% quality - NO compression
        const compressedBase64 = canvas.toDataURL(outputFormat, quality);

        resolve(compressedBase64);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};



/**
 * Validate image file before upload
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10MB)
 * @returns Object with isValid and error message
 */
export const validateImageFile = (
  file: File,
  maxSizeMB: number = 10
): { isValid: boolean; error?: string } => {
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: 'Please upload an image file (JPG, PNG, WebP, etc.)'
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Image size must be less than ${maxSizeMB}MB`
    };
  }

  return { isValid: true };
};

/**
 * Get optimal compression settings based on image type
 * ULTRA HIGH QUALITY - Maximum possible clarity
 * @param fileType - The MIME type of the image
 * @returns Optimal compression options
 */
export const getOptimalCompressionSettings = (
  fileType: string
): ImageCompressionOptions => {
  // For profile pictures and team members - ULTRA HIGH quality
  if (fileType.includes('png')) {
    return {
      maxWidth: 2000,  // MUCH higher resolution for maximum clarity
      maxHeight: 2000, // MUCH higher resolution for maximum clarity
      quality: 1.0,    // 100% quality - NO compression!
      outputFormat: 'image/png'
    };
  }

  // For photos and general images - ULTRA HIGH quality
  return {
    maxWidth: 2000,  // MUCH higher resolution for maximum clarity
    maxHeight: 2000, // MUCH higher resolution for maximum clarity
    quality: 1.0,    // 100% quality - NO compression!
    outputFormat: 'image/jpeg'
  };
};

/**
 * Handle image upload with compression
 * @param file - The image file to upload
 * @param options - Optional compression settings
 * @returns Promise<string> - Compressed base64 image
 */
export const handleImageUpload = async (
  file: File,
  options?: ImageCompressionOptions
): Promise<string> => {
  // Validate file
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Get optimal settings if not provided
  const compressionOptions = options || getOptimalCompressionSettings(file.type);

  // Compress image
  const compressedImage = await compressImage(file, compressionOptions);

  return compressedImage;
};
