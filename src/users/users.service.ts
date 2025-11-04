import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

// Add this interface
interface SocialProfile {
  id: string;
  email: string;
  name?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`); // Fixed template literal
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
        runValidators: true,
      })
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`); // Fixed template literal
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`); // Fixed template literal
    }
  }

  // Updated with proper typing
  async findOrCreateSocialUser(
    profile: SocialProfile,
    provider: 'google' | 'apple',
  ): Promise<User> {
    let user = await this.userModel.findOne({ email: profile.email });

    if (!user) {
      // Create new user with social provider
      const userData: Partial<User> = {
        email: profile.email,
        name: profile.name || `${provider} User`,
        password: '', // Empty password for social auth
      };

      if (provider === 'google') {
        userData.googleId = profile.id;
      } else {
        userData.appleId = profile.id;
      }

      user = new this.userModel(userData);
      await user.save();
    } else {
      // Link social account if not already linked
      let needsUpdate = false;

      if (provider === 'google' && !user.googleId) {
        user.googleId = profile.id;
        needsUpdate = true;
      } else if (provider === 'apple' && !user.appleId) {
        user.appleId = profile.id;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await user.save();
      }
    }

    return user;
  }
}
