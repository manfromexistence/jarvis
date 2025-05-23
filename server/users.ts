"use server"

import { auth } from "@/lib/auth";



type SignUpTypes = {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
};

export const signUp = async ({ email, password, firstName, lastName }: SignUpTypes) => {
    await auth.api.signUpEmail({
        body: {
            email: email ? email : "ajju40959@gmail.com",
            password: password ? password : "password12345@!",
            name: firstName && lastName ? `${firstName} ${lastName}` : "John Doe",
            callbackURL: "/dashboard",
        },
    });
};

export const signIn = async () => {
    await auth.api.signInEmail({
        body: {
            email: "ajju40959@gmail.com",
            password: "password123456",
        },
    });
};


export const signInWithGoogle = async () => {
    await auth.api.signInSocial({
        body: {
            provider: "google",
            callbackURL: "/dashboard",
        },
    });
};

export const signInWithGithub = async () => {
    await auth.api.signInSocial({
        body: {
            provider: "github",
            callbackURL: "/dashboard",
        },
    });
};

