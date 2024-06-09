import express, { Request, Response } from 'express';
import ProjectTag from '../models/ProjectTag';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const tags = await ProjectTag.find();
        res.send(tags);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(400).send('An unknown error occurred.');
        }
    }
});

export default router;
