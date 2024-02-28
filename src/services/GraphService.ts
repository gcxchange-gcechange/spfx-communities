/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { MSGraphClientV3 } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";




export class GraphService {
   
    public static _context: WebPartContext;

    public static async setup(context: WebPartContext): Promise<void> {
  
        this._context = context;
        console.log("CONTECT",context);
    }

    public static async getUserGroups(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            try {
                this._context.msGraphClientFactory
                    .getClient('3')
                    .then((client: MSGraphClientV3):void  => {
                        client.api("/me/memberOf/$/microsoft.graph.group?$filter=groupTypes/any(a:a eq 'unified')&$select=id,displayName,description,createdDateTime, groupTypes")
                        .get(async (error, response: any, rawResponse?: any) => {
                        await this._context.msGraphClientFactory
                            .getClient('3')
                            .then((client: MSGraphClientV3):void => {
                                client.api("/me/ownedObjects/$/microsoft.graph.group?$select=id,displayName, description, createdDateTime")
                                .get( (error, response2: any, rawResponse?: any) => {
                                    const responseResults: any[] = response.value.concat(response2.value);

                                    const uniqueValues = responseResults.filter((obj, index, self) => 
                                        index === self.findIndex((innerObj) => innerObj.id === obj.id)
                                    );
                                    console.log(uniqueValues);
    
                                    resolve(uniqueValues);
                                });
                            });
                        });
                    });
            }
            catch(error) {
                console.log("ERROR", error);
                reject(error);
            }
        })
    }

    public static async getAllGroups(selectedLetter: string):Promise<any> {

        let apiTxt: string;

        if (selectedLetter === "#") {
            apiTxt =
              "/groups?$filter=groupTypes/any(c:c+eq+'Unified') and startsWith(displayName,'1') or startswith(displayName,'2') or startswith(displayName,'3') or startswith(displayName,'4')or startswith(displayName,'5') or startswith(displayName,'6') or startswith(displayName,'7') or startswith(displayName,'8') or startswith(displayName,'9')&$select=id,displayName, createdDateTime,description&$top=5";
          } else {
            apiTxt = `/groups?$filter=groupTypes/any(c:c+eq+'Unified') and startsWith(displayName,'${selectedLetter}')&$select=id,displayName,createdDateTime,description&$top=5`;
          }
        
        const requestBody = {
            requests: [
                {
                id: "1",
                method: "GET",
                url: `${apiTxt}`
                }
            ]
        };

        return  new Promise((resolve, reject) => {

            try {
                this._context.msGraphClientFactory
                    .getClient('3')
                    .then((client: MSGraphClientV3) => {
                        client
                            .api(`/$batch`)
                            .post(requestBody, (error: any, responseObject: any) => {
                                console.log("R0",responseObject);
                                const responseResults: any[] = [];
                                responseResults.push(...responseObject.responses[0].body.value);
 
                                const link = responseObject.responses[0].body["@odata.nextLink"];

                                if (error) {
                                    reject(error);

                                }
                                else if (link) {
                                    const handleNextPage = (url: string ):any => {
                                        client.api(url).get((error:any, response2: any) => {
                                            const nextLink = response2["@odata.nextLink"];
                                            responseResults.push(...response2.value);

                                            if (nextLink) {
                                                handleNextPage(nextLink);
                                            }
                                            else {
                                                resolve(responseResults);
                                            }
                                        });
                                    }
                                    handleNextPage(link);
                                }

                            });
                    });
            }
            catch(error){
                console.log(error)
            }
        });

    }

    public static async getGroupDetailsBatch(group: any): Promise<any> {
        console.log("Group", group)
        const requestBody = {
          requests: [
            {
              id: "1",
              method: "GET",
              url: `/groups/${group.id}/sites/root/`,
            },
            {
              id: "2",
              method: "GET",
              url: `/groups/${group.id}/members/$count?ConsistencyLevel=eventual`
            },
            {
              id: "3",
              method: "GET",
              url: `/groups/${group.id}/photos/48x48/$value`
            },
    
          ],
        };
        return new Promise((resolve, reject) => {
          try {
            this._context.msGraphClientFactory
              .getClient('3')
              .then((client: MSGraphClientV3):void => {
                client
                  .api(`/$batch`)
                  .post(requestBody, (error: any, responseObject: any) => {
                    if (error) {
                      Promise.reject(error);
                    }
                    const responseContent = [{}];
    
                    responseObject.responses.forEach((response: any) => {
    
                      if (response.status === 200) {
                        responseContent[response.id] = response.body;
                      } else if (response.status === 403 || response.status === 404) {
                        return null;
                      }
                    });
    
                    resolve(responseContent);
                  });
              });
          } catch (error) {
            reject(error);
            console.error(error);
          }
        });
      }
    

    





}

export default GraphService;