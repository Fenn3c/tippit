import AddTipLinkButton from '@/components/AddTipLinkButton';
import ModalButton from '@/components/ModalButton';
import Layout from '@/components/layouts/Layout'
import Modal from '@/components/layouts/Modal';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axiosInstance from '../utils/axios';
import QrCard from '@/components/QrCard';
import DropMenu from '@/components/DropMenu';
const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN

type TipLink = {
  hide?: boolean
  name: string
  uuid: string
  organization: {
    name: string
    uuid: string
  } | null
}

type Props = {
  tipLinks: TipLink[],
  filter: string | null
}

export default function Home({ tipLinks, filter }: Props) {
  const [tipModal, setTipModal] = useState<string | null>(null)
  const [isOrganizationFilter, setIsOrganizationFilter] = useState<boolean>(Boolean(filter) && filter !== 'me')

  const router = useRouter()

  const organizationsDropdown = tipLinks.reduce((accumulator: any, tipLink) => {
    if (!tipLink.organization) return accumulator
    accumulator[tipLink.organization.uuid] = {
      name: tipLink.organization.name,
      onSelect() {
        setIsOrganizationFilter(true)
        router.push({
          query: { filter: tipLink.organization?.uuid }
        })
      }
    }
    return accumulator

  }, {})

  const initialDropDown = {
    ...{
      total: {
        name: 'Все',
        onSelect() {
          setIsOrganizationFilter(false)
          router.push({
            query: {}
          })
        },
      },
      me: {
        name: 'Мои ссылки',
        onSelect() {
          setIsOrganizationFilter(false)
          router.push({
            query: { filter: 'me' }
          })
        }
      }
    }, ...organizationsDropdown
  }
  const handleDeleteTipLink = async () => {
    if (!tipModal) return
    await axiosInstance.delete(`/api/tip-links/${tipModal}`)
    setTipModal(null)
    router.replace(router.asPath);
  }
  const handleAdd = () => {
    router.push('/tip-links/create')
  }

  const filteredTipLinks = tipLinks.filter(tipLink => !tipLink.hide)
  return (
    <>
      <Layout title="QR и ссылки" onAddClick={handleAdd} smallTitleMargin>
        {Boolean(tipLinks.length) && <DropMenu
          initialId={filter ? filter : 'total'}
          options={initialDropDown} />}
        <div className="flex flex-col gap-y-8 mb-8">
          {filteredTipLinks.map((tipLink, index) =>
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
        {!isOrganizationFilter && <AddTipLinkButton onClick={handleAdd} />}

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
    const filter = ctx.query.filter
    const res = await axiosInstance.get(`/tip-links`, {
      headers: ctx.req.headers
    })
    if (filter === 'me') {
      res.data = res.data.map((tipLink: TipLink) => {
        if (Boolean(tipLink.organization)) tipLink.hide = true
        return tipLink
      })
    } else if (filter) {
      res.data = res.data.map((tipLink: TipLink) => {
        if (tipLink.organization?.uuid !== filter) tipLink.hide = true
        return tipLink
      })
    }
    return {
      props: {
        filter: filter ?? null,
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

