/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import styles from './Communities.module.scss';
import { IStackTokens, Stack, StackItem } from '@fluentui/react';
import { SelectLanguage } from './SelectLanguage';

interface IGridLayoutProps {
    groups: any;
    seeAllLink: string;
    groupsPerPage: number;
    totalGroups: any[];
    prefLang: string;
}


const CompactLayoutStyle: React.FunctionComponent<IGridLayoutProps> = ({groups, seeAllLink, groupsPerPage, totalGroups, prefLang}) => {


  const strings = SelectLanguage(prefLang);

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
          <div>{totalGroups.length > groupsPerPage && (<a aria-label={strings.seeAllLabel} href={seeAllLink}>{strings.seeAll}</a> ) }</div>
          )}
        </StackItem>
      </Stack>
      {groups.map((item:any) => (
          <>
          <div className={styles.compactCardContainer } >
            <a href={item.url}>
              <div >
                  <Stack horizontal verticalAlign='stretch' tokens={stackTokens}>
                    <div>
                      <img aria-label={`${strings.altImgLogo}${item.displayName}`} className={styles.compactCardImg} src={item.thumbnail} alt={`${strings.altImgLogo}${item.displayName}`}/>
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