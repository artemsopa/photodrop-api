import { Request, Response } from 'express';

const notfMiddleware = (req: Request, res: Response) => res.status(404).json({ message: 'Not found!' });

export default notfMiddleware;
