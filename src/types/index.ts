
export interface User {
    name: string,
    email: string,
    password: string,
    profileImg: string,
    userQuestions: string[],
    passedQuestions: [{
        surveyName:string,
        userTime: number,
        userResult: string
    }]
    _id?: string,
    __v?: number
}

export interface Survey {
    _id?: string,
    name: string,
    author: string,
    description:string,
    questions: Question[];
    maxTime: number,
    results: Result[],
    rate: number[]
}
export interface Result {
    userName:string,
    userTime: number,
    userResult: string
}
export interface Question {
    text: string;
    answer?: string;
    types: "text" | "single" | "multiple";
    options?: Option[];
}
export interface Option {
    text: string;
    correct: boolean;
}
