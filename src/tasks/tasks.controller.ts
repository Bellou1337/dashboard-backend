import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/shared/guards';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TasksService } from './tasks.service';
import { TaskWithDetails } from './types/task.types';
import { TASK_RESPONSES, TaskDeletedResponse } from './swagger/task-responses';

@ApiTags('tasks')
@UseGuards(AuthGuard, RoleGuard)
@ApiBearerAuth('access-token')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('project/:projectId')
  @ApiOperation({ summary: 'Создать новую задачу в проекте' })
  @ApiParam({ name: 'projectId', description: 'ID проекта' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse(TASK_RESPONSES.CREATE_SUCCESS)
  @ApiResponse(TASK_RESPONSES.UNAUTHORIZED)
  @ApiResponse(TASK_RESPONSES.NOT_FOUND)
  @ApiResponse(TASK_RESPONSES.FORBIDDEN)
  @ApiResponse(TASK_RESPONSES.BAD_REQUEST)
  async create(
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,

    @Request() req,
  ): Promise<TaskWithDetails> {
    return this.tasksService.create(projectId, createTaskDto, req.user.id);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Получить все задачи проекта' })
  @ApiParam({ name: 'projectId', description: 'ID проекта' })
  @ApiResponse(TASK_RESPONSES.GET_LIST_SUCCESS)
  @ApiResponse(TASK_RESPONSES.UNAUTHORIZED)
  @ApiResponse(TASK_RESPONSES.NOT_FOUND)
  @ApiResponse(TASK_RESPONSES.FORBIDDEN)
  async findAllInProject(
    @Param('projectId') projectId: string,
    @Request() req,
  ): Promise<TaskWithDetails[]> {
    return this.tasksService.findAllInProject(projectId, req.user.id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Получить мои задачи' })
  @ApiResponse(TASK_RESPONSES.GET_MY_TASKS_SUCCESS)
  @ApiResponse(TASK_RESPONSES.UNAUTHORIZED)
  async findMyTasks(@Request() req): Promise<TaskWithDetails[]> {
    return this.tasksService.findMyTasks(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить задачу по ID' })
  @ApiParam({ name: 'id', description: 'ID задачи' })
  @ApiResponse(TASK_RESPONSES.GET_SUCCESS)
  @ApiResponse(TASK_RESPONSES.UNAUTHORIZED)
  @ApiResponse(TASK_RESPONSES.NOT_FOUND)
  @ApiResponse(TASK_RESPONSES.FORBIDDEN)
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<TaskWithDetails> {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить задачу' })
  @ApiParam({ name: 'id', description: 'ID задачи' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse(TASK_RESPONSES.UPDATE_SUCCESS)
  @ApiResponse(TASK_RESPONSES.UNAUTHORIZED)
  @ApiResponse(TASK_RESPONSES.NOT_FOUND)
  @ApiResponse(TASK_RESPONSES.FORBIDDEN)
  @ApiResponse(TASK_RESPONSES.BAD_REQUEST)
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ): Promise<TaskWithDetails> {
    return this.tasksService.update(id, updateTaskDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить задачу' })
  @ApiParam({ name: 'id', description: 'ID задачи' })
  @ApiResponse(TASK_RESPONSES.DELETE_SUCCESS)
  @ApiResponse(TASK_RESPONSES.UNAUTHORIZED)
  @ApiResponse(TASK_RESPONSES.NOT_FOUND)
  @ApiResponse(TASK_RESPONSES.FORBIDDEN)
  async remove(
    @Param('id') id: string,
    @Request() req,
  ): Promise<TaskDeletedResponse> {
    await this.tasksService.remove(id, req.user.id);
    return { message: 'Task deleted successfully' };
  }
}
