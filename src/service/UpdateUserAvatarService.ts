import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import uplodConfig from '../config/upload';
import User from '../models/User';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new Error('Only authenticated users can change avatar.');
    }

    if (user.avatar) {
      // deletar avatar anterior

      const userAvatarFilePath = path.join(uplodConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath); // stat - trás o resultado se o arquivo existe

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath); // deleta arquivo
      }
    }

    user.avatar = avatarFilename;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
