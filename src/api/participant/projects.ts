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

  // special handlers for forms

  /**
   * Saves a new submission
   * @param projectId 
   * @param moduleId 
   * @param blockId 
   * @param responseData 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public saveFormSubmission(projectId: number, moduleId: number, blockId: number, responseData, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
      ...responseData,
    }
    return makeCall("POST", `participant/projects/${projectId}/modules/${moduleId}/blocks/${blockId}/submissions`, data, options);
  }

  /**
   * Gets submissions for a form
   * @param projectId 
   * @param moduleId 
   * @param blockId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getFormSubmissions(projectId: number, moduleId: number, blockId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", `participant/projects/${projectId}/modules/${moduleId}/blocks/${blockId}/submissions`, data, options);
  }

  /**
   * Deletes all form submissions and resets the module
   * @param projectId 
   * @param moduleId 
   * @param blockId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public deleteFormSubmissions(projectId: number, moduleId: number, blockId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("DELETE", `participant/projects/${projectId}/modules/${moduleId}/blocks/${blockId}/submissions`, data, options);
  }

  /**
   * Deletes a specific submission
   * @param projectId 
   * @param moduleId 
   * @param blockId 
   * @param submissionId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public deleteFormSubmission(projectId: number, moduleId: number, blockId: number, submissionId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("DELETE", `participant/projects/${projectId}/modules/${moduleId}/blocks/${blockId}/submissions/${submissionId}`, data, options);
  }

  /**
   * Downloads a file for a participant
   * @param fileId 
   * @param fileName 
   * @param queryData 
   * @param asAdmin needed as an override for block previews
   * @param options 
   * @returns 
   */
  public downloadFileBinary(fileId: number, fileName: string = "file", format: string = "binary", queryData: any = {}, asAdmin: boolean = false, options: any = {}){
    if(format === "base64"){
      queryData.format = format;
    } else {
      options.asDownload = true;
      options.fileName = fileName;
    }
    const target = asAdmin ? "admin" : "participant";
    return makeCall("GET", `${target}/files/${fileId}/download`, queryData, options);
  }

  /**
   * Gets the file metadata
   * @param fileId 
   * @param metaData 
   * @param asAdmin needed as an override for block previews
   * @param options 
   * @returns 
   */
  public getFileMeta(fileId, metaData: any = {}, asAdmin: boolean = false, options: any = {}){
    const data = {
      ...metaData,
    }

    const target = asAdmin ? "admin" : "participant";
    return makeCall("GET", `${target}/files/${fileId}`, data, options);
  }
}