// todo: replace with variable export rather than class export
export class BBCodeReference {
    public static BBCODE_IDENTIFIER = {
        START: "[",
        END: "]",
    };

    public static HTML_IDENTIFER = {
        START: "<",
        END: ">",
    };

    public static TAG_REGEX = /\[(\/)?(\w+)=?(\w+)?]|(\w+)/g;
    public static TAG_REGEX_DATA = {
        ENDING: 1,
        TAG_NAME: 2,
        ATTRIBUTE: 3,
        PLAIN_TEXT: 4,
    };
}
