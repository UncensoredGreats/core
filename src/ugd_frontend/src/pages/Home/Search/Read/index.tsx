import { setSelectedSearchedBook } from "@/features/home/homeSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { useEffect, useRef, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { SlEye, SlPlus } from "react-icons/sl";
import { RxCross2 } from "react-icons/rx";

interface Item {
	id: number;
	title: string;
	description: string;
	image: string;
}

interface Props {
	item: Item;
}

const Read: React.FC<Props> = ({ item }) => {
	const dispatch = useAppDispatch();
	const { selectedSearchedBook } = useAppSelector((state) => state.home);

    const expandModalRef = useRef<HTMLDivElement>(null);

    const handleReadBookClick = ()=>{
        if(item.id == selectedSearchedBook?.id)
            dispatch(setSelectedSearchedBook(null))
        else
            dispatch(setSelectedSearchedBook(item))
    }


    useEffect(() => {
        if(expandModalRef.current){
            expandModalRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [item]);

	return (
        <div ref={expandModalRef} className="flex flex-col gap-2 bg-white shadow-lg rounded-lg">
            <div
                className="relative m-4 p-4 text-black shadow-xl border border-solid border-black rounded-lg transition-all duration-500 flex gap-1"
            >
                <div className="flex-shrink-0 flex flex-col basis-full md:basis-1/3 gap-1">
                    <div className="flex items-stretch">
                        <div
                            className="basis-[86px] md:basis-[180px] flex-shrink-0 h-[130px] md:h-64"
                            style={{
                                backgroundImage: `url(images/categories/${item.image})`,
                            }}
                        ></div>
                        <div className="flex-grow flex flex-col justify-between px-2 md:p-2 gap-2">
        					<div className="flex justify-between flex-grow md:flex-grow-0">
                                <div className="flex flex-col">
                                    <span className="font-roboto-condensed text-sm md:text-xl font-medium">
                                        ingo swann
                                    </span>
                                    <span className="font-syne text-lg md:text-2xl font-semibold">
                                        Penetration
                                    </span>
                                    <span className="font-roboto-condensed text-sm font-normal text-[#8E8E8E]">
                                        Non Fiction 2011
                                    </span>
                                    <div className="flex flex-wrap items-end md:items-center gap-2 flex-grow md:flex-grow-0">                                        <div className="flex justify-start flex-wrap item-center gap-2">
                                            {["RELIGION", "GENERALITIES AND IT"].map(
                                                (category, index, arr) => (
                                                    <React.Fragment key={category}>
                                                        <span className="font-roboto-condensed text-sm font-bold">
                                                            {category}
                                                        </span>
                                                        {index < arr.length - 1 && ( // Only add a dot if it's not the last item
                                                            <span className="font-roboto-condensed text-sm font-bold">
                                                                .
                                                            </span>
                                                        )}
                                                    </React.Fragment>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:flex justify-start flex-wrap item-center gap-2">
                                {[
                                    "Metaphysics",
                                    "Natural Theology",
                                    "Fossils & prehistoric life",
                                    "Classical and modern Greek literatures",
                                ].map((subCategory) => (
                                    <div className="truncate px-4 py-1 flex justify-center items-center border border-black rounded-full font-roboto-condensed text-xs font-normal cursor-pointer hover:bg-black hover:text-white transition-all duration-300 ease-in">
                                    {subCategory}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="text-[#8E8E8E] flex justify-start items-center font-roboto-condensed text-sm font-normal gap-2 ">
                        <SlPlus size={20} />
                        <span> 102 </span>
                        <SlEye size={20} />
                        <span> 1,2k</span>
                    </div>
                    <div className="flex md:hidden justify-start flex-wrap item-center gap-2">
                        {[
                            "Metaphysics",
                            "Natural Theology",
                            "Fossils & prehistoric life",
                            "Classical and modern Greek literatures",
                        ].map((subCategory) => (
                            <div className="truncate px-4 py-1 flex justify-center items-center border border-black rounded-full font-roboto-condensed text-sm font-normal cursor-pointer hover:bg-black hover:text-white transition-all duration-300 ease-in">
                                {subCategory}
                            </div>
                        ))}
                    </div>
                    <div className="md:hidden flex-grow font-roboto-condensed font-normal text-xl max-h-72 p-2 overflow-auto">
                        {item.description}
                    </div>

                </div>

                <div className="hidden md:block flex-grow font-roboto-condensed font-normal text-xl max-h-72 p-2 overflow-auto">
                    {item.description}
                </div>
                <div className="absolute top-2 right-2 md:static flex flex-col gap-2">
                    <RxCross2
                        onClick={handleReadBookClick}
                        size={36}
                        className=" p-2 text-white border border-white bg-black rounded-full cursor-pointer duration-300 transition-all hover:bg-white hover:border-black hover:text-black "
                    />
                    <HiOutlinePlus
                        size={36}
                        className="p-2 border border-solid border-black rounded-full"
                    />
                </div>
            </div>
            <div className="w-full h-[800px] text-black scale-y-100 transition-all duration-500 flex flex-col justify-between">
                <div className="text-black scale-y-100 transition-all duration-500 flex-grow flex justify-center items-center">
                    Book Loading Modal
                </div>
                <div className="bg-[#393939] p-4 rounded-bl-lg rounded-br-lg text-white flex justify-center items-center cursor-pointer">
                    <svg
                        width="75"
                        height="30"
                        viewBox="0 0 75 30"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M35.0721 0.900502L0.888989 28.7655C0.318339 29.2304 0 29.8482 0 30.4905C0 31.1329 0.318339 31.7506 0.888989 32.2155L0.927614 32.2455C1.20425 32.4717 1.53724 32.6518 1.90632 32.7748C2.27541 32.8979 2.67286 32.9614 3.07452 32.9614C3.47618 32.9614 3.87363 32.8979 4.24272 32.7748C4.6118 32.6518 4.94479 32.4717 5.22143 32.2455L37.4089 6.0055L69.5835 32.2455C69.8602 32.4717 70.1932 32.6518 70.5623 32.7748C70.9313 32.8979 71.3288 32.9614 71.7305 32.9614C72.1321 32.9614 72.5296 32.8979 72.8987 32.7748C73.2677 32.6518 73.6007 32.4717 73.8774 32.2455L73.916 32.2155C74.4866 31.7506 74.805 31.1329 74.805 30.4905C74.805 29.8482 74.4866 29.2304 73.916 28.7655L39.7329 0.900502C39.4323 0.65544 39.0707 0.460344 38.6701 0.327041C38.2695 0.193737 37.8383 0.125 37.4025 0.125C36.9667 0.125 36.5354 0.193737 36.1349 0.327041C35.7343 0.460344 35.3727 0.65544 35.0721 0.900502Z"
                            fill="white"
                        />
                    </svg>
                </div>
            </div>
        </div>
	);
};

export default Read;
