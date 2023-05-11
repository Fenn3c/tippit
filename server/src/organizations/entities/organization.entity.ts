import { User } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee.entity";
import { TipLinkData } from "src/tip-links/entities/tip-link-data.entity";
import { TipLink } from "src/tip-links/entities/tip-link.entity";

@Entity({ name: 'organizations' })
export class Organization {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    uuid: string

    @Column({ nullable: false })
    name: string

    // @ManyToOne(() => TipLinkData, (tipLinkData) => tipLinkData.organization, { eager: true, onDelete: 'CASCADE' })
    @OneToOne(type => TipLinkData, { cascade: true, eager: true })
    @JoinColumn()
    tipLinkData: TipLinkData

    @OneToMany(() => TipLink, (tipLink) => tipLink.organization, { cascade: true })
    tipLinks: TipLink[]

    @ManyToOne(() => User, (user) => user.tipLinks)
    owner: User

    @OneToMany(() => Employee, (employee) => employee.organization, { cascade: true })
    employees: Employee[]


}
