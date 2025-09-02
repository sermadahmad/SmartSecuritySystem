import RNFS from 'react-native-fs';

/**
 * Convert image file path to base64 string
 * @param imagePath - Local file path of the image
 * @returns Promise<string> - Base64 encoded string
 */
export const convertImageToBase64 = async (imagePath: string): Promise<string> => {
  try {
    // Check if file exists
    const fileExists = await RNFS.exists(imagePath);
    if (!fileExists) {
      throw new Error(`File does not exist at path: ${imagePath}`);
    }

    // Read file as base64
    const base64String = await RNFS.readFile(imagePath, 'base64');
    
    // Return with proper data URI format
    return `data:image/jpeg;base64,${base64String}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

/**
 * Convert multiple image paths to base64 strings
 * @param imagePaths - Array of local file paths
 * @returns Promise<string[]> - Array of base64 encoded strings
 */
export const convertMultipleImagesToBase64 = async (imagePaths: string[]): Promise<string[]> => {
  try {
    const base64Images: string[] = [];
    
    for (const imagePath of imagePaths) {
      try {
        const base64Image = await convertImageToBase64(imagePath);
        base64Images.push(base64Image);
      } catch (error) {
        console.error(`Failed to convert image ${imagePath} to base64:`, error);
        // Continue with other images even if one fails
      }
    }
    
    return base64Images;
  } catch (error) {
    console.error('Error converting multiple images to base64:', error);
    throw error;
  }
};

/**
 * Validate and prepare image data for API
 * @param imagePaths - Array of image file paths
 * @param maxImages - Maximum number of images to process (default: 2)
 * @returns Promise<{image1: string, image2: string}> - Object with base64 images
 */
export const prepareImagesForAPI = async (
  imagePaths: string[], 
  maxImages: number = 2
): Promise<{image1: string, image2: string}> => {
  try {
    // Limit to maxImages
    const limitedPaths = imagePaths.slice(0, maxImages);
    
    // Convert to base64
    const base64Images = await convertMultipleImagesToBase64(limitedPaths);
    
    // Ensure we have at least empty strings if no images
    const image1 = base64Images[0] || '';
    const image2 = base64Images[1] || '';
    
    return { image1, image2 };
  } catch (error) {
    console.error('Error preparing images for API:', error);
    // Return empty strings if conversion fails
    return { image1: '', image2: '' };
  }
};
