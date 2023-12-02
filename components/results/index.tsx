import React from "react";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { DotsIcon } from "../icons/accounts/dots-icon";
import { ExportIcon } from "../icons/accounts/export-icon";
import { InfoIcon } from "../icons/accounts/info-icon";
import { TrashIcon } from "../icons/accounts/trash-icon";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { useUser } from "@auth0/nextjs-auth0/client";
import { ResultsList } from "./results-list";

export const Results = ({}) => {
	return (
		<div className="my-14 mx-5 mx-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
			<ul className="flex">
				<li className="flex gap-2">
					<HouseIcon />
					<Link href={"/"}>
						<span>Home</span>
					</Link>
					<span> / </span>{" "}
				</li>

				<li className="flex gap-2">
					<ReportsIcon />
					<span>Results</span>
				</li>
			</ul>

			<h3 className="text-3xl font-semibold mt-5">Results</h3>
            <ResultsList />

		</div>
	);
};
