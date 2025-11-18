import { Controller, Post, Body, Param, Get, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postId')
  async createComment(
    @Param('postId') postId: string,
    @Request() req,
    @Body('content') content: string,
  ) {
    return this.commentsService.create(postId, req.user._id, content);
  }

  @Get(':postId')
  async getComments(@Param('postId') postId: string) {
    return this.commentsService.findByPost(postId);
  }
}