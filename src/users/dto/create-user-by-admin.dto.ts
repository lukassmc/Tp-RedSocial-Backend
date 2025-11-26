
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

  role: 'usuario' | 'administrador';
}