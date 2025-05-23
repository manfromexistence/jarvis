import { createAuthClient } from "better-auth/client"
import { anonymousClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    plugins: [
        anonymousClient()
    ],
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000"
    // baseURL: "https://9000-firebase-jarvis-1747923459525.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev/?monospaceUid=134891&embedded=0"
})

export const { 
    changeEmail, 
    changePassword, 
    deleteUser, 
    forgetPassword, 
    getAccessToken, 
    getSession, 
    linkSocial, 
    listAccounts, 
    listSessions, 
    refreshToken, 
    resetPassword, 
    sendVerificationEmail, 
    revokeOtherSessions, 
    revokeSession, 
    revokeSessions, 
    unlinkAccount, 
    updateUser, 
    verifyEmail,
    signIn, 
    signUp, 
    signOut,
    useSession 
} = createAuthClient()