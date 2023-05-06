import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tip_links' })
export class TipLink {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    uuid: string

    @Column()
    name: string

    @Column({nullable: true})
    banner: string

    @Column({ default: 'Оставить чаевые' })
    page_text: string

    @Column({ default: 'Спасибо!' })
    thank_text: string

    @Column()
    min_amount: number

    @Column()
    max_amount: number

    @ManyToOne(() => User, (user) => user.tipLinks, {eager: true})
    user: User

}
