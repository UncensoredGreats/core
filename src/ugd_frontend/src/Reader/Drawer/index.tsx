// src/Drawer/index.tsx
import React from "react";

import { DrawerStyle as defaultDrawerStyles, type IDrawerStyle } from "./style";
import { TableOfContents } from "./TableOfContents";

import { Setting } from "./Setting";
import { Bookmarks } from "./Bookmarks";
import { Annotations } from "./Annotations";
import { Search } from "./Search";
import { Tabs } from "../lib/hooks/useSidebarState";
import { useSidebar } from "../lib/hooks/useReaderContext";

import { IoCloseCircleOutline } from "react-icons/io5";

interface DrawerProps {
	drawerStyles?: IDrawerStyle;
}

export const Drawer: React.FC<DrawerProps> = ({
	drawerStyles = defaultDrawerStyles,
}) => {
	const { sidebar } = useSidebar();
	return (
		<div className="left-12 bg-gradient-to-t from-indigo-100 to-indigo-50 text-indigo-800 w-10/12 sm:w-8/12 md:w-4/12 rounded-md shadow-md p-1 text-base">
			{sidebar == Tabs.TableOfContents && <TableOfContents />}
			{sidebar == Tabs.Bookmarks && <Bookmarks />}
			{sidebar == Tabs.Annotations && <Annotations />}
			{sidebar == Tabs.Search && <Search />}
			{sidebar == Tabs.Settings && <Setting />}
		</div>
	);
};
