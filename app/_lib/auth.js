import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      // if this returns true then the current user is authorized to go through on to that route which is being protected
      //   this fn is called when the user hits the protected route specified in middleware.js
      return !!auth?.user;
      //   !! is used to convert any value to boolean
    },
    async signIn({ user, account, profile }) {
      // this is a kind of middleware than runs between when the user credentials gets put up and when he is actually signed in so that we may perform all sign in related operations in between

      try {
        const existingGuest = await getGuest(user.email);

        if (!existingGuest)
          await createGuest({ email: user.email, fullName: user.name });

        return true;
      } catch {
        return false;
      }
    },
    async session({ session, user }) {
      // here the session is created and we get access to it; we can add fields to the session (here the guestID)
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;

      return session;
    },
  },
  pages: {
    signIn: "/login", // this is the page that will be redirected to on accessing a protected part of the website
  },
};

export const {
  auth, // we can call this auth fn in any server component
  handlers: { GET, POST },
  signIn,
  signOut,
  // this signin and signout will be connected to the client side signin/signout btn to connect the flow of the signin/signout on the server
} = NextAuth(authConfig);

// this auth fn can serve to get us the current session from where we can get the logged in user details
// it can also serve a middleware which is then used in middleware.js
