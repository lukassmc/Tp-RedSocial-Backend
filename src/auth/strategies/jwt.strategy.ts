import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
     
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(), 
        ExtractJwt.fromUrlQueryParameter('token'), 
      ]),
      // ¿Ignorar expiración? NO - queremos que expire
      ignoreExpiration: false,
      // Clave secreta para verificar el token
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretKey',
    });
  }

  // Este método se ejecuta cuando el token es válido
  // "payload" es lo que guardaste cuando creaste el token (en el login)
  async validate(payload: any) {
    // : Aquí podrías buscar el usuario en la DB para ver si aún existe
    // Pero por simplicidad, confiamos en el token
    
    return {
      _id: payload.sub,       // ID del usuario
      username: payload.username,
      email: payload.email,
      profile: payload.profile // 'usuario' o 'administrador'
    };
  }
}