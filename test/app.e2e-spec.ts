import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { User } from '../src/users/user.entity';
import { Event } from '../src/events/event.entity';
import { Booking } from '../src/bookings/booking.entity';

describe('EventBooking API (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Event, Booking],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a user, an event and a booking', async () => {
    const userRes = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Andrii', email: 'andrii@example.com' })
      .expect(201);

    expect(userRes.body.id).toBeDefined();

    const eventRes = await request(app.getHttpServer())
      .post('/events')
      .send({
        title: 'Football',
        date: '2025-12-25T18:00:00.000Z',
        location: 'Stadium',
      })
      .expect(201);

    expect(eventRes.body.id).toBeDefined();

    const bookingRes = await request(app.getHttpServer())
      .post('/bookings')
      .send({ userId: userRes.body.id, eventId: eventRes.body.id })
      .expect(201);

    expect(bookingRes.body.id).toBeDefined();
    expect(bookingRes.body.userId).toBe(userRes.body.id);
    expect(bookingRes.body.eventId).toBe(eventRes.body.id);
  });

  it('should retrieve created user, event and booking', async () => {
    const users = await request(app.getHttpServer()).get('/users').expect(200);
    expect(users.body.length).toBeGreaterThan(0);

    const events = await request(app.getHttpServer())
      .get('/events')
      .expect(200);
    expect(events.body.length).toBeGreaterThan(0);

    const bookings = await request(app.getHttpServer())
      .get('/bookings')
      .expect(200);
    expect(bookings.body.length).toBeGreaterThan(0);
  });
});
