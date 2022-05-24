import {INestApplication, ValidationPipe} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {FishModule} from "../src/fish/fish.module";
import * as request from "supertest";


describe('AppService', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FishModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe())
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('fish endpoint', () => {
    it('\'/fish (GET) response status 200\'', () => {
     return request(app.getHttpServer())
       .get('/fish')
       .expect(200)
    });
    it('\'/fish (POST) response status 400 if no fish was send', () => {
      return request(app.getHttpServer())
        .post('/fish')
        .expect(400)
    })
  });
});
