import { IFishPackage } from '../../../backend/src/interfaces';

export const mockFishPackage: IFishPackage = {
  id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  name: '6 minute english 1.0',
  shoalOfFish: [
    {
      id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      frontSide: 'hard to get your head around',
      backSide: 'difficult to fully understand or comprehend',
      remember: false,
      createdAt: '2022-05-29T06:26:16.174Z',
      refreshedAt: 'never',
    },
    {
      id: 'b197f765-57cd-4368-8751-cde181e6bfdf',
      frontSide: 'thin on the ground',
      backSide: 'there are very few of something',
      remember: false,
      createdAt: '2022-05-30T06:26:16.174Z',
      refreshedAt: 'never',
    }
  ],
};
