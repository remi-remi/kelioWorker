export const removeColonPrefixFromXmlString = (xml: string) => xml.replace(/(<\/?)[^:>]+:/g, "$1")
