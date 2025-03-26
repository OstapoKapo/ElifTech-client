'use client'
import './Main.scss';
import Image from "next/image";
import AddImage from '../../../public/icon/add.svg';
import FullStarImg from '../../../public/icon/fullStar.svg';
import {useSession} from 'next-auth/react';
import {useRouter} from "next/navigation";
import React, {useEffect, useRef, useState} from "react";
import {Survey} from "@/types";
import {serverUrlStore} from "@/Store/serverUrl";
import {surveyStore} from "@/Store/surveyStore";
import GetDbUserFunc from "@/app/сomponents/GetDbUserFunc/GetDbUserFunc";



const Main: React.FC = () => {


    const {surveys, updateSurvey} = surveyStore();
    const {serverUrl} = serverUrlStore();
    const session = useSession();
    const router = useRouter();
    const filterDiv = useRef<HTMLDivElement>(null);
    const [arr, setArr] = useState<Survey[]>(surveys);

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            router.push('/');
        }
    }, [session.status, router, serverUrl]);

    useEffect(() => {
        if(arr.length<1){
            setArr(surveys);
        }
    });

    const handleFilter = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as Element;
        const action: string = (target.getAttribute('data-action') ?? '');
        if(filterDiv.current){
            [...filterDiv.current.children].map((item)=>{
                item.classList.remove('main__filterBtn_active');
            })
        }
        let sortedObjects: Survey[] = [];
        if(action === 'name'){
             sortedObjects = [...arr].sort((a:Survey, b:Survey) => a.name.localeCompare(b.name));
        }
        if(action === 'questions'){
             sortedObjects = [...arr].sort((a:Survey, b:Survey) => b.questions.length - a.questions.length);
        }
        if(action === 'completions'){
             sortedObjects = [...arr].sort((a:Survey, b:Survey) => b.results.length - a.results.length);
        }
        if(action){
            target.classList.add('main__filterBtn_active');
            updateSurvey(sortedObjects)
        }
    }

    return (
        <div className={'main'}>
            <GetDbUserFunc/>
            <div className={'main__row'}>
                <div className={'main__filterGroup'} ref={filterDiv} onClick={handleFilter}>
                    <button className={'main__filterBtn main__filterBtn_active'} data-action={'name'}>By Name</button>
                    <button className={'main__filterBtn'} data-action={'questions'}>By Questions</button>
                    <button className={'main__filterBtn'} data-action={'completions'}>By Completions</button>
                </div>
                <div className={'main__addBtn'} onClick={()=> router.push('/CreateSurvey')}>
                    <Image
                        src={AddImage}
                        width={80}
                        height={80}
                        alt="Add"
                    />
                </div>
            </div>

            <div className={'main__cardContainer'}>
                {surveys && surveys.map((q:Survey, index: number)=> (
                    <div className={'main__card'} key={index}>
                        <div className={'card__top'}>
                            <p className={'card__header'}>{q.name}</p>
                            <div className={'card__rate'}>
                                {q.rate.length ===0 ? '0' : Math.floor(q.rate.reduce((sum, num) => sum + num, 0) / q.rate.length)}
                                <Image
                                    src={FullStarImg}
                                    width={40}
                                    height={40}
                                    alt="Add"
                                />
                            </div>
                        </div>
                        <div className={'card__text card__description'}>Quiz description sadsaasd asdd sad asa asd</div>
                        <p className={'card__text'} style={{'margin': '10px 0 '}}>Questions: {q.questions.length}</p>
                        <div className={'card__row'}>
                            <p className={'card__text'}>Completions: {q.results.length}</p>
                            <button className={'card__runBtn'} onClick={()=>  router.push(`/StartSurvey?survey=${encodeURIComponent(JSON.stringify(q))}`)} >run</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Main;