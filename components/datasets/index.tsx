import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { DotsIcon } from "../icons/accounts/dots-icon";
import { ExportIcon } from "../icons/accounts/export-icon";
import { InfoIcon } from "../icons/accounts/info-icon";
import { TrashIcon } from "../icons/accounts/trash-icon";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { DatasetsIcon } from "../icons/sidebar/datasets-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
// import {TableWrapper} from '../table/table';
import { AddDataset } from "./add-dataset";
import { DatasetsList } from "./datasets-list";

export const Datasets = () => {
	return (
		<div className="my-14 mx-5 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
			<ul className="flex">
				<li className="flex gap-2">
					<HouseIcon />
					<Link href={"/"}>
						<span>Home</span>
					</Link>
					<span> / </span>{" "}
				</li>

				<li className="flex gap-2">
					<DatasetsIcon />
					<span>Datasets</span>
				</li>
			</ul>

			<h3 className="text-3xl font-semibold mt-5">Datasets</h3>
			<div className="flex justify-between flex-wrap gap-4 items-center">
				<div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
					<Input
						classNames={{
							input: "w-full",
							mainWrapper: "w-full",
						}}
						placeholder="Search datasets"
					/>
					<SettingsIcon />
					<TrashIcon />
					<InfoIcon />
					<DotsIcon />
				</div>
				<div className="flex flex-row gap-3.5 flex-wrap">
					<AddDataset />
					<Button className="auto" startContent={<ExportIcon />}>
						Export to CSV
					</Button>
				</div>
			</div>

			<DatasetsList />
		</div>
	);
};
