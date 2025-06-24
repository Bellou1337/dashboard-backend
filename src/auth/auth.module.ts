import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from './jwt/jwt.module';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from 'src/shared/guards';

@Module({
  imports: [UsersModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RoleGuard],
  exports: [AuthService, AuthGuard, JwtModule, RoleGuard, UsersModule],
})
export class AuthModule {}
