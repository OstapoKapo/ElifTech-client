'use client'
import './Profile.scss';
import GetDbUserFunc from "@/app/сomponents/GetDbUserFunc/GetDbUserFunc";
import {useSession} from 'next-auth/react';
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {serverUrlStore} from "@/Store/serverUrl";
import {userStore} from "@/Store/user";
import {surveyStore} from "@/Store/surveyStore";
import {Survey} from "@/types";
import Image from "next/image";
import FullStarImg from "../../../public/icon/fullStar.svg";
import axios from "axios";



const Profile = () => {

    const {serverUrl} = serverUrlStore();
    const router = useRouter();
    const {surveys, updateSurvey} = surveyStore();
    const session = useSession();
    const [historyKey, setHistoryKey] = useState<boolean>(false);
    const {user, updateUser} = userStore();

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            router.push('/');
        }
    }, [session.status, router]);

    const handleDelete = async (e: any) => {
        const target = e.target as Element;
        const surveyName = target.getAttribute('id');
        console.log(surveyName)
        const email = user.email
        try{
            await axios.post(`${serverUrl}/deleteSurvey`, {surveyName, email})
                .then((response) => {
                    if(response.status === 200 ){
                        updateUser(response.data.user);
                        updateSurvey(response.data.surveys);
                    }if(response.status === 404){
                        console.log(response.data)
                    }
                })
        }catch(error){
            console.error('Error updating image:', error);
        }
    }

    return (
        <div className={'profile'}>
            <GetDbUserFunc/>
            <div className={'profile__row'}>
                <button className={'profile__btn'} onClick={()=>setHistoryKey(false)}>My Surveys</button>
                <button className={'profile__btn profile__btn_history'}  onClick={()=>setHistoryKey(true)}>History</button>
            </div>
            <div className={'card__container'}>
            {historyKey ?  (
                user.passedQuestions.map((item:any, index:number)=> <div key={index}>
                    <div className={'card'} key={index}>
                        <div className={'card__top'}>
                            <p className={'card__header'}>{item.surveyName}</p>
                        </div>
                        <p className={'card__text'}
                           style={{'margin': '10px 0 '}}>Time: {item.userTime}s</p>
                        <div className={'card__row'}>
                            <p className={'card__text'}>Result: {item.userResult}</p>
                        </div>
                    </div>
                </div>)
            ) : (

                    surveys.map((item:Survey, index:number )=>  item.author === user.email ?
                    <div className={'card'} key={index}>
                        <div className={'card__top'}>
                            <p className={'card__header'}>{item.name}</p>
                            <div className={'card__rate'}>
                                {item.rate.length === 0 ? '0' : Math.floor(item.rate.reduce((sum, num) => sum + num, 0) / item.rate.length)}
                                <Image
                                    src={FullStarImg}
                                    width={40}
                                    height={40}
                                    alt="Add"
                                />
                            </div>
                        </div>
                        <div className={'card__text card__description'}>Quiz description sadsaasd asdd sad asa asd</div>
                        <p className={'card__text'} style={{'margin': '10px 0 '}}>Questions: {item.questions.length}</p>
                        <div className={'card__row'}>
                            <p className={'card__text'}>Completions: {item.results.length}</p>
                            <div style={{'display': 'flex'}}>
                                <button className={'card__runBtn'} id={item.name}
                                        onClick={handleDelete}>Delete
                                </button>
                                <button className={'card__runBtn'}
                                        onClick={() => router.push(`/ChangeSurvey?survey=${encodeURIComponent(JSON.stringify(item))}`)}>Change
                                </button>
                            </div>

                        </div>
                    </div> : '')
            )}
            </div>
        </div>
    )
}

export default Profile;