// Layout for Settings page
// Tailwindcss Layout
// Use tabs for each page of settings and index as General Settings
import { Tab, Tabs, divider } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { NavbarWrapper } from "../navbar/navbar";
interface Props {
	children: React.ReactNode;
}

export const SettingsLayout = ({ children }: Props) => {
	const pathname = usePathname();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (isClient)
		return (
			<NavbarWrapper>
				<div className="flex flex-row h-full mx-10 max-w-[90rem] w-full">
					<div className="flex flex-col w-full h-full overflow-y-auto">
						<Tabs variant="underlined" size="lg" selectedKey={pathname}>
							<Tab key="/app/settings" title="General" href="/app/settings">
								{children}
							</Tab>
							<Tab
								key="/app/settings/configurations"
								title="Configurations"
								href="/app/settings/configurations"
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
