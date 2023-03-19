import { makeCall } from "../client";

export class UsersAPI {

  /**
   * Get a list of users on the platform
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getUsersOnPlatform(otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", "admin/users", data, options);
  }
  
  /**
   * Get a specific user on the platform
   * @param userId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getUser(userId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", `admin/users/${userId}`, data, options);
  }

  /**
   * Get a list of projects for a user
   * @param userId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getUserProjects(userId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", `admin/users/${userId}/projects`, data, options);
  }

  /**
   * Gets the users on a project. This could have been placed in the projects api file as well, but decided
   * to keep the users stuff here.
   * @param projectId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getProjectUsers(projectId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", `admin/projects/${projectId}/users`, data, options);
  }
  
  /**
   * Get a single project for a user
   * @param userId 
   * @param projectId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getUserProject(userId: number, projectId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", `admin/users/${userId}/projects/${projectId}`, data, options);
  }

  /**
   * Add an existing user to a project
   * @param userId 
   * @param projectId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public linkUserAndProject(userId: number, projectId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("POST", `admin/users/${userId}/projects/${projectId}`, data, options);
  }

  /**
   * Unlink a user and a project
   * @param userId 
   * @param projectId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public unlinkUserAndProject(userId: number, projectId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("DELETE", `admin/users/${userId}/projects/${projectId}`, data, options);
  }
}