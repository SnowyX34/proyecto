import User, { UserInstance, UserCreationAttributes } from '../orm/models/user.model';

export const userRepository = {
  async getByEmail(email: string): Promise<UserInstance | null> {
    const user = await User.findOne({ where: { email } });
    return user as UserInstance | null;
  },

  async create(userData: UserCreationAttributes): Promise<UserInstance> {
    return await User.create(userData);
  }
};

