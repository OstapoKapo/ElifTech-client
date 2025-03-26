import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { serverUrlStore } from "@/Store/serverUrl";
import { userStore } from "@/Store/user";
import {surveyStore} from "@/Store/surveyStore";


const GetDbUserFunc: React.FC = () => {
    const {updateSurvey} = surveyStore();
    const { serverUrl, setServerUrl } = serverUrlStore();
    const { updateUser } = userStore();
    const session = useSession();


    useEffect(() => {


        const handleToSetServerUrl = () => {
            setServerUrl();
        };
        handleToSetServerUrl();


        const getDbUserAndQuestions = async () => {
            const sessionEmail = session.data?.user?.email;
            try {
                const response = await axios.post(`${serverUrl}/getDbUserAndQuestions`, { sessionEmail });
                if (response.status === 200) {
                    updateUser(response.data.dbUser);
                    // const sortedObjects = response.data.surveys.sort((a:Survey, b:Survey) => a.name.localeCompare(b.name));
                    // console.log(sortedObjects);
                    updateSurvey(response.data.surveys);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        if (serverUrl !== "server" && session.data?.user !== undefined) {
            getDbUserAndQuestions();
        }
        console.log('dasda')
    }, [session.status]);

    return null;
};

export default GetDbUserFunc;
