# Communities

## Summary

### Community Directory Web Part

Displays all SharePoint team sites and can be configured through the property pane. Users can filter groups by the selected letter or number, choose how many groups to display, sort results alphabetically or by creation date, switch between English and French, and hide specific groups by entering their group IDs.

### My Communities Web Part

Displays the SharePoint team sites that the current user belongs to, including links to each site's SharePoint page. Configuration options in the property pane allow administrators to change the language, select the number of groups to display, choose between three layouts, sort groups alphabetically or by creation date, and configure "See All" and "Create Community" links. When users belong to more groups than are displayed, a "See All" button provides access to additional results through pagination.

## Used SharePoint Framework Version

![SPFX](https://img.shields.io/badge/version-1.22.2-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-v22+-green.svg)


## Prerequisites

none


## Version history

| Version | Date                | Comments             |
| ------- | --------------------| -------------------- |
| 2.1     | June 25, 2026       | Update SPFX version  |
| 2.0     | September 10, 2025  | Update SPFX version  |
| 1.1     | March 10, 2021      | Update comment       |
| 1.0     | January 29, 2021    | Initial release      |


## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- To install the dependencies, in the command-line run:
  - `npm install -g @rushstack/heft`
  - `npm install`
- To debug in the front end:
  - go to the `serve.json` file and update `initialPage` to `https://your-domain-name.sharepoint.com/_layouts/15/workbench.aspx`
  - In the command-line run:
    - `heft start`
    - You will need to add your client id and azure function to the clientId and url classs members in the SCW.tsx file.
- To deploy:
  - In the command-line run:
    - `heft build --production`
    - `heft package-solution --production`


## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---
