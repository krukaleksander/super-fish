import { Injectable } from '@nestjs/common';
import { FishDto } from '../../dto/fish.dto';
import { IFish } from '../interfaces';
import {v4 as generateID} from 'uuid';
@Injectable()
export class FishService {
  findAll(): string {
    return 'This action returns all fishes';
  }

  saveFish(fish: FishDto) {
    const { backSide, frontSide } = fish;
    const newSavedFish: IFish = {
      backSide,
      frontSide,
      id: generateID(),
      remember: false,
      refreshedAt: 'never',
      createdAt: new Date().toString(),
    };
    return {
      status: 201,
      message: 'Fish created',
      fish: newSavedFish,
    };
  }
}
