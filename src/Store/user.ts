import { create } from "zustand";
import { immer } from 'zustand/middleware/immer';
import { User } from '@/types';

type State = {
    user: User
}

type Actions = {
    updateUser: (newUser: User) => void
}

export const userStore = create<State & Actions>()(
    immer((set) => ({
        user: {
            name: '',
            email: '',
            password: '',
            profileImg: '',
            userQuestions: [],
            passedQuestions: [{
                surveyName:'',
                userTime: 0,
                userResult: '',
            }],
            _id: '',
            __v: 0
        },
        updateUser: (newUser) => set((() => ({
            user: {...newUser}
        }))),
    })),
)