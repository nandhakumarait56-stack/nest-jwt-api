import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { HashService } from "src/users/hash.service";
import { UsersService } from "src/users/users.service";
import { UserDocument } from "src/users/schema/user.schema";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserDocument | null> {
    const user = await this.usersService.getUserByUsername(username);
    if (user && await this.hashService.comparePassword(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { sub: user._id, username: user.username };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.roles,
      },
    };
  }
}