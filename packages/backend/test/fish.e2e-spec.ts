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
    describe('\'/fish (GET) one fish endpoint\'', () => {
      it('\'/fish (GET) response status 200\'', () => {
        return request(app.getHttpServer())
          .get('/fish')
          .expect(200)
      });
    })
    describe('\'/fish (POST) one fish endpoint\'', () => {
      it('\'/fish (POST) response status 400 if no fish was send', () => {
        return request(app.getHttpServer())
          .post('/fish')
          .expect(400)
      })
      it('\'/fish (POST) response status 400 if fish is sent but not valid', () => {
        return request(app.getHttpServer())
          .post('/fish')
          .send({
            frontSide: 20,
            backSide: 'Something'
          })
          .expect({
              "statusCode": 400,
              "message": [
                'frontSide must be a string',
                'remember should not be empty',
                'remember must be a boolean value',
                'createdAt should not be empty',
                'createdAt must be a string',
                'refreshedAt should not be empty',
                'refreshedAt must be a string'
              ],
              "error": "Bad Request"
            }
          )
      })
    })
  });
});
