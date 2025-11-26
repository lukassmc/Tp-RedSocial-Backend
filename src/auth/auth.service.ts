import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  
  constructor(
    private userService: UserService,
    private cloudinaryService: CloudinaryService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto, profileImage?: Express.Multer.File) {
    const { email, username, password, birthdate, ...userData } = registerDto;

    console.log(' Datos recibidos para registro:', registerDto);

    const userByEmail = await this.userService.findByEmail(email);
    if (userByEmail) {
      throw new BadRequestException('El email ya está registrado');
    }

    const userByUsername = await this.userService.findByUsername(username);
    if (userByUsername) {
      throw new BadRequestException('El nombre de usuario ya está en uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePicture = '';
    if (profileImage) {
      try {
        profilePicture = await this.cloudinaryService.uploadImage(
          profileImage,
          'noisy/profiles'
        );
        console.log(' Imagen subida a Cloudinary:', profilePicture);
      } catch (error) {
        console.error('Error subiendo imagen:', error);
        throw new BadRequestException('Error al subir la imagen');
      }
    }

    const userDataToCreate = {
      ...userData,
      email,
      username,
      password: hashedPassword,
      birthdate: new Date(birthdate),
      profilePicture,
      role: 'usuario',
    };

    console.log(' Intentando crear usuario con datos:', userDataToCreate);
  
    const user = await this.userService.create(userDataToCreate);

    console.log(' Usuario creado exitosamente:', user);

    const token = await this.generateToken(user);
    const userResponse = this.formatUserResponse(user);
    
  
    return {
      user: userResponse,
      access_token: token,
      expiresIn: '2m'
    };
  }

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;

    let user = await this.userService.findByEmail(identifier);
    if (!user) {
      user = await this.userService.findByUsername(identifier);
    }

    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña inválidos');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tu cuenta ha sido deshabilitada por un administrador.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuario o contraseña inválidos');
    }

  
    const token = await this.generateToken(user);

    const userResponse = this.formatUserResponse(user);
 

  return {
    user: userResponse,
    access_token: token,
    expiresIn: '2m'

  };
  }


  async validateToken(token: string): Promise<boolean> {
    try {
      
      this.jwtService.verify(token);
      return true;
    } catch (error) {
  
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }

  async refresh(user: any) {
    const currentUser = await this.userService.findbyId(user.sub);

    if (!currentUser || !currentUser.isActive) {
        throw new UnauthorizedException('Tu cuenta ha sido deshabilitada. Por favor, contacta a un administrador.');
    }
    const payload = {
      username: user.username,
      sub: user.sub, 
      email: user.email,
      role: user.role
    };


    const tokenExpiresIn = '2m'; 

    const newToken = this.jwtService.sign(payload, { expiresIn: tokenExpiresIn });

    return {
      access_token: newToken,
      expiresIn: tokenExpiresIn,
    };
  }
  
  
  getCurrentUser(): any {
  try {
    const userStr = localStorage.getItem('currentUser');
    
    
    if (!userStr) {
      return null;
    }
    
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing currentUser from localStorage:', error);
   
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    return null;
  }
}
   
  private async generateToken(user: any): Promise<string> {
    const payload = {
      username: user.username,
      sub: user._id,       
      email: user.email,
      role: user.role      
    };

    return this.jwtService.sign(payload, { expiresIn: '2m' }); 
  }

  private formatUserResponse(user: any) {
    return {
      _id: user._id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      username: user.username,
      role: user.role,
      profilePicture: user.profilePicture,
    };
  }

  isAuthenticated(): boolean {
  const token = localStorage.getItem('access_token');
  const user = this.getCurrentUser();
  
  return !!(token && user);
}
}