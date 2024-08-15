import { Button } from "flowbite-react";

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav>
        <ul className="flex">
          {pageNumbers.map(number => (
            <li key={number} className="mx-1">
              <Button
                gradientDuoTone="purpleToBlue"
                className={`text-center ${currentPage === number ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => paginate(number)}
              >
                {number}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  export default Pagination