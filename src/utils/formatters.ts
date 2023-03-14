
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
}