import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users Controller')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() //pour que l'utilisateur puisse accéder à son profil
  @UseGuards(AuthGuard())
  findOne(@GetUser() user: User) {
    return this.usersService.findOne(user.id);
  }
}
