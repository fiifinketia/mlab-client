// Layout for Settings page
// Tailwindcss Layout
// Use tabs for each page of settings and index as General Settings
import { Spinner, Tab, Tabs, divider } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { NavbarWrapper } from "../navbar/navbar";
import { useUser } from "@auth0/nextjs-auth0/client";
interface Props {
	children: React.ReactNode;
}

export const SettingsLayout = ({ children }: Props) => {
	const pathname = usePathname();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const { isLoading } = useUser();

	if (isLoading)
		return (
			<div className="flex justify-center w-full h-screen">
				<Spinner size="lg" className="my-14 mx-6 w-full flex flex-col gap-4" />
			</div>
		);
	if (isClient)
		return (
			<NavbarWrapper>
				<div className="flex flex-row h-full mx-10 max-w-[90rem] w-full">
					<div className="flex flex-col w-full h-full overflow-y-auto">
						<Tabs variant="underlined" size="lg" selectedKey={pathname}>
							<Tab key="/settings" title="General" href="/settings">
								{children}
							</Tab>
							<Tab
								key="/settings/configurations"
								title="Configurations"
								href="/settings/configurations"
							>
								{children}
							</Tab>
						</Tabs>
					</div>
				</div>
			</NavbarWrapper>
		);
	else return null;
};
