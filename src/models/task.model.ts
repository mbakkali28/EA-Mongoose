import { Schema, model, InferSchemaType } from 'mongoose';

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }
  },
  {
    timestamps: true
});

export type Task = InferSchemaType<typeof taskSchema>;

export const TaskModel = model('Task', taskSchema);
