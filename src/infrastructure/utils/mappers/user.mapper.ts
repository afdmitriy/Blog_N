import { WithId } from 'mongodb';
import { UserOutputModel } from 'src/features/users/api/models/output/user.output.model';
import { User } from 'src/features/users/domain/user.mongoose.entity';

export const userMapper = (user: WithId<User>): UserOutputModel => {
   return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
   };
};
