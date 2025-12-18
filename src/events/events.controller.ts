import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import * as eventsService_1 from './events.service';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: eventsService_1.EventsService) {
    }

    @Post()
    create(@Body() eventData: { title: string; date: string; location: string }): eventsService_1.Event {
        return this.eventsService.create(eventData);
    }

    @Get()
    findAll(): eventsService_1.Event[] {
        return this.eventsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): eventsService_1.Event {
        return this.eventsService.findOne(id);
    }
}
