import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './users.service'; 
import { UsersController } from './users.controller';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
<<<<<<< HEAD
import { UsersAdminController } from './users-admin.controller';
=======
>>>>>>> 4f0b24ed9f688c0eeb04d1f473b95f2f29daee2d
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  providers: [UserService, CloudinaryService, RolesGuard],
<<<<<<< HEAD
  controllers: [UsersController, UsersAdminController],
=======
  controllers: [UsersController],
>>>>>>> 4f0b24ed9f688c0eeb04d1f473b95f2f29daee2d
  exports: [UserService],
})
export class UsersModule {}