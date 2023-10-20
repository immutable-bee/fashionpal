import { useState, useEffect } from "react";
import ButtonComponent from "@/components/utility/Button";
import HeaderComponent from "@/components/utility/BusinessHeader";
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import DeleteModalComponent from "@/components/utility/DeleteModalComponent";
import DatePicker from "react-datepicker";
import Select from 'react-select';

import Loading from "@/components/utility/loading";
import { NotificationManager } from 'react-notifications';
import moment from 'moment'
const ProfileComponent = ({ }) => {
    const [loadingUpcomingSales, setLoadingUpcomingSales] = useState(false);
    const [loadingCurrentSales, setLoadingCurrentSales] = useState(false);
    const [submittingSale, setSubmittingSale] = useState(false);

    const [data, setData] = useState({
        name: '',

        discount_amount: '',
        start_date: '',
        end_date: '',
    })

    const [selectedItems, setSelectedItems] = useState([]);

    const options = [
        { value: 'Clothing', label: 'Clothing' },
        { value: 'Footwear', label: 'Footwear' },
        { value: 'HATS', label: 'HATS' }
    ];




    const [currentSales, setCurrentSales] = useState([]);
    const [upcomingSales, setUpcomingSales] = useState([]);

    const handleItemChange = (selectedOptions) => {
        setSelectedItems(selectedOptions);
    }

    const handleStartDateChange = (date) => {
        setData(prevData => ({ ...prevData, start_date: date }));
    };

    // Custom handler for end date
    const handleEndDateChange = (date) => {
        setData(prevData => ({ ...prevData, end_date: date }));
    };

    const fetchSales = async (type) => {
        if (type === 'current') {
            setLoadingCurrentSales(true);
        } else {
            setLoadingUpcomingSales(true);
        }

        try {
            const res = await fetch(`/api/fetch-sales?type=${type}`);
            if (res.status === 200) {
                const sales = await res.json();
                return sales;
            } else {
                const errorMessage = await res.text();
                console.error(`Fetch failed with status: ${res.status}, message: ${errorMessage}`);
            }
        } catch (error) {
            console.error('An error occurred while fetching sales:', error);
        } finally {
            setLoadingUpcomingSales(false);
            setLoadingCurrentSales(false);
        }
    };

    const loadSales = async () => {
        const current = await fetchSales("current");
        setCurrentSales(current);

        const upcoming = await fetchSales("upcoming");
        setUpcomingSales(upcoming);
    };

    useEffect(() => {
        loadSales();
    }, []);




    const handleChange = (e) => {
        const { name, value } = e.target;

        setData({ ...data, [name]: value });
    };

    const onAddSale = async () => {
        if (moment(data.end_date).isBefore(moment(data.start_date))) {
            NotificationManager.error('End Date cannot be before Start Date!');
            return;
        }


        if (!data.name) {
            NotificationManager.error('Name is required!')
            return
        } else
            if (!selectedItems.length) {
                NotificationManager.error('Item is required!')
                return
            } else
                if (!data.discount_amount) {
                    NotificationManager.error('Discount Amount is required!')
                    return
                } else
                    if (!data.start_date) {
                        NotificationManager.error('Start Date is required!')
                        return
                    } else
                        if (!data.end_date) {
                            NotificationManager.error('End Date is required!')
                            return
                        }
        setSubmittingSale(true);
        const newSelectedItems = selectedItems.map(option => option.value);

        try {
            const res = await axios.post('/api/add-sale', {
                name: data.name,
                items: newSelectedItems,
                discount_amount: data.discount_amount,
                start_date: new Date(data.start_date).toISOString(),
                end_date: new Date(data.end_date).toISOString(),
            })

            NotificationManager.success('Sale added successfully!')
            setData({
                name: '',
                item: '',
                discount_amount: '',
                start_date: '',
                end_date: '',
            })

            setSelectedItems([])
            loadSales()

        } catch (error) {
            console.error('An error occurred while edit listing:', error);
        } finally {
            setSubmittingSale(false);
        }
    };

    return (
        <div className="min-h-screen pb-8 bg-white ">
            <HeaderComponent />
            <div className="h-full flex flex-col items-center justify-center">
                <div className="max-w-xl w-full bg-whit px-4 sm:px-8 py-3 sm:py-6 rounded">

                    <div className="sm:w-[500px] w-[90vw]">
                        <div className="py-2">
                            <label className="text-sm text-gray-700 block">Name of sale</label>
                            <input
                                name="name"
                                value={data?.name}
                                type="text"
                                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 sm:w-[500px] w-[90vw] rounded-lg  px-4 my-1 py-2"
                                onChange={handleChange}

                            />
                        </div>

                        <div className="py-2">
                            <label className="text-sm text-gray-700 block">Items on sale</label>
                            <Select
                                isMulti
                                name="item"
                                options={options}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                value={selectedItems}
                                onChange={handleItemChange}
                            />

                        </div>
                        <div className="py-2">
                            <label className="text-sm text-gray-700 block">Discount amount</label>
                            <input
                                name="discount_amount"
                                value={data?.discount_amount}
                                type="text"
                                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 sm:w-[500px] w-[90vw] rounded-lg  px-4 my-1 py-2"
                                onChange={handleChange}

                            />
                        </div>
                        <div className="py-2">
                            <label className="text-sm block text-gray-700">Start date</label>
                            <div className="relative">
                                <DatePicker
                                    selected={data.start_date}
                                    onChange={handleStartDateChange}
                                    dateFormat="yyyy/MM/dd"
                                    className="bg-white sm:w-[500px] w-[90vw] form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 rounded-lg  px-4 my-1 py-2"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 absolute right-3 top-3 pointer-events-none">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                </svg>
                            </div>
                        </div>
                        <div className="py-2 w-full">
                            <label className="text-sm block text-gray-700">End date</label>
                            <div className="relative">
                                <DatePicker
                                    selected={data.end_date}
                                    onChange={handleEndDateChange}
                                    minDate={data.start_date}
                                    dateFormat="yyyy/MM/dd"
                                    className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 sm:w-[500px] w-[90vw] rounded-lg bg-transparent  px-4 my-1 py-2 "
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 absolute right-3 top-3 z-0 pointer-events-none">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                </svg>
                            </div>

                        </div>
                        {/* <div className="py-2">
                            <label className="text-sm text-gray-700 block">Start date</label>
                            <input
                                name="start_date"
                                value={data?.start_date}
                                type="date"
                                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 sm:w-[500px] w-[90vw] rounded-lg  px-4 my-1 py-2"
                                onChange={handleChange}

                            />
                        </div>
                        <div className="py-2">
                            <label className="text-sm text-gray-700 block">End date</label>
                            <input
                                name="end_date"
                                value={data?.end_date}
                                type="date"
                                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 sm:w-[500px] w-[90vw] rounded-lg  px-4 my-1 py-2"
                                onChange={handleChange}

                            />
                        </div> */}



                        <div className="mt-5">
                            <ButtonComponent loading={submittingSale} onClick={onAddSale} rounded full type="submit">
                                Submit
                            </ButtonComponent>
                        </div>


                    </div>

                </div>

            </div>

            <div className="">
                <h3 className="text-xl text-center font-medium text-primary">Current Sales</h3>
                {loadingCurrentSales ? (
                    <div className="sm:flex justify-center pb-10">
                        <div>

                            <div className="pt-2.5 mt-10">
                                <Loading size="xl" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        {currentSales.length !== 0 ? <div className="sm:flex flex-wrap justify-center mt-2">

                            {currentSales.map((row, index) => {
                                return (
                                    <div
                                        className="px-4 py-4 relative rounded-2xl sm:mx-3 sm:my-3 my-5 w-full sm:sm:w-[500px]  shadow-lg"
                                        style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
                                        key={row.id}
                                    >
                                        <DeleteModalComponent title='Are you sure you want to delete sale?' onConfirmed={() => alert('not integrated yet')}>
                                            <button className=" hover:text-red-600 text-red-500  absolute top-3 right-3 z-10">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>

                                            </button>
                                        </DeleteModalComponent>
                                        <div
                                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                        >
                                            <span className="w-1/2">Business name:</span> <span className="w-1/2">FashionPal</span>
                                        </div>
                                        <div
                                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                        >
                                            <span className="w-1/2">Name of sale:</span> <span className="w-1/2">{row.name}</span>
                                        </div>
                                        <div
                                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                        >
                                            <span className="w-1/2">Type of items on sale:</span> <span className="w-1/2">{row.items}</span>
                                        </div>
                                        <div
                                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                        >
                                            <span className="w-1/2">Discount amount:</span> <span className="w-1/2">{row.discount_amount}</span>
                                        </div>
                                        <div
                                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                        >
                                            <span className="w-1/2">Start date:</span> <span className="w-1/2">{moment(row.start_date).format('YYYY/MM/DD')}</span>
                                        </div>
                                        <div
                                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                        >
                                            <span className="w-1/2">End date:</span> <span className="w-1/2">  {moment(row.end_date).format('YYYY/MM/DD')}</span>
                                        </div>
                                        <div
                                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                        >
                                            <span className="w-1/2">Created at:</span> <span className="w-1/2">   {moment(row.createdAt).fromNow()}</span>
                                        </div>

                                    </div>

                                );
                            })}

                        </div> :
                            <h3 className="text-center text-lg mt-5">
                                No Current Sales
                            </h3>}

                    </div>
                )}
            </div>

            <div className="mt-12">
                <h3 className="text-xl text-center font-medium text-primary">Upcoming Sales</h3>
                {loadingUpcomingSales ? (
                    <div className="sm:flex justify-center pb-10">
                        <div>

                            <div className="pt-2.5 mt-10">
                                <Loading size="xl" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        {upcomingSales.length !== 0 ? <div className="sm:flex flex-wrap justify-center mt-2">

                            {upcomingSales.map((row, index) => {
                                return (
                                    <div
                                        className="px-4 py-4 relative rounded-2xl sm:mx-3 sm:my-3 my-5 w-full sm:sm:w-[500px]  shadow-lg"
                                        style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
                                        key={row.id}
                                    >
                                        <DeleteModalComponent title='Are you sure you want to delete sale?' onConfirmed={() => alert('not integrated yet')}>
                                            <button className=" hover:text-red-600 text-red-500  absolute top-3 right-3 z-10">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>

                                            </button>
                                        </DeleteModalComponent>
                                        <div
                                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                        >
                                            <span className="w-1/2">Business name:</span> <span className="w-1/2">FashionPal</span>
                                        </div>
                                        <div
                                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                        >
                                            <span className="w-1/2">Name of sale:</span> <span className="w-1/2">{row.name}</span>
                                        </div>
                                        <div
                                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                        >
                                            <span className="w-1/2">Type of items on sale:</span> <span className="w-1/2">{row.items}</span>
                                        </div>
                                        <div
                                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                        >
                                            <span className="w-1/2">Discount amount:</span> <span className="w-1/2">{row.discount_amount}</span>
                                        </div>
                                        <div
                                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                        >
                                            <span className="w-1/2">Start date:</span> <span className="w-1/2">{moment(row.start_date).format('YYYY/MM/DD')}</span>
                                        </div>
                                        <div
                                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                        >
                                            <span className="w-1/2">End date:</span> <span className="w-1/2">  {moment(row.end_date).format('YYYY/MM/DD')}</span>
                                        </div>
                                        <div
                                            className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                        >
                                            <span className="w-1/2">Created at:</span> <span className="w-1/2">   {moment(row.createdAt).fromNow()}</span>
                                        </div>

                                    </div>

                                );
                            })}

                        </div> :
                            <h3 className="text-center text-lg mt-5">
                                No Upcoming Sales
                            </h3>
                        }
                    </div>
                )}
            </div>


        </div>
    );
};

export default ProfileComponent;
