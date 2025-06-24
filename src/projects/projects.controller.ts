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
import { ManagersOnly } from 'src/shared/decorators/roles.decorator';
import { RoleGuard } from 'src/shared/guards';
import { CreateProjectDto, UpdateProjectDto, AddMemberDto } from './dto';
import { ProjectsService } from './projects.service';
import { ProjectWithDetails } from './types/project.types';
import {
  PROJECT_RESPONSES,
  ProjectDeletedResponse,
} from './swagger/project-responses';

@ApiTags('projects')
@UseGuards(AuthGuard, RoleGuard)
@ApiBearerAuth('access-token')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ManagersOnly()
  @ApiOperation({ summary: 'Создать новый проект' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse(PROJECT_RESPONSES.CREATE_SUCCESS)
  @ApiResponse(PROJECT_RESPONSES.UNAUTHORIZED)
  @ApiResponse(PROJECT_RESPONSES.INSUFFICIENT_ROLE)
  @ApiResponse(PROJECT_RESPONSES.BAD_REQUEST)
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req,
  ): Promise<ProjectWithDetails> {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список проектов пользователя' })
  @ApiResponse(PROJECT_RESPONSES.GET_LIST_SUCCESS)
  @ApiResponse(PROJECT_RESPONSES.UNAUTHORIZED)
  async findAll(@Request() req): Promise<ProjectWithDetails[]> {
    return this.projectsService.findAllForUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить проект по ID' })
  @ApiParam({ name: 'id', description: 'ID проекта' })
  @ApiResponse(PROJECT_RESPONSES.GET_SUCCESS)
  @ApiResponse(PROJECT_RESPONSES.UNAUTHORIZED)
  @ApiResponse(PROJECT_RESPONSES.NOT_FOUND)
  @ApiResponse(PROJECT_RESPONSES.FORBIDDEN)
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ProjectWithDetails> {
    return this.projectsService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ManagersOnly()
  @ApiOperation({ summary: 'Обновить проект' })
  @ApiParam({ name: 'id', description: 'ID проекта' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse(PROJECT_RESPONSES.UPDATE_SUCCESS)
  @ApiResponse(PROJECT_RESPONSES.UNAUTHORIZED)
  @ApiResponse(PROJECT_RESPONSES.INSUFFICIENT_ROLE)
  @ApiResponse(PROJECT_RESPONSES.NOT_FOUND)
  @ApiResponse(PROJECT_RESPONSES.FORBIDDEN)
  @ApiResponse(PROJECT_RESPONSES.BAD_REQUEST)
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ): Promise<ProjectWithDetails> {
    return this.projectsService.update(id, updateProjectDto, req.user.id);
  }

  @Delete(':id')
  @ManagersOnly()
  @ApiOperation({ summary: 'Удалить проект' })
  @ApiParam({ name: 'id', description: 'ID проекта' })
  @ApiResponse(PROJECT_RESPONSES.DELETE_SUCCESS)
  @ApiResponse(PROJECT_RESPONSES.UNAUTHORIZED)
  @ApiResponse(PROJECT_RESPONSES.INSUFFICIENT_ROLE)
  @ApiResponse(PROJECT_RESPONSES.NOT_FOUND)
  @ApiResponse(PROJECT_RESPONSES.FORBIDDEN)
  async remove(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ProjectDeletedResponse> {
    await this.projectsService.remove(id, req.user.id);
    return { message: 'Project deleted successfully' };
  }

  @Post(':id/members')
  @ManagersOnly()
  @ApiOperation({ summary: 'Добавить участника в проект' })
  @ApiParam({ name: 'id', description: 'ID проекта' })
  @ApiBody({ type: AddMemberDto })
  @ApiResponse(PROJECT_RESPONSES.ADD_MEMBER_SUCCESS)
  @ApiResponse(PROJECT_RESPONSES.UNAUTHORIZED)
  @ApiResponse(PROJECT_RESPONSES.INSUFFICIENT_ROLE)
  @ApiResponse(PROJECT_RESPONSES.NOT_FOUND)
  @ApiResponse(PROJECT_RESPONSES.FORBIDDEN)
  @ApiResponse(PROJECT_RESPONSES.BAD_REQUEST)
  async addMember(
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto,
    @Request() req,
  ): Promise<ProjectWithDetails> {
    return this.projectsService.addMember(id, addMemberDto, req.user.id);
  }

  @Delete(':id/members/:userId')
  @ManagersOnly()
  @ApiOperation({ summary: 'Удалить участника из проекта' })
  @ApiParam({ name: 'id', description: 'ID проекта' })
  @ApiParam({ name: 'userId', description: 'ID пользователя' })
  @ApiResponse(PROJECT_RESPONSES.REMOVE_MEMBER_SUCCESS)
  @ApiResponse(PROJECT_RESPONSES.UNAUTHORIZED)
  @ApiResponse(PROJECT_RESPONSES.INSUFFICIENT_ROLE)
  @ApiResponse(PROJECT_RESPONSES.NOT_FOUND)
  @ApiResponse(PROJECT_RESPONSES.FORBIDDEN)
  @ApiResponse(PROJECT_RESPONSES.BAD_REQUEST)
  async removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Request() req,
  ): Promise<ProjectWithDetails> {
    return this.projectsService.removeMember(id, userId, req.user.id);
  }
}
