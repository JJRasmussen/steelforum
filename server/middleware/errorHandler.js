import StatusCodes from '../utils/statusCodes.js'

export default (err, req, res, _next) => {
    console.error('Error:', err);

    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Something went wrong';
    
    const errorResponse = { error: message};
    if (err.details){
        errorResponse.details = err.details;
    };

    res.status(statusCode).json(errorResponse);
};