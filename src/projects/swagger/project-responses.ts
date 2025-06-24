import { ApiProperty } from '@nestjs/swagger';
import { COMMON_ERROR_RESPONSES } from '../../shared/swagger/error.responses';

export class CreatorSwagger {
  @ApiProperty({ example: 'clx123abc', description: 'ID создателя проекта' })
  id: string;

  @ApiProperty({ example: 'Иван Петров', description: 'Имя создателя' })
  name: string;

  @ApiProperty({ example: 'ivan@example.com', description: 'Email создателя' })
  email: string;

  @ApiProperty({
    example: 'MANAGER',
    enum: ['DEVELOPER', 'MANAGER', 'TEAM_LEAD', 'ADMIN'],
    description: 'Роль создателя в системе',
  })
  role: string;
}

export class MemberUserSwagger {
  @ApiProperty({ example: 'clx456def' })
  id: string;

  @ApiProperty({ example: 'Петр Сидоров' })
  name: string;

  @ApiProperty({ example: 'petr@example.com' })
  email: string;

  @ApiProperty({
    example: 'DEVELOPER',
    enum: ['DEVELOPER', 'MANAGER', 'TEAM_LEAD', 'ADMIN'],
  })
  role: string;
}

export class MemberSwagger {
  @ApiProperty({ example: 'clx789ghi' })
  id: string;

  @ApiProperty({ example: 'clx456def' })
  userId: string;

  @ApiProperty({ example: 'clx123abc' })
  projectId: string;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  joinedAt: string;

  @ApiProperty({ type: MemberUserSwagger })
  user: MemberUserSwagger;
}

export class TaskSwagger {
  @ApiProperty({ example: 'clx999xyz' })
  id: string;

  @ApiProperty({ example: 'Создать API для проектов' })
  title: string;

  @ApiProperty({
    example: 'Разработать REST API для управления проектами',
    nullable: true,
    required: false,
  })
  description: string | null;

  @ApiProperty({
    example: 'IN_PROGRESS',
    enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
  })
  status: string;

  @ApiProperty({
    example: 'HIGH',
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
  })
  priority: string;

  @ApiProperty({
    example: '2024-02-15T00:00:00.000Z',
    nullable: true,
    required: false,
  })
  dueDate: string | null;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  updatedAt: string;

  @ApiProperty({ example: 'clx123abc' })
  projectId: string;

  @ApiProperty({ example: 'clx456def', nullable: true, required: false })
  assignedTo: string | null;

  @ApiProperty({ example: 'clx789ghi' })
  createdBy: string;

  @ApiProperty({ type: MemberUserSwagger, nullable: true, required: false })
  assignee: MemberUserSwagger | null;

  @ApiProperty({ type: MemberUserSwagger })
  creator: MemberUserSwagger;
}

export class ProjectResponse {
  @ApiProperty({
    example: 'clx123abc',
    description: 'Уникальный идентификатор проекта',
  })
  id: string;

  @ApiProperty({
    example: 'Dashboard для управления проектами',
    description: 'Название проекта',
  })
  name: string;

  @ApiProperty({
    example: 'Внутренний дашборд для IT команды с управлением задачами',
    description: 'Описание проекта',
    nullable: true,
    required: false,
  })
  description: string | null;

  @ApiProperty({
    example: '2024-01-15T00:00:00.000Z',
    description: 'Дата начала проекта',
  })
  startDate: string;

  @ApiProperty({
    example: '2024-06-15T00:00:00.000Z',
    description: 'Планируемая дата завершения проекта',
    nullable: true,
    required: false,
  })
  endDate: string | null;

  @ApiProperty({
    example: true,
    description: 'Статус активности проекта',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Дата создания проекта',
  })
  createdAt: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Дата последнего обновления проекта',
  })
  updatedAt: string;

  @ApiProperty({
    example: 'clx123abc',
    description: 'ID пользователя который создал проект',
  })
  createdBy: string;

  @ApiProperty({
    type: CreatorSwagger,
    description: 'Информация о создателе проекта',
  })
  creator: CreatorSwagger;

  @ApiProperty({
    type: [MemberSwagger],
    description: 'Список участников проекта',
    isArray: true,
  })
  members: MemberSwagger[];

  @ApiProperty({
    type: [TaskSwagger],
    description: 'Список задач проекта',
    isArray: true,
  })
  tasks: TaskSwagger[];
}

export class ProjectsListResponse {
  @ApiProperty({
    type: [ProjectResponse],
    description: 'Список проектов пользователя',
    isArray: true,
  })
  projects: ProjectResponse[];
}

export class ProjectDeletedResponse {
  @ApiProperty({ example: 'Project deleted successfully' })
  message: string;
}

export class ProjectForbiddenResponse {
  @ApiProperty({
    example: 'Insufficient permissions (Manager or Team Lead role required)',
  })
  message: string;
  @ApiProperty({ example: 'Forbidden' })
  error: string;
  @ApiProperty({ example: 403 })
  statusCode: number;
}

export class ProjectAccessDeniedResponse {
  @ApiProperty({ example: 'Access denied to this project' })
  message: string;
  @ApiProperty({ example: 'Forbidden' })
  error: string;
  @ApiProperty({ example: 403 })
  statusCode: number;
}

export const PROJECT_RESPONSES = {
  CREATE_SUCCESS: {
    status: 201,
    description: 'Project created successfully',
    type: ProjectResponse,
  },
  GET_LIST_SUCCESS: {
    status: 200,
    description: 'Projects list retrieved successfully',
    type: ProjectResponse,
    isArray: true,
  },
  GET_SUCCESS: {
    status: 200,
    description: 'Project retrieved successfully',
    type: ProjectResponse,
  },
  UPDATE_SUCCESS: {
    status: 200,
    description: 'Project updated successfully',
    type: ProjectResponse,
  },
  DELETE_SUCCESS: {
    status: 200,
    description: 'Project deleted successfully',
    type: ProjectDeletedResponse,
  },
  ADD_MEMBER_SUCCESS: {
    status: 200,
    description: 'Member added to project successfully',
    type: ProjectResponse,
  },
  REMOVE_MEMBER_SUCCESS: {
    status: 200,
    description: 'Member removed from project successfully',
    type: ProjectResponse,
  },
  UNAUTHORIZED: COMMON_ERROR_RESPONSES.UNAUTHORIZED,
  FORBIDDEN: {
    status: 403,
    description: 'Access denied to this project',
    type: ProjectAccessDeniedResponse,
  },
  NOT_FOUND: COMMON_ERROR_RESPONSES.NOT_FOUND,
  INSUFFICIENT_ROLE: {
    status: 403,
    description: 'Insufficient permissions to perform this operation',
    type: ProjectForbiddenResponse,
  },
  BAD_REQUEST: COMMON_ERROR_RESPONSES.BAD_REQUEST,
} as const;
