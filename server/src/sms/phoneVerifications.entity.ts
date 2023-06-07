import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'phone_verifications' })
export class PhoneVerification {
    @PrimaryGeneratedColumn({ 'name': 'id_phone_verification' })
    id: number

    @Column({ unique: true, length: 256 })
    uuid: string

    @Column({ nullable: false, length: 11 })
    phone: string

    @Column({ nullable: false, length: 256 })
    code: string

    @Column({ nullable: true, length: 256 })
    accessCode?: string

    @Column({ nullable: false })
    generateDate: Date

    @Column({ nullable: true })
    accessDate?: Date

}