import { BBCodeParser } from "./BBCodeParser";

/**
 * Member of a {@link BBCodeParser.bbCodeLibrary}
 */
export class BBCodeTag {

    public static withSimpleTag(tag: string) {
        return new BBCodeTag(tag, (content) => {
            return content;
        });
    }

    public tag: string;

    public transform: (...args: any[]) => string;

    constructor(tag: string, transform: (...args: any[]) => any) {
        this.tag = tag;
        this.transform = transform;
    }
}
