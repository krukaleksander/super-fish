import {Body, Controller, Get, Post} from '@nestjs/common';
import {FishService} from "./fish.service";
import {FishDto} from "../../dto/fish.dto";
import {ISendAllFishes} from "../interfaces";

@Controller('fish')
export class FishController {
  constructor(private readonly fishService: FishService) {
  }
  @Get()
  findAll(): ISendAllFishes {
    return this.fishService.findAll();
  }
  @Post()
  saveFish(@Body() fish: FishDto) {
    return this.fishService.saveFish(fish);
  }
}
