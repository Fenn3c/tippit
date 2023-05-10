import Layout from '@/components/layouts/Layout'
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axiosInstance from '@/utils/axios';
import Button from '@/components/Button';
import QrCard from '@/components/QrCard';
import UserCard from '@/components/UserCard';
import Modal from '@/components/layouts/Modal';
import { useState } from 'react';
import ModalButton from '@/components/ModalButton';
const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN



type Props = {
    organization: {
        uuid: string,
        name: string,
        employees: {
            uuid: string,
            position: string | null,
            user: {
                name: string,
                surname: string,
                pfp: string | null
            }
        }[]
    }
}

export default function Organization({ organization }: Props) {

    const router = useRouter()
    const [waitingEmployeeModal, setWaitingEmployeeModal] = useState<string | null>(null)
    const [activeEmployeeModal, setActiveEmployeeModal] = useState<string | null>(null)


    const handleDelete = async () => {
        await axiosInstance.delete(`/api/organizations/${organization.uuid}`)
        router.push('/organizations');
    }
    const deleteWaitingEmployee = async () => {
        await axiosInstance.delete(`/api/organizations/employees/${waitingEmployeeModal}`)
        setWaitingEmployeeModal(null)
        router.replace(router.asPath)
    }
    const deleteActiveEmployee = async () => {
        await axiosInstance.delete(`/api/organizations/employees/${activeEmployeeModal}`)
        setActiveEmployeeModal(null)
        router.replace(router.asPath)
    }
    const waitingEmployees = organization.employees.filter(employee => !Boolean(employee.position))
    const activeEmployees = organization.employees.filter(employee => employee.position)

    return (
        <>
            <Layout title={organization.name}>
                <div className="flex flex-col gap-y-8">

                    <QrCard
                        name='Получить чаевые как организация'
                        topLabel='Сотрудник должен быть зарегистрирован'
                        link={`${DOMAIN_NAME}/o/${organization.uuid}`}
                        bottomLabel='Сканируйте код при помощи камеры или воспользуйтесь ссылкой.'
                    />
                    <QrCard
                        name='Пригласите сотрудника'
                        topLabel='Сотрудник должен быть зарегистрирован'
                        link={`${DOMAIN_NAME}/organizations/${organization.uuid}/invite`}
                        bottomLabel='Сканируйте код при помощи камеры или воспользуйтесь ссылкой.'
                    />

                    <Link href={`/organizations/edit/${organization.uuid}`}>
                        <Button text="Редактировать информацию" />
                    </Link>

                    <Button text="Удалить организацию" onClick={handleDelete} red />
                    <div>
                        <p className="font-bold text-2xl mb-4">Ждут подтверждения</p>
                        <div className="flex flex-col gap-y-4 mb-6">
                            {waitingEmployees.map((employee, index) =>
                                <button key={index} onClick={() => setWaitingEmployeeModal(employee.uuid)}>
                                    <UserCard fullname={`${employee.user.name} ${employee.user.surname}`} />
                                </button>)}
                        </div>

                        <p className="font-bold text-2xl mb-4">Сотрудники</p>
                        <div className="flex flex-col gap-y-4">
                            {activeEmployees.map((employee, index) =>
                                <button key={index} onClick={() => setActiveEmployeeModal(employee.uuid)}>
                                    <UserCard fullname={`${employee.user.name} ${employee.user.surname}`}
                                        position={employee.position ? employee.position : ''} />
                                </button>)}
                        </div>

                    </div>
                </div>


            </Layout >
            <Modal open={Boolean(waitingEmployeeModal)} onClose={() => setWaitingEmployeeModal(null)}>
                <Link href={`/organizations/${organization.uuid}/employees/${waitingEmployeeModal}/confirm`}>
                    <ModalButton text='Подтвердить' />
                </Link>
                <ModalButton text='Отказать' onClick={deleteWaitingEmployee} red />
            </Modal>
            <Modal open={Boolean(activeEmployeeModal)} onClose={() => setActiveEmployeeModal(null)}>
                <Link href={`/organizations/${organization.uuid}/employees/${activeEmployeeModal}/edit`}>
                    <ModalButton text='Изменить должность' />
                </Link>
                <ModalButton text='Удалить из организации' onClick={deleteActiveEmployee} red />
            </Modal>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const res = await axiosInstance.get(`/organizations/${ctx.query.uuid}`, {
            headers: ctx.req.headers
        })
        return {
            props: {
                organization: res.data
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

