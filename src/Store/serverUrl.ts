import { create } from "zustand";
import { immer } from 'zustand/middleware/immer'

type State = {
    serverUrl: string
}

type Actions = {
    setServerUrl: () => void
}

export const serverUrlStore = create<State & Actions>()(
    immer((set) => ({
        serverUrl: 'server',
        setServerUrl: () => {
            const getUrl = () => {
                if (process.env.NODE_ENV === 'development') {
                    return 'http://localhost:8000/api'; // Local development
                } else {
                    return 'https://elif-tech-back-aeaf208a7993.herokuapp.com/api'
                }
            };
            set({serverUrl: getUrl()})
        }
    })),
)