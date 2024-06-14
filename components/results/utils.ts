import { ChipProps } from "@nextui-org/react";
import { client, dataWithAccessToken } from "../../lib";
import { UserProfile } from "@auth0/nextjs-auth0/client";

export const downloadFiles = (result_id: string, user?: UserProfile) => {
	if (!user) return;
	client
		.GET(
			"/api/results/download/{result_id}",
			dataWithAccessToken({ user, params: { path: { result_id } } })
		)
		.then(({ response }) => response.blob())
		.then((blob) => {
			const url = window.URL.createObjectURL(new Blob([blob]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "results.zip");
			document.body.appendChild(link);
			link.click();
			link.parentNode?.removeChild(link);
		});
};

export const downloadFile = (
	result_id: string,
	file_name: string,
	user?: UserProfile
) => {
	if (!user) return;
	client
		.GET(
			"/api/results/download/{result_id}/{file_name}",
			dataWithAccessToken({ user, params: { path: { result_id, file_name } } })
		)
		.then(({ response }) => response.blob())
		.then((blob) => {
			const url = window.URL.createObjectURL(new Blob([blob]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", file_name);
			document.body.appendChild(link);
			link.click();
			link.parentNode?.removeChild(link);
		});
};

export const statusColorMap: Record<string, ChipProps["color"]> = {
	running: "warning",
	error: "danger",
	done: "success",
	stopped: "secondary",
};

export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getResults = async (user: UserProfile) => {
	const { response } = await client.GET(
		"/api/results/user",
		dataWithAccessToken({ user })
	);
	const data = await response.json();
	return data;
};

export const sizeToString = (size: number) => {
	if (size < 1024) {
		return `${size} B`;
	} else if (size < 1024 * 1024) {
		return `${Math.round(size / 1024)} KB`;
	} else if (size < 1024 * 1024 * 1024) {
		return `${Math.round(size / (1024 * 1024))} MB`;
	} else {
		return `${Math.round(size / (1024 * 1024 * 1024))} GB`;
	}
};

export const columns = [
	{ name: "TYPE", uid: "type", sortable: false, width: null },
	{ name: "JOB NAME", uid: "job_name", sortable: false, width: null },
	{ name: "DATASET NAME", uid: "dataset_name", sortable: false, width: null },
	{ name: "MODEL NAME", uid: "model_name", sortable: false, width: null },
	{ name: "STATUS", uid: "status", sortable: true, width: null },
	{ name: "ACTIONS", uid: "actions", sortable: false, width: null },
	{ name: "CREATED AT", uid: "created", sortable: true, width: null },
];

export const statusOptions = [
	{ value: "all", label: "All" },
	{ value: "pending", label: "Pending" },
	{ value: "running", label: "Running" },
	{ value: "done", label: "Completed" },
	{ value: "error", label: "Failed" },
	{ value: "stopped", label: "Stopped" },
];

export const typeOptions = [
    { value: "all", label: "All" },
    { value: "train", label: "Train" },
    { value: "test", label: "Test" },
];