import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {FishDto, FishPackageDto, IdOfFishOrPackageDto, ModifyPackageDto, nameOfNewPackageDto} from '../../dto/fish.dto';
import { IFish, ISendAllFishes } from '../interfaces';
import { v4 as generateID } from 'uuid';
import { mockFishPackage } from '@super-fish/mock-fish-lib';

@Injectable()
export class FishService {
  getOneFish(fishIdObject: IdOfFishOrPackageDto) {
    const isFishInDB = mockFishPackage.shoalOfFish.findIndex(fish => fish.id === fishIdObject.id) > -1;
    if(isFishInDB) return mockFishPackage.shoalOfFish.find((fish) => fish.id === fishIdObject.id)
    throw new HttpException('No Content', HttpStatus.NO_CONTENT);
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

  updateFish(fishToUpdate: FishDto) {
    const isFishInDB = mockFishPackage.shoalOfFish.findIndex(fish => fish.id === fishToUpdate.id) > -1
    if(isFishInDB) return {message: 'Fish updated'}
    throw new HttpException('No Content', HttpStatus.NO_CONTENT);
  }

  deleteFish(fishId: IdOfFishOrPackageDto) {
    const isFishInDB = mockFishPackage.shoalOfFish.findIndex(fish => fish.id === fishId.id) > -1
    if(isFishInDB) return {message: 'Fish deleted'}
    throw new HttpException('No Content', HttpStatus.NO_CONTENT);
  }

  sendAllPackages(): ISendAllFishes {
    return {
      status: 200,
      packages: [mockFishPackage],
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

  updatePackage(packageToModify: ModifyPackageDto) {
    const db = [mockFishPackage]
    const indexOfPackage = db.findIndex(fishPackage => fishPackage.id === packageToModify.packageID);
    if(indexOfPackage > -1) {
      db[indexOfPackage].name = packageToModify.newName;
      return {message: 'Package updated'}
    }
    throw new HttpException('No Content', HttpStatus.NO_CONTENT)
  }

  deleteFishPackage(packageIdObj: IdOfFishOrPackageDto) {
    const isIdValid = mockFishPackage.id === packageIdObj.id;
    if(isIdValid) return {message: 'Package deleted'}
    throw new HttpException('No Content', HttpStatus.NO_CONTENT);
  }
}
