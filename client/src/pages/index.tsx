import AddTipLinkButton from '@/components/AddTipLinkButton';
import ModalButton from '@/components/ModalButton';
import Layout from '@/components/layouts/Layout'
import Modal from '@/components/layouts/Modal';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axiosInstance from '../utils/axios';
import QrCard from '@/components/QrCard';
const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN

type TipLink = {
  name: string
  uuid: string
  organization: {
    name: string
  } | null
}

type Props = {
  tipLinks: TipLink[]
}

export default function Home({ tipLinks }: Props) {
  const [tipModal, setTipModal] = useState<string | null>(null)


  const router = useRouter()

  const handleDeleteTipLink = async () => {
    if (!tipModal) return
    await axiosInstance.delete(`/api/tip-links/${tipModal}`)
    setTipModal(null)
    router.replace(router.asPath);
  }
  const handleAdd = () => {
    router.push('/tip-links/create')
  }

  return (
    <>
      <Layout title="QR и ссылки" onAddClick={handleAdd}>
        <div className="flex flex-col gap-y-8 mb-8">
          {tipLinks.map((tipLink, index) =>
            <QrCard
              link={`${DOMAIN_NAME}/t/${tipLink.uuid}`}
              topLabel={tipLink.organization ? tipLink.organization.name : `Ссылка на страницу чаевых`}
              bottomLabel='Сканируйте код при помощи камеры или воспользуйтесь ссылкой для оплаты.'
              key={index}
              name={tipLink.name}
              onMoreClick={tipLink.organization ? undefined : () => { setTipModal(tipLink.uuid) }}
            />
          )}
        </div>
        <AddTipLinkButton onClick={handleAdd} />

      </Layout>
      <Modal open={Boolean(tipModal)} onClose={() => setTipModal(null)}>
        <Link href={`/tip-links/edit/${tipModal}`}>
          <ModalButton text='Редактировать Ссылку' />
        </Link>

        <ModalButton text='Удалить ссылку' onClick={handleDeleteTipLink} red />

      </Modal>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const res = await axiosInstance.get('/tip-links', {
      headers: ctx.req.headers
    })
    return {
      props: {
        tipLinks: res.data
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

