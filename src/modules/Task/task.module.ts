import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaService } from 'src/provider/prisma.service';

@Module({
  controllers: [TaskController],
  providers: [PrismaService, TaskService],
  exports: [TaskService]
})

export class TaskModule { }