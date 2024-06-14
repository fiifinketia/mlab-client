"use client";
import React from "react";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarWrapper } from "../sidebar/sidebar";
import { SidebarContext } from "./layout-context";
import { Spinner } from "@nextui-org/react";
import { useUser } from "@auth0/nextjs-auth0/client";

interface Props {
	children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
	const [sidebarOpen, setSidebarOpen] = React.useState(false);
	const [_, setLocked] = useLockedBody(false);
	const handleToggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
		setLocked(!sidebarOpen);
	};
	const { isLoading } = useUser();

	if (isLoading)
		return (
			<div className="flex justify-center w-full h-screen">
				<Spinner size="lg" className="my-14 mx-6 w-full flex flex-col gap-4" />
			</div>
		);

	return (
		<SidebarContext.Provider
			value={{
				collapsed: sidebarOpen,
				setCollapsed: handleToggleSidebar,
			}}
		>
			<section className="flex">
				<SidebarWrapper />
				<NavbarWrapper>{children}</NavbarWrapper>
			</section>
		</SidebarContext.Provider>
	);
};
