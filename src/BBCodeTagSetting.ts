
export interface BBCodeTagSetting {
    tagOverwrite?: string;
    attributeLocation?: string;
    addToOpenTag?: string[];
    addToCloseTag?: string[];
    specialRules?: SpecialRules;
}

export interface SpecialRules {
    contentToAttribute?: boolean; // will not add a close tag
    childTag?: boolean;
    noCloseTag?: boolean; // list
    attributeCanBeContent?: boolean;
}
