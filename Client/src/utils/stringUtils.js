export const extractTextFromHtml = (str) =>
  new DOMParser().parseFromString(str, "text/html").body.innerText;
