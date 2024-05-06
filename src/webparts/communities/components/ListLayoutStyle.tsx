/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
import styles from "./Communities.module.scss";
import { IStackTokens, Icon, Stack, StackItem } from "@fluentui/react";
import { SelectLanguage } from "./SelectLanguage";


interface IListLayoutStyleProps {
  groups: any[];
  seeAllLink: string;
  groupsPerPage: number;
  totalGroups: any[];
  prefLang: string;
  createCommLink: string;

}

const ListLayoutStyle: React.FunctionComponent<IListLayoutStyleProps> = ({groups, seeAllLink, groupsPerPage, totalGroups, prefLang, createCommLink}) => {

  const strings = SelectLanguage(prefLang);

  const themedSmallStackTokens: IStackTokens = {
    childrenGap: "s1",
    padding: "s1",
  };

  const stackTokens: IStackTokens = { childrenGap: 20 };
  console.log("SeeAll", seeAllLink);

  

  return (
    <>
      <Stack tokens={themedSmallStackTokens}> 
      <Stack>
        { createCommLink !== undefined && (
          <div className={styles.createComm}><Icon iconName="Add" className={styles.addIcon} /><a aria-label={strings.createComm} href={createCommLink}>{strings.createComm}</a></div>
        )}
        <StackItem align="end" >
          { seeAllLink !== undefined && (
          <div>{totalGroups.length > groupsPerPage && (<a aria-label={strings.seeAllLabel} href={seeAllLink}>{strings.seeAll}</a> ) }</div>
          )}
        </StackItem>
      </Stack>
      <ul style={{listStyleType: 'none', paddingInlineStart: '0px'}} data-is-focusable>
        {groups.map((group: any, index: number) => (
          <>
            <Stack
                    horizontal
                    verticalAlign="stretch"
                    tokens={stackTokens}
                  >
           <li role="listitem" key={index}>
            <div className={styles.listCardContainer}>
              <a href={group.url}>
                <div style={{display: 'flex'}}>
                
                    <Stack.Item disableShrink  className={styles.listCardContainerImg}>
                      <img
                        className={styles.listCardImg}
                        src={group.thumbnail}
                      />
                    </Stack.Item>
                    <Stack.Item >
                      <h3 className={styles.listCardTitle}>
                        {group.displayName}
                      </h3>
                      <p className={styles.listCardDescription}>
                        {group.description}
                      </p>
                      <p className={styles.listCardFooter}>
                        Members {group.members}
                      </p>
                    </Stack.Item>
                 
                </div>
              </a>
            </div>
            </li>
            </Stack>
          </>
        ))}
        </ul>
      </Stack>
    </>
  );
};

export default ListLayoutStyle;
