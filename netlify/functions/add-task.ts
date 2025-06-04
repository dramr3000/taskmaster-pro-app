// netlify/functions/add-task.ts
import { Handler, HandlerEvent } from '@netlify/functions';
import { connectToDatabase, TaskModel, ITask } from './_utils/db'; // Adjust path if needed

interface TaskInput { // What we expect from the client
  title: string;
  description?: string;
  status?: string;
  startDate?: string; // Client might send as ISO string
  dueDate: string;   // Client might send as ISO string
}

export const handler: Handler = async (event: HandlerEvent, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  if (!event.body) {
    return { statusCode: 400, body: 'Bad Request: Missing body' };
  }

  try {
    await connectToDatabase();
    const taskData: TaskInput = JSON.parse(event.body);

    // Basic validation
    if (!taskData.title || !taskData.dueDate) {
        return { statusCode: 400, body: 'Bad Request: Missing title or dueDate' };
    }

    const newTask = new TaskModel({
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || 'To Do', // Default status if not provided
      // Mongoose will attempt to cast string dates to Date objects based on schema
      startDate: taskData.startDate ? new Date(taskData.startDate) : undefined,
      dueDate: new Date(taskData.dueDate),
    });

    const savedTask: ITask = await newTask.save();

    return {
      statusCode: 201,
      body: JSON.stringify(savedTask),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error: any) {
    console.error('Error adding task:', error);
    if (error.name === 'ValidationError') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Validation Error', details: error.errors }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add task', details: error.message }),
    };
  }
};