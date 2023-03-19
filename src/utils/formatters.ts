
export const translateStatus = (input: string) :string => {
  let textOutput = input;
  switch(input){
    case "started":
      textOutput = "Started";
      break;
    case "not_started": 
      textOutput = "Not Yet Started";
      break;
    case "completed":
      textOutput = "Completed";
      break;
  }
  return textOutput;
};

export const capFirst = (input: string): string => {
  if(input.length === 0){
    return input;
  } else if(input.length === 1){
    return input[0].toUpperCase();
  }
  return input[0].toUpperCase() + input.substring(1);
}