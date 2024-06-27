import { Request, Response } from 'express';

export const handleError500 = (req: Request, res: Response) => {
  res.redirect('/500');
};
