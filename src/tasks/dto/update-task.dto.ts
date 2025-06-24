import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Название задачи',
    example: 'Обновленное название задачи',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({
    description: 'Описание задачи',
    example: 'Обновленное описание задачи',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Статус задачи',
    enum: TaskStatus,
    example: 'IN_PROGRESS',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Приоритет задачи',
    enum: TaskPriority,
    example: 'HIGH',
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Дата выполнения задачи',
    example: '2024-02-15T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'ID пользователя, на которого назначается задача',
    example: 'clx123abc456def789',
  })
  @IsOptional()
  @IsString()
  @IsUUID('4', { each: false })
  assignedTo?: string;
}
