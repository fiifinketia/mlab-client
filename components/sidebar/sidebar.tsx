'use client'
import React from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { JobIcon } from "../icons/sidebar/job-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { useRouter } from "next/router";
import { DatasetsIcon } from "../icons/sidebar/datasets-icon";
import { CubeIcon } from "../icons/sidebar/cube-icon";

export const SidebarWrapper = () => {
  const router = useRouter();
  const { collapsed, setCollapsed } = useSidebarContext();
  const [models, setModels] = React.useState<[{}]>([{}]);

  return (
    <aside className="h-screen z-[202] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        {/* <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div> */}
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={router.pathname === "/app"}
              href="/app"
            />
            <SidebarMenu title="Main Menu">
              <SidebarItem
                isActive={router.pathname === "/app/datasets"}
                title="Datasets"
                icon={<DatasetsIcon />}
                href="/app/datasets"
              />
              <SidebarItem
                isActive={router.pathname === "/app/models"}
                title="Models"
                icon={<CubeIcon />}
                href="/app/models"
              />
              <SidebarItem
                isActive={router.pathname === "/app/jobs"}
                title="Jobs"
                icon={<JobIcon />}
                href="/app/jobs"
              />
              {/* <SidebarItem
                isActive={router.pathname === "/products"}
                title="Products"
                icon={<ProductsIcon />}
              /> */}
              <SidebarItem
                isActive={router.pathname === "/app/results"}
                title="Results"
                icon={<ReportsIcon />}
                href="/app/results"
              />
            </SidebarMenu>

            <SidebarMenu title="General">
              <SidebarItem
                isActive={router.pathname === "/docs"}
                title="Developer Docs"
                icon={<DevIcon />}
              />
              {/* <SidebarItem
                isActive={router.pathname === "/view"}
                title="View Test Data"
                icon={<ViewIcon />}
              /> */}
              {/* <SidebarItem
                isActive={router.pathname === "/settings"}
                title="Settings"
                icon={<SettingsIcon />}
              /> */}
            </SidebarMenu>

            {/* <SidebarMenu title="Updates">
              <SidebarItem
                isActive={router.pathname === "/changelog"}
                title="Changelog"
                icon={<ChangeLogIcon />}
              />
            </SidebarMenu> */}
          </div>
          <div className={Sidebar.Footer()}>
            {/* <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip> */}
          </div>
        </div>
      </div>
    </aside>
  );
};
