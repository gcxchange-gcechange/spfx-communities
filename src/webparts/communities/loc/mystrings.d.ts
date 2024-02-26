declare interface ICommunitiesWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  altImgLogo: string;
  pagPrev: string;
  pagNext: string;
  setTitleEn: string;
  setTitleFr: string;
  setPageNum: string;
  setLayoutOpt: string;
  setSortOpt: string;
  userLang: string;
  gridIcon: string;
  compactIcon: string;
  dateCreation: string;
  alphabetical: string;
  showmore: string;
  showless: string;
  members:string;
  seeAllLink: string;
  seeAll: string;
  seeAllLabel: string;
  ListIcon: string;
  createCommLink: string;
  createComm: string;
  seeAllToggle: string;
  seeAllOn: string;
  seeAllOff:string;
  loadingState: string;
}

declare module 'CommunitiesWebPartStrings' {
  const strings: ICommunitiesWebPartStrings;
  export = strings;
}