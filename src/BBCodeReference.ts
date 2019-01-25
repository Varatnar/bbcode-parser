
export const BBCODE_IDENTIFIER = {
    START: "[",
    END: "]",
};

export const HTML_IDENTIFER = {
    START: "<",
    END: ">",
};

export const TAG_REGEX: RegExp = /\[(\/)?(\w+)(?:=(.+?(?=])))?]|(.+?(?=\[)|.+)/g;

export const TAG_REGEX_DATA = {
    ENDING: 1,
    TAG_NAME: 2,
    ATTRIBUTE: 3,
    PLAIN_TEXT: 4,
};
