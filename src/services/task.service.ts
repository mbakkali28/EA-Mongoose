import { Types, HydratedDocument } from 'mongoose';
import { TaskModel, Task } from '../models/task.model.js';

type NewTask = Pick<Task, 'title' | 'description' | 'completed' | 'organization'>;

export const createTask = async (data: NewTask): Promise<HydratedDocument<Task>> => {
  const newTask = new TaskModel(data);
  return newTask.save();
}

export const getTaskById = async (id: string): Promise<HydratedDocument<Task> | null> => {
  return TaskModel.findById(id).populate('organization');
}

export const updateTask = async (id: string, data: Partial<Task>): Promise<HydratedDocument<Task> | null> => {
  return TaskModel.findByIdAndUpdate(id, data, { new: true });
}

export const deleteTask = async (id: string): Promise<Task | null> => {
  return TaskModel.findByIdAndDelete(id);
}

export const listAllTasks = async (): Promise<Task[] | null> => {
  return TaskModel.find().lean();
}
