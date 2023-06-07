import { TipLink } from 'src/tip-links/entities/tip-link.entity';
import { User } from 'src/users/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'payments' })
export class Payment {
    @PrimaryGeneratedColumn({ name: 'id_payment' })
    id: number

    @Column({ nullable: false, unique: true, length: 256 })
    uuid: string

    @Column({ nullable: false })
    amount: number

    @Column({ nullable: false })
    commision_amount: number

    @Column({ nullable: true, length: 32 })
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

    @Column({ nullable: false, length: 256 })
    payment_link: string

    @Column({ nullable: false, length: 256 })
    payment_id: string

    @ManyToOne(() => User, (user) => user.tipLinks, { onDelete: 'SET NULL' })
    receiver: User

    @ManyToOne(() => TipLink, (tipLink) => tipLink.payments, { onDelete: 'SET NULL' })
    tip_link: TipLink

}