import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor( @InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(userData : any) : Promise<User>{
        const newUser = new this.userModel(userData);
        const savedUser = await newUser.save();
        return savedUser;
    }

    async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
     }

    async createByAdmin(userData: any): Promise<User> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const createdUser = new this.userModel({
        ...userData,
        password: hashedPassword,
        birthdate: new Date(userData.birthdate),
        });
        return createdUser.save();
    }

    
    async toggleActive(userIdToToggle: string, adminId: string): Promise<User> {
       
        if (userIdToToggle === adminId) {
            
            throw new ForbiddenException('No puedes deshabilitar tu propia cuenta.');
        }

        const user = await this.userModel.findById(userIdToToggle);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        user.isActive = !user.isActive;
        return user.save();
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userModel.findOne({ email });
    }
    
    async findByUsername(username: string): Promise<User | null> {
        return await this.userModel.findOne({ username });
    }

    async findbyId(id: string): Promise<User | null> {

        return await this.userModel.findById(id);

    }

    async update(id : string, updateData : any) : Promise<User | null> {
        return await this.userModel.findByIdAndUpdate(id, updateData, {new : true});
    }


}