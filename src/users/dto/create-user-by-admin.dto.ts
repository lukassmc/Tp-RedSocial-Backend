<<<<<<< HEAD
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer'; 

export class CreateUserByAdminDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsDate() 
  @Type(() => Date) 
  birthdate: Date;

  @IsEnum(['usuario', 'administrador'])
=======
export class CreateUserByAdminDto {
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  password: string;
  birthdate: string;
  description?: string;
>>>>>>> 4f0b24ed9f688c0eeb04d1f473b95f2f29daee2d
  role: 'usuario' | 'administrador';
}