import { Payment } from "src/payments/entities/payment.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TipLinkData } from "./tip-link-data.entity";
import { Employee } from "src/organizations/entities/employee.entity";
import { Organization } from "src/organizations/entities/organization.entity";

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

    @OneToOne(() => Employee, employee => employee.tipLink, { onDelete: 'CASCADE' })
    employee: Employee

    @ManyToOne(() => Organization, organization => organization.tipLinks, { onDelete: 'CASCADE' })
    organization: Organization

}
