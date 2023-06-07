import { PhoneVerification } from "src/sms/phoneVerifications.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'payouts' })
export class Payout {
    @PrimaryGeneratedColumn({ 'name': 'id_payout' })
    id: number

    @Column({ unique: true, length: 256 })
    uuid: string

    @Column({ nullable: false })
    amount: number

    @Column({ nullable: false, length: 256 })
    payout_token: string

    @Column()
    payout_date: Date

    @Column({ nullable: false, length: 256 })
    payout_id: string

    @ManyToOne(() => User, (user) => user.payouts)
    user: User

}
