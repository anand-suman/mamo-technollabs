import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;
const mongodbUrl = process.env.MONGODB_URL || '';

import authRoutes from './routes/authentication';
import projectRoutes from './routes/project';
import tagRoutes from './routes/tags';

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tags', tagRoutes);

mongoose.connect(mongodbUrl)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
