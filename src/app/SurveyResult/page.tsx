'use client'
import './SurveyResult.scss';
import {useSearchParams} from "next/navigation";
import GetDbUserFunc from "@/app/сomponents/GetDbUserFunc/GetDbUserFunc";
import {serverUrlStore} from "@/Store/serverUrl";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import React, {useEffect, useRef} from "react";
import axios from "axios";
import {surveyStore} from "@/Store/surveyStore";
import { Suspense } from 'react';

interface Result{
    surveyName:string | undefined,
    userName: string,
    userResult: string,
    userTime: number,
    userRate?: number,
    userEmail: string,
}

interface recordResult {
    userName:string,
    userTime: number,
    userResult: string
}

const SurveyResult = () => {

    const {serverUrl} = serverUrlStore();
    const searchParams = useSearchParams();
    const resultData = searchParams.get('result');
    const result: Result | null = resultData ? JSON.parse(decodeURIComponent(resultData)) : null;

    const starsDiv = useRef<HTMLDivElement>(null);

    const session = useSession();
    const router = useRouter();

    let userRate: number = 1;
    const {surveys} = surveyStore();
    let newArr: recordResult[] | undefined = [{
        userName:'',
        userTime: 0,
        userResult: ''
    }];

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            router.push('/');
        }
    }, [session.status, router]);

    const func = async  () => {
        if(result){
            const foundSurvey = surveys.find((survey) => survey.name === result.surveyName);
            const foundSurveyRes = foundSurvey &&  foundSurvey.results;
            if(foundSurveyRes)
            newArr = [...foundSurveyRes]
                .sort((a: any, b: any) => b.userResult.substring(0,1) - a.userResult.substring(0,1))
                .slice(0, 3);
        }
    }
    func()


    const handleRate = (e:  React.MouseEvent<HTMLDivElement>)  => {
        const target = e.target as Element;
        const rateNumber: string = (target.getAttribute('data-action') ?? '');
        if(!isNaN(parseInt(target.getAttribute('data-action') ?? ''))){
            userRate = parseInt(target.getAttribute('data-action') ?? '');
        }
        if(starsDiv.current){
            [...starsDiv.current.children].map((item)=>{
                let divNumber: string = (item.getAttribute('data-action') ?? '');
                if(parseInt(divNumber) <= parseInt(rateNumber)){
                    item.classList.add('surveyResult__rate__item_active');
                }else if(parseInt(divNumber) > parseInt(rateNumber)){
                    item.classList.remove('surveyResult__rate__item_active');
                }
            })
        }
    }

    const handleBack = async () => {
        router.push('/Main');
        if(result){
            await uploadResult(userRate,result);
        }
        console.log(serverUrl)
    }

    const uploadResult = async (userRate: number, result: Result) => {
        try{
            await axios.post(`${serverUrl}/uploadResult`, {userRate,result})
                .then((response) => {
                    if(response.status === 200 ){

                    }if(response.status === 404){
                        console.log(response.data)
                    }
                })
        }catch(error){
            console.error('Error updating image:', error);
        }
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
        <div className={'surveyResult'}>
            <GetDbUserFunc/>
            <h1>Finish!!!</h1>
            <h2>Your Score: {result && result.userResult}</h2>
            <h2>Time: {result && result.userTime}s</h2>
            <div className={'surveyResult__rate'} ref={starsDiv}  onClick={handleRate}>
                <div className={'surveyResult__rate__item surveyResult__rate__item_active'} data-action={1}></div>
                <div className={'surveyResult__rate__item'} data-action={2}></div>
                <div className={'surveyResult__rate__item'} data-action={3}></div>
                <div className={'surveyResult__rate__item'} data-action={4}></div>
                <div className={'surveyResult__rate__item'} data-action={5}></div>
            </div>
            {newArr && newArr.map((item: recordResult, index: number) =>
                <div key={index} className={'surveyResult__leader'}>
                    <h1>N{index+1}</h1>
                    <div style={{'display':'flex'}}>
                        <div className={'surveyResult__logo'}>{item.userName.substring(1,0).toUpperCase()}</div>
                        <h2>{item.userName}</h2>
                    </div>
                    <h2>Result</h2>
                    <h3>Score: {result && item.userResult}</h3>
                    <h3>Time: {result && item.userTime}s</h3>
                </div>
            )}
            <button onClick={handleBack}>Back</button>
        </div>
            </Suspense>
    )
}
export default SurveyResult;