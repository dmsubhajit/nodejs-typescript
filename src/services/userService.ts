import { User } from '../models/user';

const users: User[] = [];

const getUsers = (): User[] => users;

const createUser = (data: Partial<User>): User => {
  const user: User = {
    id: users.length + 1,
    name: data.name || 'Unnamed',
    email: data.email || '',
  };
  users.push(user);
  return user;
};

export default { getUsers, createUser };
