import React, { useEffect, useState } from "react";
import { DatasetCard } from "./dataset-card";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";

export const DatasetsList = () => {
	const [datasets, setDatasets] = useState<any[]>([]);
	const { user } = useUser();
	const [openDatasetContext, setOpenDatasetContext] = useState(false);
	const [deleteDatasetModal, setDeleteDatasetModal] = useState(false);

	const handleDeleteDataset = (id: string) => {
		fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/datasets/${id}`, {
			method: "DELETE",
		})
			.then((res) => res.json())
			.then((data) => {
				setDatasets(datasets.filter((dataset) => dataset.id !== id));
				setDeleteDatasetModal(false);
			});
	};

	const openDeleteDatasetModal = () => {
		setOpenDatasetContext(false);
		setDeleteDatasetModal(true);
	};

	const contextOpen = (id: string) => {
		setOpenDatasetContext(true);
	};

	useEffect(() => {
		fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/datasets?user_id=${user?.email}`
		)
			.then((res) => res.json())
			.then((data) => setDatasets(data));
	}, [user]);
	return (
		<div>
			<br />
			<div className="flex flex-row justify-start flex-wrap gap-4">
				{datasets.map((dataset) => {
					return (
						<DatasetCard
							id={dataset.id}
							key={dataset.id}
							owner={dataset.owner_id}
							name={dataset.name}
							lastUpdated={dataset.modified}
							content_type={dataset.content_type}
							isPrivate={dataset.private}
							contextOpen={contextOpen}
						/>
					);
				})}
			</div>
			<Modal
				isOpen={openDatasetContext}
				onClose={() => setOpenDatasetContext(false)}
			>
				<ModalHeader>Dataset Context</ModalHeader>
				<ModalContent>
					<ModalBody>
						<p>Dataset Context</p>
						<p>Actions</p>
						<span className="text-warning-500">
							Not available at the moment
						</span>
						<div className="flex flex-row justify-end gap-4">
							<Button
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
								isDisabled
							>
								View
							</Button>
							<Button
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
								isDisabled
							>
								Edit
							</Button>
							<Button
								className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
								onClick={openDeleteDatasetModal}
								isDisabled
							>
								Delete
							</Button>
						</div>
					</ModalBody>
				</ModalContent>
			</Modal>
			<Modal
				isOpen={deleteDatasetModal}
				onClose={() => setDeleteDatasetModal(false)}
			>
				<ModalHeader>Delete Dataset</ModalHeader>
				<ModalContent>
					<ModalBody>
						<p>Are you sure you want to delete this dataset?</p>
					</ModalBody>
					<ModalFooter>
						<Button
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
							onClick={() => handleDeleteDataset("1")}
						>
							Yes
						</Button>
						<Button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							onClick={() => setDeleteDatasetModal(false)}
						>
							No
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};
