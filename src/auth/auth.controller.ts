import { Controller, Post, Body, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

    constructor (private authService : AuthService) {}

    @Post('register')
    @UseInterceptors(FileInterceptor('profileImage'))
    async register(
        @Body() registerDto: RegisterDto,
        @UploadedFile() profileImage?: Express.Multer.File
    ) {
         return await this.authService.register(registerDto, profileImage);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
       return await this.authService.login(loginDto);
    }
}


