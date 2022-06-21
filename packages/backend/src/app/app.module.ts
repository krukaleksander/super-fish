import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {FishModule} from "../fish/fish.module";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [FishModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
