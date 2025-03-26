'use client'
import './Header.scss';
import Logo from '../../../../public/icon/logo.svg'
import Image from "next/image";
import {signOut, useSession} from 'next-auth/react';
import {userStore} from "@/Store/user";
import React from "react";

const Header: React.FC = () => {

    const session = useSession();
    const {user} = userStore();
    const firstLetter = (word: String) => {
        const letter = word.substring(1,0);
        return letter.toUpperCase();
    }

    return (
        <div className={'header'}>
            <div className={'header__logo'}>
                <Image
                    src={Logo}
                    width={40}
                    height={40}
                    alt="Logo"
                />
                <p className={'header__logo__text'}>Answer???</p>
            </div>
            <div style={{"display": session.status === 'authenticated' ? 'flex' : 'none'}} className={'header__profile'}>
                <button className={'header__btn header__btn_signOut'} onClick={() => {signOut()}}>SignOut</button>
                <button className={'header__btn header__btn_profile'}>Profile</button>
                <div className={'header__avatar'}>
                    {user.profileImg && user.profileImg.length > 3 ? (
                        <img src={`${user.profileImg}`} alt={`${user.name || 'User'}'s profile picture`} />
                    ) : (
                        <span>{user.name ? firstLetter(user.name) : 'N/A'}</span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header;