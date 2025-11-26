import { Controller, Get, Post, Put, Param, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';

import { UserService } from './users.service';
import { CreateUserByAdminDto } from './dto/create-user-by-admin.dto'; 
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('admin/users') 
@UseGuards(JwtAuthGuard, RolesGuard) 
@Roles('administrador')
export class UsersAdminController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserByAdminDto) {
    return this.usersService.createByAdmin(createUserDto);
  }

  @Put(':id/toggle-active')
    @HttpCode(HttpStatus.OK)
    async toggleActive(@Param('id') id: string, @Request() req) {

        const adminId = req.user._id; 
 
        return this.usersService.toggleActive(id, adminId);
    }

}