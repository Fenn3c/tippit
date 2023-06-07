import { Payment } from "src/payments/entities/payment.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TipLink } from "./tip-link.entity";
import { Organization } from "src/organizations/entities/organization.entity";

@Entity({ name: 'tip_link_data' })
export class TipLinkData {
    @PrimaryGeneratedColumn({name: 'id_tip_link_data'})
    id: number

    @Column({length: 32})
    name: string

    @Column({ nullable: true, length:256 })
    banner: string

    @Column({ default: 'Оставить чаевые', length: 32})
    page_text: string

    @Column({ default: 'Спасибо!', length: 32 })
    thank_text: string

    @Column()
    min_amount: number

    @Column()
    max_amount: number

    @OneToMany(() => TipLink, (tipLinks) => tipLinks.tipLinkData, { nullable: true })
    tipLinks: TipLink[]

    @OneToOne(() => Organization, organization => organization.tipLinkData, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    organization: Organization

}
