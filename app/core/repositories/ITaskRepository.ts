import { Task, TaskWithDetails, CreateTaskInput, TaskStatus } from '../entities/Task';

export interface ITaskRepository {
    createTask(input: CreateTaskInput, adminId: string): Promise<Task>;
    getTasksByUser(userId: string): Promise<TaskWithDetails[]>;
    getTasksByMeetingsCreatedBy(adminId: string): Promise<TaskWithDetails[]>;
    updateTaskStatus(taskId: string, status: TaskStatus, userId: string): Promise<Task>;
    setDeliverableUrl(taskId: string, userId: string, url: string): Promise<Task>;
}
