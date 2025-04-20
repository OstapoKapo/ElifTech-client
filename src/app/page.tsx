'use client'
import './page.scss'
import Link from "next/link";
import Image from "next/image";
import pageImg from '../../public/icon/firstPage.svg';
import {useEffect} from "react";
import {useSession } from 'next-auth/react';
import {useRouter} from "next/navigation";



export default function Home() {

    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session.status === 'authenticated') {
            router.push('/Main');
        }
    }, [session.status, router]);

    if (session.status === 'loading') {
        return <p>Loading... </p>;
    }

  return (
      <div className={'page'}>
          <div className={'page__btnGroup'}>
              <Link href={'/LogIn'}>
                  <button className={'page__btn page__btn_login'}>LogIn</button>
              </Link>

              <Link href={'/SignIn'}>
                  <button className={'page__btn page__btn_signin'}>SignIn</button>
              </Link>
          </div>
          <div className={'page__image'}>
              <Image
                  src={pageImg}
                  width={500}
                  height={500}
                  alt="PagePicture"
              />
          </div>
      </div>
  )
}
