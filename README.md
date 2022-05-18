# Librarydb Backend Project

## Required Technologies
Your application must make use of the following libraries:
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Steps to run

###  Creating database and users

First of all, Before running the migration scripts you must create 2 databases (one for development and one for testing)
you can name them as :
librarydb and librarydb_test
then you need to create 2 users as following
dev for storefrontdb with pass 1234
tester for storefrontdb_test with pass 1234
I will provide the database.json for simplicity 
after creating the databases and users you can run the migration up command (npx db-migrate up) to create the required tables


###   ENV variables

As I won't provide the .env file here is the environment varibles

- POSTGRES_HOST=localhost
- POSTGRES_PORT=8000
- POSTGRES_DB=librarydb
- POSTGRES_admin=dev
- POSTGRES_TESTER=tester
- POSTGRES_PASSWORD=1234
- POSTGRES_TEST_DB=librarydb_test
- ENV=dev
- BCRYPT_PASSWORD=SCARFACE123 (you can change this ofc)
- SALT_ROUNDS=7 (you can change this ofc)
- TOKEN_KEY=TONYMONTANA123 (you can change this ofc)



###  Models

I have created 3 models with CRUD operations and 1 service for getting data, plus a middleware for authentcation and authorization
it also contains password hashing logic.


## Getting Started


First, you need to access signup route first and provied the required data
then you will need to access signin route with the same adminname and password for created admin to authorize the admin in database and start using the app

i will add the endpoints as they are in src code to expose the http request and the authvalidator middleware for authentcation



### JWTs

you will take admin token and place it in header so that you can access certain routes



