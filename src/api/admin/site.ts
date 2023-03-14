import { makeCall } from "../client";

export class SiteAPI {

  /**
   * Gets the information for the currently installed site
   * @param data 
   * @param options 
   * @returns 
   */
  public getSiteInfo(data: any = {}, options: any = {}){
    return makeCall("GET", "/site", data, options);
  }

  /**
   * Updates the site's information
   * @param data 
   * @param options 
   * @returns 
   */
  public updateSiteInfo(data: any, options: any = {}){
    return makeCall("PATCH", "/admin/site", data, options);
  }

}