'use client'
import './SignIn.scss';
import {FormEvent, useEffect} from "react";
import {serverUrlStore} from "@/Store/serverUrl";
import {useRouter} from "next/navigation";
import {User} from "@/types";
import axios from 'axios';
import {useSession} from "next-auth/react";

const SignIn = () => {

    const {serverUrl, setServerUrl} = serverUrlStore();
    const router = useRouter();
    const session = useSession();


    useEffect((): void=>{
        const handleToSetServerUrl = (): void => {
            setServerUrl()
        };
        handleToSetServerUrl();
    },[])

    useEffect(() => {
        if (session.status === 'authenticated') {
            router.push('/Main');
        }
    }, [session.status, router]);

    if (session.status === 'loading') {
        return <p>Loading... </p>;
    }


    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const form: HTMLFormElement = e.currentTarget;
        const name: string = (form.elements.namedItem('nameInp') as HTMLInputElement).value.toLowerCase();
        const email: string = (form.elements.namedItem('emailInp') as HTMLInputElement).value.toLowerCase();
        const password: string = (form.elements.namedItem('passwordInp') as HTMLInputElement).value.toLowerCase();

        (e.target as HTMLFormElement).reset();

        if (name.length > 2 && email.length > 2 && password.length > 2) {
            const user: User = {
                name: name,
                email: email,
                password: password,
                userQuestions: [],
                passedQuestions: [],
                profileImg: ''
            };
            try{
                await createUser(user);
            }catch(err){
                console.log(`You have error ---- ${err}`)
            }
        }else{
          alert('Please fill all inputs')
        }
    }

    const createUser = async (user: User) => {
        await axios.post(`${serverUrl}/signIn`, {user})
            .then((response) => {
                if(response.status === 200){
                    router.push('/LogIn');
                }else if(response.status === 201){
                    alert('You have empty inputs');
                }else if(response.status === 202 ){
                    alert('You have account with this email')
                }
            })
    }

    return (
        <div className={'singIn'}>
            <p className='singIn__tittle'>Sign In</p>
            <form className='singIn__form' onSubmit={handleSubmit}>
                <input className='singIn__input' name='nameInp' type="text" placeholder='NickName'/>
                <input className='singIn__input' name='emailInp' type="email" placeholder='Email'/>
                <input className='singIn__input' name='passwordInp' type="password" placeholder='Password'/>
                <button className='singIn__btn'>Sign In</button>
            </form>
        </div>
    )
}
export default SignIn;