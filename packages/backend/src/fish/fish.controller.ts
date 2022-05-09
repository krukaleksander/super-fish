import { Controller, Get } from '@nestjs/common';
import {FishService} from "./fish.service";

@Controller('fish')
export class FishController {
  constructor(private readonly fishService: FishService) {
  }
  @Get()
  findAll(): string {
    return this.fishService.findAll();
  }
}
