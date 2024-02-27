import * as React from 'react';
//import styles from './Communities.module.scss';
import type { ICommunitiesProps } from './ICommunitiesProps';
import GraphService from '../../../services/GraphService';
import { useEffect, useState  } from 'react';
 



const Communities: React.FC<ICommunitiesProps> = (props) => {
  const {
    targetAudience,
  } = props;

 
  const [groups, setGroups] = useState<any[]>([]);

  const getUserGroups = () => {
    GraphService.getUserGroups().then(data => {
      setGroups(data);
    })

  }
  useEffect(() => {
    if (targetAudience === '1') {
      getUserGroups();
    }
  }, [props])

  return (
    <>
    <div> Picked NEW: {targetAudience}</div>
    <div> Name:{groups}</div>
    </>
  )


}

export default Communities;
