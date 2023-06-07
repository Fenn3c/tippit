import { Exclude } from 'class-transformer';
import { Employee } from 'src/organizations/entities/employee.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Payout } from 'src/payouts/entities/payout.entity';
import { TipLink } from 'src/tip-links/entities/tip-link.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ name: 'id_user' })
    id: number

    @Column({ nullable: false, unique: true, length: 11 })
    phone: string

    @Column({ nullable: false, length: 32 })
    name: string

    @Column({ nullable: false, length: 32 })
    surname: string

    @Column({ nullable: false, length: 256 })
    password: string

    @Column({ nullable: false, default: 'Получатель чаевых', length: 32 })
    position: string

    @Column({ nullable: true, length: 256 })
    pfp: string

    @Column({ nullable: false, type: 'int', default: 0 })
    balance: number

    @OneToMany(() => TipLink, (tipLink) => tipLink.user)
    tipLinks: TipLink[]

    @OneToMany(() => Payment, (payment) => payment.receiver)
    payments: Payment[]

    @OneToMany(() => Payout, (payout) => payout.user)
    payouts: Payout[]

    @OneToMany(() => Organization, (organization) => organization.owner)
    organizations: Organization[]

    @OneToMany(() => Employee, (employee) => employee.user)
    employees: Employee[]
}