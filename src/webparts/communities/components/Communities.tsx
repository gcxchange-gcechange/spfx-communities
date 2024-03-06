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
import { Spinner, SpinnerSize } from "@fluentui/react";
import Paging from "./Paging";
import ListLayoutStyle from "./ListLayoutStyle";
import CompactLayoutStyle from "./CompactLayoutStyle";

const Communities: React.FC<ICommunitiesProps> = (props) => {
  const { targetAudience, layout } = props;

  const [_groups, setGroups] = useState<any[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>("A");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const _getPageViews = (filteredGroups: any): void => {
    filteredGroups.map((group: any) => {
      GraphService.pageViewsBatch(group.siteId).then((siteViews) => {
        setFilteredGroups((prevFilteredGroups) => {
          const updatedFiltered = prevFilteredGroups.map((groupItems) =>
            groupItems.id === group.id
              ? {
                  ...groupItems,
                  views: siteViews,
                }
              : groupItems
          );

          return updatedFiltered;
        });
        setIsLoading(false);
      });
    });
  };

  const removeGroupsWithoutURL = (updatedGroups: any): void => {
    const filterGroup = updatedGroups.filter((group: any) => group.url);
    setFilteredGroups(filterGroup);
    _getPageViews(filterGroup);
    return filterGroup;
  };

  const _getGroupDetailsData = (groups: any): void => {
    groups.map((groupData: any) => {
      GraphService.getGroupDetailsBatch(groupData.id).then((groupDetails) => {
        try {
          if (
            groupDetails[1] &&
            (groupDetails[1].webUrl !== null ||
              groupDetails[1].webUrl !== undefined)
          ) {
            setGroups((prevGroups) => {
              const updatedGroups = prevGroups.map((groupItems) =>
                groupItems.id === groupData.id
                  ? {
                      ...groupItems,
                      url: groupDetails[1].webUrl,
                      siteId: groupDetails[1].id,
                      modified: new Date(
                        groupDetails[1].lastModifiedDateTime
                      ).toLocaleDateString("en-CA"),
                      members: groupDetails[2],
                      thumbnail: "data:image/jpeg;base64," + groupDetails[3],
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
  };

  const _getUserGroups = (): void => {
    GraphService.getUserGroups().then((data) => {
      setGroups(data);
      _getGroupDetailsData(data);
    });
  };

  const _getAllGroups = (selectedLetter: string): void => {
    GraphService.getAllGroups(selectedLetter).then((allGroupData) => {
      setGroups(allGroupData);
      _getGroupDetailsData(allGroupData);
    });
  };

  const getSelectedLetter = (letter: string): void => {
    setSelectedLetter(letter);
  };

  const openPropertyPane = (): void => {
    props.context.propertyPane.open();
  };

  useEffect(() => {
    setIsLoading(true);
    if (targetAudience === "1") {
      _getAllGroups(selectedLetter);
    } else if (targetAudience === "2") {
      _getUserGroups();
    }
  }, [props.targetAudience]);

  useEffect(() => {
    if (targetAudience === "1") {
      _getAllGroups(selectedLetter);
    }
  }, [selectedLetter]);

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
        <div>
          {isLoading ? (
            <Spinner size={SpinnerSize.large} />
          ) : (
            <>
              {layout === "Compact" && (
                <CompactLayoutStyle groups={filteredGroups} />
              )}
              {layout === "List" && (
                <ListLayoutStyle groups={filteredGroups} />
              )}
              {layout === "Grid" && (
                <div>
                  {targetAudience === "1" && (
                    <AlphabeticalFilter
                      selectedLetter={selectedLetter}
                      onSelectLetter={getSelectedLetter}
                    />
                  )}
                  <GridLayoutStyle groups={filteredGroups} />
                  <Paging
                    items={filteredGroups.length}
                    itemsPerPage={props.numberPerPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Communities;
