/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */

import * as React from "react";
//import styles from './Communities.module.scss';
import type { ICommunitiesProps } from "./ICommunitiesProps";
import GraphService from "../../../services/GraphService";
import { useEffect, useState, useRef } from "react";
import AlphabeticalFilter from "./AlphabeticalFilter";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import GridLayoutStyle from "./GridLayoutStyle";
import { Spinner, SpinnerSize} from "@fluentui/react";
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
  const previousLetterRef = useRef('');


  const clearState = ():void => {
    setFilteredGroups([]);
    setCurrentPage(1);
    setIsLoading(false);
  };
  
  const _getPageViews = (filteredGroups: any): void => {
    const promises = filteredGroups.map((group: any) => {
      return GraphService.pageViewsBatch(group.siteId).then((siteViews) => {
        let siteView: string = '';
        if ( siteViews === undefined) {
          siteView = '0'
      } else {
        siteView = siteViews
      }
      
        return {
          ...group,
          views: siteView,
        };
      });
    });
  
    Promise.all(promises).then((updatedFilteredGroups) => {
      setFilteredGroups(updatedFilteredGroups);
      setIsLoading(false);
    });
  };

  
  const _getGroupDetailsData = (groups: any): void => {
    const promises = groups.map((groupData: any) => {
      return GraphService.getGroupDetailsBatch(groupData.id).then((groupDetails) => {
        try {
          if (groupDetails[1] !== undefined) {
            let thumbnail: string | undefined = undefined;
            if (groupDetails[3] === undefined ) {
              thumbnail = undefined;
            } else {
              thumbnail = groupDetails[3]
            }
            return {
              ...groupData,
              url: groupDetails[1].webUrl,
              siteId: groupDetails[1].id,
              modified: new Date(groupDetails[1].lastModifiedDateTime).toLocaleDateString("en-CA"),
              members: groupDetails[2],
              thumbnail: thumbnail !== undefined ? `data:image/jpeg;base64,${thumbnail}` : undefined,
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


  const _getUserGroups = (): void => {
    GraphService.getUserGroups().then((data) => {
      setGroups(data);
      setIsLoading(true);
      _getGroupDetailsData(data);
    });
  };

  const _getAllGroups = (selectedLetter: string): void => {
    GraphService.getAllGroups(selectedLetter).then((allGroupData) => {
      if (allGroupData.responseResults !== undefined) {
        setGroups(allGroupData.responseResults);
        _getGroupDetailsData(allGroupData.responseResults);
      } else {
        setGroups(allGroupData.responseResults)
      }

    });
  };


  const getSelectedLetter = (letter: string): void => {
    if (letter !== selectedLetter) {
      setSelectedLetter(letter);
      setIsLoading(true);
    }
  };

  const openPropertyPane = (): void => {
    props.context.propertyPane.open();
  };

  const onPageUpdate = (pageNumber: number): void => {
    setCurrentPage( pageNumber);
  };


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
    if (targetAudience === "1" && previousLetterRef.current !== selectedLetter) {
      clearState();
      _getAllGroups(selectedLetter);
      setIsLoading(true);
      previousLetterRef.current = selectedLetter;
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
              <h3 style={{paddingLeft: '8px'}}>{(props.prefLang === "FR" ? props.titleFr : props.titleEn )}</h3>
              {layout === "Compact" && (
                <CompactLayoutStyle groups={displayUserGroups} seeAllLink={props.seeAllLink} groupsPerPage={props.numberPerPage} totalGroups={filteredGroups} prefLang={props.prefLang}  createCommLink={props.createCommLink}/>
              )}
              {layout === "List" && ( 
                <ListLayoutStyle groups={displayUserGroups} seeAllLink={props.seeAllLink} groupsPerPage={props.numberPerPage} totalGroups={filteredGroups} prefLang={props.prefLang} createCommLink={props.createCommLink}/>
              )} 
              <div>
              {layout === "Grid" && (
                <>

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
                  <GridLayoutStyle groups={pagedSortedItems} prefLang={props.prefLang} targetAudience={props.targetAudience} seeAllCommunitiesLink={props.seeAllCommunitiesLink} createCommLink={props.createCommLink}/>
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
               
                </>
              )}
               </div>
              
            </>
          )}
        </div>
      
    </>
  );
};

export default Communities;