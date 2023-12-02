import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Tooltip, Chip } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CubeIcon } from "../icons/sidebar/cube-icon";
import { LockIcon } from "../icons/lock-icon";
import { UnlockIcon } from "../icons/unlock-icon";

interface Props {
    owner: string;
    name: string;
    lastUpdated: string;
    isPrivate: boolean;
    description: string;
    version: string;
}

export const ModelCard = ({
    owner,
    name,
    lastUpdated,
    isPrivate,
    description,
    version,
}: Props) => {
    const router = useRouter();

    const handleClick = () => {
        // router.push(`/app/models/${owner}/${name}`);
    };
    return (
        <Card
            // Set fixed width and height for screensizes
            className="w-72 h-50 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl"
            onPress={handleClick}
            isPressable
        >
            <CardHeader className="py-2">
                <div className="flex gap-2.5">
                    <CubeIcon color="#ffffff" />
                    <div className="flex flex-col">
                        <span className="text-xs text-white font-semibold">
                            {owner}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="py-3">
                {/* Model title and last updated time */}
                <div className="flex items-center gap-6">
                    <Tooltip content={name}>
                        <span className="text-lg text-white font-semibold truncate overflow-y-hidden">{name}</span>
                    </Tooltip>
                </div>
                <div className="flex items-center gap-6">
                    <div>
                        <span className="text-xs text-white font-semibold">
                            {(new Date(lastUpdated)).toLocaleDateString()}
                        </span>
                    </div>
                    <div>
                        <Chip color="secondary" className="text-xs text-white font-semibold">{version}</Chip>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="py-2">
                {/* Model description */}
                <div className="flex items-center gap-6">
                    <span className="text-xs text-left text-white font-semibold line-clamp-3">{description}</span>
                </div>
            </CardFooter>
            {
                isPrivate ? <LockIcon /> : <UnlockIcon />
            }
        </Card>
    );
};