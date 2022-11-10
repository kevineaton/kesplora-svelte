
// this would ideally come from the server?
const errorMap: any = {

  // config set up
  api_error_config_invalid_code: {
    message: "That code was not valid. Please verify or confirm with your server administrator.",
  },

};

export const errorCodeToDisplayString = (code: string): string => {
  if(errorMap[code] && errorMap[code].message){
    return errorMap[code].message;
  }
  return "Unknown";
};