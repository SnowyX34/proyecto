import { Register } from '../../domain/dto/register.dto';
import { userRepository } from '../../infrestructure/repositories/userRepoImpl';
import bcrypt from 'bcryptjs';

export const registerUserUseCase = async (data: Register) => {
  const { email, password, phone_number, role, avatarUrl, ...rest } = data;

  const existing = await userRepository.getByEmail(email);
  if (existing) return { status: 400, payload: { msg: 'Usuario ya existe' } };

  const hashed = await bcrypt.hash(password, 10);

  const user = await userRepository.create({
    ...rest,
    email,
    password: hashed,
    phone_number,
    role,
    avatarUrl,
  });

  return { status: 200, payload: { msg: 'Usuario registrado', user } };
};
