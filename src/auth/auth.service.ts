import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const { first_name, last_name, email, password, admin } =
      createAuthDto;

    // hashage du mot de passe
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // création d'une entité user
    const user = this.usersRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      admin: false,
    });
    console.log('test sauvegarde user', user);

    try {
      console.log('user', user);
      // enregistrement de l'entité user
      const createdUser = await this.usersRepository.save(user);
      delete createdUser.password;
      console.log('', createdUser);
      return createdUser;
    } catch (error) {
      // gestion des erreurs
      if (error.code === '23505') {
        throw new ConflictException('Cette email est déjà utilisée.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }


}
