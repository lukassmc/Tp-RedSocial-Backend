<<<<<<< HEAD
import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Request, HttpCode, HttpStatus, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, Put, Patch } from '@nestjs/common'
=======
import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Request, HttpCode, HttpStatus, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, Put } from '@nestjs/common'
>>>>>>> 4f0b24ed9f688c0eeb04d1f473b95f2f29daee2d
import { PostsService } from './posts.service'
import { CreatePostDto, MusicDataDto } from './dto/create-post.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Types } from 'mongoose'
import { FileInterceptor } from '@nestjs/platform-express'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { Roles } from 'src/auth/decorators/roles.decorator'

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    async create(@Body() createPostDto: CreatePostDto, @Request() req){
        const userId = new Types.ObjectId(req.user._id); 
        return await this.postsService.create(createPostDto, userId);
    }
    

    @Post('with-music')
    async createWithMusic(@Body()body : any, @Request() req){
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
        
        const userId = new Types.ObjectId(req.user._id);

        if (!music) {
            return await this.postsService.create(dto, userId);
        }

        return await this.postsService.createWithMusic(dto, userId, music);
    }

    @Post('with-image')
    @UseInterceptors(FileInterceptor('image'))
    async createWithImage(@UploadedFile() image : Express.Multer.File,
                        @Body() createPostDto : CreatePostDto,
                        @Request() req){
            console.log('📸 Imagen recibida:', image);
            console.log('📝 Datos recibidos:', createPostDto);
            const userId = new Types.ObjectId(req.user._id);
            return await this.postsService.createWithImage(createPostDto, userId, image);
        }

    @Get()
    async findAll(@Query('page', new ParseIntPipe({ optional : true})) page: number = 1,
                @Query('limit', new ParseIntPipe({ optional : true})) limit: number = 10,
                @Query('sortBy') sortBy: 'date' | 'likes' = 'date'){
                    return await this.postsService.findAll(page, limit, sortBy);
                }

    
    @Get('my-posts')
    async findMyPosts(@Request() req){
        console.log("👤 Usuario autenticado:", req.user);
        const userId = new Types.ObjectId(req.user._id);
        return await this.postsService.findByUser(userId, 3);
    }

    @Get('user/:userId')
    async findByUser(@Param('userId') userId: string){
        return await this.postsService.findByUser(new Types.ObjectId(userId))
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        // VALIDACIÓN ADICIONAL para prevenir errores
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('ID de post inválido');
        }
        const objectId = new Types.ObjectId(id);
        return this.postsService.findOne(objectId);
    }

<<<<<<< HEAD
    @Patch(':id/disable')
=======
    @Put(':id/disable')
>>>>>>> 4f0b24ed9f688c0eeb04d1f473b95f2f29daee2d
    @Roles('administrador')
    async disablePostAdmin(@Param('id') id : string, @Request() req){
        const postId= new Types.ObjectId(id)
        return await this.postsService.adminRemove(postId);
    }


    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string, @Request() req){
        const postId = new Types.ObjectId(id);
        const userId = new Types.ObjectId(req.user._id);
        return await this.postsService.remove(postId, userId);
    }

    @Post(':id/like')
    async addLike(@Param('id') id: string, @Request() req){
        const postId = new Types.ObjectId(id);
        const userId = new Types.ObjectId(req.user._id);
        return await this.postsService.addLike(postId, userId);
    }

    @Delete(':id/like')
    async removeLike(@Param('id') id :string, @Request() req){
        const postId = new Types.ObjectId(id);
        const userId = new Types.ObjectId(req.user._id);
        return await this.postsService.removeLike(postId, userId);
    }
}