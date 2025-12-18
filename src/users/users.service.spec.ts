import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', () => {
    const userData = { name: 'Andrii', email: 'andrii@example.com' };
    const savedUser = { id: 1, ...userData };

    mockUserRepository.create.mockReturnValue(savedUser);
    mockUserRepository.save.mockResolvedValue(savedUser);

    const result = service.create(userData);
    expect(result).toEqual(savedUser);
    expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
    expect(mockUserRepository.save).toHaveBeenCalledWith(savedUser);
  });

  it('should return all users', () => {
    const users = [{ id: 1, name: 'Andrii', email: 'andrii@example.com' }];
    mockUserRepository.find.mockResolvedValue(users);

    const result = service.findAll();
    expect(result).toEqual(users);
    expect(mockUserRepository.find).toHaveBeenCalled();
  });

  it('should return a user by id', () => {
    const user = { id: 1, name: 'Andrii', email: 'andrii@example.com' };
    mockUserRepository.findOneBy.mockResolvedValue(user);

    const result = service.findOne(1);
    expect(result).toEqual(user);
    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw NotFoundException if user not found', async () => {
    mockUserRepository.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(
      'User with id 999 not found',
    );
  });
});
