import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";
import { promises as fs } from "fs";
import { ResultResponseFiles, client, dataWithAccessToken } from "../../lib";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Button,
	Selection,
	Textarea,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	useDisclosure,
} from "@nextui-org/react";
import { downloadFile, sizeToString } from "../results/utils";
import { useState, useEffect, Key } from "react";

const FILES_COLUMNS = [
	{ name: "NAME", uid: "name" },
	{ name: "SIZE", uid: "size" },
	{ name: "VIEW", uid: "view" },
	{ name: "DOWNLOAD", uid: "download" },
];

export const FilesTable = ({
	files,
	resultId,
}: {
	files: ResultResponseFiles;
	resultId: string;
}) => {
	const { user } = useUser();
	const [selected, setSelectedKey] = useState<Selection>(
		new Set([files[0].name])
	);
	const [selectedValue, setSelectedValue] = useState(files[0].name);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const viewFileModal = (fileName: string) => {
		setSelectedValue(fileName);
		onOpen();
	};

	return (
		<div className="flex flex-col gap-4">
			<Table
				selectionMode="single"
				selectionBehavior="toggle"
				defaultSelectedKeys={selected}
				color="primary"
				onSelectionChange={setSelectedKey}
			>
				<TableHeader>
					{FILES_COLUMNS.map((column) => (
						<TableColumn key={column.uid}>{column.name}</TableColumn>
					))}
				</TableHeader>
				<TableBody>
					{files.map((file) => (
						<TableRow key={file.name}>
							<TableCell>{file.name}</TableCell>
							<TableCell>{sizeToString(file.size)}</TableCell>
							<TableCell>
								<Button
									isDisabled={!file.name.endsWith(".log")}
									onClick={() => viewFileModal(file.name)}
								>
									View
								</Button>
							</TableCell>
							<TableCell>
								<Button
									onClick={() => downloadFile(resultId, file.name, user)}
									color="primary"
								>
									Download
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{/* Display file content if selected */}
			<Modal size="lg" isOpen={isOpen} onClose={onClose} placement="top-center">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								{selectedValue}
							</ModalHeader>
							<ModalBody>
								<ViewFileModal
									filename={selectedValue}
									user={user!}
									resultId={resultId}
								/>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
};

const ViewFileModal = ({
	filename,
	resultId,
	user,
}: {
	filename: string;
	resultId: string;
	user: UserProfile;
}) => {
	const [fileContent, setFileContent] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [lastIntervalId, setLastIntervalId] = useState<NodeJS.Timeout | null>(
		null
	);

	const fetchFileContent = async () => {
		if (!user) return;
		const { response } = await client.GET(
			"/api/results/download/{result_id}/{file_name}",
			dataWithAccessToken({
				user,
				params: { path: { result_id: resultId, file_name: filename } },
			})
		);
		const res = await response.text();
		setIsLoading(false);
		setFileContent(res);
	};

	useEffect(() => {
		setIsLoading(true);
		if (lastIntervalId) clearInterval(lastIntervalId);
		// if (status === "running"){
		const intervalId = setInterval(() => {
			fetchFileContent();
		}, 5000);
		setLastIntervalId(intervalId);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<Textarea
			isReadOnly
			variant="bordered"
			defaultValue="Loading..."
			disableAutosize
			rows={20}
			fullWidth
			value={isLoading ? "Loading..." : fileContent}
		/>
	);
};
