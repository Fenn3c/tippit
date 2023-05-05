import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'phone_verifications' })
export class PhoneVerification {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    uuid: string

    @Column({ nullable: false })
    phone: string

    @Column({ nullable: false })
    code: string

    @Column({ nullable: true })
    accessCode?: string

    @Column({ nullable: false })
    generateDate: Date

    @Column({ nullable: true })
    accessDate?: Date

}