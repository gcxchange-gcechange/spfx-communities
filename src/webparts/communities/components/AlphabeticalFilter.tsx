import { IPivotStyles, Pivot, PivotItem } from '@fluentui/react';
import * as React from 'react';
import  styles from './Communities.module.scss'
 

interface IAlphabeticalFilterProps {
    selectedLetter: string;
    onSelectLetter: (letter: string) => void;
 
}

const AlphabeticalFilter: React.FC<IAlphabeticalFilterProps> = (props) => {

    const { selectedLetter } = props;

    const arrayAtoZ = (): string[] => {
        const navitems: string[] = [];
        for (let i = 65; i < 91; i++) {
          navitems.push(String.fromCharCode(i));
        }
        navitems.push(String.fromCharCode(35));
        return navitems;
      };
    

    const combinedIndex = arrayAtoZ();

    const _handleSelectedLetter = (item: PivotItem):void => {
        const letter: string = item.props.headerText || "A";

        props.onSelectLetter(letter);
    }

    const pivotStyles: Partial<IPivotStyles> = {
        link:{
            backgroundColor:'#e3e1e1',
        },

        root:{
            color:'black',
            marginTop:'20px',
            marginBottom: '20px',
        },

        linkIsSelected:{
            color: 'white'
        }
    }


    return (
        <Pivot styles={pivotStyles} className={styles.letter} onLinkClick={_handleSelectedLetter} selectedKey={selectedLetter} linkFormat='tabs'  linkSize='normal' >
        {combinedIndex.map((letter: string, index: number) => {
             return (
               <PivotItem
                 key={index}
                 itemKey={letter}
                 headerText={letter}
                 headerButtonProps={{'data-title': `${letter}`}}
               />
             );
           })}
           </Pivot>
    )

}

export default AlphabeticalFilter;