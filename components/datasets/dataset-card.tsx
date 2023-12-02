import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	DropdownTrigger,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	PopoverContent,
	Popover,
	PopoverTrigger,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { DatasetsIcon } from "../icons/sidebar/datasets-icon";
import { useUser } from "@auth0/nextjs-auth0/client";
import { set } from "@auth0/nextjs-auth0/dist/session";

interface Props {
	id: string;
	owner: string;
	name: string;
	lastUpdated: string;
	isPrivate: boolean;
	content_type: string;
	contextOpen: (id: string) => void;
}

export const DatasetCard = ({
	id: dataset_id,
	owner,
	name,
	lastUpdated,
	isPrivate,
	content_type,
	contextOpen
}: Props) => {
	return (
		<div>
			{" "}
			<Card
				// Set fixed width and height for screensizes
				className="w-72 h-50 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl"
				isPressable
				onContextMenu={(e) => e.preventDefault()}
				onPress={() => contextOpen(dataset_id)}
			>
				<CardHeader className="py-5">
					<div className="flex gap-2.5">
						<DatasetsIcon color="#FFFFFF" />
						<div className="flex flex-col">
							<span className="text-xs text-white font-semibold">{owner}</span>
						</div>
					</div>
				</CardHeader>
				<CardBody className="py-5">
					{/* Dataset title and last updated time */}
					<div className="flex items-center gap-6">
						<span className="text-xl text-white font-semibold">{name}</span>
					</div>
					<div className="flex items-center gap-6">
						<div>
							<span className="text-xs text-white font-semibold">
								{new Date(lastUpdated).toLocaleDateString()}
							</span>
						</div>
						<div>
							<span className="text-xs text-white font-semibold">
								{content_type}
							</span>
						</div>
					</div>
				</CardBody>
				<CardFooter className="py-5">
					{/* Reputation with increase and decrease buttons */}
					<div className="flex flex-row gap-2.5 justify-end">
						<span className="text-xs text-white font-semibold">
							{isPrivate ? "Private Dataset" : "Public Dataset"}
						</span>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};
