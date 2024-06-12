import createClient, { ParseAs } from "openapi-fetch";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { paths } from "./mapi";
import { generateAccessToken } from "./utils";

export const client = createClient<paths>({
	baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
});

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
