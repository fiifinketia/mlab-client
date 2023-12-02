import { Button, Input, Link } from "@nextui-org/react";
import React from "react";
import { DotsIcon } from "../icons/accounts/dots-icon";
import { ExportIcon } from "../icons/accounts/export-icon";
import { InfoIcon } from "../icons/accounts/info-icon";
import { TrashIcon } from "../icons/accounts/trash-icon";
import { HouseIcon } from "../icons/breadcrumb/house-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CubeIcon } from "../icons/sidebar/cube-icon";
import { ModelsList } from "./models-list";
import { AddModel } from "./add-model";

export const Models = () => {
    const [search, setSearch] = React.useState("");

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
                <CubeIcon />
                <span>Model</span>
            </li>
        </ul>

        <h3 className="text-3xl font-semibold mt-5">Models</h3>
        <div className="flex justify-between flex-wrap gap-4 items-center">
            <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                <Input
                    classNames={{
                        input: "w-full",
                        mainWrapper: "w-full",
                    }}
                    placeholder="Search Model"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <SettingsIcon />
                <TrashIcon />
                <InfoIcon />
                <DotsIcon />
            </div>
            <div className="flex flex-row gap-3.5 flex-wrap">
                <AddModel />
                <Button className="auto" startContent={<ExportIcon />}>
                    Export to CSV
                </Button>
            </div>
        </div>

        <ModelsList filter={search} />
    </div>
    );
}