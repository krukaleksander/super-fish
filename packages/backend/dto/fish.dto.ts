import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {IFish, IFishPackage} from "../src/interfaces";

export class FishDto implements IFish {
  @IsNotEmpty()
  @IsString()
  packageID: string;
  @IsOptional()
  @IsString()
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

export class nameOfNewPackageDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20, {message: 'Package name is too long'})
  name: string;
}

export class idOfDeletingItemDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
