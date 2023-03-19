import { DateTime } from "luxon";

export const DATE_FORMAT_ISO = "DATE_FORMAT_ISO";
export const DATE_FORMAT_ISO_DATE = "DATE_FORMAT_DATE";
export const DATE_FORMAT_ISO_TIME = "DATE_FORMAT_TIME";
export const DATE_FORMAT_LOCALE_DATE = "DATE_FORMAT_LOCALE_DATE";
export const DATE_FORMAT_LOCALE_SHORT = "DATE_FORMAT_LOCALE_SHORT";
export const DATE_FORMAT_LOCALE_FULL = "DATE_FORMAT_LOCALE_FULL";

export const parseDate = (input: string, inputFormat: string = DATE_FORMAT_ISO):DateTime.DateTime => {
  // first we try to convert the input; 99% of the time, we should get iso
  const dt = DateTime.fromISO(input);
  return dt;
}

export const translateDate = (input: string, inputFormat: string = DATE_FORMAT_ISO, outputFormat: string = DATE_FORMAT_LOCALE_SHORT):string => {
  let output = input;
  const dt = parseDate(input);

  switch(outputFormat){
    case DATE_FORMAT_ISO:
      output = dt.toFormat("yyyy-MM-ddTT") + "Z";
      break;
    case DATE_FORMAT_ISO_DATE:
      output = dt.toFormat("yyyy-MM-dd");
      break;
    case DATE_FORMAT_ISO_TIME:
      output = dt.toFormat("TT");
      break;
    case DATE_FORMAT_LOCALE_DATE:
      output = dt.toFormat("MM/dd/yy");
      break;
    case DATE_FORMAT_LOCALE_SHORT:
      output = dt.toLocaleString(DateTime.DATETIME_SHORT)
      break;
    case DATE_FORMAT_LOCALE_FULL:
      output = dt.toLocaleString(DateTime.DATETIME_FULL)
      break;
  }
  return output;
}

export const dateToAgo = (input: string): string => {
  const dt = parseDate(input);
  return dt.toRelative();
}