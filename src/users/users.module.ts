import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './users.service'; 
import { UsersController } from './users.controller';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UsersAdminController } from './users-admin.controller';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  providers: [UserService, CloudinaryService, RolesGuard],
  controllers: [UsersController, UsersAdminController],
  exports: [UserService],
})
export class UsersModule {}