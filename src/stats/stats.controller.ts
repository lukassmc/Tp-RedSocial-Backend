import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

    @Get('posts-per-user')
    getPostsByUser(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
        return this.statsService.getPostsByUser(startDate, endDate);
    }

    @Get('comments-over-time')
    getCommentsOverTime(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
        return this.statsService.getCommentsOverTime(startDate, endDate);
    }

    @Get('comments-per-post')
    getCommentsPerPost(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
        return this.statsService.getCommentsPerPost(startDate, endDate);
    }
}