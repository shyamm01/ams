import { CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { ZodError } from "zod";
import { prisma } from "../prisma/prisma";
import { signinSchema } from "./lib/zodSchema";


/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */

export default {
    providers: [
        // OAuth authentication providers
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "User Name", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    const { username, password } = await signinSchema.parseAsync(credentials);

                    const user = await prisma.user.findFirst({
                        where: {
                            OR: [{ email: username }, { username: username }],
                        },
                    });

                    if (!user || !user.password) {
                        throw new CredentialsSignin({
                            cause: "Invalid email or password.",
                        });
                    }

                    const isMatch = await compare(password, user.password);

                    if (!isMatch) {
                        throw new CredentialsSignin({
                            cause: "Invalid email or password.",
                        });
                    }

                    return { ...user, password: undefined };
                } catch (error) {
                    if (error instanceof ZodError) {
                        throw new CredentialsSignin({
                            cause: error.errors[0].message,
                        });
                    } else {
                        throw error;
                    }
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
            if (token) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.subscriptionId = token.subscriptionId;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.subscriptionId = user.subscriptionId;
            }
            return token;
        },
    },
};