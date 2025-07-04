import { ApiProperty } from '@nestjs/swagger';

export class NotFoundErrorResponse {
  @ApiProperty({ example: 'Resource not found' })
  message: string;
  @ApiProperty({ example: 'Not found' })
  error: string;
  @ApiProperty({ example: 404 })
  statusCode: number;
}

export class UnauthorizedErrorResponse {
  @ApiProperty({ example: 'Unauthorized access' })
  message: string;
  @ApiProperty({ example: 'Unauthorized' })
  error: string;
  @ApiProperty({ example: 401 })
  statusCode: number;
}

export class BadRequestErrorResponse {
  @ApiProperty({ example: 'Validation failed' })
  message: string;
  @ApiProperty({ example: 'Bad Request' })
  error: string;
  @ApiProperty({ example: 400 })
  statusCode: number;
}

export const COMMON_ERROR_RESPONSES = {
  NOT_FOUND: {
    description: 'resource not found',
    type: NotFoundErrorResponse,
  },
  UNAUTHORIZED: {
    description: 'unauthorized access',
    type: UnauthorizedErrorResponse,
  },
  BAD_REQUEST: {
    description: 'invalid request data',
    type: BadRequestErrorResponse,
  },
} as const;
