import { Request, Response } from 'express';
import userService from '../services/userService';

const getAllUsers = (_req: Request, res: Response) => {
  const users = userService.getUsers();
  res.json(users);
};

const createUser = (req: Request, res: Response) => {
  const user = userService.createUser(req.body);
  res.status(201).json(user);
};

export default { getAllUsers, createUser };
