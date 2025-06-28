import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

//export this authOptions as an object and use with getServerSession in the app directory to access session data in server components
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ]
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }  