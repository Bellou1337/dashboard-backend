import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван Иванов',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Пароль',
    example: 'securePassword123',
    minLength: 6,
    maxLength: 100,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
