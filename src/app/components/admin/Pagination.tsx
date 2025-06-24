export default function Pagination({ 
  page, 
  setPage, 
  totalPages,
  totalItems
}: { 
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  totalItems: number;
}) {
  return (
    <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">1</span> to{" "}
        <span className="font-medium">{totalItems}</span> of{" "}
        <span className="font-medium">{totalItems}</span> results
      </div>
      <div className="flex space-x-2">
        <button
          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-3 py-1 text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}