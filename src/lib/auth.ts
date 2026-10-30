import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { client, db } from "@/lib/mongodb";

const baseURL = process.env.BETTER_AUTH_URL;
const secret = process.env.BETTER_AUTH_SECRET;

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL is missing");
}

if (!secret || secret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be at least 32 characters");
}

export const auth = betterAuth({
  baseURL,
  secret,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [jwt()],
});
