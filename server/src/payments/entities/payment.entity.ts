import { TipLink } from 'src/tip-links/entities/tip-link.entity';
import { User } from 'src/users/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'payments' })
export class Payment {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false, unique: true })
    uuid: string

    @Column({ nullable: false })
    amount: number

    @Column({ nullable: false })
    commision_amount: number

    @Column({ nullable: true })
    comment: string

    @Column({ nullable: false })
    pay_off_commission: boolean

    @Column({ nullable: false })
    created_date: Date

    @Column({ nullable: true })
    pay_date: Date

    @Column({
        nullable: false,
        default: false
    })
    paid: boolean

    @Column({ nullable: false })
    payment_link: string

    @Column({ nullable: false })
    payment_id: string

    @ManyToOne(() => User, (user) => user.tipLinks)
    receiver: User

    @ManyToOne(() => TipLink, (tipLink) => tipLink.payments)
    tip_link: TipLink

}