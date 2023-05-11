import { PhoneVerification } from "src/sms/phoneVerifications.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'payouts' })
export class Payout {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    uuid: string

    @Column({ nullable: false })
    amount: number

    @Column({ nullable: false })
    payout_token: string

    @Column()
    payout_date: Date

    @Column({ nullable: false })
    payout_id: string

    @ManyToOne(() => User, (user) => user.payouts)
    user: User

}
