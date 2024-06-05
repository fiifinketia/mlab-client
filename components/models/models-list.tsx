import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";
import { ModelCard } from "./model-card";
import { client, dataWithAccessToken } from "../../lib/api";

export const ModelsList = ({ filter }: { filter: string }) => {
	const router = useRouter();
	const { user } = useUser();
	const [models, setModels] = useState<any[]>([]);

	useEffect(() => {
		try {
			if (user === undefined) {
				router.push("/");
				return;
			}
			const fetchModels = async () => {
				const { response, error } = await client.GET(
					"/api/models",
					dataWithAccessToken({ user })
				);
				if (!response.ok) {
					console.error("Failed to fetch models", error);
					setModels([]);
					return;
				}
				setModels(await response.json());
			};
			fetchModels();
		} catch (error) {
			console.error("Failed to fetch models", error);
			setModels([]);
		}
	}, [user, router]);

	useEffect(() => {
		if (filter === "") return;
		const filteredModels = models.filter((model) => {
			// Filter by model name
			if (model.name.toLowerCase().includes(filter.toLowerCase())) return true;
		});
		setModels(filteredModels);
	}, [filter, models]);

	return (
		<div>
			<br />
			<div className="flex flex-row justify-start flex-wrap gap-4">
				{models.length > 0 ? (
					models.map((model) => {
						return (
							<ModelCard
								key={model.id}
								owner={model.owner_id}
								name={model.name}
								lastUpdated={model.modified}
								isPrivate={model.private}
								description={model.description}
								version={model.version}
							/>
						);
					})
				) : (
					<div className="text-center w-full">
						<h2>No models found</h2>
					</div>
				)}
			</div>
		</div>
	);
};
