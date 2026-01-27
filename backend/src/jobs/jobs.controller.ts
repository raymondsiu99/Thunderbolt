import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll() {
        return this.jobsService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.jobsService.findOne(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() jobDto: any) {
        return this.jobsService.create(jobDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param('id') id: string, @Body() jobDto: any) {
        return this.jobsService.update(+id, jobDto);
    }
}
