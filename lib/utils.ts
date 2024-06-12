import { UserProfile } from "@auth0/nextjs-auth0/client";
import jwt from "jsonwebtoken";

const gitlabServer = process.env.GITLAB_SERVER || "gitlab.com";
export const makeCloneUrl = (repo_name?: string) => {
	if (!repo_name) {
		return "";
	}
	return `ssh://git@${gitlabServer}:2424/${repo_name}`;
};

export const sourceCodeUrl = (repo_name?: string) => {
	if (!repo_name) {
		return "";
	}
	return `http://${gitlabServer}/${repo_name}`;
};

export const generateAccessToken = (user: UserProfile) => {
	const iat = Math.floor(Date.now() / 1000);
	const token = jwt.sign(
		{
			username: user.nickname,
			email: user.email,
			name: user.name,
			iat,
		},
		process.env.JWT_SECRET || "",
		{
			algorithm: "HS256",
			expiresIn: "2d",
			issuer: process.env.JWT_ISSUER || "",
			audience: process.env.JWT_AUDIENCE || "",
			subject: user.email || "",
		}
	);
	return token;
};
