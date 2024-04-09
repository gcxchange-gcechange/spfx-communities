/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
import styles from "./Communities.module.scss";
import { IStackTokens, Stack, StackItem } from "@fluentui/react";

interface IListLayoutStyleProps {
  groups: any[];
  seeAllLink: string;
  groupsPerPage: number;
  totalGroups: any[];
}

const ListLayoutStyle: React.FunctionComponent<IListLayoutStyleProps> = ({groups, seeAllLink, groupsPerPage, totalGroups}) => {


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
        <StackItem align="end" >
          { seeAllLink !== undefined && (
          <div>{totalGroups.length > groupsPerPage && (<a href={seeAllLink}>see All</a> ) }</div>
          )}
        </StackItem>
      </Stack>
        {groups.map((group: any) => (
          <>
            <div className={styles.listCardContainer}>
              <a href={group.url}>
                <div>
                  <Stack
                    horizontal
                    verticalAlign="stretch"
                    tokens={stackTokens}
                  >
                    <div className={styles.listCardContainerImg}>
                      <img
                        className={styles.listCardImg}
                        src={group.thumbnail}
                      />
                    </div>
                    <div>
                      <h3 className={styles.listCardTitle}>
                        {group.displayName}
                      </h3>
                      <p className={styles.listCardDescription}>
                        {group.description}
                      </p>
                      <p className={styles.listCardFooter}>
                        Members {group.members}
                      </p>
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
};

export default ListLayoutStyle;
