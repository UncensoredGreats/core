import React from "react";
import Row from "./Row";
import { useAppSelector } from "@/store/hooks/useAppSelector";

const List = () => {
    const {data} =useAppSelector(state=>state.portal)
	return (
        <div className="transition duration-300">
            <div className="flex items-start mt-6 justify-center border rounded overflow-x-auto h-auto">
                <table className="w-full text-sm text-left text-gray-500 h-full">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr>
                            <th scope="col" className="py-3 px-6"></th>
                            <th scope="col" className="py-3 px-6">
                                Title
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Author
                            </th>
                            <th scope="col" className="py-3 px-6 text-center">
                                Status
                            </th>
                            <th scope="col" className="py-3 px-6 text-center">
                                Data
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.items.map((book: any, index: number) => (
                            <Row bookData={book} key={index} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
	);
};

export default List;
