/**
 * Uniform response helper
 */
const success = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

const error = (res, message = 'Something went wrong', statusCode = 500, details = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: details || message
    });
};

module.exports = { success, error };
