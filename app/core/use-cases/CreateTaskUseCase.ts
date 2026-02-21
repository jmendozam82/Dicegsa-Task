import { ITaskRepository } from '../repositories/ITaskRepository';
import { Task, CreateTaskInput } from '../entities/Task';

export interface IEmailService {
    sendTaskAssignmentEmail(params: {
        to: string;
        assigneeName: string;
        adminName: string;
        taskTitle: string;
        meetingTitle: string;
        appUrl: string;
    }): Promise<void>;
}

export class CreateTaskUseCase {
    constructor(
        private readonly taskRepository: ITaskRepository,
        private readonly emailService: IEmailService
    ) { }

    async execute(input: CreateTaskInput, adminId: string, adminName: string, assigneeEmail: string, assigneeName: string, meetingTitle: string): Promise<Task> {
        if (!input.title?.trim()) {
            throw new Error('El título de la tarea es obligatorio.');
        }
        if (!input.meeting_id) {
            throw new Error('La tarea debe estar asociada a una reunión.');
        }
        if (!input.assigned_to) {
            throw new Error('La tarea debe ser asignada a un usuario.');
        }

        const task = await this.taskRepository.createTask(input, adminId);

        // Fire-and-forget email — don't block if it fails
        this.emailService.sendTaskAssignmentEmail({
            to: assigneeEmail,
            assigneeName,
            adminName,
            taskTitle: task.title,
            meetingTitle,
            appUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
        }).catch(console.error);

        return task;
    }
}
