import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connect  from "../../../../utils/db";
import User from '../../../../models/User';
import bcrypt from 'bcryptjs'


const handler =  NextAuth({
    providers: [
        GoogleProvider ({
            clientId: process.env.CLIENTID,
            clientSecret: process.env.CLIENTSECRET,
        }),
        CredentialsProvider ({
            id: 'credentials',
            name: 'Credentials',
            async authorize(credentials){
                await connect();
                try{
                    const user = await User.findOne({email: credentials.email});
                    if(user){
                        const isPasswordCorrect = await bcrypt.compare(
                            credentials.password,
                            user.password
                        )
                        if(isPasswordCorrect){
                            return user
                        }else{
                            throw new Error('wrong passwrod')
                        }
                    }else{
                        throw new Error('User not found')
                    }
                }catch(err){
                    console.log(err)
                }
            }
        }),
    ],
    secret:  process.env.SECRET,
    pages: {
        error: '/login'
    }
})

export {handler as GET, handler as POST}