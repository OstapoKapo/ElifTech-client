
export interface User {
    name: String,
    email: String,
    password: String,
    profileImg: String,
    userQuestions: String[],
    passedQuestions: String[]
    _id?: String,
    __v?: Number
}

export interface Question {
    _id?: String,
    name: String,
    author: String,
    description: String,
    questions: SmallQuestion[],
    maxTime: Number,
    results: Result[],

}
export interface Result {
    userName:String,
    userTime: String,
    userResult: Number
}
export interface SmallQuestion {
    type: String,
    content: String,
    answer: String
}
