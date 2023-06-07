import { Payment } from "src/payments/entities/payment.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TipLinkData } from "./tip-link-data.entity";
import { Employee } from "src/organizations/entities/employee.entity";
import { Organization } from "src/organizations/entities/organization.entity";

@Entity({ name: 'tip_links' })
export class TipLink {
    @PrimaryGeneratedColumn({ name: 'id_tip_link' })
    id: number

    @Column({ unique: true, length: 256 })
    uuid: string

    @ManyToOne(() => TipLinkData, (tipLinkData) => tipLinkData.tipLinks, { eager: true })
    tipLinkData: TipLinkData

    @ManyToOne(() => User, (user) => user.tipLinks)
    user: User

    @OneToMany(() => Payment, (payment) => payment.tip_link)
    payments: Payment[]

    @OneToOne(() => Employee, employee => employee.tipLink, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    employee: Employee

    @ManyToOne(() => Organization, organization => organization.tipLinks, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    organization: Organization

}
