import { Column, Entity, ManyToOne } from "typeorm";
import { IFish } from "../../interfaces";
import { JoinColumn } from "typeorm/browser";
import { FishPackage } from "./FishPackage.entity";

@Entity({name: 'flashcard'})
export class FlashCard implements IFish{
  @Column({unique: true})
  id: string;
  @Column()
  backSide: string;
  @Column()
  createdAt: string;
  @Column()
  frontSide: string;
  @Column()
  packageID: string;
  @Column()
  refreshedAt: string;
  @Column()
  remember: boolean;
  @ManyToOne(() => FishPackage, (fishpackage) => fishpackage.shoalOfFish)
  @JoinColumn({referencedColumnName: 'id', name: 'packageId'})
  package: FishPackage
}
