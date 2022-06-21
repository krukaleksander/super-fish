import { Column, Entity, OneToMany } from "typeorm";
import { IFishPackage } from "../../interfaces";
import { FlashCard } from "./Flashcard.entity";

@Entity({name: 'fishpackage'})
export class FishPackage implements IFishPackage{
  @Column({unique: true})
  id: string;
  @Column()
  name: string;
  @OneToMany(() => FlashCard, (inverseSide) => inverseSide.package, {cascade: true})
  shoalOfFish: FlashCard[];
}
