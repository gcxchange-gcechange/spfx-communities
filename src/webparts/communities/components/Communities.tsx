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
import { IStackTokens, PrimaryButton, Spinner, SpinnerSize, Stack} from "@fluentui/react";
import Pagination from "./Pagination";
import ListLayoutStyle from "./ListLayoutStyle";
import CompactLayoutStyle from "./CompactLayoutStyle";
import SkeletonCard from "./Skeleton";

const Communities: React.FC<ICommunitiesProps> = (props) => {
  const { targetAudience, layout } = props;


  const [groups, setGroups] = useState<any[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>("A");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const previousLetterRef = useRef('');
  const [groupCount, setGroupCount] = useState<number>(0);
  const [nextLink, setNextLink] = useState<string | null>(null);
  const [totalNotAccessibleGroups, setTotalNotAccessibleGroups] = useState<any[]>([]);


  const clearState = ():void => {
    setGroups([]);
    setFilteredGroups([]);
    setTotalNotAccessibleGroups([]);
    setCurrentPage(1);
    setIsLoading(false);
  };
  
  const _getPageViews = (filteredGroups: any, options: { append: boolean }): void => {
    console.log("filteredGroups_PgeViews", filteredGroups)
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
    if (options.append) {
      setGroups(prev => [...prev, ...updatedFilteredGroups]); //append to groups
    } else {
      setGroups(updatedFilteredGroups); // replace the groups
    }
      setIsLoading(false);
    });
  };

  
  const _getGroupDetailsData = (groups: any, options: {append: boolean}): void => {
    console.log("groups_DETAILS", groups)
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
            return  { 
              ...groupData,
              url: groupDetails[1].webUrl,
              siteId: groupDetails[1].id,
              modified: new Date(groupDetails[1].lastModifiedDateTime).toLocaleDateString("en-CA"),
              members: groupDetails[2],
              thumbnail: thumbnail !== undefined ? `data:image/jpeg;base64,${thumbnail}` : undefined,}
          
          } else {
            console.log(`Group details not found for ${groupData.id}`);
            setTotalNotAccessibleGroups(prev => [...prev, groupData.id]);
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
      _getPageViews(filteredGroups, options);
    });
  };


  const _getUserGroups = (): void => {
    GraphService.getUserGroups().then((data) => {
      setGroups(data);
      setIsLoading(true);
      _getGroupDetailsData(data, { append: true } );
    });
  };

  const _getAllGroups = async (selectedLetter: string): Promise<void> => {
   
    try {
      // 1. Get count first - need to adjust to exclude security groups
      const count = await GraphService.getGroupCount(selectedLetter);
      setGroupCount(count);
      console.log("Count value", count);

      // 2. get groups based on the number of cards per page
      const allGroupData = await GraphService.getAllGroups(selectedLetter, props.numberPerPage);
      console.log("all", allGroupData)
      if (allGroupData.value) {
        _getGroupDetailsData( allGroupData.value, { append: false }); // selects new letter we pass in false to not append to groups

        //if dataLink exists store it
        setNextLink(allGroupData['@odata.nextLink'] || null);

      } else {
        setGroups([]);
        setNextLink(null)
      }

    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const _showMoreGroups = async (): Promise<void> => {
    
    if (!nextLink) return;

    setIsLoading(true)

      try {
        const moreGroupData = await GraphService.getGroupsByUrl(nextLink) ;
        console.log("MOREGROUPS", moreGroupData.value)
        if (moreGroupData.value) {
             _getGroupDetailsData(moreGroupData.value, { append: true });
 
        
          //if next Link then update the state
          setNextLink(moreGroupData['@odata.nextLink']);
        }
          else {
            setNextLink(null)
            // setFilteredGroups([...groups, ...moreGroupData.value])
          }
        
      } catch(error) {
        console.log("ERROR:", error)
      }
        
       
  }


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

  //targetAudience = 1  for all communities

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
      setIsLoading(true);
     setTimeout(() => {
       _getAllGroups(selectedLetter);
     }, 5) 
      previousLetterRef.current = selectedLetter;
    }
  }, [selectedLetter]);
  


  //calculate the item index to render per page


   // const startIndex:number = (currentPage - 1) * props.numberPerPage;
    //const endIndex: number = Math.min(startIndex + props.numberPerPage, groupCount.length);
    //const endIndex: number = Math.min(startIndex + props.numberPerPage, filteredGroups.length);
  
    // const displayItemsPerPage = filteredGroups.slice(startIndex, endIndex);
     

    // const pagedSortedItems =  props.sort === "Alphabetical" 
    // ? filteredGroups.sort((a:any, b:any) => (a.displayName.toLowerCase() > b.displayName.toLowerCase() ? 1: -1 )) 
    // : props.sort === "DateCreation" 
    //   ?  filteredGroups.sort((a:any , b:any) => (a.createdDateTime < b.createdDateTime ? 1 : -1 )) 
    //   :  filteredGroups


  //sorting for user groups

  const userGroupsSorted = props.sort === "Alphabetical" 
  ? filteredGroups.sort((a,b) => (a.displayName.toLowerCase() > b.displayName.toLowerCase() ? 1: -1 )) 
  : props.sort === "DateCreation" 
    ? filteredGroups.sort((a, b) => (a.createdDateTime < b.createdDateTime ? 1 : -1 )) 
    : filteredGroups

  const displayUserGroups = userGroupsSorted.slice(0, props.numberPerPage);

  const removeDuplicate = Array.from(new Set(totalNotAccessibleGroups));
  
  const totalGroups = (groupCount - removeDuplicate.length)
  console.log("disable", !nextLink);

  const sectionStackTokens: IStackTokens = { childrenGap: 20 };

  
 
  
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
          { isLoading && !nextLink ? (
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
                  {  groups.length !== 0 && 
                    (
                      <>
                        {/* <Stack horizontalAlign="center">
                          <p>Showing {groups.length} of { totalGroups }</p>
                          <PrimaryButton style={{width: '200px', borderRadius: '20px'}} onClick={() => _showMoreGroups()} disabled={!nextLink} >Show More</PrimaryButton>
                        </Stack> */}

                        {/* <Pagination
                          prefLang={props.prefLang}
                          items={groupCount}
                          itemsPerPage={props.numberPerPage}
                          currentPage={currentPage}
                          onPageUpdate={onPageUpdate}
  
                        /> */}
                      </>
                    )
                  } 
                  <GridLayoutStyle isLoading={isLoading} groups={groups} prefLang={props.prefLang} targetAudience={props.targetAudience} seeAllCommunitiesLink={props.seeAllCommunitiesLink} createCommLink={props.createCommLink}/>
                  {isLoading  && ( 
                    <>
                      <Spinner size={SpinnerSize.large}  style={{marginBottom:'20px'}}/>
                      <Stack horizontal wrap={true} tokens={sectionStackTokens}>
                        {[...Array(3)].map((_, i) => (  
                          
                          <SkeletonCard key={i} /> ))
                          }

                      </Stack>
                    </>
                    )}

                    <Stack horizontalAlign="center">
                      <p>Showing {groups.length} of { totalGroups }</p>
                      <PrimaryButton style={{width: '200px', borderRadius: '20px'}} onClick={() => _showMoreGroups()} disabled={!nextLink} >Show More</PrimaryButton>
                    </Stack>
                  { filteredGroups.length  !== 0 && 
                    (
                      <Pagination
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