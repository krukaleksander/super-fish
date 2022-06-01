import {Body, Controller, Delete, Get, HttpCode, Post, Put} from '@nestjs/common';
import {FishService} from "./fish.service";
import {FishDto, idOfDeletingItemDto, ModifyPackageDto, nameOfNewPackageDto} from "../../dto/fish.dto";
import {ISendAllFishes} from "../interfaces";

@Controller('fish')
export class FishController {
  constructor(private readonly fishService: FishService) {
  }
  @Post()
  createFish(@Body() fish: FishDto) {
    return this.fishService.createFish(fish);
  }
  @Put()
  updateFish(@Body() fishToUpdate: FishDto) {
    return this.fishService.updateFish(fishToUpdate)
  }
  @Delete()
  @HttpCode(202)
  deleteFish(@Body() fishId: idOfDeletingItemDto) {
    return this.fishService.deleteFish(fishId)
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
    return this.fishService.updatePackage(packageToModify)
  }
}
