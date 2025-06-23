import { Controller, Post, Body, HttpCode, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';
import { AuthService } from './auth.service';
import { AUTH_RESPONSES } from './swagger/auth.responses';
import { COMMON_ERROR_RESPONSES } from 'src/shared/swagger/error.responses';
import { UseGuards } from '@nestjs/common';
import type { TokensResponse } from './interfaces';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse(AUTH_RESPONSES.REGISTER_SUCCESS)
  @ApiResponse(AUTH_RESPONSES.USER_EXISTS)
  @ApiBody({ type: RegisterDto })
  async registration(
    @Body() registerDto: RegisterDto,
  ): Promise<Record<string, string>> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse(AUTH_RESPONSES.USER_NOT_FOUND)
  @ApiResponse(AUTH_RESPONSES.LOGIN_SUCCESS)
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto): Promise<TokensResponse> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(204)
  @ApiOperation({ summary: 'Выход пользователя' })
  @ApiResponse(COMMON_ERROR_RESPONSES.UNAUTHORIZED)
  @ApiResponse(AUTH_RESPONSES.LOGOUT_SUCCESS)
  async logout(@Request() req): Promise<Record<string, string>> {
    return this.authService.logout(req.user.id);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Обновление токена' })
  @ApiResponse(AUTH_RESPONSES.LOGIN_SUCCESS)
  @ApiResponse(COMMON_ERROR_RESPONSES.UNAUTHORIZED)
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<TokensResponse> {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }
}
