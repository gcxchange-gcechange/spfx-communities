/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import styles from './Communities.module.scss';
import { IStackTokens, Icon, Stack, StackItem } from '@fluentui/react';
import { SelectLanguage } from './SelectLanguage';

interface IGridLayoutProps {
    groups: any;
    seeAllLink: string;
    groupsPerPage: number;
    totalGroups: any[];
    prefLang: string;
    createCommLink: string;
}


const CompactLayoutStyle: React.FunctionComponent<IGridLayoutProps> = ({groups, seeAllLink, groupsPerPage, totalGroups, prefLang, createCommLink}) => {


  const strings = SelectLanguage(prefLang);

    const themedSmallStackTokens: IStackTokens = {
        childrenGap: "s1",
        padding: "s1",
      };
    
      const stackTokens: IStackTokens = { childrenGap: 20 };
  

    return (
    <>
    
    <Stack tokens={themedSmallStackTokens}>
      <Stack horizontal style={{width:'336px', marginBottom: '5%'}}>
        <StackItem grow>
        { createCommLink !== undefined && (
          <div className={styles.createComm}><Icon iconName="Add" className={styles.addIcon} /><a aria-label={strings.createComm} href={createCommLink}>{strings.createComm}</a></div>
        )}
        </StackItem>
        <StackItem >
          { seeAllLink !== undefined && (
          <div>{totalGroups.length > groupsPerPage && (<a aria-label={strings.seeAllLabel} href={seeAllLink}>{strings.seeAll}</a> ) }</div>
          )}
        </StackItem> 
      </Stack>
      <ul style={{listStyleType: 'none', paddingInlineStart: '0px'}} data-is-focusable>
        {groups.map((item:any, index: any) => (
          <>
          <li role="listitem" key={index}>
            <div className={styles.compactCardContainer } >
              <a href={item.url}>
                <div >
                    <Stack horizontal verticalAlign='stretch' tokens={stackTokens}>
                      <StackItem>
                        <img className={styles.compactCardImg} src={item.thumbnail} alt={`${item.displayName}`}/>
                      </StackItem>
                      <StackItem>
                        <h3 className={styles.compactCardTitle}>{item.displayName}</h3>
                      </StackItem>
                    </Stack>
                </div>
                </a>
            </div>
          </li>
          </>
        ))}
      </ul>
      </Stack>
      </>
      );
    
}

export default CompactLayoutStyle