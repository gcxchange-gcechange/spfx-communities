/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { GridLayout } from "@pnp/spfx-controls-react/lib/GridLayout";
import { ISize, Stack } from '@fluentui/react';
import styles from './Communities.module.scss';

interface IGridLayoutProps {
    items: any;
}


const GridLayoutStyle: React.FunctionComponent<IGridLayoutProps> = ({items}) => {

   


    const onRenderGridItem = (item: any, finalSize: ISize, isCompact: boolean): JSX.Element => {

        const { width, height } = finalSize; 

        const itemWidth = width / 1;
        const itemHeight = height / 1;

        return (
            <>
            <div style={{ width: itemWidth, height: itemHeight }}>
                <div className={styles.cardContainer } >
                    <a href={item.url}>
                        <div className={styles.cardBanner}>
                            <img className={styles.cardImg} src={item.thumbnail}/>
                        </div>
                        <div className={styles.cardBody}>
                            <h3 className={styles.cardTitle}>{item.displayName}</h3>
                            <p className={styles.cardDescription}>{item.description}</p>
                        </div>
                        <div className ={styles.cardFooter}>
                            <Stack horizontal horizontalAlign='space-between'>
                                <div>
                                    <p style={{margin:'0'}}><strong>Members </strong>{item.members}</p>
                                    <p ><strong>Views</strong> {item.views}</p>
                                </div>
                                <div>
                                    <p style={{margin:'0'}}><strong>Created</strong> {new Date(item.createdDateTime).toLocaleDateString("en-CA")}</p>
                                    <p><strong>Last modified</strong> {item.modified}</p>
                                </div>
                            </Stack>
                        </div>
                    </a>
                </div>
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