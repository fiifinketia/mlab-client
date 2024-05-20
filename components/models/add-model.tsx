import React, { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import {
	Button,
	Code,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Switch,
	Textarea,
	useDisclosure,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import { TrashIcon } from "../icons/accounts/trash-icon";

function makeGitPath(name: string) {
	return name.toLowerCase().replaceAll(" ", "-") + ".git";
}

export const AddModel = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { user } = useUser();
	const router = useRouter();
	const [isCompleted, setIsCompleted] = useState(false);
	const onAddModel = async () => {
		onOpenChange();
		if (user === undefined) {
			router.push("/api/auth/login");
			return;
		}
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/models`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: name,
						description: description,
						version: version,
						owner_id: user?.email,
						private: isPrivate,
						parameters: parameters,
						default_model: defaultModel,
					}),
				}
			);
			if (res.status !== 200) {
				throw {
					status: res.status,
					cause: res.statusText,
					detail: (await res.json()).detail,
				};
			}
			setIsCompleted(true);
		} catch (err: any) {
			// If error is 409, then the model already exists
			if (err.status === 409) {
				alert("Model already exists. Please choose a different name.");
			} else if (err.status === 422) {
				alert("Please fill out all required fields.");
			} else if (err.status === 404) {
				alert(err.detail);
			} else {
				alert("Internal server error, contact admin");
			}
		}
	};

	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [version, setVersion] = React.useState("");
	const [newParameter, setNewParameter] = React.useState<any>("");
	const [isPrivate, setIsPrivate] = React.useState(false);
	const [parameters, setParameters] = React.useState<any>({});
	const [defaultModel, setDefaultModel] = React.useState("");
	// const [ghProjects, setGhProjects] = React.useState<any[]>([]);

	// React.useEffect(() => {
	// 	const fetchOrgRepo = async () => {
	// 		const res = await fetch("/api/github/org-repos");

	// 		const data = await res.json();
	// 		setGhProjects(data);
	// 	};
	// 	fetchOrgRepo();
	// }, []);

	const setParameterValues = (key: string, value: any) => {
		setParameters((prev: any) => ({ ...prev, [key]: value }));
	};

	const removeParameter = (key: string) => () => {
		const newParameters = { ...parameters };
		delete newParameters[key];
		setParameters(newParameters);
	};

	const addNewParameter = () => {
		if (newParameter === "") return;
		setParameters((prev: any) => ({ ...prev, [newParameter]: "" }));
		setNewParameter("");
	};

	return (
		<div>
			<Button
				color="primary"
				size="md"
				onClick={onOpen}
				className="float-right"
			>
				Add Model
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onOpenChange}
				placement="top-center"
				size="3xl"
				closeButton
				isDismissable={false}
			>
				<ModalContent>
					<ModalHeader>Add Model</ModalHeader>
					<ModalBody>
						<Input
							label="Name"
							placeholder="Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<Input
							label="Description"
							placeholder="Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<Input
							label="Version"
							placeholder="Version"
							onChange={(e) => setVersion(e.target.value)}
							required
						/>
						<Input
							label="Default Model"
							placeholder="Relative Path to default model in repo"
							onChange={(e) => setDefaultModel(e.target.value)}
							required
						/>

						<Switch
							isSelected={isPrivate}
							onChange={() => setIsPrivate(!isPrivate)}
						>
							{isPrivate ? "Private" : "Public"}
						</Switch>
						<div className="flex flex-row gap-2 items-center">
							<h3 className="text-lg font-semibold">Parameters</h3>
							<span className="text-xs text-gray-500">
								Add parameters to your model
							</span>
						</div>
						{Object.entries(parameters).map((param: any, index) => (
							<ParameterInput
								key={index}
								name={param[0]}
								value={param[1]}
								setValue={setParameterValues}
								removeParameter={removeParameter}
							/>
						))}
						<div className="flex flex-row gap-2 items-center">
							<Input
								label="Name"
								placeholder="Name"
								value={newParameter}
								onChange={(e) => setNewParameter(e.target.value)}
							/>

							<Button color="primary" size="sm" onClick={addNewParameter}>
								Add Parameter
							</Button>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button
							color="primary"
							size="md"
							className="w-full"
							onClick={onAddModel}
							// Disabled if any of the required fields are empty
							isDisabled={name === "" || description === "" || version === ""}
						>
							Add Model
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			{isCompleted && (
				<Modal
					isOpen={isCompleted}
					onOpenChange={() => (!isCompleted ? setIsCompleted(true) : null)}
					placement="top-center"
					isDismissable={false}
					closeButton={false}
				>
					<ModalContent>
						{(onClose) => (
							<div className="flex flex-col gap-1">
								<ModalHeader>Dataset Created</ModalHeader>
								<ModalBody>
									<div className="flex flex-col gap-1 text-balance">
										<p className="text-sm text-blue-600">
											Follow these steps to push your local git repository
										</p>
										<Code className="text-wrap">git init</Code>
										<Code className="text-wrap">git add .</Code>
										<Code className="text-wrap">
											git commit -m &apos;initial commit&apos;
										</Code>
										<Code className="text-wrap">
											git remote add mlab
											ssh://disal@18.157.151.201:6000/~/disal/mlab/filez/models/
											{makeGitPath(name)}
										</Code>
										<Code className="text-wrap">git push mlab master</Code>
									</div>
								</ModalBody>
								<ModalFooter>
									<Button
										color="success"
										onClick={() => {
											setIsCompleted(false);
											window.location.reload();
										}}
									>
										Done
									</Button>
								</ModalFooter>
							</div>
						)}
					</ModalContent>
				</Modal>
			)}
		</div>
	);
};

// Parameters input component is a dynamic input
// It is has three parts: name, type, value(s)
// If the user selects a type of "list", then the user can add more values
const ParameterInput = ({
	name,
	value,
	setValue,
	removeParameter,
	isDisabled,
}: any) => {
	const [type, setType] = React.useState("string");
	return (
		<div className="flex flex-row gap-2">
			<Input label="Name" placeholder="Name" value={name} isDisabled={true} />
			<Select
				label="Type"
				placeholder="Type"
				value={type}
				// onChange={(e) => onChange(name, e.target.value)}
				onChange={(e) => setType(e.target.value)}
				isDisabled={isDisabled}
				description={
					type === "list" &&
					"Select the type of parameter, list type should be written in array format"
				}
			>
				<SelectItem value="string" key={"string"}>
					String
				</SelectItem>
				<SelectItem value="number" key={"number"}>
					Number
				</SelectItem>
				<SelectItem
					value="list"
					key={"list"}
					placeholder="Write in array format"
				>
					List
				</SelectItem>
				<SelectItem value="boolean" key={"boolean"}>
					Boolean
				</SelectItem>
			</Select>
			{type !== "boolean" ? (
				<Input
					label="Value"
					placeholder="Value"
					type={type === "number" ? "number" : "text"}
					value={value}
					isDisabled={isDisabled}
					onChange={(e) => setValue(name, e.target.value)}
				/>
			) : (
				<Select
					label="Value"
					placeholder="Value"
					value={value}
					isDisabled={isDisabled}
					onChange={(e) => setValue(name, e.target.value)}
				>
					<SelectItem value="True" key={"True"}>
						True
					</SelectItem>
					<SelectItem value="False" key={"False"}>
						False
					</SelectItem>
				</Select>
			)}
			<span className="flex items-center gap-2">
				<TrashIcon onClick={removeParameter(name)} />
			</span>
		</div>
	);
};
