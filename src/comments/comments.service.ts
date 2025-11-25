import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ForbiddenException } from '@nestjs/common';
import { Comment, CommentDocument } from './schemas/comments.schemas';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

    async create(postId: string, userId: string, content: string): Promise<Comment> {
        const comment = new this.commentModel({ post: postId, user: userId, content });
        await comment.save();

        return comment.populate('userId', 'nombre username profilePicture');
    }

  async findByPost(postId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ postId })
      .populate('userId', 'nombre username profilePicture')
      .sort({ createdAt: 1 })
      .exec();
  }

  async findByPostPaginated(postId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  const comments = await this.commentModel
    .find({ post: postId })
    .sort({ createdAt: 1 }) 
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await this.commentModel.countDocuments({ post: postId });

  return {
    comments,
    total,
    page,
    limit,
    hasMore: skip + limit < total
  };
}

async update(commentId: string, userId: string, content: string) {
  const comment = await this.commentModel.findById(commentId);

  if (!comment) {
    throw new NotFoundException('Comentario no encontrado');
  }

  if (comment.userId.toString() !== userId) {
    throw new ForbiddenException('No puedes editar este comentario');
  }

  comment.content = content;
  comment.edited = true;
  comment.updatedAt = new Date();

  return await comment.save();
}

}