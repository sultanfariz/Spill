export const isbnValidation = (url) => {
  const isbnValidation = /^978[0-9]{10}$/;
  return isbnValidation.test(url);
};

export const urlValidation = (url) => {
  // const urlValidation = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  const urlValidation = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  return urlValidation.test(url);
};
