/**
 * This method returns an object containing all attributes required for running ui integration
 * tests. It currently only contains the passed test id, if it is set. Otherwise it returns an
 * empty object.
 *
 * @param testId The test id to use (optional)
 */
export const createTestAttributes = (testId: string | undefined): Record<string, string> => {
    if (!testId) {
        return {};
    }

    return {
        "data-cy": testId
    };
};
