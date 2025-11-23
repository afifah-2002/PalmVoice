export interface Task {
  id: string;
  text: string; // Title (kept for backward compatibility)
  title: string; // Title (new field)
  description?: string; // Description (optional)
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  icons?: string[]; // Array of icon names for the task (up to 3)
}
