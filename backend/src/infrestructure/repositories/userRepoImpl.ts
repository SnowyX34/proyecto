<<<<<<< HEAD
import {User,  UserAttributes, UserCreationAttributes } from '../orm/models/user.model';
=======
import {User, UserAttributes, UserCreationAttributes } from '../orm/models/user.model';
>>>>>>> 5837d271ff19383e3e30f3ee65bcc6dcf81a5592

export const userRepository = {
  async getByEmail(email: string): Promise<UserAttributes | null> {
    const user = await User.findOne({ where: { email } });
    return user as UserAttributes | null;
  },

  async create(userData: UserCreationAttributes): Promise<UserAttributes> {
    return await User.create(userData);
  }
};

