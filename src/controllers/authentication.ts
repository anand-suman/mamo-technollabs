import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

interface DecodedToken extends JwtPayload {
    id: string;
}

interface CustomRequest extends Request {
    user?: any;
}

export const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const tokenHeader = req.header('Authorization');

    if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
        return res.status(401).send('No token provided.');
    }

    const token = tokenHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).send('User not found.');
        }
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).send('Token has expired.');
        }
        res.status(400).send('Invalid token.');
    }
};

export const role = (roles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).send('Access denied.');
        }
        next();
    };
};
