import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { RegisterDto, LoginDto } from './dto';
import { UsersService } from 'src/users/users.service';
import { hashPassword, comparePassword } from 'src/shared/utils/password.utils';
import { JwtService } from './jwt/jwt.service';
import type { TokensResponse } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Record<string, string>> {
    const { email, password } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await hashPassword(password);
    registerDto.password = hashedPassword;
    await this.usersService.create(registerDto);

    return { message: 'User successfully registered' };
  }

  async login(loginDto: LoginDto): Promise<TokensResponse> {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.generateAccessToken(user.id);
    const refreshToken = await this.jwtService.generateRefreshToken(user.id);
    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(userId: string): Promise<Record<string, string>> {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'User successfully logged out' };
  }

  async refreshTokens(refreshToken: string): Promise<TokensResponse> {
    try {
      const userId = await this.jwtService.verifyRefreshToken(refreshToken);
      const user = await this.usersService.findById(userId);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const newAccessToken = await this.jwtService.generateAccessToken(user.id);
      const newRefreshToken = await this.jwtService.generateRefreshToken(
        user.id,
      );
      await this.usersService.updateRefreshToken(user.id, newRefreshToken);
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
