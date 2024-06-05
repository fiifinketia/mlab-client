import createClient, { FetchOptions, ParseAs } from "openapi-fetch";
import jwt from "jsonwebtoken";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { paths } from "./mapi";

export const client = createClient<paths>({
	baseUrl: "https://mapi.appatechlab.com:8080",
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
			issuer: process.env.JWT_ISSUER || "",
			audience: process.env.JWT_AUDIENCE || "",
			subject: user.email || "",
		}
	);
};

export const dataWithAccessToken = ({
	user,
	body,
	headers = {},
	params,
}: {
	user: UserProfile;
	body?: any;
	headers?: any;
	params?: any;
}) => {
	const token = generateAccessToken(user);
	return {
		headers: {
			...headers,
			Authorization: `Bearer ${token}`,
		},
		parseAs: "stream" as ParseAs,
		body: body,
		params: params,
	};
};
