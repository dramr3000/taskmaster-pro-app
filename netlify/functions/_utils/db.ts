// netlify/functions/_utils/db.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Define the Task Interface (structure of a task document)
export interface ITask extends Document {
  title: string;
  description?: string;
  status: string;
  startDate?: Date;
  dueDate: Date;
  // Mongoose adds createdAt and updatedAt by default if timestamps: true
}

// 2. Define the Task Schema
const TaskSchema: Schema<ITask> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  status: { type: String, required: true, default: 'To Do' },
  startDate: { type: Date, required: false },
  dueDate: { type: Date, required: true },
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// 3. Define the Mongoose Model (or get it if already defined)
// This prevents "OverwriteModelError: Cannot overwrite `Task` model once compiled."
// during multiple function invocations in the same container (warm starts)
let TaskModel: Model<ITask>;
try {
  // Try to get the existing model if it has been compiled
  TaskModel = mongoose.model<ITask>('Task');
} catch (error) {
  // If the model doesn't exist, compile it
  TaskModel = mongoose.model<ITask>('Task', TaskSchema);
}
export { TaskModel }; // Export the TaskModel


// 4. Database Connection Logic
const MONGODB_URI = process.env.MONGODB_URI!; // Your Atlas connection string
if (!MONGODB_URI) {
  // This check is important. It will throw an error during build if MONGODB_URI is not set.
  // For local dev (netlify dev), it will throw when the function is first invoked if not set in .env
  console.error('CRITICAL: MONGODB_URI environment variable is not defined.');
  // Optionally, you could throw an error here to make it more explicit during local dev startup,
  // but for Netlify deployment, the function will fail if the env var isn't there.
  // For now, a console error is fine, the function will fail gracefully if it tries to connect without URI.
}

// Cache the connection promise to reuse connection across function invocations
let cachedConnection: Promise<typeof mongoose> | null = null;

export async function connectToDatabase() {
  if (!MONGODB_URI) { // Added check here for runtime
    throw new Error('MONGODB_URI is not defined. Cannot connect to the database.');
  }
  if (cachedConnection) {
    // console.log('Using cached database connection');
    return cachedConnection;
  }

  // console.log('Creating new database connection');
  cachedConnection = mongoose.connect(MONGODB_URI).then(mongooseInstance => {
    // console.log('Database connected successfully');
    return mongooseInstance;
  }).catch(err => {
    // console.error('Database connection error:', err);
    cachedConnection = null; // Reset cache on error so next invocation tries to reconnect
    throw err; // Re-throw error to be caught by the function handler
  });

  return cachedConnection;
}