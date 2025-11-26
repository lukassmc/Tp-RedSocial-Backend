import { Controller, Get, Patch, Param, Body, UploadedFile, UseInterceptors, BadRequestException, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard) 
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}


  @Get('me')
  getMyProfile(@Request() req) {
    return this.userService.findbyId(req.user._id);
  }


  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateMyProfile(
    @Request() req, 
    @Body() body: any,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    const userId = req.user._id;
    let profilePictureUrl: string | undefined;

    if (avatar) {
      try {
        profilePictureUrl = await this.cloudinaryService.uploadImage(avatar, 'perfiles');
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

    const updatedUser = await this.userService.update(userId, updateData);

    if (!updatedUser) {
      throw new BadRequestException('No se pudo actualizar el usuario');
    }

    return updatedUser;
  }
}