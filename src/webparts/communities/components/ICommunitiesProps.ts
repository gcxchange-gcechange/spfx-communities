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

}
