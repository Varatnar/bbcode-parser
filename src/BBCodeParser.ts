import { TreeElement } from '@varatnar/oikos-doru';
import { TAG_REGEX, TAG_REGEX_DATA } from './BBCodeReference';
import { BBCodeTag } from './BBCodeTag';
import { BBCodeToken } from './BBCodeToken';

export class BBCodeParser {
    public static withDefault(): BBCodeParser {
        const tags: BBCodeTag[] = [];

        tags.push(
            BBCodeTag.withNonSimpleTag('b', {
                tagOverwrite: 'strong',
            })
        );

        tags.push(
            BBCodeTag.withNonSimpleTag('i', {
                tagOverwrite: 'em',
            })
        );

        tags.push(BBCodeTag.withSimpleTag('u'));
        tags.push(BBCodeTag.withSimpleTag('s'));

        tags.push(
            BBCodeTag.withNonSimpleTag('h', {
                tagOverwrite: 'mark',
            })
        );

        tags.push(BBCodeTag.withSimpleTag('sub'));
        tags.push(BBCodeTag.withSimpleTag('sup'));
        tags.push(BBCodeTag.withSimpleTag('code')); // todo: not working as intended (what is in them will still get formatted)

        tags.push(
            BBCodeTag.withNonSimpleTag('url', {
                tagOverwrite: 'a',
                attributeLocation: 'href',
                addToOpenTag: ["target='_blank'"],
                specialRules: {
                    childTag: false,
                    attributeCanBeContent: true,
                },
            })
        );

        tags.push(
            BBCodeTag.withNonSimpleTag('img', {
                attributeLocation: 'src',
                specialRules: {
                    contentToAttribute: true,
                    childTag: false,
                },
            })
        );

        // TODO: Realised I needed this tag after encountering some very poorly formatted bbcode
        // TODO: Look at test to see a better way to implement this, it shouldn't have children...
        tags.push(
            BBCodeTag.withNonSimpleTag('hr', {
                specialRules: {
                    noCloseTag: true,
                },
            })
        );

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
        if (!bbcodeInput || bbcodeInput === '') {
            return '';
        }

        bbcodeInput = bbcodeInput.replace(/(\r\n|\n|\r|↵)/gm, '<br />');

        const tokenaziedInput = this.tokenify(bbcodeInput);

        const tree = this.treeify(tokenaziedInput);

        this.validateTokenTree(tree);

        return this.convert(tree);
    }

    private tokenify(input: string): Array<BBCodeToken | string> {
        const tokens: Array<BBCodeToken | string> = [];
        const execArray: RegExpExecArray[] = [];
        let match: RegExpExecArray | null;

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
                    tokens.push(
                        BBCodeToken.withEnding(
                            element[TAG_REGEX_DATA.TAG_NAME],
                            element[TAG_REGEX_DATA.ATTRIBUTE]
                        )
                    );
                } else {
                    tokens.push(
                        BBCodeToken.withStarting(
                            element[TAG_REGEX_DATA.TAG_NAME],
                            element[TAG_REGEX_DATA.ATTRIBUTE]
                        )
                    );
                }
            }
        });

        return tokens;
    }

    private validateTokenTree(
        tokenTree: TreeElement<BBCodeToken | string>
    ): void {
        for (const token of tokenTree) {
            if (!(token.getData() instanceof BBCodeToken)) {
                continue; // not a token, moving on
            }

            const tag = this.retrieveTagForToken(token.getData<BBCodeToken>());

            // todo: should this logic stay here ?
            if (tag && tag.specialRules) {
                if (
                    tag.specialRules.childTag !== undefined &&
                    !tag.specialRules.childTag
                ) {
                    token.getChildren().forEach((child) => {
                        if (child.getData() instanceof BBCodeToken) {
                            throw new Error(
                                `Token [${token.toString()} of type ${
                                    tag.tagName
                                } cannot have children token !`
                            );
                        }
                    });
                }

                if (
                    token.getData<BBCodeToken>().starting &&
                    tag.specialRules.attributeCanBeContent &&
                    !token.getData<BBCodeToken>().attribute
                ) {
                    token.getData<BBCodeToken>().attribute = '';
                    token.getChildren().forEach((child) => {
                        token.getData<BBCodeToken>().attribute += child.getData<
                            string
                        >();
                    });
                }

                if (tag.specialRules.contentToAttribute) {
                    token.getData<BBCodeToken>().attribute = '';
                    token.getChildren().forEach((child) => {
                        token.getData<BBCodeToken>().attribute += child.getData<
                            string
                        >();
                    });

                    token.clearChildren(); // children should all have been used up in previous foreach, we dont want to iterate through them again in main loop

                    // todo: what happens if parent is null?
                    token.getParent()?.getChildren().pop(); // if the content is in an attribute, there should be no close tag, removing it from token list
                }
            }

            token.getData<BBCodeToken>().tag = tag;
        }
    }

    private treeify(
        treeArray: Array<BBCodeToken | string>
    ): TreeElement<BBCodeToken | string> {
        const tree = new TreeElement<BBCodeToken | string>('');

        let currentTreeElement: TreeElement<BBCodeToken | string> = tree;

        do {
            const element = treeArray.shift();

            if (element == null) {
                throw new Error('element was null');
            }

            if (element instanceof BBCodeToken) {
                if (element.ending) {
                    currentTreeElement = currentTreeElement.isRoot()
                        ? currentTreeElement
                        : (currentTreeElement.getParent() as TreeElement<
                              BBCodeToken | string
                          >);
                    currentTreeElement.addChild(element);
                } else {
                    currentTreeElement = currentTreeElement.addChild(element);
                }
            } else {
                currentTreeElement.addChild(element);
            }
        } while (treeArray.length > 0);

        return tree;
    }

    private convert(tree: TreeElement<BBCodeToken | string>): string {
        let html: string = '';

        for (const branch of tree) {
            if (branch.getData() instanceof BBCodeToken) {
                if (
                    branch.getData<BBCodeToken>().ending &&
                    branch.getData<BBCodeToken>().tag?.specialRules?.noCloseTag
                ) {
                    continue;
                }

                html += branch.getData<BBCodeToken>().transform();
            } else {
                html += branch.getData();
            }
        }

        return html;
    }

    private retrieveTagForToken(token: BBCodeToken): BBCodeTag | null {
        for (const bbcode of this.bbCodeLibrary) {
            if (
                token.name.toLocaleLowerCase() ===
                bbcode.tagName.toLocaleLowerCase()
            ) {
                return bbcode;
            }
        }

        console.warn(`Could not find [${token.name}] in current libraries.`);
        return null;
    }
}
