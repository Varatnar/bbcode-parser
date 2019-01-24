import { TreeElement } from "@varatnar/oikos-doru";
import {
    TAG_REGEX,
    TAG_REGEX_DATA,
} from "./BBCodeReference";
import { BBCodeTag } from "./BBCodeTag";
import { BBCodeToken } from "./BBCodeToken";

export class BBCodeParser {

    public static withDefault(): BBCodeParser {
        const tags: BBCodeTag[] = [];

        tags.push(BBCodeTag.withNonSimpleTag("b", {
            tagOverwrite: "strong",
        }));

        tags.push(BBCodeTag.withNonSimpleTag("i", {
            tagOverwrite: "em",
        }));

        tags.push(BBCodeTag.withSimpleTag("u"));
        tags.push(BBCodeTag.withSimpleTag("s"));

        tags.push(BBCodeTag.withNonSimpleTag("h", {
            tagOverwrite: "mark",
        }));

        tags.push(BBCodeTag.withSimpleTag("sub"));
        tags.push(BBCodeTag.withSimpleTag("sup"));
        tags.push(BBCodeTag.withSimpleTag("code")); // todo: not working as intended (what is in them will still get formatted)

        tags.push(BBCodeTag.withNonSimpleTag("url", {
            tagOverwrite: "a",
            attributeLocation: "href",
            addToOpenTag: ["target='_blank'"],
        }));

        // todo: fix img tag -> content should be in src of img html
        tags.push(BBCodeTag.withNonSimpleTag("img", {
            attributeLocation: "src",
        }));

        for (let i = 1; i < 7; i++) {
            tags.push(BBCodeTag.withSimpleTag(`h${i}`));
        }

        return new BBCodeParser(tags);
    }

    private bbCodeLibrary: BBCodeTag[];

    constructor(tags: BBCodeTag[]) {
        this.bbCodeLibrary = tags;
    }

    public addBBcodeTagToLibrary(tag: BBCodeTag): void {
        this.bbCodeLibrary.push(tag);
    }

    public parse(bbcodeInput: string): string {
        const tokenaziedInput = this.tokenify(bbcodeInput);

        this.validateTokens(tokenaziedInput);

        const tree = this.treeify(tokenaziedInput);

        return this.convert(tree);
    }

    private tokenify(input: string): Array<BBCodeToken | string> {

        const tokens: Array<BBCodeToken | string> = [];
        const execArray: RegExpExecArray[] = [];
        let match: RegExpExecArray;

        // Finding all different parts/token
        do {
            match = TAG_REGEX.exec(input);
            if (match) {
                execArray.push(match);
            }
        } while (match);

        // mapping to tokens
        execArray.forEach((element) => {
            if (element[TAG_REGEX_DATA.PLAIN_TEXT]) {
                tokens.push(element[TAG_REGEX_DATA.PLAIN_TEXT]);
            } else {
                if (element[TAG_REGEX_DATA.ENDING]) {
                    tokens.push(BBCodeToken.withEnding(element[TAG_REGEX_DATA.TAG_NAME], element[TAG_REGEX_DATA.ATTRIBUTE]));
                } else {
                    tokens.push(BBCodeToken.withStarting(element[TAG_REGEX_DATA.TAG_NAME], element[TAG_REGEX_DATA.ATTRIBUTE]));
                }
            }
        });

        return tokens;
    }

    private validateTokens(tokens: Array<BBCodeToken | string>): void {

        for (const token of tokens) {
            if (!(token instanceof BBCodeToken)) {
                continue; // not a token, moving on
            }

            token.tag = this.mapTokenToTag(token);
        }

    }

    private treeify(treeArray: Array<BBCodeToken | string>): TreeElement<BBCodeToken | string> {

        const tree = new TreeElement<any>("");

        let currentTreeElement: TreeElement<any> = tree;

        do {
            const element = treeArray.shift();

            if (element instanceof BBCodeToken) {
                if (element.ending) {
                    currentTreeElement = currentTreeElement.getParent();
                    currentTreeElement.addDataChild(element);
                } else {
                    currentTreeElement = currentTreeElement.addDataChild(element);
                }
            } else {
                currentTreeElement.addDataChild(element);
            }

        } while (treeArray.length > 0);

        return tree;
    }

    private convert(tree: TreeElement<BBCodeToken | string>): string {

        let html: string = "";

        for (const branch of tree) {
            if (branch.getData() instanceof BBCodeToken) {
                html += (branch.getData() as BBCodeToken).transform();
            } else {
                html += branch.getData();
            }
        }

        return html;
    }

    private mapTokenToTag(token: BBCodeToken): BBCodeTag {

        for (const bbcode of this.bbCodeLibrary) {
            if (token.name === bbcode.tag) {
                return bbcode;
            }
        }

        throw new Error(`Could not find [${token.name}] in current libraries.`);
    }
}
