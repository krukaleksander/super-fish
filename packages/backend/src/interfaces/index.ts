interface IFish {
  id?: number,
  frontSide: string,
  backSide: string,
  remember: boolean,
  createdAt: string,
  refreshedAt: string
}

interface IFishPackage {
  id?: number,
  name: string,
  shoalOfFish?: IFish[]
}
