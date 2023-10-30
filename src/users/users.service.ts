import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private UsersRepository: Repository<User>,
  ) {}

  async findOne(id: number) {
    console.log("findOne appelé avec l'ID :", id);

    const found = await this.UsersRepository.findOne({ where: { id: id } });
    console.log('findOne :', found);

    if (!found) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas`);
    }
    return found;
  }
  
}
