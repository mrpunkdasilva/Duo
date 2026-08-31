import { getRequestConfig } from "next-intl/server";
import pt from "../../i18n/locales/pt.json";

export default getRequestConfig(async () => {
  return {
    locale: "pt",
    messages: pt,
    timeZone: "America/Sao_Paulo",
  };
});
