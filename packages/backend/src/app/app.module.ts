import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {FishModule} from "../fish/fish.module";

@Module({
  imports: [FishModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
