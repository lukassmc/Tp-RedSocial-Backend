import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { MongooseModule } from '@nestjs/mongoose';
// Importa los esquemas directamente
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { Comment, CommentSchema } from 'src/comments/schemas/comments.schemas';

@Module({
  imports: [
    
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}