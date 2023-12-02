import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import Link from "next/link";
import { HouseIcon } from "../../icons/breadcrumb/house-icon";
import { UsersIcon } from "../../icons/breadcrumb/users-icon";
import { DatasetsIcon } from "../../icons/sidebar/datasets-icon";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

interface Props {
	modelName: string;
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

export const ModelInfo = ({ modelName }: Props) => {
	return (
		<div>
			{/* Display centered button 'test' */}
			<div className="flex justify-center">
				<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
					Test
				</button>
			</div>
		</div>
	);
};
