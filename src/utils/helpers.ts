import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const formatCurrency = (number: number) => {
  if (number) {
    const formattedNumber = number.toString().replace(/\D/g, "");
    const rest = formattedNumber.length % 3;
    let currency = formattedNumber.substr(0, rest);
    const thousand = formattedNumber.substr(rest).match(/\d{3}/g);
    let separator;

    if (thousand) {
      separator = rest ? "." : "";
      currency += separator + thousand.join(".");
    }

    return "$"+currency;
  } else {
    return "$0";
  }
};

const formatDate = (date: string, format: string) => {
  return dayjs(date).format(format);
};

export { formatCurrency,formatDate };
