import { getContext, setContext } from 'svelte';
import type { ITag } from './tag.service.svelte';

export interface Task {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
	dueDate?: Date;
	priority?: TaskPriority;
	tag?: ITag;
}

export enum TaskPriority {
	Low = 'Nízká',
	Medium = 'Střední',
	High = 'Vysoká'
}

class TaskService {
	private tasks = $state<Task[]>([]);

	constructor() {
		// Initialize with some dummy data
		this.tasks = [
			{
				id: '1',
				title: 'Task 1',
				description: 'Testovací task',
				completed: false,
				dueDate: new Date(),
				priority: TaskPriority.Low
			},
			{
				id: '2',
				title: 'Task 2',
				completed: true,
				dueDate: new Date(),
				priority: TaskPriority.Medium
			},
			{
				id: '3',
				title: 'Task 3',
				completed: false,
				priority: TaskPriority.High,
				tag: { id: '1', name: 'Práce', color: '#0000ff', assignable: true }
			}
		];
	}

	public LoadTasks = (tasks: Task[]): void => {
		this.tasks = tasks;
	};

	public ClearTasks = (): void => {
		this.tasks = [];
	};

	public GetAllTasks = $derived(() => {
		return this.tasks;
	});

	public GetTasksByTag(tagId: string) {
		if (tagId === '0') {
			return this.tasks;
		}

		return this.tasks.filter((task) => task.tag?.id === tagId);
	}

	public GetTaskById(taskId: string) {
		return this.tasks.find((task) => task.id === taskId);
	}

	public UpdateTask(updatedTask: Task): void {
		this.tasks = this.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
	}

	public GetTasksGroupedByPriority = $derived<() => Record<string, Task[]>>(() => {
		return this.tasks.reduce((groups: Record<string, Task[]>, task) => {
			const priority = task.priority || 'none';
			if (!groups[priority]) {
				groups[priority] = [];
			}
			groups[priority].push(task);
			return groups;
		}, {});
	});

	public GetTasksGroupedByTag = $derived<() => Record<string, Task[]>>(() => {
		const tagGroups: Record<string, Task[]> = {};
		this.tasks.forEach((task) => {
			if (!task.tag) return;

			if (!tagGroups[task.tag.id]) {
				tagGroups[task.tag.id] = [];
			}
			tagGroups[task.tag.id].push(task);
		});
		return tagGroups;
	});

	public GetTasksDueToday = $derived<() => Task[]>(() => {
		const today = new Date();
		return this.tasks.filter((task) => {
			if (!task.dueDate) return false;
			const dueDate = new Date(task.dueDate);
			return (
				dueDate.getDate() === today.getDate() &&
				dueDate.getMonth() === today.getMonth() &&
				dueDate.getFullYear() === today.getFullYear()
			);
		});
	});

	public AddTask(task: Task): void {
		this.tasks.push(task);
	}

	public RemoveTask(taskId: string): void {
		this.tasks = this.tasks.filter((task) => task.id !== taskId);
	}

	public ToggleCompleted(taskId: string, completed: boolean): void {
		this.tasks = this.tasks.map((task) =>
			task.id === taskId ? { ...task, completed: completed } : task
		);
	}
}

const TASKS_KEY = Symbol('TASKS_KEY');

export function SetTaskState() {
	return setContext(TASKS_KEY, new TaskService());
}

export function GetTaskState() {
	return getContext<ReturnType<typeof SetTaskState>>(TASKS_KEY);
}
