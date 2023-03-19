import { makeCall } from "./client";

//
// Note that currently, the endpoints are duplicated between /participant and /admin
// because everyone should be able to CRUD notes, so we take in the user role as a param
//

export class NotesAPI {

  /**
   * Creates a new note
   * @param userRole 
   * @param data 
   * @param options 
   * @returns 
   */
  public createNote(userRole: "admin" | "participant", data: any = {}, options: any = {}){
    return makeCall("POST", `/${userRole}/notes`, data, options);
  }

  /**
   * Get notes for the user
   * @param userRole 
   * @param data 
   * @param options 
   * @returns 
   */
  public getNotes(userRole: "admin" | "participant", data: any = {}, options: any = {}){
    return makeCall("GET", `/${userRole}/notes`, data, options);
  }

  /**
   * Get a single note
   * @param userRole 
   * @param noteId 
   * @param data 
   * @param options 
   * @returns 
   */
  public getNote(userRole: "admin" | "participant", noteId: number, data: any = {}, options: any = {}){
    return makeCall("GET", `/${userRole}/notes/${noteId}`, data, options);
  }

  /**
   * Updates a note
   * @param userRole 
   * @param noteId 
   * @param data 
   * @param options 
   * @returns 
   */
  public updateNote(userRole: "admin" | "participant", noteId: number, data: any = {}, options: any = {}){
    return makeCall("PATCH", `/${userRole}/notes/${noteId}`, data, options);
  }

  /**
   * Deletes a note
   * @param userRole 
   * @param noteId 
   * @param data 
   * @param options 
   * @returns 
   */
  public deleteNote(userRole: "admin" | "participant", noteId: number, data: any = {}, options: any = {}){
    return makeCall("DELETE", `/${userRole}/notes/${noteId}`, data, options);
  }
}