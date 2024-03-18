import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICommunitiesProps {
  description: string;
  isDarkTheme: boolean;
  context: WebPartContext;
  prefLang: string;
  targetAudience: string;
  hidingGroups: string;
  updateWebPart: () => void;
  layout: string;
  titleEn: string;
  titleFr: string;
  numberPerPage: number;
  sort: string;
  seeAllLink: string;

}
