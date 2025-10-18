import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from '../../shared/repositories/user.repository';
import { UserResponse, CreateUserResponse, UpdateUserResponse, FindUserResponse, UserListResponse } from './types/user.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }
  
  async create(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    
    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };
    
    const user = await this.userRepository.create(userData);
    return this.mapUserToResponse(user);
  }

  async findAll(): Promise<UserListResponse[]> {
    const users = await this.userRepository.findMany();
    return users.map(user => this.mapUserToResponse(user));
  }

  async findOne(id: string): Promise<FindUserResponse | null> {
    const user = await this.userRepository.findById(String(id));
    return user ? this.mapUserToResponse(user) : null;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateUserResponse> {
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
    
    const user = await this.userRepository.update(String(id), updateUserDto);
    return this.mapUserToResponse(user);
  }
  
  async remove(id: number): Promise<UserResponse> {
    const user = await this.userRepository.delete(String(id));
    return this.mapUserToResponse(user);
  }

  private mapUserToResponse(user: any): UserResponse {
    const { password, ...userResponse } = user;
    return userResponse as UserResponse;
  }
}
