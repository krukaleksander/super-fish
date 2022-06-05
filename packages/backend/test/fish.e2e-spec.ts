import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FishModule } from '../src/fish/fish.module';
import * as request from 'supertest';
import {FishDto, ModifyPackageDto} from '../dto/fish.dto';
import { mockFishPackage } from '@super-fish/mock-fish-lib';
import * as superagent from 'superagent';

describe('Fish', () => {
  let app: INestApplication;
  let putToServer: (endpoint: string, objectToSend) => Promise<superagent.Response>;
  let getFromServer: (endpoint: string, objectToSend) => Promise<superagent.Response>;
  let postToServer: (endpoint: string, objectToSend) => Promise<superagent.Response>;
  let deleteFromServer: (endpoint: string, objectToSend) => Promise<superagent.Response>;
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
      return request(app.getHttpServer())
        .put(endpoint)
        .send(objectToSend);
    }
    getFromServer = async (endpoint, objectToSend) => {
      return request(app.getHttpServer())
        .get(endpoint)
        .send(objectToSend);
    }
    postToServer = async (endpoint, objectToSend) => {
      return request(app.getHttpServer())
        .post(endpoint)
        .send(objectToSend);
    }
    deleteFromServer = async (endpoint, objectToSend) => {
      return request(app.getHttpServer())
        .delete(endpoint)
        .send(objectToSend);
    }
  })

  afterAll(async () => {
    await app.close();
  });

  describe('fish endpoint', () => {
    const singleFishEndpoint = '/fish';
    const packageEndpoint = '/fish/package';
    const fishID = '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';
    const fakeID = 'fake id';
    const packageID = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
    describe("(GET) /fish get single fish endpoint", () => {
      it("should return status 200 if fish is in DB", async () => {
        const response = await getFromServer(singleFishEndpoint, {id: fishID})
        expect(response.status).toBe(200)
      });
      it("should return fish with given id", async () => {
        const response = await getFromServer(singleFishEndpoint, {id: fishID})
        expect(response.body).toEqual(mockFishPackage.shoalOfFish.find(fish => fish.id === fishID))
      });
      it("should return status 204 if with given id is not in db", async () => {
        const response = await getFromServer(singleFishEndpoint, {id: fakeID})
        expect(response.status).toBe(204)
      });
    })
    describe("(POST) /fish create one fish endpoint'", () => {
      it("should send back fish details in response if fish was created", async () => {
        const mockFish: FishDto = {
          backSide: 'Kot',
          frontSide: 'Cat',
          packageID: fishID,
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
          id: fakeID
        };
        const response = await putToServer('/fish', modifiedFish)
        expect(response.status).toBe(204);
      });
    });
    describe("(DELETE) /fish delete fish endpoint", () => {
      it("should delete fish if passed id is valid and can be found in db", async () => {
        const response = await deleteFromServer(singleFishEndpoint, { id: fishID })
        expect(response.status).toBe(202);
      });
      it("should send 400 if id is not valid", async () => {
        const response = await deleteFromServer(singleFishEndpoint, { id: null })
        expect(response.status).toBe(400);
      });
      it("should send 204 (No Content) if there is no fish with passed id in db", async () => {
        const response = await deleteFromServer(singleFishEndpoint, { id: fakeID })
        expect(response.status).toBe(204);
      });
    });
    describe("(GET) /fish/package all fishes endpoint",  () => {
      it("response status 200", async () => {
        const response = await getFromServer(packageEndpoint, {})
        expect(response.status).toBe(200)
      });
      it("should return all packages of fishes", async () => {
        const response = await getFromServer(packageEndpoint, {})
        expect(response.body).toMatchSnapshot();
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
          packageID: fakeID,
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
    describe('(DELETE) /fish/package delete fish package', () => {
      it("should return status 202 if id is valid", async () => {
        const response = await deleteFromServer(packageEndpoint, {id: packageID})
        expect(response.status).toBe(202);
      });
      it("should return message package deleted", async () => {
        const response = await deleteFromServer(packageEndpoint, {id: packageID})
        expect(response.body).toEqual({message: 'Package deleted'});
      });
      it("should return status 204 if there is no package with given id", async () => {
        const response = await deleteFromServer(packageEndpoint, {id: fakeID})
        expect(response.status).toBe(204);
      });
    })
  });
});
