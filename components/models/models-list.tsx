import React, { useState, useEffect} from "react";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";
import { ModelCard } from "./model-card";

export const ModelsList = ({ filter } : { filter : string }) => {
    const router = useRouter();
    const { user } = useUser();
    const [models, setModels] = useState<any[]>([]);

    useEffect(() => {
        fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/models?user_id=${user?.email}`
        )
            .then((res) => res.json())
            .then((data) => setModels(data));
    }, [user]);

    useEffect(() => {
        if (filter === "") return;
        const filteredModels = models.filter((model) => {
            // Filter by model name
            if (model.name.toLowerCase().includes(filter.toLowerCase()))
                return true;
        });
        setModels(filteredModels);
    }, [filter]);

    return (
        <div>
            <br />
            <div className="flex flex-row justify-start flex-wrap gap-4">
                {models.map((model) => {
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
                })}
            </div>
        </div>
    );
}