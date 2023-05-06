import AddTipLinkButton from '@/components/AddTipLinkButton';
import ModalButton from '@/components/ModalButton';
import TipLink from '@/components/TipLink';
import Layout from '@/components/layouts/Layout'
import Modal from '@/components/layouts/Modal';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axiosInstance from '../../utils/axios';

type TipLink = {
  name: string
  uuid: string
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
    router.reload()
  }
  const handleAdd = () => {
    router.push('/create-tip-link')
  }

  return (
    <>
      <Layout title="QR и ссылки" onAddClick={handleAdd}>
        <div className="flex flex-col gap-y-8 mb-8">
          {tipLinks.map((tipLink, index) =>
            <TipLink
              uuid={tipLink.uuid}
              key={index}
              name={tipLink.name}
              onMoreClick={() => { setTipModal(tipLink.uuid) }}
            />
          )}
        </div>
        <AddTipLinkButton onClick={handleAdd} />

      </Layout>
      <Modal open={Boolean(tipModal)} onClose={() => setTipModal(null)}>
        <Link href={`/edit-tip-link/${tipModal}`}>
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

