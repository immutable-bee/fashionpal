import sendMail from "./mailer";
import onboardingEmail from "../emails/onboarding";
import discountEmail from "../emails/discountAlert";
import recommendEmail from "../emails/recommendListing";
import errorEmail from "../emails/error";

const cheerio = require("cheerio");

const replacePlaceholders = (values, emailTemplate) => {
  const $ = cheerio.load(emailTemplate, { xmlMode: false });
  const textNodes = $("*")
    .contents()
    .filter((_, e) => e.type === "text");
  textNodes.each((_, textNode) => {
    textNode.data = textNode.data.replace(
      /{{(.+?)}}/g,
      (match, placeholder) => {
        const value = values[placeholder];
        if (value) {
          return value;
        } else {
          $(textNode.parent).remove();
          return "";
        }
      }
    );
    const parsedHTML = cheerio.load(textNode.data, { xmlMode: false }).root();
    $(textNode).replaceWith(parsedHTML.contents());
  });

  $("*").each((_, element) => {
    for (let attr in element.attribs) {
      element.attribs[attr] = element.attribs[attr].replace(
        /{{(.+?)}}/g,
        (match, placeholder) => {
          const value = values[placeholder];
          if (value) {
            return value;
          } else {
            $(element).remove();
            return "";
          }
        }
      );
    }
  });

  return $.html();
};

export const sendOnboardingEmail = async (data) => {
  const emailContent = replacePlaceholders(
    data.values,
    onboardingEmail.compiledHtml
  );
  await sendMail(data.recipient, data.values.title, emailContent);
};
export const sendErrorEmail = async (data) => {
  const emailContent = replacePlaceholders(
    data.values,
    errorEmail.compiledHtml
  );
  await sendMail(data.recipient, data.values.title, emailContent);
};
export const sendRecommendationEmail = async (data) => {
  const emailContent = replacePlaceholders(
    data.values,
    recommendEmail.compiledHtml
  );
  await sendMail(data.recipient, data.values.title, emailContent);
};
export const sendDiscountEmail = async (data) => {
  const emailContent = replacePlaceholders(
    data.values,
    discountEmail.compiledHtml
  );

  await sendMail(data.recipient, data.values.title, emailContent);
};
