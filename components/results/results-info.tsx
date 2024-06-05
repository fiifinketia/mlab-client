import {
	Button,
	Chip,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tabs,
	Tooltip,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { downloadFiles, downloadFile, statusColorMap } from "./utils";
import { client, dataWithAccessToken } from "../../lib";
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";

const FILES_COLUMNS = [
	{ name: "NAME", uid: "name" },
	{ name: "SIZE", uid: "size" },
	{ name: "ACTIONS", uid: "actions" },
];

const METRICS_COLUMNS = [
	{ name: "METRIC", uid: "metric" },
	{ name: "VALUE", uid: "value" },
];

const PARAMETERS_COLUMNS = [
	{ name: "PARAMETER", uid: "parameter" },
	{ name: "VALUE", uid: "value" },
];

export const ResultInfo = ({ resultId }: { resultId: string }) => {
	const [result, setResult] = useState<any>({});
	const [loading, setLoading] = useState<boolean>(true);
	const [currentDuration, setCurrentDuration] = useState<string>("");
	const [error, setError] = useState<boolean>(false);
	const { user } = useUser();

	useEffect(() => {
		const getResult = async () => {
			if (!user) return;
			const result = await getResultById(resultId, user);
			if (result === undefined || result.length === 0) {
				setLoading(false);
				setError(true);
				return;
			}
			setResult(result);
			setLoading(false);
		};
		getResult();
	}, [resultId]);

	// // Keep updating current duration if status is running
	useEffect(() => {
		if (result.status === "running") {
			const interval = setInterval(() => {
				setCurrentDuration(
					getDuration(result.created, new Date().toISOString())
				);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [result.status, result.created]);

	return (
		<div>
			{loading ? (
				<div>Loading...</div>
			) : error ? (
				<div>Result not found</div>
			) : (
				// Struture page to display result info in diffetnt sections
				<div className="my-8 mx-4 flex flex-col gap-4">
					<div className="flex flex-col md:flex-row justify-end gap-4">
						{/* Predict with result button */}
						{result.result_type === "train" ? (
							<Button
								color="primary"
								className="mt-sm sm:w-full md:w-auto"
								isDisabled={result.status !== "done"}
								size="lg"
							>
								Predict width trained model
							</Button>
						) : null}
						{/* Download button also displaying file size */}
						<span>
							<Button
								color="primary"
								size="lg"
								onClick={() => downloadFiles(result.id, user)}
								className="flex flex-row items-center align-middle gap-1 w-full"
							>
								Download results{" "}
								<span className="text-xs text-warning">
									({sizeToString(result.size)}){" "}
								</span>
							</Button>
						</span>
					</div>
					{/* Two rows of size 2/3 and 1/3 for larger to medium screends and full for small screens */}
					<div className="flex gap-4 w-full flex-col md:flex-row">
						{/* First row, first column */}
						<div className="flex flex-col gap-4 md:w-2/3">
							<div className="flex flex-row gap-4">
								<div className="flex flex-col gap-1">
									<span className="text-xs text-gray-500 font-semibold">
										Result Type
									</span>
									<span className="text-lg font-semibold">
										{result.result_type}
									</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-xs text-gray-500 font-semibold">
										Status
									</span>
									<Chip color={statusColorMap[result.status]}>
										{result.status}
									</Chip>
								</div>
							</div>
							<div className="flex flex-col md:flex-row gap-4">
								<div className="flex flex-col gap-1">
									<span className="text-xs text-gray-500 font-semibold">
										Started
									</span>
									<span className="text-lg font-semibold">
										{new Date(result.created).toLocaleString()}
									</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-xs text-gray-500 font-semibold">
										Finished
									</span>
									<span className="text-lg font-semibold">
										{result.status === "running" ? (
											<Chip color={statusColorMap[result.status]}>
												{result.status}
											</Chip>
										) : (
											new Date(result.modified).toLocaleString()
										)}
									</span>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-xs text-gray-500 font-semibold">
										Duration
									</span>
									<span className="text-lg font-semibold">
										{result.status === "running"
											? currentDuration
											: getDuration(result.created, result.modified)}
									</span>
								</div>
							</div>
							<div className="flex flex-col gap-1">
								<Tabs>
									<Tab title="Parameters" key="1">
										<div className="flex flex-col gap-4">
											<Table>
												<TableHeader>
													{PARAMETERS_COLUMNS.map((column) => (
														<TableColumn key={column.uid}>
															{column.name}
														</TableColumn>
													))}
												</TableHeader>
												<TableBody>
													{result.parameters &&
														Object.entries(result.parameters).map(
															(param: any, index: number) => (
																<TableRow key={index}>
																	<TableCell>{param[0]}</TableCell>
																	<TableCell>{param[1]}</TableCell>
																</TableRow>
															)
														)}
												</TableBody>
											</Table>
										</div>
									</Tab>
									<Tab title="Metrics" key="2">
										<div className="flex flex-col gap-4">
											<Table>
												<TableHeader>
													{METRICS_COLUMNS.map((column) => (
														<TableColumn key={column.uid}>
															{column.name}
														</TableColumn>
													))}
												</TableHeader>
												<TableBody>
													{result.metrics &&
														Object.entries(result.metrics).map(
															(metric: any, index: number) => (
																<TableRow key={index}>
																	<TableCell>{metric[0]}</TableCell>
																	<TableCell>{metric[1]}</TableCell>
																</TableRow>
															)
														)}
												</TableBody>
											</Table>
										</div>
									</Tab>
									<Tab title="Files" key="3">
										<div className="flex flex-col gap-4">
											<Table>
												<TableHeader>
													{FILES_COLUMNS.map((column) => (
														<TableColumn key={column.uid}>
															{column.name}
														</TableColumn>
													))}
												</TableHeader>
												<TableBody>
													{result.files.map(
														(
															file: { name: string; size: number },
															index: number
														) => (
															<TableRow key={index}>
																<TableCell>{file.name}</TableCell>
																<TableCell>{sizeToString(file.size)}</TableCell>
																<TableCell>
																	<Button
																		onClick={() =>
																			downloadFile(result.id, file.name, user)
																		}
																		color="primary"
																	>
																		Download
																	</Button>
																</TableCell>
															</TableRow>
														)
													)}
												</TableBody>
											</Table>
										</div>
									</Tab>
								</Tabs>
							</div>
						</div>
						{/* Second row */}
						<div className="flex flex-col gap-4 md:w-1/3">
							<h3 className="text-2xl font-semibold">Model Info</h3>
							<div className="flex flex-row gap-4 justify-between">
								<div className="flex flex-col gap-1">
									<span className="text-xs text-gray-500 font-semibold">
										Model Name
									</span>
									<Tooltip content={result.model_name}>
										<span className="text-lg font-semibold truncate w-40">
											{result.model_name}
										</span>
									</Tooltip>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-xs text-gray-500 font-semibold">
										Model Version
									</span>
									<Tooltip content={result.model_version}>
										<span className="text-lg font-semibold truncate w-40">
											{result.model_version}
										</span>
									</Tooltip>
								</div>
							</div>
							<div className="flex flex-row gap-4 justify-between">
								<div className="flex flex-col gap-1">
									<span className="text-xs text-gray-500 font-semibold">
										Model Description
									</span>
									<Tooltip content={result.model_description}>
										<span className="text-lg font-semibold truncate w-40">
											{result.model_description}
										</span>
									</Tooltip>
								</div>
							</div>
							<hr className="border-gray-300" />
							<h3 className="text-2xl font-semibold">Dataset Info</h3>
							<div className="flex flex-row gap-4 justify-between">
								<div className="flex flex-col gap-1">
									<span className="text-xs text-gray-500 font-semibold">
										Dataset Name
									</span>
									<Tooltip content={result.dataset_name}>
										<span className="text-lg font-semibold truncate w-40">
											{result.dataset_name}
										</span>
									</Tooltip>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-xs text-gray-500 font-semibold">
										Dataset Version
									</span>
									<Tooltip content={result.dataset_version}>
										<span className="text-lg font-semibold truncate w-40">
											{result.dataset_version}
										</span>
									</Tooltip>
								</div>
							</div>
							<div className="flex flex-col gap-1">
								<div className="flex flex-col gap-1">
									<span className="text-xs text-gray-500 font-semibold">
										Dataset Description
									</span>
									<Tooltip content={result.dataset_description}>
										<span className="text-lg font-semibold truncate w-40">
											{result.dataset_description}
										</span>
									</Tooltip>
								</div>
								<div className="flex flex-col gap-1">
									<span className="text-xs text-gray-500 font-semibold">
										Content Type
									</span>
									<Tooltip content={result.dataset_content}>
										<span className="text-lg font-semibold truncate w-40">
											{result.dataset_content}
										</span>
									</Tooltip>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const getResultById = async (resultId: string, user: UserProfile) => {
	const { response } = await client.GET(
		"/api/results/{result_id}",
		dataWithAccessToken({ user, params: { path: { result_id: resultId } } })
	);
	const result = await response.json();
	return result;
};

const sizeToString = (size: number) => {
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

const getDuration = (start: string, end: string) => {
	const startDate = new Date(start);
	const endDate = new Date(end);
	const duration = endDate.getTime() - startDate.getTime();
	if (duration < 1000) {
		return `${duration} ms`;
	}
	if (duration < 1000 * 60) {
		return `${Math.round(duration / 1000)} sec`;
	}
	if (duration < 1000 * 60 * 60) {
		return `${Math.round(duration / (1000 * 60))} mins`;
	}
	if (duration < 1000 * 60 * 60 * 24) {
		return `${Math.round(duration / (1000 * 60 * 60))} hrs`;
	}
	return `${Math.round(duration / (1000 * 60 * 60 * 24))} days`;
};
