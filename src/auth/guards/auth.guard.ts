import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { UsersService } from '../../users/users.service';
import { extractTokenFromHeader } from 'src/shared/utils/token.utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Access token is missing');
    }

    try {
      const userId = await this.jwtService.verifyToken(token);
      const user = await this.usersService.findById(userId);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
