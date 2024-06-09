import mongoose, { Document, Schema } from 'mongoose';

interface IProject extends Document {
    title: string;
    description: string;
    client: mongoose.Schema.Types.ObjectId;
    tags: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
}

const projectSchema = new Schema<IProject>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectTag' }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProject>('Project', projectSchema);
