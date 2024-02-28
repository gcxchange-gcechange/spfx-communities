/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */

import * as React from 'react';
//import styles from './Communities.module.scss';
import type { ICommunitiesProps } from './ICommunitiesProps';
import GraphService from '../../../services/GraphService';
import { useEffect, useState  } from 'react';
import AlphabeticalFilter from './AlphabeticalFilter';
 



const Communities: React.FC<ICommunitiesProps> = (props) => {
  const {
    targetAudience,
  } = props;

 
  //const [myGroups, setMyGroups] = useState<any[]>([]);
  //const [allGroups, setAllGroups] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>("A");

  console.log(setSelectedLetter)



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

  const getGroupDetailsData = (groups:any):void => {
    groups.map((group: any) => {
      GraphService.getGroupDetailsBatch(group.id).then(groupDetails => {
        console.log("GD",groupDetails);
      })
    })
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
  }, [])

  useEffect(() => {
      _getAllGroups(selectedLetter);
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
          <li key={item.id}>{item.id}</li>
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
        <AlphabeticalFilter selectedLetter={selectedLetter}  />
      </div>
       <ul>
      {groups.map(item => (
          <li key={item.id}>{item.id}</li>
        ))}
      </ul>
      </>
      )}
     
    </div>
      
   
    </>
  )


}

export default Communities;
