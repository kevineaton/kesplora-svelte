import { makeCall } from "./client";

export class UserAPI {

  /**
   * Login attempts to login a user
   * @param login: either the email or the participant code 
   * @param password 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public login(login: string, password: string, otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
      login,
      password,
    }
    return makeCall("POST", "login", data, options);
  }
}