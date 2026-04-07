import * as React from 'react';
import styles from './Communities.module.scss';

const SkeletonCard = (): JSX.Element => {

   // const sectionStackTokens: IStackTokens = { childrenGap: 20 };

    return (
        <>
                <div className={styles.cardContainer_Skeleton} > 
                    <div className={styles.cardBanner_Skeleton}>
                        <div className={styles.cardImg_Skeleton}/>
                    </div>
                    <div className={styles.cardBody}/>
                    <div className ={styles.cardFooter}/>
                </div>
        </>

    )
}

export default SkeletonCard