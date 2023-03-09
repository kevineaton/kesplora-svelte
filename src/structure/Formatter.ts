
export const sizeToReadable = (input: number): string => {
  let ret = "Unknown";
  // first, figure out the magnitude; this is for rough calculations
  // we don't let them upload GBs, but even then, we could just use MB
  if(input > 1024 * 1024) {
    // we are dealing with megs
    let amount = input / 1024 / 1024;
    ret = `${amount.toFixed(2)} MB`;
  } else if(input > 1024) {
    // kilos
    let amount = input / 1024;
    ret = `${amount.toFixed(2)} KB`;
  } else {
    // bytes
    let amount = input;
    ret = `${amount} B`;
  }
  return ret;
}