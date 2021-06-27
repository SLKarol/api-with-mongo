import { User } from '../schemas/user.schema';

export type UserType = Omit<User, 'password'>;
