export const sortByString = <T>(values: T[] | undefined, extract: (value: T) => string): T[] => {
    return values?.slice().sort((a, b) => extract(a).localeCompare(extract(b))) || [];
};
