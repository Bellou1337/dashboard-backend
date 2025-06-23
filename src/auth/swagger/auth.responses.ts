import { ApiProperty } from '@nestjs/swagger';
import { COMMON_ERROR_RESPONSES } from '../../shared/swagger/error.responses';

export class RegisterResponse {
  @ApiProperty({ example: 'User successfully registered' })
  message: string;
}

export class UserExistsResponse {
  @ApiProperty({ example: 'User already exists' })
  message: string;
  @ApiProperty({ example: 'Conflict' })
  error: string;
  @ApiProperty({ example: 409 })
  statusCode: number;
}

export class LoginSuccessResponse {
  @ApiProperty({ example: 'accessToken' })
  accessToken: string;
  @ApiProperty({ example: 'refreshToken' })
  refreshToken: string;
}

export class LogoutSuccessResponse {
  @ApiProperty({ example: 'User successfully logged out' })
  message: string;
}

export const AUTH_RESPONSES = {
  REGISTER_SUCCESS: {
    status: 201,
    description: 'User successfully registered',
    type: RegisterResponse,
  },
  USER_EXISTS: {
    status: 409,
    description: 'User already exists',
    type: UserExistsResponse,
  },
  USER_NOT_FOUND: COMMON_ERROR_RESPONSES.NOT_FOUND,
  LOGIN_SUCCESS: {
    status: 200,
    description: 'User successfully logged in',
    type: LoginSuccessResponse,
  },
  LOGOUT_SUCCESS: {
    status: 204,
    description: 'User successfully logged out',
    type: LogoutSuccessResponse,
  },
} as const;
