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

  /**
   * Log out the user
   * @param otherData 
   * @param options 
   * @returns 
   */
  public logout(otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("POST", "logout", data, options);
  }

  /**
   * Get My Profile
   * @param otherData 
   * @param options 
   * @returns 
   */
  public getMe(otherData: any = {}, options: any = {}){
    const data = {
      ...otherData,
    }
    return makeCall("GET", "me", data, options);
  }

  /**
   * Update my profile
   * @param profile 
   * @param otherData 
   * @param options 
   * @returns 
   */
  public updateMe(profile: any, otherData: any = {}, options: any = {}){
    const data = {
      ...profile,
      ...otherData,
    }
    return makeCall("PATCH", "/me", profile, options);
  }
}