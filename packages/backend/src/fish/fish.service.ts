import { Injectable } from '@nestjs/common';
@Injectable()
export class FishService {
  findAll(): string {
    return 'This action returns all fishes';
  }
}
