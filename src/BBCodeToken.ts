export class BBCodeToken {

    public static withStarting(name: string, attribute?: string) {
        return new BBCodeToken(name, false, true, attribute);
    }

    public static withEnding(name: string, attribute?: string) {
        return new BBCodeToken(name, true, true, attribute);
    }

    public name: string;
    public ending: boolean;
    public starting: boolean;
    public needClosing: boolean;
    public attribute?: string;

    private constructor(name: string, ending: boolean, needClosing?: boolean, attribute?: string) {
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

    public toString() {
        return JSON.stringify(this);
    }
}
