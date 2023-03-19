import { makeCall } from "../client";

export class FilesAPI {

  /**
   * Gets a list of files with optional sorting and offsets
   * @param queryData 
   * @param options 
   * @returns 
   */
  public getFiles(queryData: any = {}, options: any = {}){
    const data = {
      ...queryData,
    }
    return makeCall("GET", "admin/files", data, options);
  }

  /**
   * Uploads a file. This will return a File struct from the API which will contain sane defaults to be updated. NOTE that the client
   * will automatically created the FormData, so this should be the equivalent of files[0]
   * @param fileData 
   * @param options 
   * @returns 
   */
  public uploadFile(fileData: any, options: any = {}){
    options.asMultipartFile = true;
    return makeCall("POST", "admin/files", fileData, options);
  }

  /**
   * Get the file's metadata
   * @param fileId 
   * @param metaData 
   * @param options 
   * @returns 
   */
  public getFileMeta(fileId, metaData: any = {}, options: any = {}){
    const data = {
      ...metaData,
    }
    return makeCall("GET", `admin/files/${fileId}`, data, options);
  }
  
  /**
   * Updates the file's metadata
   * @param fileId 
   * @param metaData 
   * @param options 
   * @returns 
   */
  public updateFileMeta(fileId, metaData: any = {}, options: any = {}){
    const data = {
      ...metaData,
    }
    return makeCall("PATCH", `admin/files/${fileId}`, data, options);
  }
  
  /**
   * Delete a file
   * @param fileId 
   * @param metaData 
   * @param options 
   * @returns 
   */
  public deleteFile(fileId, metaData: any = {}, options: any = {}){
    const data = {
      ...metaData,
    }
    return makeCall("DELETE", `admin/files/${fileId}`, data, options);
  }

  /**
   * Replace the binary for a file
   * @param fileId 
   * @param fileData 
   * @param options 
   * @returns 
   */
  public replaceFileBinary(fileId: number, fileData: any, options: any = {}){
    options.asMultipartFile = true;
    return makeCall("POST", `admin/files/${fileId}`, fileData, options);
  }

  /**
   * Downloads a file through the admin path. Note that, behind the scenes, the data is translated into a link and clicked
   * for the user. See the client.ts file.
   * @param fileId 
   * @param queryData 
   * @param options 
   * @returns 
   */
  public downloadFileBinary(fileId: number, fileName: string = "file", format: string = "binary", queryData: any = {}, options: any = {}){
    if(format === "base64"){
      queryData.format = format;
    } else {
      options.asDownload = true;
      options.fileName = fileName;
    }
    return makeCall("GET", `admin/files/${fileId}/download`, queryData, options);
  }
}