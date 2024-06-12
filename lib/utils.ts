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
