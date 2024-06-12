import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect } from "react";
import { DotsIcon } from "../icons/accounts/dots-icon";
import { ExportIcon } from "../icons/accounts/export-icon";
import { InfoIcon } from "../icons/accounts/info-icon";
import { TrashIcon } from "../icons/accounts/trash-icon";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { JobIcon } from "../icons/sidebar/job-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
// import {TableWrapper} from '../table/table';
import { AddJob } from "./add-job";
import { JobsList } from "./jobs-list";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { client, dataWithAccessToken } from "../../lib";

export const Jobs = () => {
	// Set up search bar
	const [search, setSearch] = React.useState("");
	const [jobs, setJobs] = React.useState<any[]>([]);
	const { user } = useUser();
	const router = useRouter();

	useEffect(() => {
		// if (user === undefined) {
		// 	router.push("/api/auth/login");
		// }

		const user_email = localStorage.getItem("user_email");
		if (!user) return;
		const fetchJobs = async () => {
			const { response: res } = await client.GET(
				"/api/jobs",
				dataWithAccessToken({ user })
			);
			const data = await res.json();
			setJobs(data);
		};
		fetchJobs();
	}, [user]);

	return (
		<div className="my-14 mx-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
			<ul className="flex">
				<li className="flex gap-2">
					<HouseIcon />
					<Link href={"/"}>
						<span>Home</span>
					</Link>
					<span> / </span>{" "}
				</li>

				<li className="flex gap-2">
					<JobIcon />
					<span>Job</span>
				</li>
			</ul>

			<h3 className="text-3xl font-semibold mt-5">Job</h3>
			<div className="flex justify-between flex-wrap gap-4 items-center">
				<div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
					<Input
						classNames={{
							input: "w-full",
							mainWrapper: "w-full",
						}}
						placeholder="Search Job"
						onChange={(e) => setSearch(e.target.value)}
					/>
					<SettingsIcon />
					<TrashIcon />
					<InfoIcon />
					<DotsIcon />
				</div>
				<div className="flex flex-row gap-3.5 flex-wrap">
					<AddJob />
					<Button className="auto" startContent={<ExportIcon />}>
						Export to CSV
					</Button>
				</div>
			</div>

			<JobsList filter={search} jobs={jobs} />
		</div>
	);
};
