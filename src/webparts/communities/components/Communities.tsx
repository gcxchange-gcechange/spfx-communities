import * as React from 'react';
//import styles from './Communities.module.scss';
import type { ICommunitiesProps } from './ICommunitiesProps';


const Communities: React.FC<ICommunitiesProps> = (props) => {
  const {
    targetAudience
  } = props;

// React.useEffect(() => {

// }, [props])

  return (
    <div> Picked NEW: {targetAudience}</div>
  )


}

export default Communities;
