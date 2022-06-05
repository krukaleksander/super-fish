import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
} from '@nestjs/common';
import { FishService } from './fish.service';
import {
  FishDto,
  IdOfFishOrPackageDto,
  ModifyPackageDto,
  nameOfNewPackageDto,
} from '../../dto/fish.dto';
import { ISendAllFishes } from '../interfaces';

@Controller('fish')
export class FishController {
  constructor(private readonly fishService: FishService) {}
  @Get()
  getOneFish(@Body() fishIdObject: IdOfFishOrPackageDto) {
    return this.fishService.getOneFish(fishIdObject);
  }
  @Post()
  createFish(@Body() fish: FishDto) {
    return this.fishService.createFish(fish);
  }
  @Put()
  updateFish(@Body() fishToUpdate: FishDto) {
    return this.fishService.updateFish(fishToUpdate);
  }
  @Delete()
  @HttpCode(202)
  deleteFish(@Body() fishId: IdOfFishOrPackageDto) {
    return this.fishService.deleteFish(fishId);
  }
  @Get('/package')
  sendAllPackages(): ISendAllFishes {
    return this.fishService.sendAllPackages();
  }
  @Post('/package')
  createPackage(@Body() packageName: nameOfNewPackageDto) {
    return this.fishService.createPackage(packageName);
  }
  @Put('/package')
  updatePackage(@Body() packageToModify: ModifyPackageDto) {
    return this.fishService.updatePackage(packageToModify);
  }
  @Delete('/package')
  @HttpCode(202)
  deleteFishPackage(@Body() packageIdObj: IdOfFishOrPackageDto) {
    return this.fishService.deleteFishPackage(packageIdObj);
  }
}
