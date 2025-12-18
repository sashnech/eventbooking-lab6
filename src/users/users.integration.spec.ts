import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users.module';
import { EventsModule } from '../events/events.module';
import { BookingsModule } from '../bookings/bookings.module';
import { User } from './user.entity';
import { Event } from '../events/event.entity';
import { Booking } from '../bookings/booking.entity';

describe('EventBooking API (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        EventsModule,
        BookingsModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Event, Booking],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) -> should create a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Andrii', email: 'andrii@example.com' })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Andrii');
  });

  it('/events (POST) -> should create an event', async () => {
    const res = await request(app.getHttpServer())
      .post('/events')
      .send({
        title: 'Football',
        date: '2025-12-25T18:00:00.000Z',
        location: 'Stadium',
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe('Football');
  });

  it('/bookings (POST) -> should create a booking', async () => {
    // Створюємо користувача
    const user = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Test User', email: 'test@example.com' });

    // Створюємо подію
    const event = await request(app.getHttpServer()).post('/events').send({
      title: 'Test Event',
      date: '2025-12-25T18:00:00.000Z',
      location: 'Test Location',
    });

    // Створюємо бронювання
    const booking = await request(app.getHttpServer())
      .post('/bookings')
      .send({ userId: user.body.id, eventId: event.body.id })
      .expect(201);

    expect(booking.body.id).toBeDefined();
    expect(booking.body.userId).toBe(user.body.id);
    expect(booking.body.eventId).toBe(event.body.id);
  });
});
