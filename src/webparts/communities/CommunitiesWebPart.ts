 

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneChoiceGroup,
  PropertyPaneSlider,
  
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'CommunitiesWebPartStrings';
import Communities from './components/Communities';
import { ICommunitiesProps } from './components/ICommunitiesProps';
import { SelectLanguage } from './components/SelectLanguage';
import GraphService from '../../services/GraphService';

export interface ICommunitiesWebPartProps {
  description: string;
  prefLang: string;
  targetAudience: string;
  hidingGroups: string;
  layout: string;
  titleEn: string;
  titleFR: string;
  numberPerPage: number;
  sort: string;
  seeAllLink: string;
  createCommLink: string;
  seeAllCommunitiesLink: string;
}

export default class CommunitiesWebPart extends BaseClientSideWebPart<ICommunitiesWebPartProps> {

  private _isDarkTheme: boolean = false;
  private strings: ICommunitiesWebPartStrings;
  
  public updateWebPart= async ():Promise<void> => {
    this.context.propertyPane.refresh();
    this.render();
  }
 

  public render(): void {
    const element: React.ReactElement<ICommunitiesProps> = React.createElement(
      Communities,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        prefLang: this.properties.prefLang,
        context: this.context,
        targetAudience: this.properties.targetAudience,
        hidingGroups: this.properties.hidingGroups,
        updateWebPart:this.updateWebPart,
        layout: this.properties.layout,
        titleEn: this.properties.titleEn,
        titleFr: this.properties.titleFR,
        numberPerPage : this.properties.numberPerPage,
        sort: this.properties.sort,
        seeAllLink: this.properties.seeAllLink,
        createCommLink: this.properties.createCommLink,
        seeAllCommunitiesLink: this.properties.seeAllCommunitiesLink,

       
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected  async onInit(): Promise<void> {
    this.strings = SelectLanguage(this.properties.prefLang);
    await  super.onInit() 
    await   GraphService.setup(this.context);
  }



  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private validateURL(value:string):string {
    const urlregex = new RegExp(
      // eslint-disable-next-line no-useless-escape
      "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
      
    if (value === null ||
      value.trim().length === 0) {
      return '';
    }    
    else if(!urlregex.test(value))
    {
      return 'Please type a valid URL';
    }
    return '';
}


  
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    const layoutOptions = [
      {
        key: "Grid",
        text: this.strings.gridIcon,
        iconProps: { officeFabricIconFontName: "GridViewSmall"},
 
        //disabled: this.properties.targetAudience === "2"
      },
      {
        key: "Compact",
        text: this.strings.compactIcon,
        iconProps: { officeFabricIconFontName: "BulletedList2"},
        //disabled: this.properties.targetAudience === "1"  
      },
      {
        key: "List",
        text: this.strings.listIcon,
        iconProps: { officeFabricIconFontName: "ViewList"},
       // disabled: this.properties.targetAudience === "1"  
      }
    ];

    const layoutOptionsDisabled = [
      {
        key: "Grid",
        text: this.strings.gridIcon,
        iconProps: { officeFabricIconFontName: "GridViewSmall"},
        disabled: this.properties.targetAudience === undefined
      },
      {
        key: "Compact",
        text: this.strings.compactIcon,
        iconProps: { officeFabricIconFontName: "BulletedList2"},
        disabled: this.properties.targetAudience === undefined 
      },
      {
        key: "List",
        text: this.strings.listIcon,
        iconProps: { officeFabricIconFontName: "ViewList"},
        disabled: this.properties.targetAudience === undefined 
      }
    ];

    const updateLayoutOptions = (): void => {
      this.context.propertyPane.refresh();
  };
  

    const choiceGroupLayout = {
        label: this.strings.setLayoutOpt,
        options: this.properties.targetAudience !== undefined ? layoutOptions : layoutOptionsDisabled,
        onPropertyChange: updateLayoutOptions
    };
 

    // let viewAll: any;
    // if(this.properties.targetAudience === '2') {
    //   viewAll = PropertyPaneTextField('seeAllLink', {
    //     label: strings.seeAllLink,
    //   })
    // }
    
    console.log("Select", this.properties.targetAudience);

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneDropdown('prefLang', {
                  label: 'Preferred Language',
                  options: [
                      { key: 'account', text: 'Account' },
                      { key: 'en-us', text: 'English' },
                      { key: 'fr-fr', text: 'Français' }
                  ],
                 selectedKey: this.properties.prefLang
                }),
                PropertyPaneTextField('titleEn', {
                  label: strings.setTitleEn
                }),
                
                PropertyPaneTextField('titleFr', {
                  label: strings.setTitleFr
                }), 

                PropertyPaneDropdown('targetAudience', {
                  label: 'Select Audience',
                  options: [
                   { key: '1', text: 'All_Communities' },
                   { key: '2', text: 'User_Communities'},
                 ],

               }),

                PropertyPaneChoiceGroup("layout", choiceGroupLayout),

                PropertyPaneTextField( 'hidingGroups', {
                  label: 'Groups not in search, seperate items by pressing the Enter key.',
                  placeholder: 'Seperate items by pressing the Enter key.',
                  description: 'Enter group id of groups that are not to be rendered',
                  multiline: true,
                  rows: 10,
                }),

                
                PropertyPaneSlider('numberPerPage', {
                  label: 'items per page',
                  min: 1,
                  max: 50,
                  step: 1,
                  showValue: true,
                  value: 3
                }),

                PropertyPaneTextField('createCommLink', {
                  label: this.strings.createCommLink
                }),

                PropertyPaneTextField('seeAllLink', {
                  label: this.strings.seeAllLabel,
                  onGetErrorMessage: this.validateURL.bind(this),
                }),
                PropertyPaneTextField('seeAllCommunitiesLink', {
                  label: this.strings.see_All_Communities_link,
                  onGetErrorMessage: this.validateURL.bind(this),
                }),
                 
                PropertyPaneChoiceGroup("sort", {
                  label: this.strings.setSortOpt,
                  options: [
                    {
                      key: "DateCreation",
                      text: this.strings.dateCreation,

                    },
                    {
                      key: "Alphabetical",
                      text: this.strings.alphabetical,
                    }
                  ]
                })


                          
              ]
            }
          ]
        }
      ]
    };
  }


}