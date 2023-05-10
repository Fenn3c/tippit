import { Exclude } from 'class-transformer';
import { Employee } from 'src/organizations/entities/employee.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { TipLink } from 'src/tip-links/entities/tip-link.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false, unique: true })
    phone: string

    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    surname: string

    @Column({ nullable: false })
    password: string

    @Column({ nullable: false, default: 'Получатель чаевых' })
    position: string

    @Column({ nullable: true })
    pfp: string

    @Column({ nullable: false, type: 'int', default: 0 })
    balance: number

    @OneToMany(() => TipLink, (tipLink) => tipLink.user)
    tipLinks: TipLink[]

    @OneToMany(() => Payment, (payment) => payment.receiver)
    payments: Payment[]

    @OneToMany(() => Organization, (organization) => organization.owner)
    organizations: Organization[]

    @OneToMany(() => Employee, (employee) => employee.user)
    employees: Employee[]
}