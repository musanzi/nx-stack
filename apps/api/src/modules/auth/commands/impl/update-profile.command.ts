import { Command } from '@nestjs/cqrs';
import { UpdateUserDto } from '@api/modules/users/dto';
import { User } from '@api/modules/users/entities';
import { IUserResponse } from '@api/modules/users/interfaces';

export class UpdateProfile extends Command<IUserResponse> {
  constructor(
    public readonly currentUser: User,
    public readonly updateUserDto: UpdateUserDto
  ) {
    super();
  }
}
