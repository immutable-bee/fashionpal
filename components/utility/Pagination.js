import { usePagination, DOTS } from './usePagination';

function Pagination({ total, current, pageSize, siblingCount, onChange, align = 'center' }) {
  const paginationRange = usePagination({ total, current, siblingCount, pageSize });
  const alignMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  }
  if (!paginationRange) return null;

  return (
    <nav className="py-2">
      <ul className={`flex items-center ${alignMap[align]}`} >

        <button
          className={`mx-1 flex justify-center items-center text-sm w-9 h-9 DOTS-xl bg-white border-2 border-gray-300 hover:bg-gray-100 cursor-pointer ${current === 1 ? ' opacity-50 pointer-events-none' : ''}`}
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>

        </button>

        {
          paginationRange.map((page, idx) => {
            if (page === DOTS) {
              return <li key={idx} className="mx-2">...</li>
            }

            return (
              <button
                key={idx}
                className={`mx-1 flex justify-center items-center text-sm w-9 h-9 rounded-xl  ${page === current ? 'bg-sky-600 text-white' : 'bg-white border-2 border-gray-300 hover:bg-gray-100 cursor-pointer'}`}
                onClick={() => onChange(page)}
              >
                {page}
              </button>
            );
          })
        }

        <button
          className={`mx-1 flex justify-center items-center text-sm w-9 h-9 rounded-xl bg-white border-2 border-gray-300 hover:bg-gray-100 cursor-pointer ${current === Math.ceil(total / pageSize) ? ' opacity-50 pointer-events-none' : ''}`}
          onClick={() => onChange(current + 1)}
          disabled={current === Math.ceil(total / pageSize)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>

        </button>
      </ul>
    </nav>
  );
}

export default Pagination;
