const helpers = {
    isNumber: function (value: string) {
        return !isNaN(Number(value))
    },
    isPositiveInt: function (value: string) {
        return /^\d+$/.test(value);
    },
    throwError: function(errorMessage: string) {
        throw new Error(errorMessage);
    },

    getClientConfig: function(token: string | null) {
        return {
            //#TODO change to cloud backend
            basePath: "http://localhost:8080",
                    "headers": {
                        'Authorization': `${token}`,
                    }

            }
    }
}


export default helpers