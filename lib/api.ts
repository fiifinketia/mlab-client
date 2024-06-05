import createClient from "openapi-fetch";
import jwt from "jsonwebtoken";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { paths } from "./mapi";

export const client = createClient<paths>({
	baseUrl: "https://jsonplaceholder.typicode.com/posts",
});

export const generateAccessToken = (user: UserProfile) => {
	return jwt.sign(
		{
			username: user.nickname,
			email: user.email,
			name: user.name,
		},
		process.env.JWT_SECRET || "",
		{
			algorithm: "HS256",
			expiresIn: "2h",
			issuer: process.env.NEXT_PUBLIC_APP_BASE_URL || "",
			audience: process.env.NEXT_PUBLIC_API_BASE_URL || "",
			subject: user.email || "",
		}
	);
};

export const dataWithAccessToken = async (
	user: UserProfile,
	data: any = {}
) => {
	const token = generateAccessToken(user);
	return {
		...data,
		headers: {
			...data.headers,
			Authorization: `Bearer ${token}`,
		},
	};
};
