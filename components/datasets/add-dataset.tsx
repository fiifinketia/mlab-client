import { useUser } from "@auth0/nextjs-auth0/client";
import {
	Button,
	Code,
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
import {
	client,
	dataWithAccessToken,
	CreateDatasetForm,
	Dataset,
	makeCloneUrl,
} from "../../lib";

export const AddDataset = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { user } = useUser();
	const [datasetForm, setDatasetForm] = useState<CreateDatasetForm>({
		name: "",
		description: "",
		private: false,
		owner_id: user?.nickname || "",
	});
	const [isCompleted, setIsCompleted] = useState(false);
	const [dataset, setDataset] = useState<Dataset>();

	const handleSubmit = async () => {
		onOpenChange();
		try {
			if (!datasetForm) {
				throw new Error("Dataset form is not set");
			}
			if (!user) {
				throw new Error("User is not set");
			}
			const { response } = await client.POST(
				"/api/datasets",
				dataWithAccessToken({
					body: datasetForm,
					user,
				})
			);
			if (response.status === 200) {
				const data: Dataset = await response.json();
				setIsCompleted(true);
				setDataset(data);
			}
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
	};
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
										value={user?.nickname || ""}
									/>
									<Input
										label="Unique Name"
										name="name"
										isRequired
										variant="bordered"
										placeholder="Unique Name without spaces"
										value={datasetForm?.name}
										onChange={(e) =>
											setDatasetForm({ ...datasetForm, name: e.target.value })
										}
									/>
									<Textarea
										label="Description"
										isRequired
										name="description"
										variant="bordered"
										maxLength={200}
										value={datasetForm?.description}
										onChange={(e) =>
											setDatasetForm({
												...datasetForm,
												description: e.target.value,
											})
										}
									/>
									<Switch
										name="private"
										value={String(datasetForm?.private)}
										onChange={() =>
											setDatasetForm({
												...datasetForm,
												private: !datasetForm?.private,
											})
										}
									>
										{datasetForm?.private ? "Private" : "Public"}
									</Switch>
								</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="flat" onClick={onClose}>
										Close
									</Button>
									<Button color="primary" type="button" onClick={handleSubmit}>
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
										<div className="flex flex-col gap-1 text-balance">
											<p className="text-sm text-blue-600">
												Follow these steps to push your local git repository
											</p>
											<Code className="text-wrap">git init</Code>
											<Code className="text-wrap">
												git clone {makeCloneUrl(dataset?.git_name)}
											</Code>
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
					</Modal>
				)}
			</>
		</div>
	);
};
