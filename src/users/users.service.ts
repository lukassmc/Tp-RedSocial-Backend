import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {

    constructor( @InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(userData : any) : Promise<User>{
        console.log('🔧 UserService.create() - Datos recibidos:', userData);
        const newUser = new this.userModel(userData);
        console.log('🔧 UserService.create() - Modelo creado:', newUser);
        const savedUser = await newUser.save();
        console.log('🔧 UserService.create() - Usuario guardado:', savedUser);
        return savedUser;
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