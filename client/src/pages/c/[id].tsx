import Layout from "@/components/layouts/Layout";
import UserCard from "@/components/UserCard";
import { GetServerSideProps } from 'next';
import Link from "next/link";


type Props = {
    users: {
        link: string,
        name: string,
        surname: string,
        position: string
        pfp: string
    }[]
}

export default function companyLink({ users }: Props) {
    return (
        <Layout title="Выберите получателя">
            <div className="flex flex-col gap-y-4">
                {users.map((user, index) =>
                    <Link href={`/t/${user.link}`}>
                        <UserCard key={index} fullname={`${user.name} ${user.surname}`} pfp={user.pfp} position={user.position} />
                    </Link>
                )}
            </div>

        </Layout>)
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    return {
        props: {
            users: [
                {
                    link: 'jci2c',
                    name: 'Александр',
                    pfp: 'test',
                    surname: 'Тихонов',
                    position: 'Бариста'
                },
                {
                    link: 'jci2c',
                    name: 'Александр',
                    pfp: 'test',
                    surname: 'Тихонов',
                    position: 'Бариста'
                },
                {
                    link: 'jci2c',
                    name: 'Александр',
                    pfp: 'test',
                    surname: 'Тихонов',
                    position: 'Бариста'
                },
                {
                    link: 'jci2c',
                    name: 'Александр',
                    pfp: 'test',
                    surname: 'Тихонов',
                    position: 'Бариста'
                },
                {
                    link: 'jci2c',
                    name: 'Александр',
                    pfp: 'test',
                    surname: 'Тихонов',
                    position: 'Бариста'
                },
            ]
        }
    }
}