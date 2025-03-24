'use client'
import './SignIn.scss';

const SignIn =  () => {

    const handleSubmit = () => {

    }

    return(
        <div className={'signIn'}>
            <p className='signIn__tittle'>Sign In</p>
            <form className='signIn__form' onSubmit={handleSubmit}>
                <input className='signIn__input' name='nameInp' type="text" placeholder='NickName'/>
                <input className='signIn__input' name='emailInp' type="email" placeholder='Email'/>
                <input className='signIn__input' name='passwordInp' type="password" placeholder='Password'/>
                <button className='signIn__btn'>Sign In</button>
            </form>
        </div>
    )
}
export default SignIn;