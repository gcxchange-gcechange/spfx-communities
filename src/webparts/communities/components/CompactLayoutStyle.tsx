/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import styles from './Communities.module.scss';
import { IStackTokens, Stack } from '@fluentui/react';

interface IGridLayoutProps {
    groups: any;
}


const CompactLayoutStyle: React.FunctionComponent<IGridLayoutProps> = ({groups}) => {

    const themedSmallStackTokens: IStackTokens = {
        childrenGap: "s1",
        padding: "s1",
      };
    
      const stackTokens: IStackTokens = { childrenGap: 20 };
  

    return (
    <>
    <Stack tokens={themedSmallStackTokens}>
      {groups.map((item:any) => (
          <>
          <div className={styles.compactCardContainer } >
            <a href={item.url}>
              <div >
                  <Stack horizontal verticalAlign='stretch' tokens={stackTokens}>
                    <div >
                      <img className={styles.compactCardImg} src={item.thumbnail}/>
                    </div>
                    <div>
                      <h3 className={styles.compactCardTitle}>{item.displayName}</h3>
                    </div>
                  </Stack>
              </div>
              </a>
          </div>
          </>
        ))}
      </Stack>
      </>
      );
    
}

export default CompactLayoutStyle