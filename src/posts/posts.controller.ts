import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Request, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { Types } from 'mongoose'
import { types } from 'util'


@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    async create(@Body() createPostDto: CreatePostDto, @Request() req){

        return await this.postsService.create(createPostDto, req.user._id);

    }

    @Get()
    async findAll(@Query('page', new ParseIntPipe({ optional : true})) page: number = 1,
                @Query('limit', new ParseIntPipe({ optional : true})) limit: number = 10,
                @Query('sortBy') sortBy: 'date' | 'likes' = 'date'){
                    return await this.postsService.findAll(page, limit, sortBy);
                }

    @Get('user/:userId')
    async findByUser(@Param('userId') userId: string){
        return await this.postsService.findByUser(new Types.ObjectId(userId))
    }


    @Get('my-posts')
    async findMyPosts(@Request() req){
        return await this.postsService.findByUser(req.user._id, 3);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') postId: string, @Request() req){
        return await this.postsService.remove(new Types.ObjectId(postId), req.user._id)
    }

    @Post(':id/like')
    async addLike(@Param('id') postId: string, @Request() req){
        return await this.postsService.addLike(new Types.ObjectId(postId), req.user._id);
    }

    @Delete(':id/like')
    async removeLike(@Param('id') postId :string, @Request() req){
        return await this.postsService.removeLike(new Types.ObjectId(postId), req.user._id);
    }
    
}