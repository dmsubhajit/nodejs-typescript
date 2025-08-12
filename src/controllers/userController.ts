import { Request, Response } from 'express';
import userService from '../services/userService';

const getAllUsers = async (_req: Request, res: Response) => {
  const users = await userService.getUsers();
  res.json(users);
};

const createUser = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
};

export default { getAllUsers, createUser };
