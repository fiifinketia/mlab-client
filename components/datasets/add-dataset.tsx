import { useUser } from "@auth0/nextjs-auth0/client";
import {
	Button,
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
import { useRouter } from "next/router";
import React, { useState } from "react";

export const AddDataset = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { user } = useUser();
	const router = useRouter();
	const [datasetName, setDatasetName] = useState("");
	const [datasetDescription, setDatasetDescription] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);

	const handleSubmit = () => {
		onOpenChange();
		// router.reload();
		// Wait for the dataset to be uploaded for refreshing
		// Warn user to wait for the dataset to be uploaded
		// TODO: Add loading indicator
	};

	const upload_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/datasets`;
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
							<form
								action={upload_url}
								encType="multipart/form-data"
								method="post"
								target="submit_file"
								onSubmitCapture={handleSubmit}
							>
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
										label="name"
										name="name"
										isRequired
										variant="bordered"
										value={datasetName}
										onChange={(e) => setDatasetName(e.target.value)}
									/>
									<Textarea
										label="Description"
										isRequired
										name="description"
										variant="bordered"
										value={datasetDescription}
										onChange={(e) => setDatasetDescription(e.target.value)}
									/>
									<Input
										variant="bordered"
										placeholder="Upload dataset here"
										isRequired
										name="file"
										type="file"
									/>
									<Switch
										name="private"
										value={String(isPrivate)}
										onChange={() => setIsPrivate(!isPrivate)}
									/>
								</ModalBody>
								<ModalFooter>
									<Button color="danger" variant="flat" onClick={onClose}>
										Close
									</Button>
									<Button color="primary" type="submit">
										Add Dataset
									</Button>
								</ModalFooter>
							</form>
						)}
					</ModalContent>
				</Modal>
				<iframe name="submit_file" style={{ display: "none" }}></iframe>
			</>
		</div>
	);
};
