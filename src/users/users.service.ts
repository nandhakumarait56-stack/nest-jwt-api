import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { HashService } from './hash.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor( @InjectModel(User.name) private  userModel : Model<UserDocument>, 
     private hashService: HashService
    ){}
    async getUserByUsername(username: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ username }).exec();
    return user; // returns null automatically if not found
}

    async registerUsser(CreateUserDto : CreateUserDto): Promise<UserDocument>{
        const createUser = new this.userModel(CreateUserDto);
        //check if user exists
        const user = await this.getUserByUsername(createUser.username);
        if(user){
            throw new BadRequestException();
        }
        //Hash Password
        createUser.password = await this.hashService.hashPassword(createUser.password);
        return createUser.save();
    }
    async deleteUser(username: string): Promise<boolean> {
    const user = await this.userModel.findOneAndDelete({ username }).exec();
    if (!user) {
        throw new NotFoundException(`User ${username} not found`);
    }
    return true;
}

async updateUser(username: string, updateData: Partial<UserDocument>): Promise<UserDocument> {
    const updatedUser = await this.userModel
        .findOneAndUpdate({ username }, updateData, { new: true })
        .exec();

    if (!updatedUser) {
        throw new NotFoundException(`User ${username} not found`);
    }

    return updatedUser;
}

}
