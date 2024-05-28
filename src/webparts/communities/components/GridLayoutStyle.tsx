/* eslint-disable react/no-string-refs */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
import styles from "./Communities.module.scss";
import { IImageProps, IStackTokens, Stack } from "@fluentui/react";
import { SelectLanguage } from './SelectLanguage';

interface IGridLayoutProps {
  groups: any;
  prefLang: string;
}

const GridLayoutStyle: React.FunctionComponent<IGridLayoutProps> = ({ groups, prefLang }) => {

  const imageProps: Partial<IImageProps> = {
    src: (require("../assets/YetiHiding.png")),
     // imageFit: ImageFit.contain,
     width: 300,
     height: 300,
   };
  const strings = SelectLanguage(prefLang);
  const sectionStackTokens: IStackTokens = { childrenGap: 20 };


  return (
    <>
      <ul style={{listStyleType: 'none', paddingInlineStart: '0px'}}>
        {groups.length >= 1 && (
          <Stack
            horizontal
            horizontalAlign="start"
            wrap={true}
            tokens={sectionStackTokens}
          >
            {groups.map((item: any, index: any) => (
              <>
              <li role="listitem" key={index} data-is-focusable>
                  <a href={item.url}  target="_blank" rel="noreferrer" style={{color: 'black', textDecoration: 'none'}}>
                <div className={styles.cardContainer}>
                    <div className={styles.cardBanner}>
                      {
                        item.thumbnail !== undefined ? (
                          <img className={styles.cardImg} src={item.thumbnail} />
                        ) : (
                        <div className={styles.cardMissingLogo}>
                          <p style={{margin:'0px'}} >{ item.displayName.match(/\b\w/g).slice(0, 2).join("").toUpperCase().toString()}</p>
                         </div>)

                      }

                    </div>
                    <div className={styles.cardBody}>
                      <h3 className={styles.cardTitle}>{item.displayName}</h3>
                      <p className={styles.cardDescription}>
                        {item.description}
                      </p>
                    </div>
                    <div className={styles.cardFooter}>
                      <Stack horizontal horizontalAlign="space-between">
                        <div>
                          <p style={{ margin: "0" }}>
                            <strong aria-label={`${strings.members_ariaLabel} ${item.members}`}>{strings.members}</strong>{item.members}
                          </p>
                          <p>
                            <strong>{strings.siteViews}</strong>{item.views}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: "0" }}>
                            <strong>{strings.created}</strong>
                            {new Date(item.createdDateTime).toLocaleDateString(
                              "en-CA"
                            )}
                          </p>
                          <p>
                            <strong>{strings.lastModified}</strong> {item.modified}
                          </p>
                        </div>
                      </Stack>
                    </div>
                </div>
                  </a>
                </li>
              </>
            ))}
          </Stack>
        ) }
        </ul>

        {groups.length === 0 && (
          <Stack horizontal verticalAlign="center">
            <div
              className={styles.noResultsText}
              aria-label={strings.noResults}
              tabIndex={0}
            >
              <h4 className={styles.margin0}>
                {strings.sorry}
                <br />
                {strings.We_couldnt_find}
              </h4>
              <p className={styles.margin0}>
                {strings.Does_not_exist}
                <br />
                {strings.Try_searching}
              </p>
            </div>

            <img {...imageProps} alt={strings.hidingYeti}/>
          </Stack>
        )}

    </>
  );
};

export default GridLayoutStyle;
