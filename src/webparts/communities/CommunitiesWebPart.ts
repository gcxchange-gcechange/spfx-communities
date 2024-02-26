import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneChoiceGroup,
  
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'CommunitiesWebPartStrings';
import Communities from './components/Communities';
import { ICommunitiesProps } from './components/ICommunitiesProps';
import { SelectLanguage } from './components/SelectLanguage';

export interface ICommunitiesWebPartProps {
  description: string;
  prefLang: string;
  targetAudience: string;
}

export default class CommunitiesWebPart extends BaseClientSideWebPart<ICommunitiesWebPartProps> {

  private _isDarkTheme: boolean = false;
  private strings: ICommunitiesWebPartStrings;

 

  public render(): void {
    const element: React.ReactElement<ICommunitiesProps> = React.createElement(
      Communities,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        prefLang: this.properties.prefLang,
        context: this.context,
        targetAudience: this.properties.targetAudience
       
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected  async onInit(): Promise<void> {
    this.strings = SelectLanguage(this.properties.prefLang);
    return super.onInit();
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





  
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    const layoutOptions = [
      {
        key: "Grid",
        text: this.strings.gridIcon,
        iconProps: { officeFabricIconFontName: "GridViewSmall"},
        checked: this.properties.targetAudience === "1",
        disabled: this.properties.targetAudience === "1" ? false : true
      },
      {
        key: "Compact",
        text: this.strings.compactIcon,
        iconProps: { officeFabricIconFontName: "BulletedList2"},
        disabled: this.properties.targetAudience === "1" ? true : false
      },
      {
        key: "List",
        text: this.strings.ListIcon,
        iconProps: { officeFabricIconFontName: "ViewList"},
        checked: this.properties.targetAudience === "2",
        disabled: this.properties.targetAudience === "1" ? true : false
      }
    ];
    
    const choiceGroupLayout = {
      label: this.strings.setLayoutOpt,
      options: layoutOptions
    };




    // let viewAll: any;
    // if(this.properties.targetAudience === '2') {
    //   viewAll = PropertyPaneTextField('seeAllLink', {
    //     label: strings.seeAllLink,
    //   })
    // }
    
  
    
    

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
                selectedKey: this.properties.targetAudience
               }),

                PropertyPaneChoiceGroup("layout", choiceGroupLayout),

                 
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