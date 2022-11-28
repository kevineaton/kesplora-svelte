import { makeCall } from "./client";

export class UserAPI {

  /**
   * Login attempts to login a user
   * @param email 
   * @param password 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public login(email: string, password: string, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
      email,
      password,
    }
    return makeCall("POST", "login", data, options);
  }
}