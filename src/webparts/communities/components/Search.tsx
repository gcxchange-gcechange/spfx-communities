/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
//import styles from "./Communities.module.scss";

interface ISearchProps {
  groups: any;
  prefLang: string;
}

const SearchFilter: React.FunctionComponent<ISearchProps> = ( ) => {

    const onSearch = () => {
        console.log("hello")
    }



    return (
        <div>
            <input type="search" id="siteSearch" />
            <button onClick={onSearch}>Search</button>
        </div>
    );

}

export default SearchFilter;
