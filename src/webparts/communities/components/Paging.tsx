import * as React from 'react';
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
 

interface IPagingProps {
 items: number;
 itemsPerPage: number;
}

const Paging : React.FunctionComponent<IPagingProps> =  ({items, itemsPerPage}) => {
    
    console.log("ITEMS:",items);
    console.log("NPERPAGE:",itemsPerPage);

    const getNumberOfPages = Math.ceil(items/ itemsPerPage);
    console.log("getPages:", getNumberOfPages);

    const getPage = (page: number):void =>{
        console.log('Page:', page);
      }
    
    
    return (
        <Pagination
        currentPage={1}
        totalPages={getNumberOfPages} 
        onChange={getPage}
        limiter={1} // Optional - default value 3
        // hideFirstPageJump // Optional
        // hideLastPageJump // Optiona
        //limiterIcon={ } // Optional
        />
    );
}

export default Paging;