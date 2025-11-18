import {Controller, Get,Patch, Param, Body, UploadedFile, UseInterceptors, BadRequestException} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findbyId(id);
    if (!user) throw new BadRequestException('Usuario no encontrado');
    return user;
  }


  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    let profilePictureUrl: string | undefined;

  
    if (avatar) {
      try {
        profilePictureUrl = await this.cloudinaryService.uploadImage(
          avatar,
          'perfiles'
        );
      } catch (error) {
        throw new BadRequestException('Error subiendo imagen');
      }
    }

    
    const updateData: any = {
      nombre: body.nombre,
      apellido: body.apellido,
      username: body.username,
      email: body.email,
      descripcion: body.descripcion,
      fechaNacimiento: body.fechaNacimiento,
    };

    if (profilePictureUrl) updateData.profilePicture = profilePictureUrl;

 
    const updatedUser = await this.userService.update(id, updateData);

    if (!updatedUser) {
      throw new BadRequestException('No se pudo actualizar el usuario');
    }

    return updatedUser;
  }
}
