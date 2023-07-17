const sendResponse = (statusCode, body) => {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    }
    return response
}

const validateInput = (data) => {
    const userRoles = ['seller', 'bidder'];

    const body = JSON.parse(data);
    const { email, password, user_role } = body
    if (!email || !password || password.length < 6)
        return false
    if (!user_role || !userRoles.includes(user_role))
        return false 
    return true
}

module.exports = {
    sendResponse, validateInput
};