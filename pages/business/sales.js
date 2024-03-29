import { useCallback, useEffect, useState } from "react";
import CreateNewRule from "@/components/scoped/CreateNewRule";
import Rules from "@/components/scoped/Rules";
import Head from "next/head";

const RePricer = () => {
  const [addRule, setAddRule] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`/api/categories/list`);
      const response = await res.json();
      setCategoryList(response);
    } catch (error) {}
  }, []);

  useEffect(() => {
    const initialFetch = async () => {
      await fetchCategories();
    };
    initialFetch();
  }, []);

  return (
    <div className="sm:w-[24rem] mx-auto mt-4 mb-7 ">
      <Head>
        <title>Sales</title>
      </Head>
      <>
        {addRule ? (
          <CreateNewRule
            onBack={() => setAddRule(false)}
            categoryList={categoryList}
          />
        ) : (
          <div>
            <div className="flex justify-between items-center">
              <h1 class="text-2xl mt-1">Rules</h1>
              <button
                onClick={() => setAddRule(true)}
                className={`bg-primary text-white duration-250 ease-in-out rounded-xl px-4 sm:px-4 text-base py-1.5 sm:py-1.5  border border-gray-300`}
              >
                Create rule
              </button>
            </div>
            <Rules categoryList={categoryList} />
          </div>
        )}
      </>
    </div>
  );
};

export default RePricer;
