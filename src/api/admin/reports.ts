import { makeCall } from "../client";

//
// Note that currently, the endpoints are duplicated between /participant and /admin
// because everyone should be able to CRUD notes, so we take in the user role as a param
//

export class ReportsAPI {

  /**
   * Get a cound of users on the project by their status
   * @param userRole 
   * @param data 
   * @param options 
   * @returns 
   */
  public getUsersOnProjectByStatus(projectId: number, data: any = {}, options: any = {}){
    return makeCall("GET", `/admin/reports/projects/${projectId}/status`, data, options);
  }

  /**
   * Get the count of users on the project by their last updated
   * @param projectId 
   * @param data 
   * @param options 
   * @returns 
   */
  public getUsersOnProjectByLastUpdated(projectId: number, data: any = {}, options: any = {}){
    return makeCall("GET", `/admin/reports/projects/${projectId}/lastUpdatedOn`, data, options);
  }

  /**
   * Get the count of users by status in each step of the flow
   * @param projectId 
   * @param data 
   * @param options 
   * @returns 
   */
  public getUsersOnProjectByFlowStatus(projectId: number, data: any = {}, options: any = {}){
    return makeCall("GET", `/admin/reports/projects/${projectId}/flow/status`, data, options);
  }


  public getProjectSubmissions(projectId: number, data: any = {}, options: any = {}){
    return makeCall("GET", `/admin/reports/projects/${projectId}/flow/submissions`, data, options);
  }

  public getProjectSubmissionsForBlock(projectId: number, moduleId: number, blockId: number, data: any = {}, options: any = {}){
    return makeCall("GET", `/admin/reports/projects/${projectId}/flow/modules/${moduleId}/blocks/${blockId}/submissions`, data, options);
  }
}