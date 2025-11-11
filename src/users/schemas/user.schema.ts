import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

    @Prop({ required: true })
    nombre : string;

    @Prop({ required: true })
    apellido : string;

    @Prop({ required: true, unique: true })
    username : string;
    
    @Prop({ required: true, unique: true })
    email : string;

    @Prop({ required: true })
    password : string;

    @Prop({ required: true })
    birthdate : Date;

    @Prop({ required: false, default: '' })
    description : string;

    @Prop({ required: false, default: '' })
    profilePicture : string;

    @Prop({ 
    enum: ['usuario', 'administrador'], 
    default: 'usuario' 
    })
    role: string;

    @Prop({ required: true, default: Date.now })
    createdAt : Date;

    @Prop({ required: true, default: Date.now })
    updatedAt : Date;

}

export const UserSchema = SchemaFactory.createForClass(User);