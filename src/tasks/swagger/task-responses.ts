import { ApiProperty } from '@nestjs/swagger';
import { COMMON_ERROR_RESPONSES } from '../../shared/swagger/error.responses';

export class UserSwagger {
  @ApiProperty({ example: 'clx123abc' })
  id: string;

  @ApiProperty({ example: 'Иван Петров' })
  name: string;

  @ApiProperty({ example: 'ivan@example.com' })
  email: string;

  @ApiProperty({
    example: 'DEVELOPER',
    enum: ['DEVELOPER', 'MANAGER', 'TEAM_LEAD', 'ADMIN'],
  })
  role: string;
}

export class ProjectSwagger {
  @ApiProperty({ example: 'clx123abc' })
  id: string;

  @ApiProperty({ example: 'Dashboard проект' })
  name: string;
}

export class TaskResponse {
  @ApiProperty({
    example: 'clx123abc',
    description: 'Уникальный идентификатор задачи',
  })
  id: string;

  @ApiProperty({
    example: 'Создать API для авторизации',
    description: 'Название задачи',
  })
  title: string;

  @ApiProperty({
    example: 'Разработать REST API для регистрации и входа пользователей',
    description: 'Описание задачи',
    nullable: true,
    required: false,
  })
  description: string | null;

  @ApiProperty({
    example: 'IN_PROGRESS',
    enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
    description: 'Статус задачи',
  })
  status: string;

  @ApiProperty({
    example: 'HIGH',
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    description: 'Приоритет задачи',
  })
  priority: string;

  @ApiProperty({
    example: '2024-02-15T00:00:00.000Z',
    description: 'Дата выполнения задачи',
    nullable: true,
    required: false,
  })
  dueDate: string | null;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Дата создания задачи',
  })
  createdAt: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Дата последнего обновления задачи',
  })
  updatedAt: string;

  @ApiProperty({
    example: 'clx123abc',
    description: 'ID проекта',
  })
  projectId: string;

  @ApiProperty({
    example: 'clx456def',
    description: 'ID исполнителя',
    nullable: true,
    required: false,
  })
  assignedTo: string | null;

  @ApiProperty({
    example: 'clx789ghi',
    description: 'ID создателя задачи',
  })
  createdBy: string;

  @ApiProperty({
    type: UserSwagger,
    description: 'Информация об исполнителе',
    nullable: true,
    required: false,
  })
  assignee: UserSwagger | null;

  @ApiProperty({
    type: UserSwagger,
    description: 'Информация о создателе задачи',
  })
  creator: UserSwagger;

  @ApiProperty({
    type: ProjectSwagger,
    description: 'Информация о проекте',
  })
  project: ProjectSwagger;
}

export class TaskDeletedResponse {
  @ApiProperty({ example: 'Task deleted successfully' })
  message: string;
}

export class TaskForbiddenResponse {
  @ApiProperty({ example: 'Only task creator or assignee can edit this task' })
  message: string;

  @ApiProperty({ example: 'Forbidden' })
  error: string;

  @ApiProperty({ example: 403 })
  statusCode: number;
}

export const TASK_RESPONSES = {
  CREATE_SUCCESS: {
    status: 201,
    description: 'Task created successfully',
    type: TaskResponse,
  },
  GET_LIST_SUCCESS: {
    status: 200,
    description: 'Tasks list retrieved successfully',
    type: TaskResponse,
    isArray: true,
  },
  GET_MY_TASKS_SUCCESS: {
    status: 200,
    description: 'My tasks retrieved successfully',
    type: TaskResponse,
    isArray: true,
  },
  GET_SUCCESS: {
    status: 200,
    description: 'Task retrieved successfully',
    type: TaskResponse,
  },
  UPDATE_SUCCESS: {
    status: 200,
    description: 'Task updated successfully',
    type: TaskResponse,
  },
  DELETE_SUCCESS: {
    status: 200,
    description: 'Task deleted successfully',
    type: TaskDeletedResponse,
  },
  UNAUTHORIZED: COMMON_ERROR_RESPONSES.UNAUTHORIZED,
  FORBIDDEN: {
    status: 403,
    description: 'Access denied to this task',
    type: TaskForbiddenResponse,
  },
  NOT_FOUND: COMMON_ERROR_RESPONSES.NOT_FOUND,
  BAD_REQUEST: COMMON_ERROR_RESPONSES.BAD_REQUEST,
};
