# Data Parsing App

## Introduction:

This is simple data parsing app whoose take json data from employee and parse thoose data and store in database , when stack holder login using valid email and password he get back all important info related to employee, In this application stack holder have a option to get email from application if stack holder click on get email button stack holder get back all employee data as a email.

## Dependency:

-  "bcrypt": "^5.0.0",
-  "cors": "^2.8.5",
-  "express": "^4.17.1",
-  "express-session": "^1.17.1",
-  "mongoose": "^5.11.13",
-  "nodemailer": "^6.4.17",
-  "nodemon": "^2.0.7"

-  **bcrypt** :

   -  for hasing the password and comparing the password

-  **cors**:

   -  for making cross browser request.

-  **nodemailer**:

   -  for sending email.

-  **express-session**:

   -  for mantaining the session.

## Various endpoint:

### /signup

This endpoint responsible for signup a user. In this application i use session for signup purpose.This endpoint simply take unique email, password and name. If user put duplicate email it will throw and error.

### /login

This endpoint responsible for login a user ..This endpoint simply take unique email, password . If user put duplicate email it will throw and error.

### /logout

This endpoint for logout purpose.User can logout using this endpoint.

### /userinfo

This endpoint send userinfo the the user eg. name,email etc.

### /getName

Return name of the user.

### /sendEmail

This endpoint take email address of user and send all employee related info to stack holder as an email.

### /allUserCount

This endpoint count all type of user and send to the user.

### AuthMiddleware (middleware):

This is a middleware which is reponsible to authenticate each request.

### /saveData

This endpoint save users confidential data in database.

### /allActiveUser

This endpoint return all active user data.

### /allUser

This endpoint return all user that are stored in database.

## How to run locally:

**Follow the following step:**

-  open vscode new window and create a new folder.
-  clone the git repo.
-  > git clone https://github.com/rambhajansonti/Khojdeal-backend
-  open the Khojdeal-backend folder in new window.
-  run open terminal and run below command
-  > npm install
-  above command install all dependency locally.
-  > npm start
-  you can see in terminal backend is stared on port number 9999

## Prerequisite tools and technology:

-  NodeJS
-  MongoDB

## Project Link

[link](https://github.com/rambhajansonti/Khojdeal-backend)
