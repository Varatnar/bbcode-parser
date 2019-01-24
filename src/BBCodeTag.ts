import { BBCodeParser } from "./BBCodeParser";
import { BBCodeReference } from "./BBCodeReference";

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
            return `${BBCodeReference.HTML_IDENTIFER.START}${closed}${tag}${attributeString}${BBCodeReference.HTML_IDENTIFER.END}`;
        });
    }

    public tag: string;

    public transform: (closing?: boolean, attribute?: string) => string;

    constructor(tag: string, transform: (closing?: boolean, attribute?: string) => any) {
        this.tag = tag;
        this.transform = transform;
    }
}
