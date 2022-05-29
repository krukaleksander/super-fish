import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {IFish, IFishPackage} from "../src/interfaces";

export class FishDto implements IFish {
  @IsOptional()
  @IsNumber()
  id?: string;
  @IsString()
  @IsNotEmpty()
  frontSide: string;
  @IsString()
  @IsNotEmpty()
  backSide: string;
  @IsBoolean()
  @IsOptional()
  remember?: boolean;
  @IsString()
  @IsOptional()
  createdAt?: string;
  @IsString()
  @IsOptional()
  refreshedAt?: string;
}

export class FishPackageDto implements IFishPackage {
  @IsOptional()
  @IsNumber()
  id?: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsOptional()
  @ValidateNested({each: true})
  @Type(() => FishDto)
  shoalOfFish?: FishDto[];
}
