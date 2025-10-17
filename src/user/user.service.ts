import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from 'src/repositories';

@Injectable()
export class UserService {

  constructor(private readonly userRepository: UserRepository) { }
  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  findAll() {
    return this.userRepository.findMany();
  }

  findOne(id: string) {
    return this.userRepository.findById(String(id));
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(String(id), updateUserDto);
  }
  remove(id: number) {
    return this.userRepository.delete(String(id));
  }
}
