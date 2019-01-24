import { TreeElement } from "@varatnar/oikos-doru";
import { BBCodeReference } from "./BBCodeReference";
import { BBCodeTag } from "./BBCodeTag";
import { BBCodeToken } from "./BBCodeToken";

export class BBCodeParser {

    public static withDefault() {
        const tags: BBCodeTag[] = [];

        const URL = BBCodeTag.withSimpleTag("url");
        tags.push(URL);

        tags.push(BBCodeTag.withSimpleTag("test"));

        return new BBCodeParser(tags);
    }

    private bbCodeLibrary: BBCodeTag[];

    constructor(tags: BBCodeTag[]) {
        this.bbCodeLibrary = tags;
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
            match = BBCodeReference.TAG_REGEX.exec(input);
            if (match) {
                execArray.push(match);
            }
        } while (match);

        // mapping to tokens
        execArray.forEach((element) => {
            if (element[BBCodeReference.TAG_REGEX_DATA.PLAIN_TEXT]) {
                tokens.push(element[BBCodeReference.TAG_REGEX_DATA.PLAIN_TEXT]);
            } else {
                if (element[BBCodeReference.TAG_REGEX_DATA.ENDING]) {
                    tokens.push(BBCodeToken.withEnding(element[BBCodeReference.TAG_REGEX_DATA.TAG_NAME], element[BBCodeReference.TAG_REGEX_DATA.ATTRIBUTE]));
                } else {
                    tokens.push(BBCodeToken.withStarting(element[BBCodeReference.TAG_REGEX_DATA.TAG_NAME], element[BBCodeReference.TAG_REGEX_DATA.ATTRIBUTE]));
                }
            }
        });

        return tokens;
    }

    private validateTokens(tokens: Array<BBCodeToken | string>) {

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

        tree.forEach((element) => {
            console.log(element.toString());
        });

        return tree;
    }

    private convert(tree: TreeElement<BBCodeToken | string>): string {

        let html: string = "";

        for (const branch of tree) {
            if (branch.getData() instanceof BBCodeToken) {
                console.log((branch.getData() as BBCodeToken).transform());
                html += (branch.getData() as BBCodeToken).transform();
            } else {
                console.log(branch.getData());
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
