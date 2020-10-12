import { BBCODE_IDENTIFIER } from './BBCodeReference';
import { BBCodeTag } from './BBCodeTag';

export class BBCodeToken {
    public static withStarting(name: string, attribute?: string): BBCodeToken {
        return new BBCodeToken(name, false, true, attribute);
    }

    public static withEnding(name: string, attribute?: string): BBCodeToken {
        return new BBCodeToken(name, true, true, attribute);
    }

    public name: string;
    public ending: boolean;
    public starting: boolean;
    public needClosing?: boolean;
    public attribute?: string;
    public tag?: BBCodeTag | null;

    private constructor(
        name: string,
        ending: boolean,
        needClosing?: boolean,
        attribute?: string
    ) {
        this.name = name;
        this.ending = ending;
        this.starting = !ending;

        if (attribute) {
            this.attribute = attribute;
        }

        if (needClosing) {
            this.needClosing = needClosing;
        }
    }

    public transform(): string {
        if (!this.tag) {
            let unchangedTag: string = BBCODE_IDENTIFIER.START;
            unchangedTag += this.ending ? '/' : '';
            unchangedTag += this.name;
            unchangedTag += this.attribute ? `=${this.attribute}` : '';
            unchangedTag += BBCODE_IDENTIFIER.END;

            return unchangedTag;
        }

        return this.tag.transform(this.ending, this.attribute);
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}
