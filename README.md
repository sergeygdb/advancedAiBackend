# Courses: back-end

## Installation

### PostgreSQL

Make sure that you have a local installation of PostgreSQL running and that you have created a user with all privileges. This user will be used in the `.env` file to configure the database connection.

To set a password for the `postgres` user, you can execute:

```sql
ALTER USER postgres WITH PASSWORD 'postgres';
```

### Dotenv

Dotenv is a module to externalize configuration, for instance database connection details.
To get this demo up and running, you'll need to create a **.env** file in you root project directory (on the same level as .gitignore). The contents should look like this:

```properties
JWT_SECRET="2154f4f52194f158c308f668a64a6f4a7f43f3f5ccc5cfeef6ff30fda34fa82"  
JWT_EXPIRES_HOURS=8
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fullstack?schema=public"
APP_PORT=3000
OPENAI_API_KEY=YOUR_OPENAI_TOKEN
```



## Starting the application

Run the following commands in a terminal (project root folder) to get the application up and running.

Install all required node dependencies (it can take a few minutes):

```console
$ npm install
```

The first time running this application, you will have to run the database migration scripts. You can do this by executing:

```console
$ npx prisma migrate dev
```


Execute the seed script to fill the database with test data:

```console
$ npx ts-node util/seed.ts
```

To start the Node.js server execute:

```console
$ npm start
```

This will start an express server on <http://localhost:3000>.
