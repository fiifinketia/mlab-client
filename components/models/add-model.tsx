import React, { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import {
	Button,
	Code,
	Input,
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
import { client, dataWithAccessToken } from "../../lib/api";
import { CreateModelForm, Model, makeCloneUrl } from "../../lib";
import { AppModal } from "../modals";

export const AddModel = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { user } = useUser();
	const router = useRouter();
	const [isCompleted, setIsCompleted] = useState(false);
	const [modelForm, setModelForm] = useState<CreateModelForm>({
		name: "",
		description: "",
		private: false,
		owner_id: user?.nickname || "",
		version: "",
		parameters: {},
	});
	const [model, setModel] = useState<Model>();
	const onAddModel = async () => {
		onOpenChange();
		if (user === undefined) {
			router.push("/api/auth/login");
			return;
		}
		try {
			// update the model form with the parameters
			setModelForm({ ...modelForm, parameters: parameters });
			const { response: res } = await client.POST(
				"/api/models",
				dataWithAccessToken({ user, body: modelForm })
			);
			if (res.status !== 200) {
				throw {
					status: res.status,
					cause: res.statusText,
					detail: (await res.json()).detail,
				};
			}
			setIsCompleted(true);
			setModel(await res.json());
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

	const [newParameter, setNewParameter] = React.useState<any>("");
	const [parameters, setParameters] = React.useState<any>({});

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
			<AppModal
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
							value={modelForm.name}
							onChange={(e) =>
								setModelForm({ ...modelForm, name: e.target.value })
							}
						/>
						<Input
							label="Description"
							placeholder="Description"
							value={modelForm.description}
							onChange={(e) =>
								setModelForm({ ...modelForm, description: e.target.value })
							}
						/>
						<Input
							label="Version"
							placeholder="Version"
							onChange={(e) =>
								setModelForm({ ...modelForm, version: e.target.value })
							}
							required
						/>

						<Switch
							isSelected={modelForm.private}
							onChange={() =>
								setModelForm({ ...modelForm, private: !modelForm.private })
							}
						>
							{modelForm.private ? "Private" : "Public"}
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
							isDisabled={
								modelForm.name === "" ||
								modelForm.description === "" ||
								modelForm.version === ""
							}
						>
							Add Model
						</Button>
					</ModalFooter>
				</ModalContent>
			</AppModal>
			{isCompleted && (
				<AppModal
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
										<Code className="text-wrap">
											git clone {makeCloneUrl(model?.git_name)}
										</Code>
										<p className="text-wrap"> Add you files </p>
										<Code className="text-wrap">git add .</Code>
										<Code className="text-wrap">
											git commit -m &apos;initial commit&apos;
										</Code>
										<Code className="text-wrap">git push</Code>
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
				</AppModal>
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
