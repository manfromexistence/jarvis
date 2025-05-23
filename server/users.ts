"use server"

import { auth } from "@/lib/auth";

export const signIn = async () => {
    await auth.api.signInEmail({
        body: {
            email: "ajju40959@gmail.com",
            password: "password123456",
        },
    });
};

export const signUp = async () => {
    await auth.api.signUpEmail({
        body: {
            email: "ajju40959@gmail.com",
            password: "password123456",
            name: "emon",
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
   
