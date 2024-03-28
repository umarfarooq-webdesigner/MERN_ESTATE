export const errorHandler = (statusCode, message) => {
    const error = new Error(message);
    error.stastusCode = statusCode;
    error.message = message;
    return error;
};