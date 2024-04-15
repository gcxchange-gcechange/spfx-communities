/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */

import * as React from "react";
//import styles from './Communities.module.scss';
import type { ICommunitiesProps } from "./ICommunitiesProps";
import GraphService from "../../../services/GraphService";
import { useEffect, useState } from "react";
import AlphabeticalFilter from "./AlphabeticalFilter";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import GridLayoutStyle from "./GridLayoutStyle";
import { Spinner, SpinnerSize, Stack } from "@fluentui/react";
import Paging from "./Paging";
import ListLayoutStyle from "./ListLayoutStyle";
import CompactLayoutStyle from "./CompactLayoutStyle";

const Communities: React.FC<ICommunitiesProps> = (props) => {
  const { targetAudience, layout } = props;


  const [_groups, setGroups] = useState<any[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>("A");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  


  const clearState = ():void => {
    setFilteredGroups([]);
    setCurrentPage(1);
    setIsLoading(false);
  };

  // const _getPageViews = (filteredGroups: any): void => {
  //   filteredGroups.map((group: any) => {
  //     GraphService.pageViewsBatch(group.siteId).then((siteViews) => {
  //       setFilteredGroups((prevFilteredGroups) => {
  //         const updatedFiltered = prevFilteredGroups.map((groupItems) =>
  //           groupItems.id === group.id
  //             ? {
  //                 ...groupItems,
  //                 views: siteViews,
  //               }
  //             : groupItems
  //         );

  //         return updatedFiltered;
  //       });
  //       setIsLoading(false);
  //     });
  //   });
  // };

  
  const _getPageViews = (filteredGroups: any): void => {
    console.log("filter", filteredGroups)
    const promises = filteredGroups.map((group: any) => {
      return GraphService.pageViewsBatch(group.siteId).then((siteViews) => {
        console.log("SiteViews", siteViews)
        if( siteViews === undefined) {
          console.log("view Undefiend")
        }
        return {
          ...group,
          views: siteViews,
        };
      });
    });
  
    Promise.all(promises).then((updatedFilteredGroups) => {
      setFilteredGroups(updatedFilteredGroups);
      setIsLoading(false);
    });
  };


  // const removeGroupsWithoutURL = (updatedGroups: any): any[] => {
  //   console.log("remove", updatedGroups);
  //   // const filterGroup = updatedGroups.filter((group: any) => group.url);
  //   setFilteredGroups(updatedGroups);
  //   // _getPageViews(filterGroup);
  //   return updatedGroups;
  // };

  
  const _getGroupDetailsData = (groups: any): void => {
    console.log("Getting Details", groups);
    const promises = groups.map((groupData: any) => {
      console.log("loader", isLoading);
      return GraphService.getGroupDetailsBatch(groupData.id).then((groupDetails) => {
        try {
          if (groupDetails[1] !== undefined) {
           const firstLetter: string[] = groupData.displayName.match(/\b\w/g).slice(0, 2).join("").toUpperCase();
           const firstTwoLetters: string = firstLetter.toString();

           const encodeUri = encodeURI(firstTwoLetters);
           //const firstTwoLetters: string[] = firstLetter.slice(0,2);
           //const joinLetters: string = firstTwoLetters.join("").toUpperCase();
           console.log("en", encodeUri);
            let thumbnail: string = '';
            if (groupDetails[3] === undefined ) {
              console.log("thumbnail", groupDetails[3]);
              //console.log("data:image/jpeg;base64," + encodeUri)
              thumbnail = `${encodeUri}`;
            } else {
              console.log("data:image/jpeg;base64," + encodeUri)
              thumbnail = groupDetails[3]
            }
            return {
              ...groupData,
              url: groupDetails[1].webUrl,
              siteId: groupDetails[1].id,
              modified: new Date(groupDetails[1].lastModifiedDateTime).toLocaleDateString("en-CA"),
              members: groupDetails[2],
              thumbnail: "data:image/jpeg;base64," + thumbnail,
            };
          } else {
            console.log(`Group details not found for ${groupData.id}`);
            return null;
          }
        } catch (error) {
          console.log("ERROR", error);
          return null;
        }
      });
    });
    
    
    Promise.all(promises).then((updatedGroups) => {
      const filteredGroups = updatedGroups.filter((group) => group !== null);
      _getPageViews(filteredGroups);
    });
  };



  // const _getGroupDetailsData = (groups: any): void => {
  //   console.log("Getting Details");
  //   let groupCount = 0;
  //   groups.map((groupData: any) => {
  //     GraphService.getGroupDetailsBatch(groupData.id).then((groupDetails) => {
  //       try {
  //         if ( groupDetails[1] !== undefined) 
  //         {
  //           setIsLoading(true);
  //           setGroups((prevGroups) => {
  //             const updatedGroups = prevGroups.map((groupItems) =>
  //               groupItems.id === groupData.id
  //                 ? {
  //                     ...groupItems,
  //                     url: groupDetails[1].webUrl,
  //                     siteId: groupDetails[1].id,
  //                     modified: new Date( groupDetails[1].lastModifiedDateTime ).toLocaleDateString("en-CA"),
  //                     members: groupDetails[2],
  //                     thumbnail: "data:image/jpeg;base64," + groupDetails[3],
  //                   }
  //                 : groupItems
  //             );
  //             console.log("GC", groupCount);
  //             removeGroupsWithoutURL(updatedGroups);
  //             return updatedGroups;

  //           });
  //         } else {
  //           console.log(`Group details not found for ${groupData.id}`);
  //           return null;
  //         }
  //       } catch (error) {
  //         console.log("ERROR", error);
  //       }
  //     });
  //   });
  // };


  const _getUserGroups = (): void => {
    GraphService.getUserGroups().then((data) => {
      setGroups(data);
      setIsLoading(true);
      _getGroupDetailsData(data);
    });
  };

  const _getAllGroups = (selectedLetter: string): void => {
    console.log("Lo", isLoading);
    GraphService.getAllGroups(selectedLetter).then((allGroupData) => {
      console.log("GroupData", allGroupData);
      if (allGroupData.responseResults !== undefined) {
        setGroups(allGroupData.responseResults);
        _getGroupDetailsData(allGroupData.responseResults);
      } else {
        setGroups(allGroupData.responseResults)
        // return null;
      }

    });
  };


  const getSelectedLetter = (letter: string): void => {
    console.log("letter", letter);
    setSelectedLetter(letter);
    setIsLoading(true);
  };

  const openPropertyPane = (): void => {
    props.context.propertyPane.open();
  };

  const onPageUpdate = (pageNumber: number): void => {
    console.log("page#",pageNumber)
    setCurrentPage( pageNumber);
    console.log("current page",currentPage)

  }


  useEffect(() => {   
    if (targetAudience === "1") {
      setIsLoading(true);
      _getAllGroups(selectedLetter);
    } else if (targetAudience === "2") {
      setIsLoading(true);
      _getUserGroups();
    }
  }, [props.targetAudience]);

  useEffect(() => {
    console.log("sel", selectedLetter)
    if (targetAudience === "1" ) {
      clearState();
      _getAllGroups(selectedLetter);
      setIsLoading(true);
    }
  }, [selectedLetter]);
  


  //calculate the item index to render per page


    const startIndex:number = (currentPage - 1) * props.numberPerPage;
    const endIndex: number = Math.min(startIndex + props.numberPerPage, filteredGroups.length);
  
    const displayItemsPerPage = filteredGroups.slice(startIndex, endIndex);

    const pagedSortedItems =  props.sort === "Alphabetical" 
    ? displayItemsPerPage.sort((a:any, b:any) => (a.displayName.toLowerCase() > b.displayName.toLowerCase() ? 1: -1 )) 
    : props.sort === "DateCreation" 
      ?  displayItemsPerPage.sort((a:any , b:any) => (a.createdDateTime < b.createdDateTime ? 1 : -1 )) 
      :  displayItemsPerPage


  //sorting for user groups

  const userGroupsSorted = props.sort === "Alphabetical" 
  ? filteredGroups.sort((a,b) => (a.displayName.toLowerCase() > b.displayName.toLowerCase() ? 1: -1 )) 
  : props.sort === "DateCreation" 
    ? filteredGroups.sort((a, b) => (a.createdDateTime < b.createdDateTime ? 1 : -1 )) 
    : filteredGroups

  const displayUserGroups = userGroupsSorted.slice(0, props.numberPerPage);
  
 
  
  return ( 
    <>
      <div>
        {!props.targetAudience && !props.layout && (
          <Placeholder
            iconName="Edit"
            iconText="Configure your web part"
            description="Please configure the web part."
            buttonLabel="Configure"
            onConfigure={openPropertyPane}
          />
        )}
      </div>
        <div>
          { isLoading ? (
            <Spinner size={SpinnerSize.large} />
          ) : (
            <>
              <h3>{(props.prefLang === "FR" ? props.titleFr : props.titleEn )}</h3>
              {layout === "Compact" && (
                <CompactLayoutStyle groups={displayUserGroups} seeAllLink={props.seeAllLink} groupsPerPage={props.numberPerPage} totalGroups={filteredGroups} prefLang={props.prefLang}/>
              )}
              {layout === "List" && ( 
                <ListLayoutStyle groups={displayUserGroups} seeAllLink={props.seeAllLink} groupsPerPage={props.numberPerPage} totalGroups={filteredGroups} prefLang={props.prefLang}/>
              )} 
              {layout === "Grid" && (
                <Stack horizontalAlign="center">
                  {targetAudience === "1" && (
                      <AlphabeticalFilter
                        selectedLetter={selectedLetter}
                        onSelectLetter={getSelectedLetter}
                      />
                  )}
                  {  filteredGroups.length !== 0 && 
                    (
                      <Paging
                        prefLang={props.prefLang}
                        items={filteredGroups.length}
                        itemsPerPage={props.numberPerPage}
                        currentPage={currentPage}
                        onPageUpdate={onPageUpdate}
 
                      />
                    )
                  } 
                  <GridLayoutStyle groups={pagedSortedItems} prefLang={props.prefLang} />
                  { filteredGroups.length  !== 0 && 
                    (
                      <Paging
                        prefLang={props.prefLang}
                        items={filteredGroups.length}
                        itemsPerPage={props.numberPerPage}
                        currentPage={currentPage}
                        onPageUpdate={onPageUpdate}
                     
                      />
                    )
                  } 
                </Stack>
              )}
            </>
          )}
        </div>
      
    </>
  );
};

export default Communities;