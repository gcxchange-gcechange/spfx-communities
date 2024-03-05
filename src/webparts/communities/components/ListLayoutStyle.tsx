/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
import styles from "./Communities.module.scss";
import { IStackTokens, Stack } from "@fluentui/react";

interface IListLayoutStyleProps {
  groups: any[];
}

const ListLayoutStyle: React.FunctionComponent<IListLayoutStyleProps> = ({groups}) => {


  const themedSmallStackTokens: IStackTokens = {
    childrenGap: "s1",
    padding: "s1",
  };

  const stackTokens: IStackTokens = { childrenGap: 20 };

  return (
    <>
      <Stack tokens={themedSmallStackTokens}> 
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
