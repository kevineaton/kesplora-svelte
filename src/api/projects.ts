import { makeCall } from "./client";

export class ProjectsAPI {

  /**
   * Get the projects the user has access to
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getProjects(otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", "projects", data, options);
  }
  
  /**
   * Creates a project. Admins only.
   * @param otherData 
   * @param options 
   * @returns 
   */
  public createProject(otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("POST", "projects", data, options);
  }
  
  /**
   * Get a project by its id.
   * @param projectId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getProject(projectId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", `projects/${projectId}`, data, options);
  }
  
  /**
   * Update a project. Admins only.
   * @param projectId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public updateProject(projectId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("PATCH", `projects/${projectId}`, data, options);
  }

  /**
   * Get the flow of the project, which is typiclaly modules and consents.
   * @param projectId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getProjectFlow(projectId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", `projects/${projectId}/flow`, data, options);
  }
}