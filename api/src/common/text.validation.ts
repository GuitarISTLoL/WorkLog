/** Буквы (латиница/кириллица), пробелы и распространённые знаки препинания */
export const TEXT_WITH_PUNCTUATION_PATTERN =
  /^[A-Za-zА-Яа-яЁё\s.,'\-«»()—]+$/;

export const TEXT_WITH_PUNCTUATION_MESSAGE =
  'Допустимы буквы, пробелы и знаки препинания';
