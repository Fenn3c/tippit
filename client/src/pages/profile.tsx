import AddTipLinkButton from '@/components/AddTipLinkButton';
import ModalButton from '@/components/ModalButton';
import TipLink from '@/components/QrCard';
import Layout from '@/components/layouts/Layout'
import Modal from '@/components/layouts/Modal';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axiosInstance from '../utils/axios';
import Card from '@/components/layouts/Card';
import TextButton from '@/components/TextButton';
import ProfileIcon from '@/components/ProfileIcon';
import ExitIcon from '@/components/ExitIcon';



type Props = {
    id: string,
    phone: string,
    pfp: string | null,
    name: string,
    surname: string,
    position: string,
}

export default function Profile({ id, phone, name, surname, position, pfp }: Props) {

    const router = useRouter()

    const handleExit = async () => {
        axiosInstance.post('/api/auth/exit').then((res) => {
            router.reload()
        })
    }

    const fullname = `${name} ${surname}`

    return (
        <>
            <Layout title="Профиль">
                <Card bigYpadding>
                    <div className='flex gap-x-4 items-center justify-center mb-8'>
                        {pfp ?
                            <img className='bg-gray-text w-16 h-16 rounded-3xl' src={`${process.env.NEXT_PUBLIC_STATIC_HOST}/${pfp}`} alt="" /> :
                            <Image width={128} height={128} className='bg-gray-text w-16 h-16 rounded-3xl' src='/default-pfp.png' alt='default-pfp' />
                        }
                        <div>
                            <p className='font-semibold'>{fullname}</p>
                            <p className='text-gray-text'>{phone}</p>
                        </div>

                    </div>
                    <div className='flex flex-col items-center gap-y-4'>
                        <Link href='/edit-profile'>
                            <button className='font-semibold text-main-500 flex items-center gap-x-2'>
                                <ProfileIcon />
                                Изменить профиль
                            </button>
                        </Link>

                        <button onClick={handleExit} className='font-semibold text-error flex items-center gap-x-2'>
                            <ExitIcon />
                            Выйти
                        </button>
                    </div>
                </Card>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const res = await axiosInstance.get('/users/me', {
            headers: ctx.req.headers
        })
        return {
            props: {
                id: res.data.id,
                name: res.data.name,
                surname: res.data.surname,
                pfp: res.data.pfp,
                phone: res.data.phone,
                position: res.data.position
            }
        }
    } catch (e) {
        console.error(e)
        return {
            props: {},
            redirect: {
                permanent: false,
                destination: "/signin"
            }
        }
    }
}

