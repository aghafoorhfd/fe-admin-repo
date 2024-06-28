export const REGEX = {
  PASSWORD_FORMAT_REGEX:
    '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{4,}$',
  ALPHABET_ALLOW_FORMAT_REGEX: '^[A-Za-z]+$',
  ALPHA_NUMERIC: /^(?=.*[a-zA-Z])(?=^[^\d])[a-zA-Z0-9 _-]+$/,
  ALPHABETICAL_ALLOW_FORMAT_REGEX: /[a-zA-Z]/,
  SPECIAL_CHARACTER_WITH_STRING: /^[ A-Za-z_@./#&+-]*$/,
  ALPHA_MIN_THREE_ALLOW_SPECIAL: /(?:[a-zA-Z].*){3,}/
};
