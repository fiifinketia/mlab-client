import { ChipProps } from "@nextui-org/react";

export const downloadFiles = (result_id: string) => {
	fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/results/download/${result_id}/`
	)
		.then((response) => response.blob())
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

export const downloadFile = (result_id: string, file_name: string) => {
	fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/results/download/${result_id}/${file_name}/`
	)
		.then((response) => response.blob())
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
};

export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getResults = async () => {
	const response = await fetch(
		`${
			process.env.NEXT_PUBLIC_API_BASE_URL
		}/api/results/user/${localStorage.getItem("user_email")}/`
	);
	const data = await response.json();
	return data;
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
];

export const typeOptions = [
    { value: "all", label: "All" },
    { value: "train", label: "Train" },
    { value: "test", label: "Test" },
];