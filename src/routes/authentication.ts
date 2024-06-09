import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const router = express.Router();

router.post('/client/signup', async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;

    if (role !== 'Client') {
        return res.status(400).send('Invalid role.');
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).send('Client registered.');
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).send(err.message);
        } else {
            res.status(400).send('An unknown error occurred.');
        }
    }
});

router.post('/freelancer/signup', async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;

    if (role !== 'Freelancer') {
        return res.status(400).send('Invalid role.');
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).send('Freelancer registered.');
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).send(err.message);
        } else {
            res.status(400).send('An unknown error occurred.');
        }
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send('Invalid email or password.');
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.send({ token });
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).send(err.message);
        } else {
            res.status(400).send('An unknown error occurred.');
        }
    }
});

export default router;
