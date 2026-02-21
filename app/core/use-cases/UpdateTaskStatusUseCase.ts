import { ITaskRepository } from '../repositories/ITaskRepository';
import { Task, TaskStatus } from '../entities/Task';

const VALID_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done'];

export class UpdateTaskStatusUseCase {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(taskId: string, status: TaskStatus, userId: string): Promise<Task> {
        if (!VALID_STATUSES.includes(status)) {
            throw new Error('Estado inválido. Debe ser: todo, in_progress, o done.');
        }

        return this.taskRepository.updateTaskStatus(taskId, status, userId);
    }
}
