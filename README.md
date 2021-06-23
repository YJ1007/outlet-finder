# sample oulet finder
A sample project for demonstrating a full-stack development minus the deployment for outlet search using geospatial queries.

Requirements
  1. node >= v10
  2. npm >= 5.6
  3. mongodb shell >= 3.4

#Setting up mongodb database
While setting up mongodb we will create 2 users:
  - admin: permission to read/write any database
  - database specific user: will have access for a particular database

Following commands in the mongo shell will create the users respectively

  - creating admin user

    use admin
    db.createUser(
      {
        user: "admin",
        pwd: "superadmin",
        roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
      }
    )

  - creating database specific user (here using outletDb)

    use outletDb
    db.createUser(
      {
        user: "outletDb",
        pwd: "outlet123!",
        roles: [ { role: "readWrite", db: "outletDb" },
        { role: "read", db: "outletDbbckp" } ]
      }
    )

You should use authenticated user to access the mongo shell
  - accessing mongo shell : "mongo --port 27017 -u admin -p superadmin --authenticationDatabase admin"

*TIP*
For easy usage consider putting an alias for the above command in your bashrc or any equaivalent thing.
example for bash
- alias mongo_admin="mongo --port 27017 -u admin -p superadmin --authenticationDatabase admin"

access mongo shell by simply running: mongo_admin.

#Adding data to database
Steps:
1. Go to be_outlet_finder/server
2. Run genLocData.js. Node script.

Simply run 'mongo_admin be_outlet_finder/mongoScripts/data.js';
This mongo script will fill your database.
Also run indexing for quicker search 
'mongo_admin be_outlet_finder/mongoScripts/indexing.js'

#Setting up client

All the code related to client is inside the 'fe_outlet_finder' directory
  1. Change directory to 'fe_outlet_finder'.
  2. run npm install
  3. run npm start to start the debug build of client on your local browser


#Setting up server

All server related code is present in 'be_outlet_finder' directory
Within be_outlet_finder directory there are 2 folders
  - mongoScripts: contains script to fill data in the mongodb
  - server: contains the actual server code.

navigate to server and run following commands:
- 'npm install' to install dependencies.
- 'npm start' or 'node server.js' to run the server.
- 'npm test' to see and run all tests. (please make sure the server is running while you run the tests in a separate terminal)


#backing up data from our collection

example
backup (creates a bson file including all the indexes)
- sudo mongodump --db newdb --out /var/backups/mongobackups/`filename_should_be_dated`

restore
- sudo mongorestore --db newdb --drop /var/backups/mongobackups/`filename`/newdb/

--db : mention your databse name. If you skip this mongodump will create dump of all databases by default
--out: output directory for the backup.
--drop: drops the database to restore a clean database

#TODO
- Include linting
- Write script for creating mongo users
- Write script for backups and restore
- Unit test for the frontend
