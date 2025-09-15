import { UserType } from 'src/users/entities/user.entity';

export interface ActiveUserType {
  sub: number;
  email: string;
  user_type: UserType;
}
