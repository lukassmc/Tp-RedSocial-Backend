import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Request, HttpCode, HttpStatus, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto, MusicDataDto } from './dto/create-post.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Types } from 'mongoose'
import { types } from 'util'
import { FileInterceptor } from '@nestjs/platform-express'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { error } from 'console'
import { ObjectId } from 'mongodb'


@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    
    @Post()
    async create(@Body() createPostDto: CreatePostDto, @Request() req){
        const userId = new Types.ObjectId(req.user.userId); 
        return await this.postsService.create(createPostDto, req.user._id);
        
    }
    @Post()
    async createWithMusic(@Body()body : any,  @Request() req){

        let music : MusicDataDto | null = null;
        
        if (body.music){

            const parsed = JSON.parse(body.music);

            music = plainToInstance(MusicDataDto, parsed)

            const errors = await validate(music)
            if (errors.length > 0){
                throw new BadRequestException(errors)
            }
        
            
        }
        const dto: CreatePostDto ={
            ...body,
            music,
        }
        
        if (!music) {
        return await this.postsService.create(dto, req.user._id);
    }

        // 👉 Si HAY música, usar createWithMusic
        return await this.postsService.createWithMusic(dto, req.user._id, music);

}
    @Post('with-image')
    @UseInterceptors(FileInterceptor('image'))
    async createWithImage(@UploadedFile() image : Express.Multer.File,
                        @Body() createPostDto : CreatePostDto,
                        @Request() req){

            console.log('📸 Imagen recibida:', image);
            console.log('📝 Datos recibidos:', createPostDto);
            return await this.postsService.createWithImage(createPostDto, req.user._id, image);
        }

    @Get()
    async findAll(@Query('page', new ParseIntPipe({ optional : true})) page: number = 1,
                @Query('limit', new ParseIntPipe({ optional : true})) limit: number = 10,
                @Query('sortBy') sortBy: 'date' | 'likes' = 'date'){
                    return await this.postsService.findAll(page, limit, sortBy);
                }

    @Get(':id')
    async findOne(
        @Param('id') id: string) {
            
        const objectId = new Types.ObjectId(id);
        return this.postsService.findOne(objectId);
        }

    @Get('user/:userId')
    async findByUser(@Param('userId') userId: string){
        return await this.postsService.findByUser(new Types.ObjectId(userId))
    }


    @Get('my-posts')
    async findMyPosts(@Request() req){
        console.log("👤 Usuario autenticado:", req.user);
        return await this.postsService.findByUser(req.user._id, 3);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string, @Request() req){
        const postId = new Types.ObjectId(id);
        const userId = new Types.ObjectId(req.user.userId);
        return await this.postsService.remove(new Types.ObjectId(postId), req.user._id)
    }

    @Post(':id/like')
    async addLike(@Param('id') id: string, @Request() req){
        const postId = new Types.ObjectId(id);
        const userId = new Types.ObjectId(req.user.userId);
        return await this.postsService.addLike(new Types.ObjectId(postId), req.user._id);
    }

    @Delete(':id/like')
    async removeLike(@Param('id') id :string, @Request() req){
            const postId = new Types.ObjectId(id);
        const userId = new Types.ObjectId(req.user.userId);
        return await this.postsService.removeLike(new Types.ObjectId(postId), req.user._id);
    }
    
}