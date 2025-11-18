export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
}
