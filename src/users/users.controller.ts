import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './schema/user.schema';

@Controller()
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post('register')
    registerUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.registerUsser(createUserDto);
    }

 @UseGuards(AuthGuard('jwt'))
  @Get('user/:username')
  getUser(@Param('username') username: string) {
    return this.userService.getUserByUsername(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('user/:username')
  updateUser(
    @Param('username') username: string,
    @Body() updateData: Partial<UserDocument>
  ) {
    return this.userService.updateUser(username, updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('user/:username')
  deleteUser(@Param('username') username: string) {
    return this.userService.deleteUser(username);
  }

}