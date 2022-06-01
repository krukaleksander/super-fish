import {Body, Controller, Delete, Get, HttpCode, Post, Put} from '@nestjs/common';
import {FishService} from "./fish.service";
import {FishDto, idOfDeletingItemDto, ModifyPackageDto, nameOfNewPackageDto} from "../../dto/fish.dto";
import {ISendAllFishes} from "../interfaces";

@Controller('fish')
export class FishController {
  constructor(private readonly fishService: FishService) {
  }
  @Get('/package')
  sendAllPackages(): ISendAllFishes {
    return this.fishService.sendAllPackages();
  }
  @Post()
  createFish(@Body() fish: FishDto) {
    return this.fishService.createFish(fish);
  }
  @Post('/package')
  createPackage(@Body() packageName: nameOfNewPackageDto) {
    return this.fishService.createPackage(packageName);
  }
  @Delete()
  @HttpCode(202)
  deleteFish(@Body() fishId: idOfDeletingItemDto) {
    return this.fishService.deleteFish(fishId)
  }
  @Put()
  updateFish(@Body() fishToUpdate: FishDto) {
    return this.fishService.updateFish(fishToUpdate)
  }
  @Put('/package')
  updatePackage(@Body() packageToModify: ModifyPackageDto) {
    return this.fishService.updatePackage(packageToModify)
  }
}
