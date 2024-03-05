/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
import styles from "./Communities.module.scss";
import { Stack } from "@fluentui/react";

interface IGridLayoutProps {
  groups: any;
}

const GridLayoutStyle: React.FunctionComponent<IGridLayoutProps> = ({groups}) => {


  return (
    <>
      <Stack horizontal horizontalAlign="space-evenly" wrap={true}>
        {groups.map((item:any) => (
          <>
            <div className={styles.cardContainer}>
              <a href={item.url}>
                <div className={styles.cardBanner}>
                  <img className={styles.cardImg} src={item.thumbnail} />
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{item.displayName}</h3>
                  <p className={styles.cardDescription}>{item.description}</p>
                </div>
                <div className={styles.cardFooter}>
                  <Stack horizontal horizontalAlign="space-between">
                    <div>
                      <p style={{ margin: "0" }}>
                        <strong>Members </strong>
                        {item.members}
                      </p>
                      <p>
                        <strong>Views</strong> {item.views}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: "0" }}>
                        <strong>Created</strong>{" "}
                        {new Date(item.createdDateTime).toLocaleDateString(
                          "en-CA"
                        )}
                      </p>
                      <p>
                        <strong>Last modified</strong> {item.modified}
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

export default GridLayoutStyle;
