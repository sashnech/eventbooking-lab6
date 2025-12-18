import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import * as usersService_1 from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: usersService_1.UsersService) {
    }

    @Post()
    create(@Body() userData: { name: string; email: string }): usersService_1.User {
        return this.usersService.create(userData);
    }

    @Get()
    findAll(): usersService_1.User[] {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): usersService_1.User {
        return this.usersService.findOne(id);
    }
}
