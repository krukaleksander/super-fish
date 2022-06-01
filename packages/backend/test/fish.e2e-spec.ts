import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FishModule } from '../src/fish/fish.module';
import * as request from 'supertest';
import {FishDto, ModifyPackageDto} from '../dto/fish.dto';
import { mockFishPackage } from '@super-fish/mock-fish-lib';
describe('Fish', () => {
  let app: INestApplication;
  let putToServer: (endpoint: string, objectToSend) => Promise<any>;
  let getFromServer: (endpoint: string, objectToSend) => Promise<any>;
  let postToServer: (endpoint: string, objectToSend) => Promise<any>;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FishModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  beforeAll(function createCustomMethods() {
    putToServer = async (endpoint, objectToSend) => {
      return await request(app.getHttpServer())
        .put(endpoint)
        .send(objectToSend)
    }
    getFromServer = async (endpoint, objectToSend) => {
      return await request(app.getHttpServer())
        .get(endpoint)
        .send(objectToSend)
    }
    postToServer = async (endpoint, objectToSend) => {
      return await request(app.getHttpServer())
        .post(endpoint)
        .send(objectToSend)
    }
  })

  afterAll(async () => {
    await app.close();
  });

  describe('fish endpoint', () => {
    const singleFishEndpoint = '/fish';
    const packageEndpoint = '/fish/package';
    describe("(GET) /fish all fishes endpoint",  () => {
      it("response status 200", async () => {
        const response = await getFromServer(singleFishEndpoint, {})
        expect(response.status).toBe(200)
      });
      it("should return all packages of fishes", async () => {
        const response = await getFromServer(singleFishEndpoint, {})
        expect(response.body).toMatchSnapshot();
      });
    });
    describe("(POST) /fish create one fish endpoint'", () => {
      it("should send back fish details in response if fish was created", async () => {
        const mockFish: FishDto = {
          backSide: 'Kot',
          frontSide: 'Cat',
          packageID: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
        };
       const response = await postToServer(singleFishEndpoint, mockFish)
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
      it("response status 400 if no fish was send", async () => {
        const response = await postToServer(singleFishEndpoint, {})
        expect(response.status).toBe(400)
      });
      it("response status 400 if fish is sent but not valid", async () => {
        const response = await postToServer(singleFishEndpoint, {
          packageID: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          frontSide: 20,
          backSide: 'Something',
        })
      expect(response.body).toEqual({
        statusCode: 400,
        message: ['frontSide must be a string'],
        error: 'Bad Request',
      });
      });
    });
    describe("(PUT) /fish update fish endpoint", () => {
      const { shoalOfFish } = mockFishPackage;
      const fishToUpdate = shoalOfFish[0];
      it("should update existing fish", async () => {
        const modifiedFish = {
          ...fishToUpdate,
          remember: true,
        };
        const response = await putToServer('/fish', modifiedFish)
        expect(response.body).toEqual({ message: 'Fish updated' });
        expect(response.status).toBe(200);
      });
      it("should send 204 (No Content) if there is no fish with passed id in db or if user is trying to change fish id", async () => {
        const modifiedFish = {
          ...fishToUpdate,
          id: 'aaaa-xxxx-zzzz-ddddddd'
        };
        const response = await putToServer('/fish', modifiedFish)
        expect(response.status).toBe(204);
      });
    });
    describe("(DELETE) /fish delete fish endpoint", () => {
      it("should delete fish if passed id is valid and can be found in db", async () => {
        const response = await request(app.getHttpServer())
          .delete('/fish')
          .send({ id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed' });
        expect(response.status).toBe(202);
      });
      it("should send 400 if id is not valid", async () => {
        const response = await request(app.getHttpServer())
          .delete('/fish')
          .send({ id: true });
        expect(response.status).toBe(400);
      });
      it("should send 204 (No Content) if there is no fish with passed id in db", async () => {
        const response = await request(app.getHttpServer())
          .delete('/fish')
          .send({ id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bba' });
        expect(response.status).toBe(204);
      });
    });
    describe("(POST)/fish/package create package endpoint", () => {
      it("should create package and send back details of it", async () => {
        const packageName = '6 minute english 1.2';
        const response = await postToServer(packageEndpoint, {name: packageName})
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
      it("should send 400 if package name is not a string", async () => {
        const response = await postToServer(packageEndpoint, { name: [1, null, undefined] })
        expect(response.status).toBe(400);
      });
      it("should send 400 if package name is too long", async () => {
        const response = await postToServer(packageEndpoint, { name: "I'am writing too long package name =)" })
        expect(response.status).toBe(400);
      });
    });
    describe("(PUT) /fish/package update fish package", () => {
      const packageToRename: ModifyPackageDto = {
        packageID: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        newName: "New Package Name"
      }
      it("should change package name if passed id is valid", async () => {
        const response = await putToServer(packageEndpoint, packageToRename)
        expect(response.status).toBe(200)
      });
      it("should throw 204 if there is no package with that id", async () => {
        const packageWithWrongID:ModifyPackageDto = {
          packageID: 'wrong id',
          newName: "New Name"
        }
        const response = await putToServer(packageEndpoint, packageWithWrongID)
        expect(response.status).toBe(204)
      });
      it("should throw 400 if new package name is too long", async () => {
        const packageWithTooLongName: ModifyPackageDto = {
          newName: "I'm sure that this name for a package is too long",
          packageID: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"

        };
        const response = await putToServer(packageEndpoint, packageWithTooLongName)
        expect(response.status).toBe(400)
      });

    })
  });
});
