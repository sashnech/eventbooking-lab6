import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import * as bookingsService_1 from './bookings.service';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: bookingsService_1.BookingsService) {
    }

    @Post()
    create(@Body() bookingData: { userId: number; eventId: number }): bookingsService_1.Booking {
        return this.bookingsService.create(bookingData);
    }

    @Get()
    findAll(): bookingsService_1.Booking[] {
        return this.bookingsService.findAll();
    }

    @Get('event/:eventId')
    findByEvent(@Param('eventId', ParseIntPipe) eventId: number): bookingsService_1.Booking[] {
        return this.bookingsService.findByEvent(eventId);
    }
}
