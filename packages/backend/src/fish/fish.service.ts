import { Injectable } from '@nestjs/common';
import { FishDto } from '../../dto/fish.dto';
import { IFish } from '../interfaces';
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
      id: Math.random().toString(),
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
