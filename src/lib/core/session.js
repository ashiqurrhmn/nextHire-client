import { headers } from "next/headers"
import { auth } from "../auth"
import { redirect } from "next/navigation";

export const getUserSession = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        return session?.user || null;
    } catch (error) {
        // Suppress error so Next.js dev overlay doesn't pop up for malformed cookies.
        return null;
    }
}
    export const requireRole = async (role) =>{
        const user = await getUserSession()
        if (!user){
            redirect("/auth/signin")
        }
        if(user.role !== role){
            return redirect('/unauthorized')
        }
    }