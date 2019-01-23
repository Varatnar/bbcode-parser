export class BBCodeToken {

    public static withStarting(name: string, attribute?: string) {
        return new BBCodeToken(name, false, attribute);
    }

    public static withEnding(name: string, attribute?: string) {
        return new BBCodeToken(name, true, attribute);
    }

    public name: string;
    public ending: boolean;
    public starting: boolean;
    public attribute?: string;

    private constructor(name: string, ending: boolean, attribute: string) {
        this.name = name;
        this.ending = ending;
        this.starting = !ending;
        if (attribute) {
            this.attribute = attribute;
        }
    }

    public toString() {
        return JSON.stringify(this);
    }
}
