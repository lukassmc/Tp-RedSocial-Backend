import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  
  constructor(private configService: ConfigService) {
 
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }


  async uploadImage(file: Express.Multer.File, folder: string = 'noisy'): Promise<string> {
    try {
 
  
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: folder,  
            resource_type: 'auto',
            format: 'webp',  
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

     
        stream.end(file.buffer);
      });

      return (result as any).secure_url;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw new Error(`Error subiendo imagen a Cloudinary: ${error.message}`);
    }
  }


  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
    }
  }
}