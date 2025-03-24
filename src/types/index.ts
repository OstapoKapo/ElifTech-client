export interface fullUser {
    name: string,
    email: string,
    password: string,
    profileImg: string,
    question: Question[],
    _id?: string,
    __v?: number
}

export interface Question {
    name: string,
}