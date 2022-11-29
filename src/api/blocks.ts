import { makeCall } from "./client";

export class BlocksAPI {

  /**
   * Get the blocks on the platform. Admins only.
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getBlocks(otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", "blocks", data, options);
  }
  
  /**
   * Create a block. Admins only.
   * @param blockData 
   * @param options 
   * @returns 
   */
  public createBlock(blockType: string, blockData: any = {}, options: any = {}){
    const data = {
      ...blockData,
      blockType,
    }
    return makeCall("POST", `blocks/${blockType}`, data, options);
  }
  
  /**
   * Get a block by its id.
   * @param blockId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getBlock(blockId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", `blocks/${blockId}`, data, options);
  }
  
  /**
   * Update a block. Admins only.
   * @param blockId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public updateBlock(blockId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("PATCH", `blocks/${blockId}`, data, options);
  }

  /**
   * Deletes a block
   * @param blockId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public deleteBlock(blockId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("DELETE", `blocks/${blockId}`, data, options);
  }

  /**
   * Links a block and a project. Admins only.
   * @param moduleId 
   * @param blockId 
   * @param order 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public linkBlockToModule(moduleId: number, blockId: number, order: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("PUT", `modules/${moduleId}/blocks/${blockId}/order/${order}`, data, options);
  }

  /**
   * Unlinks a block and a project. Admins only.
   * @param moduleId 
   * @param blockId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public unlinkBlockFromModule(moduleId: number, blockId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("DELETE", `modules/${moduleId}/blocks/${blockId}`, data, options);
  }

  /**
   * Gets any blocks attached to a module
   * @param moduleId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getBlocksOnModule(moduleId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", `/modules/${moduleId}/blocks`, data, options);
  }

  /**
   * Unlinks all blocks from a module
   * @param moduleId 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public unlinkAllBlocksOnAModule(moduleId: number, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("DELETE", `/modules/${moduleId}/blocks`, data, options);
  }
}