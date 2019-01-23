import { TreeElement } from "@varatnar/oikos-doru";
import { BBCodeReference } from "./BBCodeReference";
import { BBCodeTag } from "./BBCodeTag";
import { BBCodeToken } from "./BBCodeToken";

export class BBCodeParser {

    public static withDefault() {
        const tags: BBCodeTag[] = [];

        const URL = BBCodeTag.withSimpleTag("url");
        tags.push(URL);

        return new BBCodeParser(tags);
    }

    private bbCodeLibrary: BBCodeTag[];

    constructor(tags: BBCodeTag[]) {
        this.bbCodeLibrary = tags;
    }

    public parse(bbcodeInput: string): string {
        const tokenaziedInput = this.tokenify(bbcodeInput);
        const tree = this.treeify(tokenaziedInput);

        // console.log(this.validate(tree));

        return "";
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

    // private validate(input: TreeElement<BBCodeToken | string>): boolean {
    //     return this.validateLoop(input.getChildren());
    // }

    // private validateLoop(loopElement: Array<TreeElement<BBCodeToken | string>>): boolean {
    //
    //     for (const child of loopElement) {
    //
    //     }
    // }
}
