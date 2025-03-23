
import React from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Calculate the range of page numbers to display
  const getPageNumbers = () => {
    const range = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than our max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // Always include first page
      range.push(1);
      
      // Calculate start and end of the middle range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning
      if (currentPage <= 3) {
        end = 4;
      }
      
      // Adjust if we're at the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }
      
      // Add ellipsis if needed before the middle range
      if (start > 2) {
        range.push(-1); // -1 represents ellipsis
      }
      
      // Add the middle range
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      
      // Add ellipsis if needed after the middle range
      if (end < totalPages - 1) {
        range.push(-2); // -2 represents ellipsis
      }
      
      // Always include last page
      range.push(totalPages);
    }
    
    return range;
  };
  
  return (
    <Pagination className="mt-4 mb-6">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }} 
            />
          </PaginationItem>
        )}
        
        {getPageNumbers().map((pageNum, index) => (
          <PaginationItem key={index}>
            {pageNum < 0 ? (
              <span className="flex h-9 w-9 items-center justify-center">...</span>
            ) : (
              <PaginationLink
                href="#"
                isActive={pageNum === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(pageNum);
                }}
              >
                {pageNum}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }} 
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
