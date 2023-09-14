import { useState, useEffect } from "react";
import ButtonComponent from "@/components/utility/Button";
import HeaderComponent from "@/components/utility/BusinessHeader";
const ProfileComponent = ({ }) => {
    const { user, fetchUserData } = {}

    const testData = [
        {},
        {},
        {},
    ];

    const [formData, setFormData] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetch("/api/business/updateData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: user.email, data: formData }),
            });
            fetchUserData();
        } catch (error) { }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="min-h-screen pb-8 bg-white ">
            <HeaderComponent />
            <div className="h-full flex flex-col items-center justify-center">
                <div className="max-w-xl w-full bg-whit px-4 sm:px-8 py-3 sm:py-6 rounded">

                    <form onSubmit={handleSubmit} className="">
                        <div className="py-2">
                            <label className="text-sm text-gray-700">Name of sale</label>
                            <input
                                name="name"
                                value={user?.name}
                                type="text"
                                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                                onChange={handleChange}

                            />
                        </div>

                        <div className="py-2">
                            <label className="text-sm text-gray-700">Items on sale</label>
                            <select
                                name="type"
                                value={user?.type}
                                className="bg-white focus:ring-1 focus:ring-[#ffc71f] focus:outline-none form-select border border-gray-500 w-full rounded-lg  px-3 my-1 py-2"
                                onChange={handleChange}
                            >
                                <option value="THRIFT">Thrift</option>
                                <option value="LIBRARY">Library</option>
                                <option value="BOOKSTORE">Bookstore</option>
                            </select>
                        </div>
                        <div className="py-2">
                            <label className="text-sm text-gray-700">Discount amount</label>
                            <input
                                name="discount"
                                value={user?.discount}
                                type="number"
                                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                                onChange={handleChange}
                                placeholder={
                                    user?.discount
                                        ? user.discount
                                        : ""
                                }
                            />
                        </div>
                        <div className="py-2">
                            <label className="text-sm text-gray-700">Start date</label>
                            <input
                                name="start_date"
                                value={user?.start_date}
                                type="date"
                                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                                onChange={handleChange}

                            />
                        </div>
                        <div className="py-2">
                            <label className="text-sm text-gray-700">End date</label>
                            <input
                                name="end_date"
                                value={user?.end_date}
                                type="date"
                                className="bg-white form-input focus:ring-1 focus:ring-[#ffc71f] focus:outline-none border border-gray-500 w-full rounded-lg  px-4 my-1 py-2"
                                onChange={handleChange}

                            />
                        </div>



                        <div className="mt-5">
                            <ButtonComponent rounded full type="submit">
                                Submit
                            </ButtonComponent>
                        </div>


                    </form>

                </div>

            </div>
            <div>
                <h3 className="text-xl text-center font-medium text-primary">Upcoming Sales</h3>
                <div className="sm:flex flex-wrap justify-center mt-2">



                    {testData.map((row, index) => {
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

                </div>
            </div>
            <div className="mt-12">
                <h3 className="text-xl text-center font-medium text-primary">Current Sales</h3>
                <div className="sm:flex flex-wrap justify-center mt-2">



                    {testData.map((row, index) => {
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

                </div>
            </div>
        </div>
    );
};

export default ProfileComponent;
