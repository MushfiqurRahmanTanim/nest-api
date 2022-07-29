import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createHash } from '../../utils/hash';
import { CreateUserDto } from './dto/create-user.dto';

import { User, UserDocument } from './models/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.findOne(createUserDto.email);
    if (user) throw new ConflictException('User already exists');

    createUserDto.password = await createHash(createUserDto.password);
    await this.userModel.create(createUserDto);

    return {
      message: `Account created successfully`,
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username });

    if (!user) return null;

    return user;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) return null;

    return user;
  }
  async findOne(email: string) {
    return await this.userModel.findOne({ email });
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
