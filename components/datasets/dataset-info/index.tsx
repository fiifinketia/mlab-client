import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import Link from "next/link";
import { HouseIcon } from "../../icons/breadcrumb/house-icon";
import { UsersIcon } from "../../icons/breadcrumb/users-icon";
import { DatasetsIcon } from "../../icons/sidebar/datasets-icon";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

interface Props {
	owner: string;
	datasetName: string;
}

const MDPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
	ssr: false,
});

const MarkdownPreview = ({ source }: { source: string }) => {
	return (
		<div data-color-mode="dark">
			<MDPreview
				source={source}
				// rehypePlugins={[reHypeRaw]}
				// remarkPlugins={[remarkGfm, remarkHtml]}
			/>
		</div>
	);
};

export const DataSetInfo = ({ owner, datasetName }: Props) => {
	// Fetch repo info from github
	const [repoContent, setRepoContent] = useState({});
	const [repoReadme, setRepoReadme] = useState("");

	useEffect(() => {
		// Use /api/github to fetch repo info

		const fetchRepoContent = async () => {
			const res = await fetch(
				`/api/github?owner=${"datasets"}&repo=${"oil-prices"}`
			);
			const data = await res.json();
			setRepoContent(data);
		};
		fetchRepoContent();
	}, []);

	useEffect(() => {
		// Use /api/github to fetch repo info

		const fetchRepoReadme = async () => {
			const res = await fetch(
				`https://raw.githubusercontent.com/${"datasets"}/${"oil-prices"}/main/README.md`
			);
			// Respoonse is a raw text
			const data = await res.text();
			// console.log("🚀 ~ file: index.tsx:62 ~ fetchRepoReadme ~ data:", data);
			setRepoReadme(data);
		};
		fetchRepoReadme();
	}, []);

	return (
		<div className="my-14 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
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
					<Link href={"/datasets"}>
						<span>Datasets</span>
					</Link>
					<span> / </span>{" "}
				</li>
				<li className="flex gap-2">
					<UsersIcon />
					<span>{owner}</span>
					<span> / </span>{" "}
				</li>
				<li className="flex gap-2">
					<span>{datasetName}</span>
				</li>
			</ul>

			<div className="flex justify-between flex-wrap gap-4 items-center">
				<Tabs variant="underlined" aria-label="Tabs variants">
					<Tab key="info" title="Info">
						{repoReadme && (
							//  Display readme content with div
								<MarkdownPreview source={repoReadme} />
							// <Markdown children={source}/>
						)}
					</Tab>
					<Tab key="files" title="Files" />
				</Tabs>
			</div>
		</div>
	);
};
