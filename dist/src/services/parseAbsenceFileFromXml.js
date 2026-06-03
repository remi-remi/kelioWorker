export const parseAbsenceFileFromXml = (xml) => {
    const periods = [];
    const periodRegex = /<AbsenceFile>([\s\S]*?)<\/AbsenceFile>/g;
    let periodMatch;
    while ((periodMatch = periodRegex.exec(xml)) !== null) {
        const periodContent = periodMatch[1];
        const period = {};
        const tagRegex = /<(\w+)(?:\s[^>]*)?>([^<]*)<\/\1>/g;
        let tagMatch;
        while ((tagMatch = tagRegex.exec(periodContent)) !== null) {
            const key = tagMatch[1];
            const value = tagMatch[2].trim();
            // boolean conversion
            const num = Number(value);
            if (value === 'true' || value === 'false')
                period[key] = value === 'true';
            else if (value !== '' && !Number.isNaN(num))
                period[key] = num;
            else
                period[key] = value;
        }
        periods.push(period);
    }
    return periods;
};
