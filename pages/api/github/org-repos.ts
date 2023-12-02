import { NextApiRequest, NextApiResponse } from "next";

// Fectch repo data from github using octokit
import { Octokit } from "octokit";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const GITHUB_AUTH_TOKEN = process.env.GITHUB_AUTH_TOKEN;
	const GITHUB_ORG_NAME = process.env.GITHUB_ORG_NAME;
	if (!GITHUB_AUTH_TOKEN) {
		throw new Error("GITHUB_AUTH_TOKEN is not defined");
	}
	if (!GITHUB_ORG_NAME) {
		throw new Error("GITHUB_ORG_NAME is not defined");
	}
	const octokit = new Octokit({ auth: GITHUB_AUTH_TOKEN });

	const repos = await octokit.rest.repos.listForOrg({
		org: GITHUB_ORG_NAME,
        per_page: 1000,
	});

    const mlabModels = repos.data.filter((repo) => repo.topics?.includes("mlab-model")).map((repo) => ({ name: repo.name, description: repo.description}));

	res.status(200).json(mlabModels);
}

