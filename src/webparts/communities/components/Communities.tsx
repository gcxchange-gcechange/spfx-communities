/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */

import * as React from 'react';
//import styles from './Communities.module.scss';
import type { ICommunitiesProps } from './ICommunitiesProps';
import GraphService from '../../../services/GraphService';
import { useEffect, useState } from 'react';
import AlphabeticalFilter from './AlphabeticalFilter';
// import { Icon } from '@fluentui/react';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import GridLayoutStyle from './GridLayoutStyle';
import styles from './Communities.module.scss';
import { Stack } from '@fluentui/react';



const Communities: React.FC<ICommunitiesProps> = (props) => {
  const {
    targetAudience,

  } = props;

 
  const [_groups, setGroups] = useState<any[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>("A");


  const _getPageViews = (filteredGroups:any):void => {
    filteredGroups.map((group: any) => {
      GraphService.pageViewsBatch(group.siteId).then((siteViews) => {
         setFilteredGroups(prevFilteredGroups => {
          const updatedFiltered = prevFilteredGroups.map( groupItems => 
            groupItems.id === group.id ?
            {
             ...groupItems,
             views: siteViews
            }
            :
            groupItems
            );

            return updatedFiltered;
         });    
      })
    })
  }

  const removeGroupsWithoutURL = (updatedGroups: any):void => {

    const filterGroup = updatedGroups.filter((group:any ) => group.url);
    setFilteredGroups(filterGroup);
    _getPageViews(filterGroup);
    return filterGroup;

  }

  const _getGroupDetailsData = (groups: any): void => {
    groups.map((groupData: any) => {
      GraphService.getGroupDetailsBatch(groupData.id).then((groupDetails) => {
        try {
          if (groupDetails[1] && (groupDetails[1].webUrl !== null || groupDetails[1].webUrl !== undefined)) {
            setGroups(prevGroups => {
              const updatedGroups = prevGroups.map(groupItems =>
                groupItems.id === groupData.id
                  ? {
                      ...groupItems,
                      url: groupDetails[1].webUrl,
                      siteId: groupDetails[1].id,
                      modified:  new Date(groupDetails[1].lastModifiedDateTime).toLocaleDateString("en-CA"),
                      members: groupDetails[2],
                      thumbnail: "data:image/jpeg;base64," + groupDetails[3]
                    }
                  : groupItems
              );
            
            removeGroupsWithoutURL(updatedGroups);

            return updatedGroups;
            });
          } 
        } catch (error) {
          console.log("ERROR", error);
        }
      });
    });
  }

  

  const _getUserGroups = ():void => {
    GraphService.getUserGroups().then(data => {
      setGroups(data);
      _getGroupDetailsData(data);
    })
  
  }

  const _getAllGroups = (selectedLetter: string):void => {
    GraphService.getAllGroups(selectedLetter).then(allGroupData => {
      setGroups(allGroupData);
      _getGroupDetailsData(allGroupData);
    });  

   
  }

  const getSelectedLetter = (letter: string):void => {
    setSelectedLetter(letter);
  }

  const openPropertyPane = ():void => {
    props.context.propertyPane.open();
  }


  useEffect(() => {
    if (targetAudience === '1') {
      _getAllGroups(selectedLetter);
    }
    else if (targetAudience === '2') {
      _getUserGroups();
    }
  }, [props]);


  useEffect(() => {
    if (targetAudience === '1') {
      _getAllGroups(selectedLetter);
    }
  }, [selectedLetter]);
  
  
  return (
    <>
    <div>
      {( !props.targetAudience && (
 
      <Placeholder iconName='Edit'
             iconText='Configure your web part'
             description='Please configure the web part.'
             buttonLabel='Configure'
             onConfigure={openPropertyPane}

      />
        )
      )}
    </div>
    <div>
    {props.targetAudience === '2' && (
      <>    
      <h3>User Groups</h3>
      <ul>
        {filteredGroups.map(item => (
          <li key={item.id}>
            {item.id}, {item.displayName}
            <ul>
              <li>URL: {item.url}</li>
              <li>MEMBERS: {item.members}</li>
              <li>VIEWS: {item.views}</li>
            </ul>
          </li>
        ))}
      </ul>
      </>
      )}
    </div>
    <div>
      {props.targetAudience === '1' && (
        <>      
      <h3>All Groups</h3>
      <div>
        <AlphabeticalFilter selectedLetter={selectedLetter} onSelectLetter={getSelectedLetter} />
      </div>
      <GridLayoutStyle items={filteredGroups}/>
      <Stack horizontal horizontalAlign="space-evenly" wrap={true}>
        {filteredGroups.map(item => (
          <>
          <div className={styles.cardContainer } >
            <a href={item.url}>
              <div className={styles.cardBanner}>
                <img className={styles.cardImg} src={item.thumbnail}/>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{item.displayName}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
              <div className ={styles.cardFooter}>
                  <Stack horizontal horizontalAlign='space-between'>
                    <div>
                      <p style={{margin:'0'}}><strong>Members </strong>{item.members}</p>
                      <p ><strong>Views</strong> {item.views}</p>
                    </div>
                    <div>
                      <p style={{margin:'0'}}><strong>Created</strong> {new Date(item.createdDateTime).toLocaleDateString("en-CA")}</p>
                      <p><strong>Last modified</strong> {item.modified}</p>
                    </div>
                  </Stack>
              </div>
              </a>
          </div>
          </>
        ))}
      </Stack>
      </>
      )}
     
    </div>
    </>
  )


}

export default Communities;
