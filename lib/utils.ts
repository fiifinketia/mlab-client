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
