import { IsString, IsEmail, MinLength, Matches, IsOptional, IsDateString } from 'class-validator';

export class RegisterDto {
  
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre: string;

  @IsString()
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  apellido: string;

  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email: string;

  @IsString()
  @MinLength(3, { message: 'El username debe tener al menos 3 caracteres' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/[A-Z]/, { message: 'La contraseña debe contener al menos una mayúscula' })
  @Matches(/[0-9]/, { message: 'La contraseña debe contener al menos un número' })
  password: string;

  @IsDateString({}, { message: 'La fecha debe estar en formato YYYY-MM-DD' })
  birthdate: string;

  @IsOptional()  
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  role?: string;

}