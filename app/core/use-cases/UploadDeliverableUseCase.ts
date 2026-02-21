import { ITaskRepository } from '../repositories/ITaskRepository';
import { Task } from '../entities/Task';

export class UploadDeliverableUseCase {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async execute(taskId: string, userId: string, fileUrl: string): Promise<Task> {
        if (!fileUrl) {
            throw new Error('La URL del archivo no puede estar vacía.');
        }

        return this.taskRepository.setDeliverableUrl(taskId, userId, fileUrl);
    }
}
