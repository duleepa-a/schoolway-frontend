import NextAuth, { NextAuthOptions } from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import {compare} from "bcryptjs" 
import prisma from "@/lib/prisma"
// import { NextResponse } from "next/server"

//export this authOptions as an object and use with getServerSession in the app directory to access session data in server components
const authOptions:NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session:{
        strategy:'jwt'
    },
    pages: {
        signIn : '/login'
    },
    providers: [
                
        CredentialsProvider ({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            credentials: {
            email: { label: "Email", type: "text", placeholder: "your.email@mail.com" },
            password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
            // const res = await fetch("/api/login", {
            //     method: 'POST',
            //     body: JSON.stringify(credentials),
            //     headers: { "Content-Type": "application/json" }
            // })
            
// await new Promise(resolve => setTimeout(resolve, 3000));

// console.log(credentials);
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
                // last:existingUser.lastname
                role:`${existingUser.role}`,
                // servicename:existingUser.servicename, fetch service name from vanservice db
            }
            
            // return NextResponse.json({message: "signed in "},{error:"noerror"})
            }
        }),
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID!,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        // }),

    ],callbacks:{
        async jwt({token,user}){
            if(user){
                return {
                    ...token,
                    role:user.role,
                    id: user.id,
                    // servicename:user.servicename,
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
                    // servicename:token.servicename,
                }
            }
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }  