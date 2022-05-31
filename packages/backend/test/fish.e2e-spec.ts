import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FishModule } from '../src/fish/fish.module';
import * as request from 'supertest';
import { FishDto } from '../dto/fish.dto';
import { mockFishPackage } from '@super-fish/mock-fish-lib';
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
    describe("'/fish (POST) create one fish endpoint'", () => {
      it("'/fish (POST) response status 400 if no fish was send", () => {
        return request(app.getHttpServer()).post('/fish').expect(400);
      });
      it("'/fish (POST) response status 400 if fish is sent but not valid", () => {
        return request(app.getHttpServer())
          .post('/fish')
          .send({
            packageID: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
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
          packageID: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
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
    describe('create package endpoint', () => {
      it('should create package and send back details of it', async () => {
        const packageName = '6 minute english 1.2';
        const response = await request(app.getHttpServer())
          .post('/fish/package')
          .send({ name: packageName });
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          status: 201,
          message: 'Package Created',
          package: {
            id: expect.any(String),
            name: packageName,
            shoalOfFish: [],
          },
        });
      });
      it('should send 400 if package name is not a string', async () => {
        const response = await request(app.getHttpServer())
          .post('/fish/package')
          .send({ name: [1, null, undefined] });
        expect(response.status).toBe(400);
      });
      it('should send 400 if package name is too long', async () => {
        const response = await request(app.getHttpServer())
          .post('/fish/package')
          .send({ name: "I'am writing too long package name =)" });
        expect(response.status).toBe(400);
      });
    });
    describe('delete fish endpoint', () => {
      it('should delete fish if passed id is valid and can be found in db', async () => {
        const response = await request(app.getHttpServer())
          .delete('/fish')
          .send({ id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed' });
        expect(response.status).toBe(202);
      });
      it('should send 400 if id is not valid', async () => {
        const response = await request(app.getHttpServer())
          .delete('/fish')
          .send({ id: true });
        expect(response.status).toBe(400);
      });
      it('should send 204 (No Content) if there is no fish with passed id in db', async () => {
        const response = await request(app.getHttpServer())
          .delete('/fish')
          .send({ id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bba' });
        expect(response.status).toBe(204);
      });
    });
    describe('(PUT) / fish update fish endpoint', () => {
      const { shoalOfFish } = mockFishPackage;
      const fishToUpdate = shoalOfFish[0];
      it('should update existing fish', async () => {
        const modifiedFish = {
          ...fishToUpdate,
          remember: true,
        };
        const response = await request(app.getHttpServer())
          .put('/fish')
          .send(modifiedFish);
        expect(response.body).toEqual({ message: 'Fish updated' });
        expect(response.status).toBe(200);
      });
      it('should send 204 (No Content) if there is no fish with passed id in db or if user is trying to change fish id', async () => {
        const modifiedFish = {
          ...fishToUpdate,
          id: 'aaaa-xxxx-zzzz-ddddddd'
        };
        const response = await request(app.getHttpServer())
          .put('/fish')
          .send(modifiedFish);
        expect(response.status).toBe(204);
      });
    });
  });
});
