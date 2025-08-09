import {User,  UserAttributes, UserCreationAttributes } from '../orm/models/user.model';

export const userRepository = {
  async getByEmail(email: string): Promise<UserAttributes | null> {
    const user = await User.findOne({ where: { email } });
    return user as UserAttributes | null;
  },

  async create(userData: UserCreationAttributes): Promise<UserAttributes> {
    return await User.create(userData);
  }
};

