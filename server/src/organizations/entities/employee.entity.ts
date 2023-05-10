import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organization } from "./organization.entity";

@Entity({ name: 'employees' })
export class Employee {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    uuid: string

    @Column({ nullable: false })
    position: string

    @ManyToOne(() => User, (user) => user.employees)
    user: User

    @ManyToOne(() => Organization, (organization) => organization.employees)
    organization: Organization

    // staff: any


}
