const { constants } = require('../constants');

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case constants.VAILDATION_ERROR:
            res.json(
                {
                    title: "Validation Failed", message: err.message, stackTrace: err.stack
                });
            break;
        case constants.UNAUTHORIZED:
            return res.status(401).json({
                status: false,
                errors: [
                    {
                        message: "You need to sign in to proceed.",
                        code: "NOT_SIGNEDIN"
                    },
                ],
            });
        case constants.FORBIDDEN:
            res.json(
                {
                    title: "Forbidden", message: err.message, stackTrace: err.stack
                });
            break;  // <-- Add break statement here
        case constants.NOT_FOUND:
            res.json(
                {
                    title: "Not found", message: err.message, stackTrace: err.stack
                });
            break;  // <-- Add break statement here
        default:
            console.log("no error");
            break;
    }
};

module.exports = errorHandler;
