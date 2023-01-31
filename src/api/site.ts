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
   * Gets all of the available projects on a site
   * @param data 
   * @param options 
   * @returns 
   */
  public getSiteProjects(data: any = {}, options: any = {}){
    return makeCall("GET", "/projects", data, options);
  }

  /**
   * Gets the public information for a project
   * @param projectId 
   * @param data 
   * @param options 
   * @returns 
   */
  public getProjectInfo(projectId: number, data: any = {}, options: any = {}){
    return makeCall("GET", `/projects/${projectId}`, data, options);
  }

  /**
   * Gets the consent form for a project, which must be available without sign up
   * @param projectId 
   * @param data 
   * @param options 
   * @returns 
   */
  public getProjectConsent(projectId: number, data: any = {}, options: any = {}){
    return makeCall("GET", `/projects/${projectId}/consent`, data, options);
  }

  /**
   * Saves the project consent response. If the project is set to a limited visibility, additional user
   * information should be provided.
   * @param projectId 
   * @param data 
   * @param options 
   * @returns 
   */
  public saveProjectConsentResponse(projectId: number, data: any = {}, options: any = {}){
    return makeCall("POST", `/projects/${projectId}/consent/responses`, data, options);
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
   * Attempts to configure a site for first use. This isn't behind admin because the credentials
   * could not have been configured beforehand.
   * @param data 
   * @param options 
   * @returns 
   */
  public setSiteSetupInfo(data: any = {}, options: any = {}){
    return makeCall("POST", "/setup", data, options);
  }
}