import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organization } from "./organization.entity";
import { TipLink } from "src/tip-links/entities/tip-link.entity";

@Entity({ name: 'employees' })
export class Employee {
    @PrimaryGeneratedColumn({ name: 'id_employee' })
    id: number

    @Column({ unique: true, length: 256 })
    uuid: string

    @Column({ nullable: true, length: 32 })
    position: string

    @ManyToOne(() => User, (user) => user.employees)
    user: User

    @ManyToOne(() => Organization, (organization) => organization.employees, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    organization: Organization

    @OneToOne(type => TipLink, { cascade: true, eager: true })
    @JoinColumn()
    tipLink: TipLink

}
