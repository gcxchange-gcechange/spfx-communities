/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { GridLayout } from "@pnp/spfx-controls-react/lib/GridLayout";
import { ISize } from '@fluentui/react';
import styles from './Communities.module.scss';

interface IGridLayoutProps {
    items: any;
}


const GridLayoutStyle: React.FunctionComponent<IGridLayoutProps> = ({items}) => {


    const onRenderGridItem = (item: any, finalSize: ISize, isCompact: boolean): JSX.Element => {

        return (
            <>
            <div className={styles.cardContainer } key={item.id}>
                <div className={styles.cardBanner}>
                    <img className={styles.cardImg} src={item.thumbnail}
                     alt={`${item.displayName}`}/> 
                </div>
                <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{item.displayName}</h3>
                    <p className={styles.cardDescription}>{item.description}</p>
                </div>
                <div className ={styles.cardFooter}>Footer</div>
            </div>


            </>
        )
    }

    



    return (
        <GridLayout
            items={items} 
            onRenderGridItem={(item: any, finalSize: ISize, isCompact: boolean) => onRenderGridItem(item, finalSize, isCompact)}
        />
    );
}

export default GridLayoutStyle