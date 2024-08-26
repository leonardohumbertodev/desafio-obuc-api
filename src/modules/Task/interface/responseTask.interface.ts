import { StatusTask } from '@prisma/client';

export interface ResponseTask {
  id: number;
  name: string;
  description: string;
  status: StatusTask;
  created_at?: Date;
  updated_at?: Date;
  userId?: number;
};