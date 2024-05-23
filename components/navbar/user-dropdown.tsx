import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
} from "@nextui-org/react";
import React from "react";
import { DarkModeSwitch } from "./darkmodeswitch";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";


export const UserDropdown = () => {
	const router = useRouter();
	const { user } = useUser();

	const runAction = (key: React.Key) => {
		if (key === "logout") {
			router.push("/api/auth/logout");
			return;
		}
		if (key === "settings") {
			router.push("/app/settings");
			return;
		}
		if (key === "configurations") {
			router.push("/app/settings/configurations");
			return;
		}
	};
	return (
		<Dropdown>
			<NavbarItem>
				<DropdownTrigger>
					<Avatar
						as="button"
						color="secondary"
						size="md"
						src={user?.picture || ""}
					/>
				</DropdownTrigger>
			</NavbarItem>
			<DropdownMenu
				aria-label="User menu actions"
				onAction={(actionKey) => runAction(actionKey)}
			>
				<DropdownItem
					key="profile"
					className="flex flex-col justify-start w-full items-start"
				>
					<p>Signed in as</p>
					<p>{user?.email}</p>
				</DropdownItem>
				<DropdownItem key="settings">My Settings</DropdownItem>
				<DropdownItem key="team_settings">Team Settings</DropdownItem>
				<DropdownItem key="analytics">Analytics</DropdownItem>
				<DropdownItem key="system">System</DropdownItem>
				<DropdownItem key="configurations">Configurations</DropdownItem>
				<DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
				<DropdownItem key="logout" color="danger" className="text-danger">
					Log Out
				</DropdownItem>
				<DropdownItem key="switch">
					<DarkModeSwitch />
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};
