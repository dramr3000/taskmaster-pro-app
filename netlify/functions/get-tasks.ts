// netlify/functions/get-tasks.ts
import { Handler } from '@netlify/functions';
import { connectToDatabase, TaskModel, ITask } from './_utils/db'; // Adjust path if needed

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    await connectToDatabase();
    const tasks: ITask[] = await TaskModel.find({}).sort({ createdAt: -1 }); // Get all tasks, newest first

    // Mongoose returns documents with _id.
    // If your frontend expects 'id', you can map it here or handle _id in frontend.
    // For simplicity, let's return as is, frontend can adapt or use _id.
    return {
      statusCode: 200,
      body: JSON.stringify(tasks),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch tasks', details: error.message }),
    };
  }
};