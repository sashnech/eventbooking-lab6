import { Injectable, NotFoundException } from '@nestjs/common';

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
}

@Injectable()
export class EventsService {
  private events: Event[] = [];
  private idCounter = 1;

  create(eventData: { title: string; date: string; location: string }): Event {
    const newEvent: Event = {
      id: this.idCounter++,
      ...eventData,
    };
    this.events.push(newEvent);
    return newEvent;
  }

  findAll(): Event[] {
    return this.events;
  }

  findOne(id: number): Event {
    const event = this.events.find((e) => e.id === id);
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }
}
