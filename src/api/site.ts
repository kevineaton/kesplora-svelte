import { makeCall } from "./client";

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
   * Gets the site's set up configuration
   * @param data 
   * @param options 
   * @returns 
   */
  public getSiteSetupInfo(data: any = {}, options: any = {}){
    return makeCall("GET", "/setup", data, options);
  }

  /**
   * Attempts to configure a site for first use
   * @param data 
   * @param options 
   * @returns 
   */
  public setSiteSetupInfo(data: any = {}, options: any = {}){
    return makeCall("POST", "/setup", data, options);
  }
}