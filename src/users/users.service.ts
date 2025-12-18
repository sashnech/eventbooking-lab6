import { Injectable, NotFoundException } from '@nestjs/common';

export interface User {
    id: number;
    name: string;
    email: string;
}

@Injectable()
export class UsersService {
    private users: User[] = [];
    private idCounter = 1;

    create(userData: { name: string; email: string }): User {
        const newUser: User = {
            id: this.idCounter++,
            ...userData,
        };
        this.users.push(newUser);
        return newUser;
    }

    findAll(): User[] {
        return this.users;
    }

    findOne(id: number): User {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }
}
