import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {FishDto, FishPackageDto, idOfDeletingItemDto, nameOfNewPackageDto} from '../../dto/fish.dto';
import { IFish, ISendAllFishes } from '../interfaces';
import { v4 as generateID } from 'uuid';
import { mockFishPackage } from '@super-fish/mock-fish-lib';

@Injectable()
export class FishService {
  findAll(): ISendAllFishes {
    return {
      status: 200,
      packages: [mockFishPackage],
    };
  }

  createFish(fish: FishDto) {
    const { backSide, frontSide, packageID } = fish;
    const newSavedFish: IFish = {
      packageID,
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

  createPackage(packageName: nameOfNewPackageDto) {
    const newPackage: FishPackageDto = {
      id: generateID(),
      name: packageName.name,
      shoalOfFish: []
    }
    return {
      status: 201,
      message: 'Package Created',
      package: newPackage
    }
  }

  deleteFish(fishId: idOfDeletingItemDto) {
    const isFishInDB = mockFishPackage.shoalOfFish.findIndex(fish => fish.id === fishId.id) > -1
    if(isFishInDB) return {message: 'Fish deleted'}
    throw new HttpException('No Content', HttpStatus.NO_CONTENT);
  }

  updateFish(fishToUpdate: FishDto) {
    const isFishInDB = mockFishPackage.shoalOfFish.findIndex(fish => fish.id === fishToUpdate.id) > -1
    if(isFishInDB) return {message: 'Fish updated'}
    throw new HttpException('No Content', HttpStatus.NO_CONTENT);
  }
}
