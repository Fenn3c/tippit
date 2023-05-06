import Layout from '@/components/layouts/Layout'
import { GetServerSideProps } from 'next';
import Image from 'next/image'

export default function Home() {
  return (
    <Layout title="QR и ссылки">
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  return {
    props:{}
  }
}

