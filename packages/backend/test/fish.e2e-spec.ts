import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FishModule } from '../src/fish/fish.module';
import * as request from 'supertest';
import { FishDto } from '../dto/fish.dto';

describe('Fish', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FishModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('fish endpoint', () => {
    describe('/fish (GET) all fishes endpoint', () => {
      it("'/fish (GET) response status 200'", () => {
        return request(app.getHttpServer()).get('/fish').expect(200);
      });
      it('/fish (GET) should return all packages of fishes', async () => {
        const { body: response } = await request(app.getHttpServer()).get(
          '/fish'
        );
        expect(response).toMatchSnapshot();
      });
    });
    describe("'/fish (POST) one fish endpoint'", () => {
      it("'/fish (POST) response status 400 if no fish was send", () => {
        return request(app.getHttpServer()).post('/fish').expect(400);
      });
      it("'/fish (POST) response status 400 if fish is sent but not valid", () => {
        return request(app.getHttpServer())
          .post('/fish')
          .send({
            frontSide: 20,
            backSide: 'Something',
          })
          .expect({
            statusCode: 400,
            message: ['frontSide must be a string'],
            error: 'Bad Request',
          });
      });
      it('/fish (POST) should send back fish details in response', async () => {
        const mockFish: FishDto = {
          backSide: 'Kot',
          frontSide: 'Cat',
        };
        const response = await request(app.getHttpServer())
          .post('/fish')
          .send(mockFish);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          status: 201,
          message: 'Fish created',
          fish: {
            frontSide: mockFish.frontSide,
            backSide: mockFish.backSide,
            id: expect.any(String),
            remember: expect.any(Boolean),
            createdAt: expect.any(String),
            refreshedAt: expect.any(String),
          },
        });
      });
    });
  });
});
