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

export const AddDataset = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { user } = useUser();
	const [datasetName, setDatasetName] = useState("");
	const [datasetDescription, setDatasetDescription] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const ref = React.useRef<HTMLInputElement>(null);

	const upload_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/datasets`;
	const handleFileUpload = () => new Promise(async (resolve) => {
		onOpenChange();
		setProgress(0)
		setIsLoading(true)
		if(ref.current?.files){
			const file = ref.current.files[0]
			const data = new FormData()
			data.append('file', file)
			data.append('name', datasetName)
			data.append('description', datasetDescription)
			data.append('private', String(isPrivate))
			data.append('owner_id', user?.email || "")

	
			const config: AxiosRequestConfig = {
				headers: { 
					'content-type': 'multipart/form-data',
					'Filename': file.name
			 	},
				onUploadProgress: (event: any) => {
					const p = Math.round((event.loaded * 100) / event.total);
					setProgress(p)
					if (p === 100) {
						setIsLoading(false)
						onOpenChange()
						window.location.reload()
					}
				},
				
			}
	
			try{
				const response = await axios.post(upload_url, data, config)
				resolve(response)
			}
			catch(err){
				alert("Error uploading dataset")
			}
	   }
	})

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
										maxLength={200}
										value={datasetDescription}
										onChange={(e) => setDatasetDescription(e.target.value)}
									/>
									<Input
										variant="bordered"
										placeholder="Upload dataset here"
										isRequired
										name="file"
										type="file"
										ref={ref}
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
									<Button color="primary" type="button" onClick={handleFileUpload}>
										Add Dataset
									</Button>
								</ModalFooter>
							</form>
						)}
					</ModalContent>
				</Modal>
				{
					isLoading && (
						<Modal
							isOpen={isLoading}
							onOpenChange={() => !isLoading ? setIsLoading(false): null}
							placement="top-center"
							isDismissable={false}
							closeButton={!isLoading}
						>
							<ModalContent>
								{(onClose) => (
									<div className="flex flex-col gap-1">
										<ModalHeader>Uploading Dataset</ModalHeader>
										<ModalBody>
											<div className="flex flex-col gap-1">
												<p className="text-sm text-warning">Please wait while we upload your dataset</p>
												<p className="text-sm text-warning">Do not close this window</p>
												<p className="text-sm text-warning">This may take a while depending on the size of your dataset</p>
												<p className="text-lg text-primary">Uploading {progress}%</p>
											</div>
											<Progress value={progress} />
										</ModalBody>
									</div>
								)}
							</ModalContent>
						</Modal>
					)
				}
				<iframe name="submit_file" style={{display: 'none'}}></iframe>
			</>
		</div>
	);
};
