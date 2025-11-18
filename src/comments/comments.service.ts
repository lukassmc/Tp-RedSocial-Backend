import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comments.schemas';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

    async create(postId: string, userId: string, content: string): Promise<Comment> {
        const comment = new this.commentModel({ postId, userId, content });
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
}