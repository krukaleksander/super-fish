import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

class FishDto implements IFish {
  @IsOptional()
  @IsNumber()
  id?: number;
  @IsString()
  @IsNotEmpty()
  frontSide: string;
  @IsString()
  @IsNotEmpty()
  backSide: string;
  @IsBoolean()
  @IsNotEmpty()
  remember: boolean;
  @IsString()
  @IsNotEmpty()
  createdAt: string;
  @IsString()
  @IsNotEmpty()
  refreshedAt: string;
}

class FishPackageDto implements IFishPackage {
  @IsOptional()
  @IsNumber()
  id?: number;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsOptional()
  @ValidateNested({each: true})
  @Type(() => FishDto)
  shoalOfFish?: FishDto[];
}
