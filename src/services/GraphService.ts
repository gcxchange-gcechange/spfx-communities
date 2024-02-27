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
                        client.api("/me/memberOf/$/microsoft.graph.group?$filter=groupTypes/any(a:a eq 'unified')")
                        .get(async (error, response: any, rawResponse?: any) => {

                        await this._context.msGraphClientFactory
                            .getClient('3')
                            .then((client: MSGraphClientV3):void => {
                                client.api("/me/ownedObjects/$/microsoft.graph.group")
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
            }
        })
    }

    





}

export default GraphService;