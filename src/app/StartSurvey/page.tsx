'use client'
import './StartSurvey.scss';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import {userStore} from "@/Store/user";
import { Survey } from '@/types';
import GetDbUserFunc from "@/app/сomponents/GetDbUserFunc/GetDbUserFunc";
import {useSession} from "next-auth/react";
import { Suspense } from 'react';

interface Result{
    surveyName:string | undefined,
    userName: string,
    userResult: string,
    userTime: number,
    userEmail: string,
}

const StartSurvey: React.FC = () => {
    const searchParams = useSearchParams();
    const surveyData = searchParams.get('survey');
    const survey: Survey | null = surveyData ? JSON.parse(decodeURIComponent(surveyData)) : null;


    const {user} = userStore();
    const session = useSession();
    const router = useRouter();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<(string | string[])[]>([]);

    let userResult: Result = {
        surveyName: survey?.name,
        userName: user?.name,
        userEmail: user?.email,
        userResult: '',
        userTime: 0
    }


    const maxTime = Number(survey?.maxTime) || 0; // Хвилини → число
    const [timeLeft, setTimeLeft] = useState<number>(maxTime * 60);
    let interval: any = ''
    useEffect(() => {
        if (timeLeft <= 0) handleSubmit();

        interval = setInterval(() => {
            setTimeLeft((prev)=> prev-1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);


    useEffect(() => {
        if (survey) {
            const savedAnswers = localStorage.getItem(`surveyAnswers-${survey.name}`);
            const savedIndex = localStorage.getItem(`surveyIndex-${survey.name}`);
            const savedTime = localStorage.getItem(`surveyTime-${survey.name}`);

            if (savedAnswers && savedIndex) {
                setAnswers(JSON.parse(savedAnswers));
                setCurrentQuestionIndex(Number(savedIndex));
                setTimeLeft(Number(savedTime));
            }
        }
    }, []);

    useEffect(() => {
        if (survey) {
            localStorage.setItem(`surveyAnswers-${survey.name}`, JSON.stringify(answers));
            localStorage.setItem(`surveyIndex-${survey.name}`, String(currentQuestionIndex));
            localStorage.setItem(`surveyTime-${survey.name}`, String(timeLeft));
        }
    }, [answers,timeLeft, currentQuestionIndex]);



    const handleAnswerChange = (questionIndex: number, answer: string | string[]) => {
        const newAnswers = [...answers];

        if (Array.isArray(answer)) {
            newAnswers[questionIndex] = answer;
        } else {
            newAnswers[questionIndex] = answer;
        }

        setAnswers(newAnswers);
    };

    const goToNextQuestion = () => {
        if(survey){
            if (currentQuestionIndex < survey?.questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                handleSubmit();
            }
        }
    };

    const handleSubmit = async () => {
        const score = calculateScore();
        userResult = {
            surveyName: survey?.name,
            userName: user?.name,
            userEmail: user?.email,
            userResult: `${score}/${survey?.questions.length}`,
            userTime: (((Number(survey?.maxTime) || 0)*60)-timeLeft)
        }
        clearInterval(interval);
        router.push(`/SurveyResult?result=${encodeURIComponent(JSON.stringify(userResult))}`)
    };

    const calculateScore = (): number => {
        let score = 0;

        survey?.questions.forEach((question, index) => {
            const userAnswer = answers[index];
            if (question.types === 'text' && question.answer === userAnswer) {
                score++;
            } else if (question.types !== 'text') {
                const correctAnswers = question.options?.filter(opt => opt.correct).map(opt => opt.text);
                if (Array.isArray(userAnswer)) {
                    const isCorrect = userAnswer.every((answer) => correctAnswers?.includes(answer));
                    if (isCorrect && userAnswer.length === correctAnswers?.length) {
                        score++;
                    }
                }
            }
        });

        return score;
    };


    if (!survey) {
        return <div>Loading...</div>;
    }

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            router.push('/');
        }
    }, [session.status, router]);



    const currentQuestion = survey.questions[currentQuestionIndex];

    return (<Suspense >
        <div className="startSurvey">
            <GetDbUserFunc/>
            <h1>Survey's name: <span>{survey.name}</span></h1>
            <h2>Description: <span>{survey.description}</span></h2>

            <div className="startSurvey__container">
                <h1> {currentQuestion.text}</h1>
                {currentQuestion.types === 'text' && (
                    <input
                        type="text"
                        value={answers[currentQuestionIndex] as string || ''}
                        onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
                        placeholder="Your answer"
                    />
                )}

                {currentQuestion.types === 'single' && currentQuestion.options?.map((opt, oIndex) => (
                    <div key={oIndex}>
                        <input
                            type="radio"
                            name={`question-${currentQuestionIndex}`}
                            value={opt.text}
                            checked={answers[currentQuestionIndex] === opt.text}
                            onChange={() => handleAnswerChange(currentQuestionIndex, opt.text)}
                        />
                        <label className={'startSurvey__label'}>{opt.text}</label>
                    </div>
                ))}

                {currentQuestion.types === 'multiple' && currentQuestion.options?.map((opt, oIndex) => (
                    <div key={oIndex}>
                        <input
                            type="checkbox"
                            checked={Array.isArray(answers[currentQuestionIndex]) && (answers[currentQuestionIndex] as string[]).includes(opt.text)}
                            onChange={(e) => {
                                const newAnswers = Array.isArray(answers[currentQuestionIndex]) ? [...(answers[currentQuestionIndex] as string[])] : [];
                                if (e.target.checked) {
                                    newAnswers.push(opt.text);
                                } else {
                                    const index = newAnswers.indexOf(opt.text);
                                    if (index > -1) {
                                        newAnswers.splice(index, 1);
                                    }
                                }
                                handleAnswerChange(currentQuestionIndex, newAnswers);
                            }}
                        />
                        <label className={'startSurvey__label'}>{opt.text}</label>
                    </div>
                ))}

                <div className="">
                    {currentQuestionIndex < survey.questions.length - 1 ? (
                        <button className={'startSurvey__btn'} onClick={goToNextQuestion}>Next</button>
                    ) : (
                        <button className={'startSurvey__btn'} onClick={handleSubmit}>Submit</button>
                    )}
                </div>
            </div>

            <h3>Question {currentQuestionIndex + 1} of {survey.questions.length}</h3>

             <h3 className={'startSurvey__time'}>⏳ Час, що залишився: {timeLeft}</h3>
        </div>
        </Suspense>
    );
};

export default StartSurvey;
