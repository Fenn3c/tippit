import { Payment } from "src/payments/entities/payment.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TipLinkData } from "./tip-link-data.entity";

@Entity({ name: 'tip_links' })
export class TipLink {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    uuid: string

    @ManyToOne(() => TipLinkData, (tipLinkData) => tipLinkData.tipLinks, { eager: true })
    tipLinkData: TipLinkData

    @ManyToOne(() => User, (user) => user.tipLinks)
    user: User

    @OneToMany(() => Payment, (payment) => payment.tip_link)
    payments: Payment[]

}
