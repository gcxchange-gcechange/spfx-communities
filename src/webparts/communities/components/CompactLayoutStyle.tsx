/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import styles from './Communities.module.scss';
import { IStackTokens, Stack, StackItem } from '@fluentui/react';

interface IGridLayoutProps {
    groups: any;
    seeAllLink: string;
    groupsPerPage: number;
    totalGroups: any[];
}


const CompactLayoutStyle: React.FunctionComponent<IGridLayoutProps> = ({groups, seeAllLink, groupsPerPage, totalGroups}) => {

    const themedSmallStackTokens: IStackTokens = {
        childrenGap: "s1",
        padding: "s1",
      };
    
      const stackTokens: IStackTokens = { childrenGap: 20 };
  

    return (
    <>
    
    <Stack tokens={themedSmallStackTokens}>
      <Stack>
        <StackItem align="end" >
          { seeAllLink !== undefined && (
          <div>{totalGroups.length > groupsPerPage && (<a href={seeAllLink}>see All</a> ) }</div>
          )}
        </StackItem>
      </Stack>
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