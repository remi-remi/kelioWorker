export const removeColonPrefixFromXmlString = (xml) => xml.replace(/(<\/?)[^:>]+:/g, "$1");
