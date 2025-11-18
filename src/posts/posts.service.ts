
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, SortOrder } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { promises } from 'dns';


@Injectable()

export class PostsService {

    constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>, private cloudinaryService : CloudinaryService) {}

    async create(CreatePostDto: CreatePostDto, userId: Types.ObjectId): Promise<Post> {
        const postData = {
            ...CreatePostDto,
            userId,
            isPublished: true,
        };

        const createdPost = new this.postModel(postData);
        return await createdPost.save();

    }

    async createWithImage(createPostDto: CreatePostDto, userId: Types.ObjectId, image: Express.Multer.File): Promise<Post> {

        let imageUrl = '';

        if (image){
            imageUrl = await this.cloudinaryService.uploadImage(image, 'noisy/posts');

        }
        const postData = {
            ...createPostDto,
            userId,
            imageUrl,
            isPublished: true
        }

         const createdPost = new this.postModel(postData);
        return await createdPost.save();
    }

    async findAll(page: number = 1, limit: number = 10, sortBy: 'date' | 'likes' = 'date'): Promise<{ posts: Post[]; total: number }>{
        const skip = (page - 1) * limit;

          const sortOptions: { [key: string]: SortOrder } = sortBy === 'likes' 
      ? { likes: -1 as SortOrder }  // Ordenar por cantidad de likes descendente
      : { createdAt: -1 as SortOrder };

        const [posts, total] = await Promise.all([
            this.postModel
            .find({ isPublished : true})
            .populate('userId', 'nombre apellido username profilePicture')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .exec(),

            this.postModel.countDocuments({ isPublished : true})

        ])

        return { posts, total };
    }

    async findByUser(userId: Types.ObjectId, limit : number = 3) : Promise<Post[]> {
        return await this.postModel
        .find({ userId, isPlublished: true})
        .populate('userId', 'nombre apellido username profilePicture')
        .sort({ createdAt : -1})
        .limit(limit)
        .exec();
    }

    async remove(postId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    const result = await this.postModel.updateOne(
        { _id: postId, userId},
        { isPublished: false }
    );


    if (result.matchedCount === 0) {

        throw new NotFoundException('Publicacion no encontrada o no autorizada para eliminarla.');
    }
    }

    async addLike(postId: Types.ObjectId, userId: Types.ObjectId) : Promise<Post>{
        const post = await this.postModel.findById(postId);

        if (!post){

            throw new NotFoundException('Publicación no encontrada.')
        }

        if (post.likes.includes(userId)){

            throw new Error('El usuario ya ha dado me gusta a esta publicación.');
        }

        post.likes.push(userId);

        return await post.save();

    }

    async removeLike(postId: Types.ObjectId, userId: Types.ObjectId) : Promise<void>{
        const post = await this.postModel.findById(postId);

        if (!post){
            throw new NotFoundException('Publicación no encontrada.');
        
        }

        if(!post.likes.includes(userId)){

            throw new Error('El usuario no ha dado me gusta a esta publicación.');

        }

        post.likes = post.likes.filter(like => like !== userId);
        await post.save();
    }
    
}