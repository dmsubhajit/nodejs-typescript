import { User } from '../models/user';

const getUsers = async (): Promise<User[]> => {
  return await User.findAll();
};

const createUser = async (data: Partial<User>): Promise<User> => {
  return await User.create({
    name: data.name || 'Unnamed',
    email: data.email || '',
  });
};

export default { getUsers, createUser };
