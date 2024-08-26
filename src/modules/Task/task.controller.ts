import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';

import { Request } from 'express';

import { AccessTokenGuard } from '../Auth/guards/accessToken.guard';

import { TaskService } from './task.service';
import { TaskDto } from './dto/task.dto';
import { ResponseTask } from './interface/responseTask.interface';

@Controller('task')
export class TaskController {
  private logger: Logger = new Logger(TaskController.name);

  constructor(private taskService: TaskService) { }

  @Get()
  @UseGuards(AccessTokenGuard)
  async getFilterTasks(@Req() req: Request, @Query('status') status?: string): Promise<ResponseTask> {
    const id = req.user['sub'];
    this.logger.log("Filter task with status");

    return this.taskService.getTasksWithFilter(id, status);
  };

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async findTaskById(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<ResponseTask> {
    const idUser = req.user['sub'];
    this.logger.log(`Finding task with id: ${id}`);

    return this.taskService.getByIdTask(idUser, id);
  };

  @Post()
  @UseGuards(AccessTokenGuard)
  async createNewTask(@Req() req: Request, @Body() taskDto: TaskDto): Promise<void> {
    const id = req.user['sub'];
    this.logger.log('Creating new task');

    await this.taskService.createTask(id, taskDto);
  };

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  async updateActualTask(@Param('id', ParseIntPipe) idTask: number, @Req() req: Request, @Body() taskDto: TaskDto): Promise<void> {
    const idUser = req.user['sub'];
    this.logger.log('Updating actual task');

    await this.taskService.updateTask(idTask, idUser, taskDto);
  };

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async deleteSettingsScheduleSingle(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.log('Deleting task');

    await this.taskService.deleteTask(id);
  };
};