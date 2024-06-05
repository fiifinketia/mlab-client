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
import Link from "next/link";

import { Dataset, client, dataWithAccessToken, sourceCodeUrl } from "../../lib";

export const DatasetsList = () => {
	const [datasets, setDatasets] = useState<Dataset[]>([]);
	const { user } = useUser();
	const router = useRouter();
	const [openDatasetContext, setOpenDatasetContext] = useState(false);
	const [deleteDatasetModal, setDeleteDatasetModal] = useState(false);
	const [dataset, setDataset] = useState<Dataset | null>(null);

	const handleDeleteDataset = async (pid?: string) => {
		if (!pid) return;
		if (!user) return;
		const { response } = await client.DELETE(
			`/api/datasets/{dataset_id}`,
			dataWithAccessToken({ user, params: { path: { dataset_id: pid } } })
		);
		if (response.ok) {
			setDeleteDatasetModal(false);
			setDataset(null);
			router.reload();
		}
	};

	const openDeleteDatasetModal = () => {
		setOpenDatasetContext(false);
		setDeleteDatasetModal(true);
	};

	const contextOpen = (id: string) => {
		const dataset = datasets.find((dataset) => dataset.id === id);
		if (!dataset) return;
		setDataset(dataset);
		setOpenDatasetContext(true);
	};

	useEffect(() => {
		const fetchDatasets = async () => {
			if (!user) return;
			const { response, error } = await client.GET(
				"/api/datasets",
				dataWithAccessToken({ user })
			);
			if (!response.ok) {
				console.error("Failed to fetch models", error);
				setDatasets([]);
				return;
			}
			setDatasets(await response.json());
		};
		fetchDatasets();
	}, [user]);
	return (
		<div>
			<br />
			<div className="flex flex-row justify-start flex-wrap gap-4">
				{datasets.map((dataset) => {
					if (!dataset) return null;
					return (
						<DatasetCard
							id={dataset.id || ""}
							key={dataset.id}
							owner={dataset.owner_id}
							name={dataset.name}
							lastUpdated={dataset.modified || ""}
							isPrivate={dataset.private || false}
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
						<p className="text-primary">Dataset Actions</p>
						<span className="text-body">{dataset?.description}</span>
						<div className="flex flex-row justify-end gap-4">
							<Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
								<Link
									href={sourceCodeUrl(dataset?.git_name)}
									passHref
									target="_blank"
								>
									View Source
								</Link>
							</Button>
							{/* <Button
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
								isDisabled
							>
								Edit
							</Button> */}
							<Button
								className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
								onClick={openDeleteDatasetModal}
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
							onClick={() => handleDeleteDataset(dataset?.id)}
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
