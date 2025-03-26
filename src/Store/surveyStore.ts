import { create } from "zustand";
import { immer } from 'zustand/middleware/immer';
import { Survey } from '@/types';

type State = {
    surveys: Survey[],
}

type Actions = {
    updateSurvey: (newSurveys: Survey[]) => void;

};

export const surveyStore = create<State & Actions>()(
    immer((set) => ({
        surveys: [],
        updateSurvey: (newSurveys: Survey[]) => set((state) => {
            state.surveys = newSurveys;
        }),
    }))
);