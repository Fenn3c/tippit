import { TipLink } from 'src/tip-links/entities/tip-link.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false, unique: true })
    phone: string

    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    surname: string

    @Column({ nullable: false })
    password: string

    @Column({ nullable: false, default: 'Получатель чаевых' })
    position: string

    @Column({ nullable: true })
    pfp: string

    @OneToMany(() => TipLink, (tipLink) => tipLink.user)
    tipLinks: TipLink[]
}