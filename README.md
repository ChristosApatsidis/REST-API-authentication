REST API user authentication
============
For the last two years I reading and searching about user identity applications based on json web tokens.
While I was worked on some applications for user identity I encountered some security based issues and I was trying to solve them with some ideas I been found.
I hope you like this git and find it useful!
In case you want we talk about this project or you have any questions, fell free to conact me on my email address xristosapatsidis@gmail.com.

# Description
This is a Node.js RESTful api for user authentication created with Express.js, JsonWebTokens and MongoDB.

# Install and setup
First of all run ```npm install``` command in project directory to install node modules. <br>
Now you must generate the RSA keys. One for encryption(public key) and one for decryption(private key). This time we yous RSA encription method for our Json Web Tokens because is a secure solution. To generate fast this two files you can run ```node generateKeypair\generateKeypair.js```  <br>
To start the server run ```npm run-script nodemon``` <br>

# Routes
## Login
* **URL:** http://127.0.0.1:4444/api/v1/auth/login
* **Method:** `POST`
* **Body:** 
  * ```json
    {
      "email": "testemail@gmail.com",
      "password": "rootIsAStrongestPassword"
    }
    ```
* **Success Response:**
  * ```json
    {
      "success": true,
      "sessionData": {
        // jwt payload
        "loginInfo": "eyJpZCI6IjYwZWIxOWYwNWUxZjZjMDVjNDNmNDQxOCIsImlhdCI6MTYyNjAyMDMzNn0",
        // jwt verify signature
        "secure": "nqpNvyc4R8bzhxVVp1VK4OH9oo7-Y_FLh2woWazSQ1Sca2k7xGsfRszAUUwGN0eOyvNFiKeNjjyqgwLnM3OWOxs35uenbIGknbNQMUqG8mbhebtyisfYYtMybf-D64refxaA...",
        // Id of object in activeSessions array
        "clientId": "60e176ffe03cff1fe07ba8fa"
      },
      // Just a quote:)
      "quote": "Love is energy of life."
    }
    ```
* **Error Responses:**
  * ```json
    // When body does not contain email or password
    {
      "success": false,
      "message": "email and password is required"
    }
    ```

## Register
* **URL:** http://127.0.0.1:4444/api/v1/auth/register
* **Method:** `POST`
* **Body:** 
  * ```json
    {
	    "email": "testemail@gmail.com",
	    "firstname": "xristos",
	    "lastname": "apatsidis",
	    "password": "rootIsAStrongestPassword"
    }
    ```
* **Success Response:**
  * ```json
    {
      "success": true,
      "userData": {
        "email": "testemail@gmail.com",
        "firstname": "xristos",
        "lastname": "apatsidis"
      },
      "sessionData": {
        // jwt payload
        "loginInfo": "eyJpZCI6IjYwZWIxOWYwNWUxZjZjMDVjNDNmNDQxOCIsImlhdCI6MTYyNjAyMDMzNn0",
        // jwt verify signature
        "secure": "nqpNvyc4R8bzhxVVp1VK4OH9oo7-Y_FLh2woWazSQ1Sca2k7xGsfRszAUUwGN0eOyvNFiKeNjjyqgwLnM3OWOxs35uenbIGknbNQMUqG8mbhebtyisfYYtMybf-D64refxaA...",
        // Id of object in activeSessions array
        "clientId": "60eb19f05e1f6c05c43f441a"
      },
      // Just a quote:)
      "quote": "You have to separate the chaff from the wheat."
    }
    ```
* **Error Responses:**
  * ```json
    // When body does not contain email, firstname, lastname, or password
    {
      "success": false,
      "message": "email, firstnme, lstname, password is required"
    }
    ```

  * ```json
    // When email exist in database
    {
      "success": false,
      "message": "User exist"
    }
    ```

## User
* **URL:** http://127.0.0.1:4444/api/v1/auth/user
* **Method:** `GET`
* **Cookies:** login_info, secure
* **Success Response:**
  * ```json
    {
      "success": true,
      "email": "testemail@gmail.com",
      "firstname": "xristos",
      "lastname": "apatsidis"
    }
    ```
* **Error Responses:**
  * ```json
    // When jwt invalid or request does not contain   authentication cookies or jwt is invalid
    {
      success: false,
      message: 'Unauthorized'
    }
    ```

## Active-sessions
* **URL:** http://127.0.0.1:4444/api/v1/auth/user/active-sessions
* **Method:** `GET`
* **Cookies:** login_info, secure
* **Success Response:**
  * ```json
    {
      "success": true,
      "activeSessions": [
        {
          "_id": "60eb19f05e1f6c05c43f441a",
          "source": "insomnia/2021.4.0",
          "ip": "::ffff:127.0.0.1",
          "loginInfo": "eyJpZCI6IjYwZWIxOWYwNWUxZjZjMDVjNDNmNDQxOCIsImlhdCI6MTYyNjAyMDMzNn0",
          "date": "2021-07-11T16:18:56.937Z"
        }
      ]
    }
    ```
* **Error Responses:**
  * ```json
    // When jwt invalid or request does not contain   authentication cookies or jwt is invalid
    {
      success: false,
      message: 'Unauthorized'
    }
    ```


## logout
* **URL:** http://127.0.0.1:4444/api/v1/auth/user/logout/:id
* **Method:** `POST`
* **URL params:** id
* **Success Response:**
  * ```json
    {
      success: true
    }
    ```
* **Error Responses:**
  * ```json
    {
      success: false,
      message: 'Error processing the request'
    }
    ```
  * ```json
    // When jwt invalid or request does not contain   authentication cookies or jwt is invalid
    {
      success: false,
      message: 'Unauthorized'
    }
    ```