import { Controller, Post, Body, Param, Get, UseGuards, Request, Query, Put } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Types } from 'mongoose';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('post/:postId')
  async createComment(
    @Param('postId') postId: string,
    @Request() req,
    @Body('content') content: string,
  ) {
     const userId = new Types.ObjectId(req.user._id);
        
        return this.commentsService.create(postId, userId, content);
  }

  @Get('post/:postId')
  async getComments(
    @Param('postId') postId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.commentsService.findByPostPaginated(postId, page, limit);
  }


  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body('content') content: string,
    @Request() req,
  ) {
    console.log('Usuario adjunto a req:', req.user);
    return this.commentsService.update(commentId, req.user._id, content);
  }
}
