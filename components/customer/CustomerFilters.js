import { useState, useEffect } from "react";
import { NotificationManager } from 'react-notifications';
import Inputcomponent from "@/components/utility/Input";
import ModalComponent from '@/components/utility/Modal';
export default function CustomerFilters({
	fetchListings,
	changeFilter,
	changeType,
	changeSize,
	changeZipCode,
	changeRadius
}) {
	const [openModal, setOpenModal] = useState(false);
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


	const handleCopy = () => {
		navigator.clipboard.writeText("https://fashionpal.vercel.app/");
		NotificationManager.success('Link Copied!');
	};

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
			<ModalComponent open={openModal} width="400px" title="Share FashionPal" onClose={() => setOpenModal(false)}>

				<div className="bg-gray-200 px-4 py-2 text-center text-gray-700 rounded-lg w-full">
					https://fashionpal.vercel.app/
				</div>
				<div className="flex justify-center mt-4">
					<button
						onClick={() => handleCopy()}
						className="bg-primary px-5 py-2 rounded-xl text-white mb-2"
					>
						Copy url
					</button>
				</div>

			</ModalComponent>
			<div className="flex justify-center sm:mt-2 mt-3">
				<button
					onClick={() => setOpenModal(true)}
					className="bg-primary px-5 py-2 rounded-xl text-white mb-2"
				>
					Share FashionPal
				</button>
			</div>

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
			<ul className=" mt-2 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center sm:items-center sm:ml-2">
				<div className="mx-2 sm:mt-0 mt-3 ">
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

				<div className="mx-2 sm:mt-0 mt-3 ">
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

				<div className="mx-2 sm:mt-0 mt-3 ">
					<label className="block">Zip Code</label>
					<input
						className="sm:w-40 w-full mt-1 rounded-lg px-3 h-9 border border-gray-600"
						type="number"
						onChange={(e) => onChangeZipCode(e)}
					/>
				</div>
				<div className="mx-2 sm:mt-0 mt-3 ">
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
