import { makeCall } from "../client";

export class ModulesAPI {

  /**
   * Get the modules on the platform. Admins only.
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getModules(otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", "admin/modules", data, options);
  }
  
  /**
   * Create a module. Admins only.
   * @param otherData 
   * @param options 
   * @returns 
   */
  public createModule(otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("POST", "admin/modules", data, options);
  }
  
  /**
   * Get a module by its id.
   * @param moduleId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getModule(moduleId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", `admin/modules/${moduleId}`, data, options);
  }
  
  /**
   * Update a module. Admins only.
   * @param moduleId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public updateModule(moduleId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("PATCH", `admin/modules/${moduleId}`, data, options);
  }

  /**
   * Deletes a module
   * @param moduleId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public deleteModule(moduleId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("DELETE", `admin/modules/${moduleId}`, data, options);
  }

  /**
   * Links a module and a project. Admins only.
   * @param projectId 
   * @param moduleId 
   * @param order 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public linkModuleToProject(projectId: number, moduleId: number, order: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("PUT", `admin/projects/${projectId}/modules/${moduleId}/order/${order}`, data, options);
  }

  /**
   * Unlinks a module and a project. Admins only.
   * @param projectId 
   * @param moduleId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public unlinkModuleFromProject(projectId: number, moduleId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("DELETE", `admin/projects/${projectId}/modules/${moduleId}`, data, options);
  }
}