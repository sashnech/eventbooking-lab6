import { Injectable, BadRequestException } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';

export interface Booking {
  id: number;
  userId: number;
  eventId: number;
}

@Injectable()
export class BookingsService {
  private bookings: Booking[] = [];
  private idCounter = 1;

  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
  ) {}

  create(bookingData: { userId: number; eventId: number }): Booking {
    try {
      this.usersService.findOne(bookingData.userId);
    } catch {
      throw new BadRequestException(
        `User with id ${bookingData.userId} does not exist`,
      );
    }

    try {
      this.eventsService.findOne(bookingData.eventId);
    } catch {
      throw new BadRequestException(
        `Event with id ${bookingData.eventId} does not exist`,
      );
    }

    const newBooking: Booking = {
      id: this.idCounter++,
      ...bookingData,
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  findAll(): Booking[] {
    return this.bookings;
  }

  findByEvent(eventId: number): Booking[] {
    return this.bookings.filter((b) => b.eventId === eventId);
  }
}
