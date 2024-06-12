import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Tooltip,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
	useDisclosure,
	Switch,
	Chip,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { Job, client, dataWithAccessToken } from "../../lib";

// Jobs List
const columns = [
	{ name: "NAME", uid: "name" },
	{ name: "MODEL NAME", uid: "model_name" },
	{ name: "STATUS", uid: "results" },
	{ name: "ACTIONS", uid: "actions" },
	{ name: "CREATED AT", uid: "created" },
];

const RenderCell = (
	columnKey: string | React.Key,
	item: Job & { results: any[] },
	openTrainModel: Function,
	openTestModel: Function
) => {
	const latestResult =
		item.results !== undefined
			? item.results.sort((a: any, b: any) => {
					return new Date(b.created).getTime() - new Date(a.created).getTime();
			  })[0]
			: undefined;
	switch (columnKey) {
		case "name":
			return <span>{item.name}</span>;
		case "model_name":
			return (
				<Tooltip content={item.model_name}>
					<span className="flex w-40 truncate">{item.model_name}</span>
				</Tooltip>
			);
		case "results":
			if (item.ready && !item.closed) return <Chip color="primary">Ready</Chip>;
			if (latestResult && latestResult.status === "running")
				return <Chip color="warning">Running</Chip>;
			if (latestResult && latestResult.status === "error")
				return <Chip color="danger">Error</Chip>;
			if (!item.ready) <Chip color="secondary">Not Ready</Chip>;
			return <Chip color="secondary">Closed</Chip>;
		case "actions":
			return (
				<div className="flex items-center gap-4 ">
					<Dropdown>
						<DropdownTrigger>
							<Button variant="bordered">Select</Button>
						</DropdownTrigger>
						<DropdownMenu
							aria-label="Dynamic Actions"
							disabledKeys={
								latestResult && latestResult.status === "running"
									? ["train", "test"]
									: []
							}
						>
							<DropdownItem
								color="primary"
								onClick={() => openTrainModel(item)}
								key={"train"}
							>
								Train Model
							</DropdownItem>
							<DropdownItem
								color="primary"
								onClick={() => openTestModel(item)}
								key={"test"}
							>
								Test Model
							</DropdownItem>
							<DropdownItem
								color="danger"
								className="text-danger"
								// onClick={() => openRunJobModal(item)}
							>
								Close Job
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			);
		case "created":
			const date = new Date(item.created as string);
			return <span>{date.toLocaleDateString()}</span>;
		default:
			return <span>{item[columnKey as keyof Job]}</span>;
	}
};

export const JobsList = ({ filter, jobs }: { filter: string; jobs: any[] }) => {
	const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
	const { isOpen: isTrainModelOpen, onOpenChange: onTrainOpenChange } =
		useDisclosure();
	const { isOpen: isTestModelOpen, onOpenChange: onTestOpenChange } =
		useDisclosure();
	const [runTrainJob, setRunTrainJob] = useState<any>({});
	const [runTestJob, setRunTestJob] = useState<any>({});
	const { user } = useUser();
	const router = useRouter();

	const openTrainModel = (job: any) => {
		onTrainOpenChange();
		setRunTrainJob(job);
	};

	const openTestModel = (job: any) => {
		onTestOpenChange();
		setRunTestJob(job);
	};

	const closeTrainModal = () => {
		onTrainOpenChange();
	};

	// set filtered jobs to jobs on first render
	useEffect(() => {
		setFilteredJobs(jobs);
	}, []);

	// Filter Jobs using filter keyword from parent
	useEffect(() => {
		if (filter === "") return;
		const filteredJobs = jobs.filter((job) => {
			// Filter by job name or model name
			if (job.name.toLowerCase().includes(filter.toLowerCase())) return true;
			if (job.model_name.toLowerCase().includes(filter.toLowerCase()))
				return true;
		});
		// if (filteredJobs.length === 0) {
		// 	setFilteredJobs(jobs);
		// 	return;
		// }
		setFilteredJobs(filteredJobs);
	}, [filter]);

	const runTrain = (data: {
		job_id: string;
		parameters?: any;
		name: string;
	}) => {
		if (user === undefined) router.push("/api/auth/login");
		console.log("🚀 ~ user:", user);
		if (data.job_id === undefined) return;

		const body = {
			job_id: data.job_id,
			user_id: user?.email,
			parameters: data.parameters,
			name: data.name,
		};
		if (!user) return;
		client
			.POST("/api/jobs/train", dataWithAccessToken({ user, body }))
			.then(() => {
				onTrainOpenChange();
				setTimeout(() => {
					window.location.reload();
				}, 5000); // 5 seconds
			});
	};

	const runTest = (data: {
		job_id: string;
		parameters?: any;
		name: string;
	}) => {
		if (user === undefined) router.push("/api/auth/login");
		if (data.job_id === undefined) return;

		const body = {
			job_id: data.job_id,
			user_id: user?.email,
			parameters: data.parameters,
			name: data.name,
		};
		if (!user) return;
		client.POST("/api/jobs/test", dataWithAccessToken({ user, body }));
		onTestOpenChange();
		setTimeout(() => {
			window.location.reload();
		}, 5000); // 5 seconds
	};

	return (
		<div className=" w-full flex flex-col gap-4">
			<Table aria-label="Example table with custom cells">
				<TableHeader columns={columns}>
					{(column) => (
						<TableColumn
							key={column.uid}
							// hideHeader={column.uid === "actions"}
							align={column.uid === "actions" ? "center" : "start"}
						>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody
					items={
						filter.length === 0 && filteredJobs.length === 0
							? jobs
							: filteredJobs
					}
				>
					{(job) => (
						<TableRow key={job.id}>
							{(columnKey) => (
								<TableCell key={columnKey}>
									{RenderCell(columnKey, job, openTrainModel, openTestModel)}
								</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>

			<TrainModelModal
				isOpen={isTrainModelOpen}
				onOpenChange={onTrainOpenChange}
				job={runTrainJob}
				closeModal={closeTrainModal}
				runTrain={runTrain}
			/>

			<TestModelModal
				isOpen={isTestModelOpen}
				onOpenChange={onTestOpenChange}
				job={runTestJob}
				closeModal={onTestOpenChange}
				runTest={runTest}
			/>
		</div>
	);
};

const TrainModelModal = ({
	isOpen,
	onOpenChange,
	job,
	closeModal,
	runTrain,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	job: any;
	closeModal: () => void;
	runTrain: (data: { job_id: string; parameters?: any; name: string }) => void;
}) => {
	const [changeParams, setChangeParams] = useState<boolean>(false);
	const [defaultParams, setDefaultParams] = useState<any>({});
	const [name, setName] = useState("");

	const setParameters = (key: string, value: any) => {
		setDefaultParams((prev: any) => ({ ...prev, [key]: value }));
	};

	const handleSubmit = () => {
		const data = {
			job_id: job.id as string,
			parameters: changeParams ? defaultParams : undefined,
			name: name,
		};
		runTrain(data);
	};

	const closeModalAndReset = () => {
		closeModal();
		setChangeParams(false);
		setDefaultParams({});
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={closeModalAndReset}
			onOpenChange={onOpenChange}
			placement="top-center"
			isDismissable={false}
			size="3xl"
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Train Model
						</ModalHeader>
						<ModalBody>
							<span>Model Name: {job.model_name}</span>
							<span>Description: {job.description}</span>
							<span>Datasets</span>
							<Input
								label="Name"
								variant="bordered"
								required
								onChange={(e) => setName(e.target.value)}
							/>
							<Switch
								isSelected={changeParams}
								onChange={() => {
									setChangeParams(!changeParams);
									setDefaultParams(job.parameters);
								}}
							>
								Change Parameters
							</Switch>
							{changeParams && (
								<div className="flex flex-wrap md:inline-grid md:grid-cols-4 gap-2">
									{
										// Default parameters is an object of [string, Any]
										Object.entries(defaultParams).map((param: any) => (
											<div>
												<Input
													label={param[0]}
													key={param[0]}
													variant="bordered"
													required
													value={param[1]}
													type={
														typeof param[1] === "number" ? "number" : "text"
													}
													onChange={(e) =>
														setParameters(
															param[0],
															e.target.type === "number"
																? Number(e.target.value)
																: e.target.value
														)
													}
												/>
											</div>
										))
									}
								</div>
							)}
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="flat"
								onClick={closeModalAndReset}
							>
								Close
							</Button>
							<Button color="primary" onPress={handleSubmit}>
								Train
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

const TestModelModal = ({
	isOpen,
	onOpenChange,
	job,
	closeModal,
	runTest,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	job: {
		id: string;
		model_name: string;
		description: string;
		results: {
			id: string;
			name: string;
			created: string;
			status: string;
			type: string;
		}[];
	};
	closeModal: () => void;
	runTest: (data: {
		job_id: string;
		parameters?: any;
		result_id?: string;
		name: string;
	}) => void;
}) => {
	const [useDefaultPretrainedModel, setUseDefaultPretrainedModel] =
		useState<boolean>(true);
	const [customPreTrainedModel, setCustomPreTrainedModel] = useState<any>(
		new Set([])
	);
	const [name, setName] = useState("");

	const [results, setResults] = useState<any[]>([]);

	useEffect(() => {
		if (job.results === undefined) return;
		setResults(
			job.results.filter(
				(result) => result.type === "train" && result.status === "done"
			)
		);
	}, [job]);

	const handleSubmit = () => {
		const data = {
			job_id: job.id as string,
			parameters: undefined,
			result_id: useDefaultPretrainedModel
				? (Array.from(customPreTrainedModel)[0] as string)
				: undefined,
			name: name,
		};
		runTest(data);
	};

	const closeModalAndReset = () => {
		closeModal();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={closeModalAndReset}
			onOpenChange={onOpenChange}
			placement="top-center"
			isDismissable={false}
			size="3xl"
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Test Model
						</ModalHeader>
						<ModalBody>
							<span>Model Name: {job.model_name}</span>
							<span>Description: {job.description}</span>
							<span>Datasets</span>
							<Input
								label="Name"
								variant="bordered"
								required
								onChange={(e) => setName(e.target.value)}
							/>
							<Switch
								isSelected={useDefaultPretrainedModel}
								onChange={() =>
									setUseDefaultPretrainedModel(!useDefaultPretrainedModel)
								}
							>
								Use default pretrained model
							</Switch>
							{useDefaultPretrainedModel && (
								<Select
									label={
										results.length === 0
											? "No pretrained models"
											: "Select a pretrained model"
									}
									className="max-w-xs"
									selectedKeys={customPreTrainedModel}
									onSelectionChange={setCustomPreTrainedModel}
									isDisabled={
										!useDefaultPretrainedModel || results.length === 0
									}
								>
									{results.length === 0 ? (
										<SelectItem value={""} key={"0"} isReadOnly>
											No pretrained models
										</SelectItem>
									) : (
										results.map((result: any) => {
											return (
												<SelectItem key={result.id} value={result.id}>
													{result.name +
														" - " +
														new Date(result.created).toLocaleDateString()}
												</SelectItem>
											);
										})
									)}
								</Select>
							)}
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="flat"
								onClick={closeModalAndReset}
							>
								Close
							</Button>
							<Button color="primary" onPress={handleSubmit}>
								Test
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
