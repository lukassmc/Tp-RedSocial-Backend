import { Controller, Post, Body, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {

    constructor (private authService : AuthService) {}

    @Post('register')
    @UseInterceptors(FileInterceptor('profileImage'))
    async register(
        @Body() registerDto: RegisterDto,
        @UploadedFile() profileImage?: Express.Multer.File
    ) {
        const result = await this.authService.register(registerDto, profileImage);

        return {
            statusCode: HttpStatus.CREATED, 
            message: 'Usuario registrado exitosamente',
            data: result,
        };
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const result = await this.authService.login(loginDto);
        
        return {
            statusCode: HttpStatus.OK, 
            message: 'Login exitoso',
            data: result,
        };
    }
}


