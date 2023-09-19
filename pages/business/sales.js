import { useState, useEffect } from "react";
import ButtonComponent from "@/components/utility/Button";
import HeaderComponent from "@/components/utility/BusinessHeader";
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import moment from 'moment'
const ProfileComponent = ({ }) => {
    const [data, setData] = useState({
        name: '',
        item: '',
        discount_amount: 0,
        start_date: '',
        end_date: '',
    })
    const [uploading, setUploading] = useState(false);
    const testData = [
        {},
        {},
        {},
    ];


    const [currentSales, setCurrentSales] = useState([]);
    const [upcomingSales, setUpcomingSales] = useState([]);

    const fetchSales = async (type) => {
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
        }
    };


    useEffect(() => {
        (async () => {
            const current = await fetchSales("current");
            setCurrentSales(current);

            const upcoming = await fetchSales("upcoming");
            setUpcomingSales(upcoming);
        })();
    }, []);



    const handleChange = (e) => {
        const { name, value } = e.target;

        setData({ ...data, [name]: value });
    };

    const onAddSale = async () => {
        if (!data.name) {
            NotificationManager.error('Name is required!')
        } else
            if (!data.item) {
                NotificationManager.error('Item is required!')
            } else
                if (!data.discount_amount) {
                    NotificationManager.error('Discount Amount is required!')
                } else
                    if (!data.start_date) {
                        NotificationManager.error('Start Date is required!')
                    } else
                        if (!data.end_date) {
                            NotificationManager.error('End Date is required!')
                        }
        try {
            const res = await axios.post('/api/add-sale', {
                name: data.name,
                item: data.item,
                discount_amount: Number(data.discount_amount),
                start_date: new Date(data.start_date).toISOString(),
                end_date: new Date(data.end_date).toISOString(),
            })

            NotificationManager.success('Sale added successfully!')
            setData({
                name: '',
                item: '',
                discount_amount: 0,
                start_date: '',
                end_date: '',
            })
        } catch (error) {
            console.error('An error occurred while edit listing:', error);
        }
    };

    return (
        <div className="min-h-screen pb-8 bg-white ">
            <HeaderComponent />
            <div className="h-full flex flex-col items-center justify-center">
                <div className="max-w-xl w-full bg-whit px-4 sm:px-8 py-3 sm:py-6 rounded">

                    <div className="">
                        <div className="py-2">
                            <label className="text-sm text-gray-700">Name of sale</label>
                            <input
                                name="name"
                                value={data?.name}
                                type="text"
                                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                                onChange={handleChange}

                            />
                        </div>

                        <div className="py-2">
                            <label className="text-sm text-gray-700">Items on sale</label>
                            <select
                                name="item"
                                value={data?.item}
                                className="bg-white focus:ring-1 focus:ring-[#ffc71f] focus:outline-none form-select border border-gray-500 w-full rounded-lg  px-3 my-1 py-2"
                                onChange={handleChange}
                            >
                                <option value="" disabled>Select Item</option>
                                <option value="THRIFT">Thrift</option>
                                <option value="LIBRARY">Library</option>
                                <option value="BOOKSTORE">Bookstore</option>
                            </select>
                        </div>
                        <div className="py-2">
                            <label className="text-sm text-gray-700">Discount amount</label>
                            <input
                                name="discount_amount"
                                value={data?.discount_amount}
                                type="number"
                                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                                onChange={handleChange}

                            />
                        </div>
                        <div className="py-2">
                            <label className="text-sm text-gray-700">Start date</label>
                            <input
                                name="start_date"
                                value={data?.start_date}
                                type="date"
                                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                                onChange={handleChange}

                            />
                        </div>
                        <div className="py-2">
                            <label className="text-sm text-gray-700">End date</label>
                            <input
                                name="end_date"
                                value={data?.end_date}
                                type="date"
                                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                                onChange={handleChange}

                            />
                        </div>



                        <div className="mt-5">
                            <ButtonComponent onClick={onAddSale} rounded full type="submit">
                                Submit
                            </ButtonComponent>
                        </div>


                    </div>

                </div>

            </div>

            <div>
                <h3 className="text-xl text-center font-medium text-primary">Upcoming Sales</h3>
                {upcomingSales.length !== 0 ? <div className="sm:flex flex-wrap justify-center mt-2">



                    {upcomingSales.map((row, index) => {
                        return (
                            <div
                                className="px-4 py-4 relative rounded-2xl sm:mx-3 sm:my-3 my-5 w-full sm:w-96 shadow-lg"
                                style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
                                key={row.id}
                            >


                                <div
                                    className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                    <span className="w-1/2">Business name:</span> <span className="w-1/2">Softronet Inc</span>
                                </div>
                                <div
                                    className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                    <span className="w-1/2">Name of sale:</span> <span className="w-1/2">Summer sale</span>
                                </div>
                                <div
                                    className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                    <span className="w-1/2">Type of items on sale:</span> <span className="w-1/2">Cloths, Footware</span>
                                </div>
                                <div
                                    className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                    <span className="w-1/2">Discount amount:</span> <span className="w-1/2">$50</span>
                                </div>
                                <div
                                    className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                    <span className="w-1/2">Start date:</span> <span className="w-1/2">14th sep 2021</span>
                                </div>
                                <div
                                    className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                    <span className="w-1/2">End date:</span> <span className="w-1/2">11th oct 2022</span>
                                </div>

                            </div>

                        );
                    })}

                </div> : 'No Upcoming Sales'}
            </div>

            <div className="mt-12">
                <h3 className="text-xl text-center font-medium text-primary">Current Sales</h3>
                {upcomingSales.length !== 0 ? <div className="sm:flex flex-wrap justify-center mt-2">

                    {currentSales.map((row, index) => {
                        return (
                            <div
                                className="px-4 py-4 relative rounded-2xl sm:mx-3 sm:my-3 my-5 w-full sm:w-96 shadow-lg"
                                style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)' }}
                                key={row.id}
                            >
                                <div
                                    className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                    <span className="w-1/2">Business name:</span> <span className="w-1/2">BiblioPal</span>
                                </div>
                                <div
                                    className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                    <span className="w-1/2">Name of sale:</span> <span className="w-1/2">{row.name}</span>
                                </div>
                                <div
                                    className={`text-gray-800 font-light bg-white rounded px-2 py-1 w-full flex text-base leading-5 !mt-1.5`}
                                >
                                    <span className="w-1/2">Type of items on sale:</span> <span className="w-1/2">{row.item}</span>
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

                            </div>

                        );
                    })}

                </div> : 'No Current Sales'}
            </div>
        </div>
    );
};

export default ProfileComponent;
