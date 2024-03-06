import { IButtonProps, IButtonStyles, Icon, Stack, ActionButton, DefaultButton, } from '@fluentui/react';
import * as React from 'react';
import styles from './Communities.module.scss';
import { SelectLanguage } from './SelectLanguage';
 

interface IPagingProps {
 items: number;
 itemsPerPage: number;
 prefLang: string;
 currentPage: number;
 onPageUpdate: (pageNumber: number) => void;
}

const Paging : React.FunctionComponent<IPagingProps> =  ({items, itemsPerPage, prefLang, currentPage, onPageUpdate}) => {
    
    const strings = SelectLanguage(prefLang);

    const getNumberOfPages = (): Array<number> => {
        const numberOfPages = Math.ceil(items/ itemsPerPage);
        const numbers: number[] = [];
        for (let i = 0; i < numberOfPages; i++) {
            numbers.push(i + 1);
        }
        return numbers;
    }

    const numberOfPages: number = getNumberOfPages().length;
   
    const nextDisabled: boolean = currentPage >= numberOfPages;

    const prevDisabled: boolean = currentPage < 2;

    const nextPage = ():void =>{
        const numberOfPages: number = getNumberOfPages().length;
        if (currentPage < numberOfPages) {
             onPageUpdate(currentPage + 1);
        }
    };

    const  prevPage = (): void => {
        if (currentPage > 1) {
            onPageUpdate( currentPage - 1);
        }
    };

    const goToPage = (itemNumber: number):void => {
        const pageNumber: number[]  = getNumberOfPages();
        const selected = pageNumber.indexOf(itemNumber);
         onPageUpdate(pageNumber[selected]);
    }

   const goToFirstPage = (): void => {
        const number: number = getNumberOfPages().length;
        if( number !== 1) {
          onPageUpdate(1);
        }
    }

    const goToLastPage = (): void => {
        const number: number =  currentPage;
        const lastItem = getNumberOfPages()[getNumberOfPages().length - 1];
  
        if(number !== lastItem) {
          onPageUpdate(lastItem);
        }
      }
    
    const buttonStyles: IButtonStyles = {
        root:{
          padding: '0px',
          minWidth: '30px',
          borderRadius: '50%',
          borderColor: 'transparent'

        },

        rootHovered: {
          backgroundColor: "lightgray"
        }

      };
    
    
    return (
        <Stack horizontal  horizontalAlign="center" verticalAlign="center">

        <ActionButton
          onRenderIcon={(_props: IButtonProps) => {
                  // we use the render custom icon method to render the icon consistently with the right icon
                  return (
                      <Icon iconName="DoubleChevronLeft" />
                  );
              }}
              disabled={prevDisabled}
              onClick={goToFirstPage}
              ariaLabel={strings.firstPage}/>

          <ActionButton
              onRenderIcon={(_props: IButtonProps) => {
                  // we use the render custom icon method to render the icon consistently with the right icon
                  return (
                      <Icon iconName="ChevronLeft" />
                  );
              }}
              disabled={prevDisabled}
              onClick={prevPage}
              ariaLabel={strings.pagPrev}
          >
              {strings.pagPrev}
          </ActionButton>




           {getNumberOfPages().map( itemNumber =>
            <div key={itemNumber.toString()}  tabIndex={0}   onClick={() => goToPage(itemNumber) }>{
              itemNumber === currentPage
                 ? <DefaultButton styles={buttonStyles} className={styles.currentPage} aria-label={`${strings.currentPage}, ${currentPage}`} aria-current={true}>
                  {currentPage}
                  </DefaultButton>
                 : <DefaultButton  styles={buttonStyles} id={itemNumber.toString()} aria-label={`${strings.goToPage} ${itemNumber}`} >{itemNumber}</DefaultButton>}
            </div>)}



          <ActionButton
              disabled={nextDisabled}
              onRenderMenuIcon={(_props: IButtonProps) => {
                  // we use the render custom menu icon method to render the icon to the right of the text
                  return (
                      <Icon iconName="ChevronRight" />
                  );
              }}
              onClick={nextPage}
              ariaLabel={strings.pagNext}
          >
              {strings.pagNext}
          </ActionButton>

          <ActionButton
          onRenderIcon={(_props: IButtonProps) => {
                  // we use the render custom icon method to render the icon consistently with the right icon
                  return (
                      <Icon iconName="DoubleChevronRight" />
                  );
              }}
              disabled={nextDisabled}
              onClick={goToLastPage}
              ariaLabel={strings.lastPage} />
      </Stack>
    );
}

export default Paging;