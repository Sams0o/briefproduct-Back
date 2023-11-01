import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const { first_name, last_name, email, password} = createAuthDto;

    // hashage du mot de passe
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // création d'une entité user
    const user = this.usersRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
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

  async login(loginDto: LoginDto) {
    console.log('dans le service back => ' + JSON.stringify(loginDto));
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOneBy({ email });
    console.log('dans le service => ' + user);
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      console.log("L'authetification a échoué.");
    }
  }
}
