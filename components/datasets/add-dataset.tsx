import { useUser } from "@auth0/nextjs-auth0/client";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Progress,
	Switch,
	Textarea,
	useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

function makeGitPath(name: string) {
	return name.toLowerCase().replace(" ", "-") + ".git";
}

export const AddDataset = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { user } = useUser();
	const [datasetName, setDatasetName] = useState("");
	const [datasetDescription, setDatasetDescription] = useState("");
	const [projectName, setProjectName] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const [progress, setProgress] = useState(0);
	const ref = React.useRef<HTMLInputElement>(null);

	const SUBMIT_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/datasets`;
	const handleFileUpload = () =>
		new Promise(async (resolve) => {
			onOpenChange();
			setIsCompleted(false);
			const data = new FormData();
			data.append("name", datasetName);
			data.append("description", datasetDescription);
			data.append("private", String(isPrivate));
			data.append("owner_id", user?.email || "");

			try {
				const response = await axios.post(SUBMIT_url, data);
				resolve(response);
				setIsCompleted(true);
			} catch (err: any) {
				// If error is 409, then the model already exists
				if (err.status === 409) {
					alert("Dataset already exists. Please choose a different name.");
				} else if (err.status === 422) {
					alert("Please fill out all required fields.");
				} else if (err.status === 404) {
					alert(err.detail);
				} else {
					alert("Internal server error, contact admin");
				}
			}
		});

	return (
		<div>
			<>
				<Button onPress={onOpen} color="primary">
					Add Dataset
				</Button>
				<Modal
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					placement="top-center"
				>
					<ModalContent>
						{(onClose) => (
							<form>
								<ModalHeader className="flex flex-col gap-1">
									Add Datasets
								</ModalHeader>
								<ModalBody>
									<input
										type="hidden"
										name="owner_id"
										value={user?.email || ""}
									/>
									<Input
										label="Unique Name"
										name="name"
										isRequired
										variant="bordered"
										placeholder="Unique Name without spaces"
										value={datasetName}
										onChange={(e) => setDatasetName(e.target.value)}
									/>
									<Textarea
										label="Description"
										isRequired
										name="description"
										variant="bordered"
										maxLength={200}
										value={datasetDescription}
										onChange={(e) => setDatasetDescription(e.target.value)}
									/>
									{/* <Input
										variant="bordered"
										placeholder="Upload dataset here"
										isRequired
										name="file"
										type="file"
										ref={ref}
									/> */}
									<Switch
										name="private"
										value={String(isPrivate)}
										onChange={() => setIsPrivate(!isPrivate)}
									>
										{isPrivate ? "Private" : "Public"}
									</Switch>
								</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="flat" onClick={onClose}>
										Close
									</Button>
									<Button
										color="primary"
										type="button"
										onClick={handleFileUpload}
									>
										Add Dataset
									</Button>
								</ModalFooter>
							</form>
						)}
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
										<div className="flex flex-col gap-1">
											<p className="text-sm text-blue-600">
												Follow these steps to push your local git repository
											</p>
											<p className="text-sm text-white">
												<code>git init</code>
											</p>
											<p className="text-sm text-white">
												<code>git add .</code>
											</p>
											<p className="text-sm text-white">
												<code>git commit -m &apos;initial commit&apos;</code>
											</p>
											<p className="text-sm text-white">
												<code>
													git remote set-url mlab
													disal@18.157.151.201:disal/mlab/filez/datasets/`$
													{makeGitPath(datasetName)}`
												</code>
											</p>
											<p className="text-sm text-white">
												<code>git push mlab master</code>
											</p>
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
				<iframe name="submit_file" style={{ display: "none" }}></iframe>
			</>
		</div>
	);
};
