import {
	ModalContent,
	ModalHeader,
	ModalBody,
	Input,
	Switch,
	ModalFooter,
	Button,
	Tab,
	Tabs,
	Checkbox,
	Select,
	SelectItem,
} from "@nextui-org/react";
import { useState, useEffect, useMemo, useRef } from "react";
import {
	TestModelForm,
	client,
	dataWithAccessToken,
	generateAccessToken,
} from "../../lib";
import { Note } from "../alert/note";
import axios, { AxiosRequestConfig } from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";
import { AppModal } from ".";

export const TestModelModal = ({
	isOpen,
	onOpenChange,
	job,
	closeModal,
	runTest,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	job: any;
	closeModal: () => void;
	runTest: (data: {
		job_id: string;
		parameters?: any;
		result_id?: string;
		name: string;
	}) => void;
}) => {
	const { user } = useUser();
	const [changeParams, setChangeParams] = useState<boolean>(false);

	const [defaultParams, setDefaultParams] = useState<any>({});
	const [name, setName] = useState("");
	const [useDataset, setUseDataset] = useState<TestModelForm["dataset"]>({
		type: "default",
	});
	const [useModel, setUseModel] = useState<TestModelForm["model"]>({
		type: "default",
	});
	const [selectedPage, setSelectedPage] = useState<React.Key>("model");
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

	const [results, setResults] = useState<any[]>([]);

	useEffect(() => {
		if (job.results === undefined) return;
		setResults(
			job.results.filter(
				(result: any) => result.type === "train" && result.status === "done"
			)
		);
	}, [job]);

	async function handleSubmit() {
		if (!user) return;
		const data: TestModelForm = {
			parameters: changeParams ? defaultParams : undefined,
			name: name,
			model: useModel,
			dataset: useDataset,
			job_id: job.id,
		};
		try {
			await client.POST(
				"/api/jobs/test",
				dataWithAccessToken({ user, body: data })
			);
		} catch (error) {
			alert("Error testing model. Please try again.");
		}
		window.location.reload();
	}

	const closeModalAndReset = () => {
		closeModal();
	};

	return (
		<AppModal
			isOpen={isOpen}
			onClose={closeModalAndReset}
			onOpenChange={onOpenChange}
			placement="center"
			isDismissable={false}
			scrollBehavior="inside"
			size="lg"
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Test Model
						</ModalHeader>
						<ModalBody>
							<Tabs
								fullWidth
								size="md"
								aria-label="Tabs form"
								selectedKey={selectedPage}
								onSelectionChange={setSelectedPage}
							>
								<Tab key="model" title="Model">
									<UseModelFormComponent
										job={job}
										name={name}
										setName={setName}
										modelName={job.model_name}
										changeParams={changeParams}
										setChangeParams={setChangeParams}
										setUseModel={setUseModel}
										setDefaultParams={setDefaultParams}
									/>
								</Tab>
								<Tab key="dataset" title="Dataset">
									<UseDatasetFormComponent
										job={job}
										isUploading={isUploading}
										setIsUploading={setIsUploading}
										uploadProgress={uploadProgress}
										setUploadProgress={setUploadProgress}
										setUseDataset={setUseDataset}
									/>
								</Tab>
							</Tabs>
						</ModalBody>
						<ModalFooter className="flex gap-2 justify-between">
							<Button
								color={selectedPage === "model" ? "danger" : "default"}
								variant="flat"
								onClick={
									selectedPage === "model"
										? closeModalAndReset
										: () => setSelectedPage("model")
								}
							>
								{selectedPage === "model" ? "Cancel" : "Back"}
							</Button>
							<Button
								color="primary"
								isLoading={isUploading}
								isDisabled={
									isUploading ||
									(selectedPage === "dataset" &&
										useDataset.type === "upload" &&
										!useDataset.path)
								}
								onPress={
									selectedPage === "dataset"
										? handleSubmit
										: () => setSelectedPage("dataset")
								}
							>
								{selectedPage === "dataset" ? "Submit" : "Next"}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</AppModal>
	);
};

const UseModelFormComponent = ({
	job,
	name,
	setName,
	modelName,
	changeParams,
	setDefaultParams,
	setUseModel,
	setChangeParams,
}: {
	job: any;
	name: string;
	setName: (data: string) => void;
	modelName: string;
	changeParams: boolean;
	setDefaultParams: (data: any) => void;
	setUseModel: (data: any) => void;
	setChangeParams: (data: boolean) => void;
}) => {
	const setParameters = (key: string, value: any) => {
		setDefaultParams((prev: any) => ({ ...prev, [key]: value }));
	};
	const [useDefaultPretrainedModel, setUseDefaultPretrainedModel] =
		useState<boolean>(true);
	const [customPreTrainedModel, setCustomPreTrainedModel] = useState<any>(
		new Set([])
	);
	const [preTrainedResults, setPreTrainedResults] = useState<any[]>([]);
	useEffect(() => {
		if (useDefaultPretrainedModel) {
			setUseModel({
				type: "default",
			});
		} else {
			setUseModel({
				type: "pretrained",
				result_id: Array.from(customPreTrainedModel)[0],
			});
		}
		if (job.results === undefined) return;
		setPreTrainedResults(
			job.results.filter(
				(result: any) =>
					result.result_type === "train" &&
					result.status === "done" &&
					job.model_name === modelName
			)
		);
	}, [job, useDefaultPretrainedModel, customPreTrainedModel, modelName]);

	const SetParametersSection = useMemo(() => {
		return (
			<>
				{Object.keys(job.parameters).length === 0 && (
					<Note message={"No parameters available"} />
				)}
				<Switch
					isSelected={changeParams}
					isDisabled={Object.keys(job.parameters).length === 0}
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
							Object.entries(job.parameters).map((param: any) => (
								<div>
									<Input
										label={param[0]}
										key={param[0]}
										variant="bordered"
										required
										value={param[1]}
										type={typeof param[1] === "number" ? "number" : "text"}
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
			</>
		);
	}, [changeParams, job]);

	const LoadModelSection = useMemo(() => {
		return (
			<>
				{preTrainedResults.length === 0 && useDefaultPretrainedModel && (
					<Note message="No pretrained models available, using default model" />
				)}
				<Switch
					className="my-5"
					defaultSelected
					isDisabled={preTrainedResults.length === 0}
					onChange={() => {
						setUseDefaultPretrainedModel(!useDefaultPretrainedModel);
						setChangeParams(true);
					}}
				>
					Use Default Model
				</Switch>
				<Select
					label="Select a pretrained model"
					isDisabled={
						useDefaultPretrainedModel || preTrainedResults.length === 0
					}
					onChange={(e) => {
						setCustomPreTrainedModel(new Set([e.target.value]));
						setChangeParams(true);
					}}
				>
					{preTrainedResults &&
						preTrainedResults.map((result: any) => (
							<SelectItem
								key={result.id}
								value={result.id}
								title={result.name}
							/>
						))}
				</Select>
			</>
		);
	}, [useDefaultPretrainedModel, customPreTrainedModel, preTrainedResults]);
	return (
		<form className="flex flex-col gap-4 h-[300px]">
			<Input
				label="Name"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			{SetParametersSection}
			{LoadModelSection}
		</form>
	);
};
const UseDatasetFormComponent = ({
	job,
	isUploading,
	setIsUploading,
	setUploadProgress,
	setUseDataset,
}: {
	job: any;
	isUploading: boolean;
	uploadProgress: number;
	setIsUploading: (data: any) => void;
	setUploadProgress: (data: any) => void;
	setUseDataset: (data: any) => void;
}) => {
	const [uploadDataset, setUploadDataset] = useState(false);
	const [uploadedDataset, setUploadedDataset] = useState<any>(null);
	const ref = useRef<HTMLInputElement>(null);
	const { user } = useUser();

	useEffect(() => {
		if (uploadDataset) {
			setUseDataset({
				type: "upload",
				path: uploadedDataset,
			});
		} else {
			setUseDataset({
				type: "default",
			});
		}
	}, [job, uploadDataset, uploadedDataset]);

	const handleFileUpload = () =>
		new Promise(async (resolve) => {
			setUploadProgress(0);
			setIsUploading(true);
			if (ref.current?.files) {
				const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/upload/test/${job.id}`;
				const file = ref.current.files[0];
				const formData = new FormData();
				formData.append("file", file);
				if (!user) return;
				const accessToken = generateAccessToken(user);

				const config = {
					headers: {
						"content-type": "multipart/form-data",
						Authorization: `Bearer ${accessToken}`,
						Filename: file.name,
					},
					onUploadProgress: (event: any) => {
						const p = Math.round((event.loaded * 100) / event.total);
						setUploadProgress(p);
						if (p === 100) {
							setIsUploading(false);
						}
					},
				};

				try {
					const { data } = await axios.post(url, formData, config);
					setUploadedDataset(data);
				} catch (err) {
					alert("Error uploading dataset");
				}
			}
		});
	return (
		<form className="flex flex-col gap-4">
			<Checkbox isSelected={uploadDataset} onValueChange={setUploadDataset}>
				Would you like to upload a smaller file for testing?
			</Checkbox>
			<input
				// variant="bordered"
				placeholder="Upload dataset here"
				disabled={!uploadDataset}
				name="file"
				type="file"
				size={50_000_000}
				ref={ref}
			/>
			<Button
				color="primary"
				onPress={handleFileUpload}
				isLoading={isUploading}
				isDisabled={uploadDataset === false || isUploading}
			>
				Upload
			</Button>
		</form>
	);
};
