import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create a user', () => {
    const userData = { name: 'Andrii', email: 'andrii@example.com' };

    const created = service.create(userData as any);

    expect(created).toMatchObject(userData);
    expect(created).toHaveProperty('id');
  });

  it('should return all users', () => {
    service.create({ name: 'Andrii', email: 'andrii@example.com' } as any);

    const users = service.findAll();

    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject({ name: 'Andrii', email: 'andrii@example.com' });
  });

  it('should return a user by id', () => {
    const created = service.create({ name: 'Andrii', email: 'andrii@example.com' } as any);

    const found = service.findOne(created.id);

    expect(found).toEqual(created);
  });

  it('should throw NotFoundException if user not found', () => {
    expect(() => service.findOne(999)).toThrow(NotFoundException);
  });
});
