import { ActionIcon, Table } from "@mantine/core";
import { useTableDataContext } from "../context/TableDataContext";
import { Delete } from "../assets/svg/delete";
import { DeleteBookRow } from "@/pages/business";

export interface Rows {
  title: string;
  author: string;
  isbn: string;
  format: string;
  image_url: string;
}

interface ContentTableProps {
  deleteBookRow: DeleteBookRow;
  isSale: boolean;
}

const TableHead = () => {
  return (
    <thead className="text-base font-semibold text-gray-700   ">
      <tr>
        <th
          scope="col"
          className=" border-2 border-[rgb(222, 226, 230)] px-6 py-3"
        >
          Title
        </th>
        <th
          scope="col"
          className=" border-2 border-[rgb(222, 226, 230)] px-6 py-3"
        >
          Author
        </th>
        <th
          scope="col"
          className=" border-2 border-[rgb(222, 226, 230)] px-6 py-3"
        >
          ISBN
        </th>
        <th
          scope="col"
          className=" border-2 border-[rgb(222, 226, 230)] px-6 py-3"
        ></th>
      </tr>
    </thead>
  );
};

const TableBody: React.FC<ContentTableProps> = ({ deleteBookRow, isSale }) => {
  const { tableData, bookSaleTableData } = useTableDataContext();

  const tableHandler = () => {
    return isSale ? bookSaleTableData : tableData;
  };

  const handleDelete = (ISBN: string) => deleteBookRow(ISBN);

  return (
    <tbody className="border-2 text-gray-700 text-xs sm:text-sm font-light border-[rgb(222, 226, 230)]">
      {tableHandler().rows.map((row) => (
        <tr className=" border-b  " key={row.isbn}>
          <td className="border-2 border-[rgb(222, 226, 230)] px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
            {row?.title}
          </td>
          <td className="border-2 border-[rgb(222, 226, 230)] px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
            {row?.author}
          </td>
          <td className="border-2 border-[rgb(222, 226, 230)] px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
            {row?.isbn}
          </td>
          <td className="border-2 border-[rgb(222, 226, 230)] px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
            <ActionIcon onClick={() => handleDelete(row?.isbn)}>
              <Delete />
            </ActionIcon>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

const ContentTable: React.FC<ContentTableProps> = ({
  deleteBookRow,
  isSale,
}) => {
  return (
    <div className="relative mt-6 overflow-x-auto">
      <table className="w-full rounded-lg border-2 border-[rgb(222, 226, 230)]  text-sm text-left text-gray-500 ">
        <TableHead />
        <TableBody isSale={isSale} deleteBookRow={deleteBookRow} />
      </table>
    </div>
  );
};

export default ContentTable;
