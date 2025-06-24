import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Dashboard для управления проектами',
    description: 'Название проекта',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Внутренний dashboard для IT команды с управленим задачами',
    description: 'Описание проекта',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: '2024-01-15T00:00:00.000Z',
    description: 'Дата начала проекта',
    required: false,
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    example: '2024-06-15T00:00:00.000Z',
    description: 'Дата окончания проекта',
    required: false,
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
