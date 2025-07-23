export default (err, req, res, next) => {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    
    const errorResponse = { error: message};
    if (err.details){
        errorResponse.details = err.details;
    };

    res.status(statusCode).json(errorResponse);
};