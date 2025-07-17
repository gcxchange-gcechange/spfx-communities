/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
import styles from "./Communities.module.scss";
import { IImageProps, IStackTokens, Stack } from "@fluentui/react";
import { SelectLanguage } from './SelectLanguage';
import { PrimaryButton } from "@fluentui/react";

interface IGridLayoutProps {
  groups: any;
  prefLang: string;
  targetAudience: string;
  seeAllCommunitiesLink: string;
  createCommLink: string;
  loadingMore: boolean;
}

const GridLayoutStyle: React.FunctionComponent<IGridLayoutProps> = ({ groups, prefLang, targetAudience, seeAllCommunitiesLink, createCommLink, loadingMore }) => {

  const imageProps: Partial<IImageProps> = {
    src: (require("../assets/YetiHiding.png")),
     // imageFit: ImageFit.contain,
     width: 300,
     height: 300,
   };
  const strings = SelectLanguage(prefLang);
  const sectionStackTokens: IStackTokens = { childrenGap: 20 };

  const stackVerticalAlign = targetAudience === '1' ? 'center' : 'start';
  console.log(createCommLink, seeAllCommunitiesLink)

  return (
    <>
      <section>
      <ul style={{listStyleType: 'none', paddingInlineStart: '0px'}} data-is-focusable>
        {groups.length >= 1 && (
       
          <Stack
            horizontal
            horizontalAlign="start"
            wrap={true}
            tokens={sectionStackTokens}
          >
            {groups.map((item: any, index: any) => (
              <>
              <li role="listitem" key={index}>
                <div className={styles.cardContainer}>
                  <a href={item.url}  target="_blank" rel="noreferrer">
                    <div className={styles.cardBanner}>
                      {
                        item.thumbnail !== undefined ? (
                          <img className={styles.cardImg} src={item.thumbnail} alt={`${strings.altImgLogo}${item.displayName}`}/>
                        ) : (
                        <div className={styles.cardMissingLogo}>
                          <p style={{margin:'0px'}} aria-label={`${strings.altImgLogo}${item.displayName}`}>{ item.displayName.match(/\b\w/g).slice(0, 2).join("").toUpperCase().toString()}</p>
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
                            <strong>{strings.members}</strong>{item.members}
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
                  </a>
                </div>
                </li>
              </>
            ))}

            {loadingMore &&
              Array.from({length: 3}).map((_, index) => (
                <div key={`skeleton-${index}`} className={styles.skeleton}>
                  <div className={styles.skeletonBanner}>
                    <div className={styles.skeletonThumbnail}/>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.skeletonLine}/> 
                    <div className={styles.skeletonLine}/> 
                  </div>
                  <div className={styles.cardFooter}>
                    <Stack  horizontal horizontalAlign="space-between" wrap>
                      <div className={styles.skeletonLineShort}/> 
                      <div className={styles.skeletonLineShort}/> 
                      <div className={styles.skeletonLineShort}/> 
                      <div className={styles.skeletonLineShort}/> 
                    </Stack>
                  </div>
                </div>
              ))
            }
          </Stack>
        ) }
        </ul>
        </section>

        {groups.length === 0 && targetAudience === "1" && (
          <section>
          <Stack horizontal verticalAlign={stackVerticalAlign} horizontalAlign="center">
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
          </section>
        )}

        { groups.length === 0 && targetAudience === '2' && (
          <>
          <section style={{clear:"both"}}>
            <Stack tokens={sectionStackTokens} verticalAlign={stackVerticalAlign} horizontalAlign="start">  
            <div> 
              <p style={{marginBottom: '20px'}}>{strings.user_not_in_communities}</p>
            </div>
            <div>
              <Stack horizontal tokens={sectionStackTokens} horizontalAlign="start" >  
                {seeAllCommunitiesLink && (
                  <PrimaryButton id="1" text={strings.see_All_Communities_button} target="_blank" href={seeAllCommunitiesLink}/>
                )}
                  {createCommLink  && (
                    <PrimaryButton id="2" text={strings.createComm} target="_blank" href={createCommLink}/>
                  )}
              </Stack>
            </div>
            </Stack>
          </section>
          </>
        )}



    </>
  );
};

export default GridLayoutStyle;