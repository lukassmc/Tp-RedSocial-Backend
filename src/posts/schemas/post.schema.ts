import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true})
export class Post {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop()
    imageUrl?: string;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId : Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    likes: Types.ObjectId[];

    @Prop({ default: 0})
    comments : number;

    @Prop({ default: false})
    isPublished : boolean;

    @Prop({ type: Object })

    music? :{
        trackId: string;
        previewUrl: string;
        trackName: string;
        artistName: string;
        albumName: string;
    };
}


export const PostSchema = SchemaFactory.createForClass(Post);

