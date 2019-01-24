import { BBCodeParser } from "./BBCodeParser";
import { HTML_IDENTIFER } from "./BBCodeReference";
import { BBCodeTagSetting } from "./BBCodeTagSetting";

/**
 * Member of a {@link BBCodeParser.bbCodeLibrary}
 */
export class BBCodeTag {

    public static withSimpleTag(tag: string) {
        return new BBCodeTag(tag, (closing?: boolean, attribute?: string) => {

            if (closing && attribute) {
                throw new Error("Closing tag cannot have attributes");
            }

            const closed: string = closing ? "/" : "";
            const attributeString: string = attribute ? `=${attribute}` : "";

            return `${HTML_IDENTIFER.START}${closed}${tag}${attributeString}${HTML_IDENTIFER.END}`;
        });
    }

    public static withNonSimpleTag(tag: string, options: BBCodeTagSetting) {

        return new BBCodeTag(tag, (closing?: boolean, attribute?: string) => {

            if (closing && attribute) {
                throw new Error("Closing tag cannot have attributes");
            }

            let htmlTag: string = HTML_IDENTIFER.START;

            htmlTag += closing ? "/" : "";

            htmlTag += options.tagOverwrite || tag;

            if (!closing && attribute && options.attributeLocation) {
                htmlTag += ` ${options.attributeLocation}='${attribute}'`;
            } else if (!closing && (attribute || options.attributeLocation)) {
                throw new Error("Cannot use attribute without attribute location option");
            }

            if (!closing && options.addToOpenTag) {
                options.addToOpenTag.forEach((forcedAttribute) => {
                    htmlTag += ` ${forcedAttribute}`;
                });
            }

            if (closing && options.addToCloseTag) {
                options.addToCloseTag.forEach((forcedAttribute) => {
                    htmlTag += ` ${forcedAttribute}`;
                });
            }

            htmlTag += HTML_IDENTIFER.END;

            return htmlTag;
        });
    }

    public tag: string;

    public transform: (closing?: boolean, attribute?: string, overwrite?: string) => string;

    constructor(tag: string, transform: (closing?: boolean, attribute?: string, overwrite?: string) => any) {
        this.tag = tag;
        this.transform = transform;
    }
}
