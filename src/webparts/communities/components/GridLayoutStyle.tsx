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

 const getTruncatedDescription = (description: string): string  => {
  console.log("desc",description)
  return description.length > 100 ? description.slice(0, 100) + "..." : description;
 }



  return (
    <>
      <ul style={{listStyleType: 'none', paddingInlineStart: '0px'}} role="list">
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
                      <h3 className={styles.cardTitle} aria-hidden={true}>
                        <a href={item.url}  target="_blank" rel="noreferrer" aria-describedby={index}>{item.displayName}</a>
                      </h3>
                      <p id={index} className={styles.cardDescription}>
                        {getTruncatedDescription(item.description)}
                      </p>
                    </div>
                    <ul className={styles.cardFooter} role="list">
                      <Stack horizontal horizontalAlign="space-between">
                        <div>
                          <li style={{listStyle:'none'}}>
                            <p style={{ margin: "0" }}>
                            <span aria-label={strings.members_ariaLabel}><strong>{strings.members}</strong></span>
                            {item.members}
                            </p>
                          </li>
                          <li style={{listStyle:'none'}}>
                            <p><strong>{strings.siteViews}</strong>{item.views}</p>
                          </li>
                        </div>
                        <div>
                          <li style={{listStyle:'none'}}><p style={{ margin: "0" }}>
                              <strong>{strings.created}</strong>
                              {new Date(item.createdDateTime).toLocaleDateString("en-CA")}
                            </p>
                          </li>
                          <li style={{listStyle:'none'}}>
                            <p>
                              <strong>{strings.lastModified}</strong> {item.modified}
                            </p>
                          </li>
                        </div>
                      </Stack>
                    </ul>
                </div>
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
