'use client'
import './ChangeSurvey.scss';
import {useSession} from 'next-auth/react';
import {useRouter, useSearchParams} from "next/navigation";
import {serverUrlStore} from "@/Store/serverUrl";
import React, {useEffect, useState} from "react";
import {Survey, Question, Option} from "@/types";
import axios from "axios";
import GetDbUserFunc from "@/app/сomponents/GetDbUserFunc/GetDbUserFunc";



const ChangeSurvey: React.FC = () => {

    const searchParams = useSearchParams();
    const surveyData = searchParams.get('survey');
    const surveys: Survey | null = surveyData ? JSON.parse(decodeURIComponent(surveyData)) : null;

    const {serverUrl} = serverUrlStore();
    const session = useSession();
    const router = useRouter();
    const [survey, setSurvey] = useState<any>(surveys);

    useEffect(() => {
        const savedSurvey = localStorage.getItem("surveyData");
        if (savedSurvey) {
            setSurvey(JSON.parse(savedSurvey));
        }
    }, []);

    useEffect(() => {
        if (survey) {
            localStorage.setItem("surveyData", JSON.stringify(survey));
        }
    }, [survey]);


    const addQuestion = () => {
        setSurvey({
            ...survey,
            questions: [...survey.questions, { text: '', types: 'text' }],
        });
    };

    const deleteQuestion = (index: number) => {
        const updatedQuestions = survey.questions.filter((_:any, i:number) => i !== index);
        setSurvey({ ...survey, questions: updatedQuestions });
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const updatedQuestions = survey.questions.map((q:any, i:any) =>
            i === index ? { ...q, [field]: value } : q
        );
        setSurvey({ ...survey, questions: updatedQuestions });
    };

    const addOption = (index: number) => {
        const updatedQuestions = survey.questions.map((q:any, i:number) => {
            if (i === index) {
                const options = q.options ? [...q.options, { text: '', correct: false }] : [{ text: '', correct: false }];
                return { ...q, options };
            }
            return q;
        });
        setSurvey({ ...survey, questions: updatedQuestions });
    };

    const deleteOption = (qIndex: number, oIndex: number) => {
        const updatedQuestions = survey.questions.map((q:any, i:number) => {
            if (i === qIndex && q.options) {
                const updatedOptions = q.options.filter((_:any, j:number) => j !== oIndex);
                return { ...q, options: updatedOptions };
            }
            return q;
        });
        setSurvey({ ...survey, questions: updatedQuestions });
    };

    const updateOption = (qIndex: number, oIndex: number, field: keyof Option, value: any) => {
        const updatedQuestions = survey.questions.map((q:any, i:number) => {
            if (i === qIndex && q.options) {
                let updatedOptions = q.options.map((opt:any, j:number) =>
                    j === oIndex ? { ...opt, [field]: value } : opt
                );

                if (q.types === 'single' && field === 'correct' && value) {
                    updatedOptions = updatedOptions.map((opt:any, j:number) => ({ ...opt, correct: j === oIndex }));
                }

                return { ...q, options: updatedOptions };
            }
            return q;
        });
        setSurvey({ ...survey, questions: updatedQuestions });
    };

    const saveSurvey = async () => {
        const newSurvey = {...survey}
        console.log(newSurvey)
        await updateSurvey(newSurvey);
        setSurvey({
            name: '',
            description: '',
            questions: [],
            author: '',
            maxTime: 0,
            results: [],
            rate: []
        })
    };

    const updateSurvey = async (survey: Survey) => {
        try {
            await axios.post(`${serverUrl}/updateSurvey`, {survey})
                .then((response) => {
                    if(response.status === 200){
                        console.log(response.data)
                        router.push('/Main');
                    }else if(response.status === 201){
                        alert('Sorry this name is already used');
                    }
                })
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            router.push('/');
        }
    }, [session.status, router]);



    return (
        <div className="createSurvay">
            <div className="createSurvay__row">
                <button className="createSurvay__btn" onClick={() => router.push('/Main')}>Back</button>
            </div>
            <GetDbUserFunc/>
            <h2>Create Survey</h2>
            <input className="createSurvay__inp"
                   type="number"
                   placeholder="Time(in minutes)"
                   value={survey.maxTime}
                   onChange={(e) => setSurvey({...survey, maxTime: parseInt(e.target.value)})}
            />
            <textarea className="createSurvay__inp"
                      placeholder="Description"
                      value={survey.description}
                      onChange={(e) => setSurvey({...survey, description: e.target.value})}
            />
            <button className={'createSurvay__btn'} onClick={addQuestion}>Add Question</button>
            {survey.questions.map((q:any, index:number) => (
                <div className={'ddd'} key={index}>
                    <input className="createSurvay__inp"
                           type="text"
                           placeholder="Text question"
                           value={q.text}
                           onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                    />
                    <select
                        value={q.types}
                        onChange={(e) => updateQuestion(index, 'types', e.target.value)}
                    >
                        <option value="text">Text answer</option>
                        <option value="single">One answer</option>
                        <option value="multiple">Few answers</option>
                    </select>
                    <button className="createSurvay__btn createSurvay__btn_delete" onClick={() => deleteQuestion(index)}>Delete Question</button>
                    {q.types === 'text' && (
                        <input className="createSurvay__inp"
                               type="text"
                               placeholder="Correct Answer"
                               value={q.answer || ''}
                               onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                        />
                    )}
                    {(q.types === 'single' || q.types === 'multiple') && (
                        <div className="options">
                            <button className={'createSurvay__btn createSurvay__btn_add'} onClick={() => addOption(index)}>Add Variant</button>
                            {q.options?.map((opt:any, oIndex:number) => (
                                <div key={oIndex} className="option">
                                    <input className="createSurvay__inp"
                                           type="text"
                                           placeholder="Answer Option"
                                           value={opt.text}
                                           onChange={(e) => updateOption(index, oIndex, 'text', e.target.value)}
                                    />
                                    <input
                                        className="createSurvay__inp"
                                        type="checkbox"
                                        checked={opt.correct}
                                        onChange={(e) => updateOption(index, oIndex, 'correct', e.target.checked)}
                                    /> Correct
                                    <button className={'createSurvay__btn createSurvay__btn_delete'} onClick={() => deleteOption(index, oIndex)}>Delete Variant</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <button className={'createSurvay__btn'} onClick={saveSurvey}>Save Survey</button>
        </div>

    );
};

export default ChangeSurvey;
