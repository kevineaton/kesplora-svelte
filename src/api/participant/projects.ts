import { makeCall } from "../client";

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
    return makeCall("GET", "participant/projects", data, options);
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
    return makeCall("GET", `participant/projects/${projectId}`, data, options);
  }
  
  /**
   * Gets the participant's flow status for the project
   * @param projectId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getProjectFlow(projectId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", `participant/projects/${projectId}/flow`, data, options);
  }

  /**
   * Get the block for a user in a project
   * @param projectId 
   * @param moduleId 
   * @param blockId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getProjectModuleBlock(projectId: number, moduleId: number, blockId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", `participant/projects/${projectId}/modules/${moduleId}/blocks/${blockId}`, data, options);
  }

  /**
   * Update the status for a user in a project
   * @param projectId 
   * @param moduleId 
   * @param blockId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public updateProjectModuleBlockStatus(projectId: number, moduleId: number, blockId: number, status: string, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("PUT", `participant/projects/${projectId}/modules/${moduleId}/blocks/${blockId}/status/${status}`, data, options);
  }
}