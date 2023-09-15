import { useState, useEffect } from "react";
import Inputcomponent from "@/components/utility/Input";
import ShareFashionPal from '@/components/customer/ShareFashionPal';
export default function CustomerFilters({
	fetchListings,
	changeFilter,
	changeType,
	changeSize,
	changeZipCode,
	changeRadius
}) {

	const [showFilters, setShowFilters] = useState(false);


	const [filter, setFilter] = useState("");

	const [zipCode, setZipCode] = useState('');
	const [radius, setRadius] = useState('');
	const [size, setSize] = useState('');
	const [type, setType] = useState('');
	const [sizes, setSizes] = useState([
		{ value: 'XS', type: '' },
		{ value: 'S', type: '' },
		{ value: 'M', type: '' },
		{ value: 'L', type: '' },
		{ value: 'XL', type: '' },
		{ value: 'XXL', type: '' },
		{ value: 1, type: 'Footwear' },
		{ value: 2, type: 'Footwear' },
		{ value: 3, type: 'Footwear' },
		{ value: 4, type: 'Footwear' },
		{ value: 5, type: 'Footwear' },
		{ value: 6, type: 'Footwear' },
		{ value: 7, type: 'Footwear' },
		{ value: 8, type: 'Footwear' },
		{ value: 9, type: 'Footwear' },
		{ value: 10, type: 'Footwear' },
		{ value: 11, type: 'Footwear' },
		{ value: 12, type: 'Footwear' },
		{ value: 13, type: 'Footwear' },
		{ value: 14, type: 'Footwear' },
		{ value: 15, type: 'Footwear' },
	])



	const onChangeFilter = (e) => {
		const value = e.target.value
		setFilter(value)
		changeFilter(value)
	}
	const onChangeType = (e) => {
		const value = e.target.value
		setType(value)
		changeType(value)
	}
	const onChangeSize = (e) => {
		const value = e.target.value
		setSize(value)
		changeSize(value)
	}
	const onChangeZipCode = (e) => {
		const value = e.target.value
		setZipCode(value)
		changeZipCode(value)
	}
	const onChangeRadius = (e) => {
		const value = e.target.value
		setRadius(value)
		changeRadius(value)
	}

	return (
		<div>

			<ShareFashionPal />
			<div class=" flex justify-between px-5 max-w-7xl mx-auto">
				<Inputcomponent
					value={filter}
					onChange={(e) => onChangeFilter(e)}
				/>

				<div className="flex flex-shrink-0 items-center justify-end">
					<div className="ml-2 sm:ml-3">
						<button
							type="button"
							class="bg-primary px-3 sm:px-4 py-3 sm:py-4 rounded-[0.65rem] sm:rounded-[0.85rem]"
							onClick={() => fetchListings()}
						>
							<div>
								<svg
									class="text-white w-4"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
									/>
								</svg>
							</div>
						</button>
					</div>
				</div>
			</div>
			<ul className=" mt-2 flex flex-wrap sm:justify-center sm:items-center sm:ml-2">
				<div className="px-2 w-[50%] sm:w-auto sm:mt-0 mt-3 ">
					<label className="block">Apparel</label>
					<select
						className="sm:w-40 w-full mt-1 rounded-lg px-3 h-9 border border-gray-600"
						onChange={(e) => onChangeType(e)}
					>
						<option value="">All</option>
						<option value="Clothing">Clothing</option>
						<option value="Footwear">Footwear</option>
						<option value="Hats">Hats</option>
					</select>
				</div>

				<div className="px-2 w-[50%] sm:w-auto sm:mt-0 mt-3 ">
					<label className="block">Size</label>
					<select
						className="sm:w-40 w-full mt-1 rounded-lg px-3 h-9 border border-gray-600"
						onChange={(e) => onChangeSize(e)}
					>
						<option value="">All</option>
						{sizes
							.filter((x) =>
								type === "Footwear"
									? x.type === "Footwear"
									: x.type !== "Footwear"
							)
							.map((x) => (
								<option key={x.value} value={x.value}>
									{x.value}
								</option>
							))}
					</select>
				</div>
				{/* Button to toggle filters visibility */}

				<div className={`flex sm:hidden justify-center w-full mt-3 ${showFilters ? '!hidden' : ''}`}>
					<button
						className="mb-3 flex items-center text-blue-600 border-b border-blue-600"
						onClick={() => setShowFilters(!showFilters)}
					>
						More Filters
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ml-1">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
						</svg>

					</button>
				</div>

				{/* Conditional rendering of filters based on state */}

				<div className={`px-2 w-[50%] sm:w-auto sm:mt-0 mt-3 sm:block hidden ${showFilters ? '!block' : ''}`}>
					<label className="block">Zip Code</label>
					<input
						className="sm:w-40 w-full mt-1 rounded-lg px-3 h-9 border border-gray-600"
						type="number"
						onChange={(e) => onChangeZipCode(e)}
					/>
				</div>
				<div className={`px-2 w-[50%] sm:w-auto sm:mt-0 mt-3 sm:block hidden ${showFilters ? '!block' : ''}`}>
					<label className="block">Mile Radius</label>
					<select
						className="sm:w-40 w-full mt-1 rounded-lg px-3 h-9 border border-gray-600"
						onChange={(e) => onChangeRadius(e)}
					>
						<option value="">All</option>
						<option value="25">25 miles</option>
						<option value="50">50 miles</option>
						<option value="100">100 miles</option>
						<option value="200">200 miles</option>
					</select>

				</div>

			</ul>
		</div>
	);
}
