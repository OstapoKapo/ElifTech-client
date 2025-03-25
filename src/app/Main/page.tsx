'use client'
import './Main.scss';
import Image from "next/image";
import AddImage from '../../../public/icon/add.svg';
import FullStarImg from '../../../public/icon/fullStar.svg';
import {useSession} from 'next-auth/react';
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {serverUrlStore} from "@/Store/serverUrl";
import {userStore} from '@/Store/user';
import axios from 'axios';

const Main = () => {

    const {serverUrl, setServerUrl} = serverUrlStore();
    const {user, updateUser} = userStore();
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            router.push('/');
        }

        const handleToSetServerUrl = () => {
            setServerUrl();
        };
        handleToSetServerUrl();

        const getDbUser = async () => {
            const sessionEmail  = session.data?.user?.email;

            await axios.post(`${serverUrl}/getDbUser`, {sessionEmail})
                .then((response) => {
                    if(response.status === 200 ){
                        updateUser(response.data.dbUser);
                    }
                })
        }

        if(serverUrl !== 'server' && session.data?.user !== undefined){
            getDbUser();
        }

    }, [session.status, router, serverUrl]);


    return (
        <div className={'main'}>
            <div className={'main__line'}></div>
            <div className={'main__row'}>
                <div className={'main__filterGroup'}>
                    <button className={'main__filterBtn'}>By Name</button>
                    <button className={'main__filterBtn'}>By Questions</button>
                    <button className={'main__filterBtn'}>By Completions</button>
                </div>
                <div className={'main__addBtn'}>
                    <Image
                        src={AddImage}
                        width={80}
                        height={80}
                        alt="Add"
                    />
                </div>
            </div>

            <div className={'main__cardContainer'}>
                <div className={'main__card'}>
                    <div className={'card__top'}>
                        <p className={'card__header'}>Quiz Name</p>
                        <div className={'card__rate'}>
                            4
                            <Image
                                src={FullStarImg}
                                width={40}
                                height={40}
                                alt="Add"
                            />
                        </div>
                    </div>
                    <div className={'card__text card__description'}>Quiz description sadsaasd asdd sad asa asd</div>
                    <p className={'card__text'} style={{'margin': '10px 0 '}}>Questions: 18</p>
                    <div className={'card__row'}>
                        <p className={'card__text'}>Completions: 18</p>
                        <button className={'card__runBtn'}>run</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main;