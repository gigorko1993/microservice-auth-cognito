const AWS = require('aws-sdk')
const { sendResponse, validateInput } = require("../lib/helpers");

const cognito = new AWS.CognitoIdentityServiceProvider()

module.exports.handler = async (event) => {
    try {
        const isValid = validateInput(event.body)
        if (!isValid)
            return sendResponse(400, { message: 'Invalid input' })

        const { email, password, } = JSON.parse(event.body)

        console.log("🚀 ~ file: signup.js:13 ~ module.exports.handler= ~ event.body:", event.body)
        const { user_pool_id } = process.env
        console.log("🚀 ~ file: signup.js:14 ~ module.exports.handler= ~ user_pool_id:", user_pool_id)
        const params = {
            UserPoolId: user_pool_id,
            Username: email,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'email_verified',
                    Value: 'true'
                }],
            // to not send the default email by AWS Cognito when a new user gets created in the user pool
            MessageAction: 'SUPPRESS'
        }
        const response = await cognito.adminCreateUser(params).promise();
        if (response.User) {
            const paramsForSetPass = {
                Password: password,
                UserPoolId: user_pool_id,
                Username: email,
                // otherwise temporary password will be generated for user
                Permanent: true
            };
            await cognito.adminSetUserPassword(paramsForSetPass).promise()
        }
        return sendResponse(200, { message: 'User registration successful' })
    }
    catch (error) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
}