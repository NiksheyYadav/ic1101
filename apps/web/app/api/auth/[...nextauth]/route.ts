import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
const backendUrl = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.VERCEL ? "http://aetheris-api-prod.eba-3ijumbws.ap-south-1.elasticbeanstalk.com" : "http://localhost:8000");
          console.log(`[NextAuth] Authorizing ${credentials.email} against ${backendUrl}`);
          const res = await fetch(`${backendUrl}/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (res.ok) {
            const user = await res.json();
            console.log(`[NextAuth] Login successful for ${credentials.email}`);
            return {
              id: user.user_id || credentials.email,
              email: credentials.email,
              accessToken: user.access_token,
            };
          }
          console.warn(`[NextAuth] Login failed for ${credentials.email}: ${res.status}`);
          return null;
        } catch (error) {
          console.error("[NextAuth] Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 
        (process.env.VERCEL ? "http://aetheris-api-prod.eba-3ijumbws.ap-south-1.elasticbeanstalk.com" : "http://localhost:8000");

      // Persistence check: If we have an accessToken in the current token, keep it!
      if (token.accessToken) {
        console.log("[NextAuth] JWT: Persisting existing accessToken.");
      }

      // Initial sign in
      if (account && user) {
        console.log(`[NextAuth] Initial sign-in for ${user.email} via ${account.provider}`);
        if (account.provider === "github") {
          try {
            const syncPayload = {
              email: user.email || `${account.providerAccountId}@github.com`,
              name: user.name || (profile as any)?.login || "Github User",
              github_id: account.providerAccountId,
              avatar_url: user.image || (profile as any)?.avatar_url || "",
            };
            
            console.log(`[NextAuth] Syncing Github user to ${backendUrl}`, syncPayload);
            
            const res = await fetch(`${backendUrl}/v1/auth/github-sync`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(syncPayload),
            });

            if (res.ok) {
              const data = await res.json();
              token.accessToken = data.access_token;
              console.log(`[NextAuth] SUCCESS: Github sync successful. Token: ${token.accessToken?.substring(0, 10)}...`);
            } else {
              const errText = await res.text();
              console.error(`[NextAuth] ERROR: Github sync failed (${res.status}): ${errText}`);
            }
          } catch (error) {
            console.error("[NextAuth] NETWORK ERROR: Cannot reach backend at " + backendUrl, error);
          }
        } else if (account.provider === "credentials") {
          token.accessToken = (user as any).accessToken;
          console.log(`[NextAuth] Credentials token assigned to JWT.`);
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log(`[NextAuth] Session Callback: HasToken=${!!token.accessToken}`);
      if (token.accessToken) {
        (session as any).accessToken = token.accessToken;
        (session as any).user.id = token.sub;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        // Here we could sync with our FastAPI backend
        // For now, we'll allow it and handle backend registration in the callback logic if needed
        return true;
      }
      return true;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

if (!process.env.NEXTAUTH_SECRET && process.env.VERCEL) {
  console.warn("!!! CRITICAL WARNING: NEXTAUTH_SECRET is missing on Vercel environment. Authentication will be unstable. !!!");
}

export { handler as GET, handler as POST };
