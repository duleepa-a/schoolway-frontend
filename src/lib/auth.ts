import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import {compare} from "bcryptjs" 
import prisma from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session:{
        strategy:'jwt'
    },
    pages: {
        signIn : '/login'
    },
    providers: [
        CredentialsProvider ({
            name: 'Credentials',
            credentials: {
            email: { label: "Email", type: "text", placeholder: "your.email@mail.com" },
            password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
            if(!credentials?.email || !credentials?.password){
                return null;
            }

            const existingUser= await prisma.userProfile.findUnique({
                where:{email: credentials?.email}
            })
            console.log("here is the unique usr ", existingUser);

            if(!existingUser){
                return null
            }

            const pwmatch = await compare(credentials.password, existingUser.password);

            console.log(pwmatch);
            if(!pwmatch){
                return null;
            }
            return {
                id:`${existingUser.id}`,
                email: existingUser.email,
                name:existingUser.firstname,
                dp: existingUser.dp || null,
                role:`${existingUser.role}`,
            }
            }
        }),
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                const customUser = user as typeof user & {
                    role?: string;
                    dp?: string;
                };
                return {
                    ...token,
                    role: customUser.role,
                    id: customUser.id,
                    dp: customUser.dp,
                }
            }
            return token
        },
        async session({session,token}){
            return {
                ...session,
                user:{
                    ...session.user,
                    role:token.role,
                    id: token.id, 
                    dp: token.dp,
                }
            }
        }
    }
}

