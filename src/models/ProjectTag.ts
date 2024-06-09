import mongoose, { Document, Schema } from 'mongoose';

interface IProjectTag extends Document {
    name: string;
}

const projectTagSchema = new Schema<IProjectTag>({
    name: { type: String, required: true, unique: true }
});

export default mongoose.model<IProjectTag>('ProjectTag', projectTagSchema);
