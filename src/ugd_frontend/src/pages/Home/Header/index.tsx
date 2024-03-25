import AuthButton from "@/components/ui/AuthButton";
import FilterButton from "@/components/ui/FilterButton";
import SearchField from "@/components/ui/SearchField";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React from "react";
import Filter from "./Filter";
import Mobile from "./Filter/Mobile";

function Header() {
	const dispatch = useAppDispatch();
	const {filter} = useAppSelector(state=>state.home);

	return (
		<div className={`flex-grow-0 flex-shrink-0 ${filter ? 'md:basis-80 bg-[#717171]':'basis-32 md:basis-40'} flex flex-col justify-center items-stretch px-4 md:px-10`}>
			<div className="relative flex-grow-0 flex-shrink-0 flex basis-32 md:basis-40 justify-between items-center">
				<FilterButton />
				<SearchField />
				<AuthButton />
			</div>
			{filter && (window.innerWidth < 640 ? <Mobile /> : <Filter />)}
		</div>
	);
}

export default Header;
