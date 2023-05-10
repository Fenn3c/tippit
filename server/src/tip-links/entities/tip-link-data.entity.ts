import { Payment } from "src/payments/entities/payment.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TipLink } from "./tip-link.entity";
import { Organization } from "src/organizations/entities/organization.entity";

@Entity({ name: 'tip_link_data' })
export class TipLinkData {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ nullable: true })
    banner: string

    @Column({ default: 'Оставить чаевые' })
    page_text: string

    @Column({ default: 'Спасибо!' })
    thank_text: string

    @Column()
    min_amount: number

    @Column()
    max_amount: number

    @OneToMany(() => TipLink, (tipLinks) => tipLinks.tipLinkData)
    tipLinks: TipLink[]

    @OneToOne(() => Organization, organization => organization.tipLinkData, { onDelete: 'CASCADE' })
    organization: Organization

}
