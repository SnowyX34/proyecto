import cloudinary from '../../config/cloudinaryConfig';
import { UploadApiResponse } from 'cloudinary';

export class CloudinaryService {
  
  static async uploadImage(
    buffer: Buffer, 
    originalName: string,
    folder: string = 'products'
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          public_id: `${folder}/${Date.now()}-${originalName.split('.')[0]}`,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto:good' },
            { format: 'webp' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            reject(error);
          } else {
            resolve(result as UploadApiResponse);
          }
        }
      );
      
      uploadStream.end(buffer);
    });
  }

  static async deleteImage(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Image deleted from Cloudinary:', result);
      return result;
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw error;
    }
  }

  // Método auxiliar para extraer public_id de una URL de Cloudinary
  static extractPublicId(cloudinaryUrl: string): string | null {
    try {
      const regex = /\/v\d+\/(.+)\./;
      const match = cloudinaryUrl.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      console.error('Error extracting public_id:', error);
      return null;
    }
  }
}