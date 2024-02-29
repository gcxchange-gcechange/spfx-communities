/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */

import * as React from 'react';
//import styles from './Communities.module.scss';
import type { ICommunitiesProps } from './ICommunitiesProps';
import GraphService from '../../../services/GraphService';
import { useEffect, useState } from 'react';
import AlphabeticalFilter from './AlphabeticalFilter';


const Communities: React.FC<ICommunitiesProps> = (props) => {
  const {
    targetAudience,
  } = props;

 
  //const [myGroups, setMyGroups] = useState<any[]>([]);
  //const [allGroups, setAllGroups] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>("A");

  console.log(setSelectedLetter)

  const getGroupDetailsData = (groups: any): void => {
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
                      modified: groupDetails[1].lastModifiedDateTime,
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

  const removeGroupsWithoutURL = (updatedGroups: any):void => {
    const filterGroup = updatedGroups.filter((group:any ) => group.url);
    setFilteredGroups(filterGroup);
    return filterGroup
  }

  const getUserGroups = ():void => {
    GraphService.getUserGroups().then(data => {
      setGroups(data);
      getGroupDetailsData(data);
    })
  
  }

  const _getAllGroups = (selectedLetter: string):void => {
    GraphService.getAllGroups(selectedLetter).then(allGroupData => {
      setGroups(allGroupData);
      getGroupDetailsData(allGroupData);
    });  

   
  }

  // const getSelectedLetter = ():void => {

  // }



  useEffect(() => {
    if (targetAudience === '1') {
      _getAllGroups(selectedLetter);
    }
    else if (targetAudience === '2') {
      getUserGroups();
    }
  }, [props]);


  useEffect(() => {
    if (targetAudience === '1') {
      _getAllGroups(selectedLetter);
    }
  }, [selectedLetter]);

  return (
    <>
    <div> Picked NEW: {targetAudience}</div>
    <div>
    {props.targetAudience === '2' && (
      <>    
      <h3>User Groups</h3>
      <ul>
        {groups.map(item => (
          <li key={item.id}>
            {item.id}, {item.displayName}
            <ul>
              <li>{item.url}</li>
              <li>{item.members}</li>
            </ul>
          </li>
        ))};
      </ul>
      </>
      )}
    </div>
    <div>
      {props.targetAudience === '1' && (
        <>      
      <h3>All Groups</h3>
      <div>
        <AlphabeticalFilter selectedLetter={selectedLetter}  />
      </div>
       <ul>
        {filteredGroups.map(item => (
          <>
          <li key={item.id}>{item.id} NAME: {item.displayName}</li>
          <ul>
            <li>URL: {item.url}</li>
          
          </ul>
          </>
        ))}
        
      </ul>
      </>
      )}
     
    </div>
      
   
    </>
  )


}

export default Communities;
