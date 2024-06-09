import express, { Request, Response } from 'express';
import Project from '../models/Project';
import { auth, role } from '../controllers/authentication';

// Custom request interface to include user
interface CustomRequest extends Request {
    user?: {
        _id: string;
        role: string;
    };
}

const router = express.Router();

router.post('/', auth, role(['Client']), async (req: CustomRequest, res: Response) => {
    try {
        const { title, description, tags } = req.body;
        const project = await Project.create({ title, description, client: req.user!._id, tags });
        res.status(201).send(project);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(400).send('An unknown error occurred.');
        }
    }
});

router.get('/', auth, role(['Client']), async (req: CustomRequest, res: Response) => {
    try {
        const projects = await Project.find({ client: req.user!._id }).populate('client', 'username').populate('tags', 'name');
        res.send(projects);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(400).send('An unknown error occurred.');
        }
    }
});

router.put('/:id', auth, role(['Client']), async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, tags } = req.body;

        const project = await Project.findOneAndUpdate(
            { _id: id, client: req.user!._id },
            { title, description, tags },
            { new: true }
        );

        if (!project) {
            return res.status(404).send('Project not found or access denied.');
        }

        res.send(project);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(400).send('An unknown error occurred.');
        }
    }
});

router.delete('/:id', auth, role(['Client']), async (req: CustomRequest, res: Response) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id);
        if (!project || project.client.toString() !== req.user!._id.toString()) {
            return res.status(404).send('Project not found or access denied.');
        }
        await Project.findByIdAndDelete(id);
        res.send('Project removed.');
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(400).send('An unknown error occurred.');
        }
    }
});

export default router;
