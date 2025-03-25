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
                    return 'https://machine-service-server.onrender.com/api'
                }
            };
            set({serverUrl: getUrl()})
        }
    })),
)