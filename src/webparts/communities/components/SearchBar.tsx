import { SearchBox } from '@fluentui/react';
import * as React from 'react';
//import styles from './Communities.module.scss';

interface ISearchBarProps {
 items: number;
 itemsPerPage: number;
 prefLang: string;
 currentPage: number;
 onSearchText: (newValue: string) => void;
 
}


const SearchBar : React.FunctionComponent<ISearchBarProps> =  ({items, itemsPerPage, prefLang, currentPage, onSearchText }) => {

    const onSearch = (value: string) : void => {
        onSearchText(value)
    }

    return (
        <>
            <SearchBox
                placeholder='Search'
                onSearch={onSearch}
            />
        </>
    )
}

export default SearchBar;