import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../../infrestructure/repositories/userRepoImpl';

export const loginUserUseCase = async ({ email, password }: { email: string, password: string }) => {
  const user = await userRepository.getByEmail(email);
  if (!user) return { status: 400, payload: { msg: 'Usuario no encontrado' } };

  const valid = await bcrypt.compare(password, user.password); 
  if (!valid) return { status: 400, payload: { msg: 'Contraseña incorrecta' } };

  const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY || 'secret', { expiresIn: '1h' });
  return { status: 200, payload: { token } };
};
