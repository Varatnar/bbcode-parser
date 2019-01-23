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

(() => {

    const data = "[url=coolUrl]thisIsMyUrl[test]plusMore[/test][/url]";

    const URL = new BBCodeTag("url", (link) => {
        console.log(link);
    });

    const parser = BBCodeParser.withDefault();

    parser.parse(data);

})();
