export interface IFish {
  id?: string,
  frontSide: string,
  backSide: string,
  remember?: boolean,
  createdAt?: string,
  refreshedAt?: string
}

export interface IFishPackage {
  id?: string,
  name: string,
  shoalOfFish?: IFish[]
}

export interface ISendAllFishes {
  status: number,
  packages: IFishPackage[]
}
