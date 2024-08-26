import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { PrismaService } from 'src/provider/prisma.service';
import { StatusTask } from '@prisma/client';
import { ResponseTask } from './interface/responseTask.interface';

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) { }

  async getTasksWithFilter(id: number, status: string): Promise<ResponseTask> {
    const tasks: any = await this.prismaService.task.findMany({
      where: {
        userId: id,
        ...(status && { status: status as any })
      }
    });

    if (tasks.length === 0) {
      throw new NotFoundException("Nenhuma tarefa encontrada.");
    };
    
    return tasks;
  };

  async getByIdTask(idUser: number, id: number): Promise<ResponseTask> {
    const task = await this.prismaService.task.findUnique({
      where: {
        id: id,
        userId: idUser,
      },
    });

    if (!task) {
      throw new NotFoundException("Nenhuma tarefa encontrada para este usuário");
    };

    return task;
  };

  async createTask(id: number, taskDto: TaskDto): Promise<void> {
    const newTask = await this.prismaService.task.create({
      data: {
        name: taskDto.name,
        description: taskDto.description,
        status: StatusTask[taskDto.status],
        userId: id,
      }
    });;

    if (!newTask) {
      throw new HttpException('Erro ao criar o usuário. Tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
    };
  };

  async updateTask(idTask: number, idUser: number, taskDto: TaskDto): Promise<void> {
    const actualTask = await this.prismaService.task.findUnique({
      where: { id: idTask },
    });

    if (!actualTask) {
      throw new NotFoundException("Tarefa não encontrada");
    };

    if (actualTask.userId !== idUser) {
      throw new ForbiddenException("Você não tem permissão para atualizar esta tarefa");
    };

    if (actualTask.status === StatusTask.COMPLETED) {
      throw new ForbiddenException("Não é possível atualizar uma tarefa que já foi concluída.");
    };
    
    const taskUpdate = await this.prismaService.task.update({
      where: { id: idTask },
      data: {
        name: taskDto.name,
        description: taskDto.description,
        status: StatusTask[taskDto.status],
        userId: idUser,
      }
    });

    if (!taskUpdate) {
      throw new HttpException('Erro ao atualizar a atividade. Tente novamente.', HttpStatus.INTERNAL_SERVER_ERROR);
    };
  };

  async deleteTask(id: number): Promise<void> {
    const actualTask = await this.prismaService.task.findUnique({
      where: { id }
    });

    if (!actualTask) {
      throw new HttpException('Atividade não encontrada.', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.task.delete({
      where: { id }
    });
  };
};