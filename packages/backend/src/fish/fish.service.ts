import { Injectable } from '@nestjs/common';
import {FishDto} from "../../dto/fish.dto";
@Injectable()
export class FishService {
  findAll(): string {
    return 'This action returns all fishes';
  }

  saveFish(fish: FishDto) {
    return {status: 200, message: 'Fish created'}
  }
}
