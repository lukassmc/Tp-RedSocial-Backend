import { IsString, IsOptional, IsUrl, IsObject, MinLength, MaxLength, isString } from 'class-validator';

class MusicDataDto {

    @IsString()
    trackId: string;

    @IsUrl()
    previewUrl: string;

    @IsString()
    trackName: string;
    
    @IsString()
    artistName: string;
    
    @IsString()
    albumName: string;
}

export class CreatePostDto {
    
    @IsString()
    @MinLength(1, { message: 'El titulo debe tener al menos 1 caracter.'})
    @MaxLength(100, {message: 'El titulo no puede tener mas de 100 caracteres.'})
    title: string;


    @IsString()
    @MinLength(1, { message: 'El contenido debe tener al menos 1 caracter.'})
    @MaxLength(5000, {message: 'El contenido no puede tener mas de 5000 caracteres.'})
    content: string;

    @IsOptional()
    @IsUrl({}, { message: 'La URL de la imagen no es valida.'})
    imageUrl?: string;

    @IsOptional()
    @IsObject({ message: 'Los datos de musica no son validos.'})
    music?: MusicDataDto;

}

