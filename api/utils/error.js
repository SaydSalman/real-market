export const errorHandler = (statusCode,message)=>{ //manual status code for ourselves
    const error = new Error() //create errror constructor
    error.statusCode = statusCode
    error.message = message
    return error
}