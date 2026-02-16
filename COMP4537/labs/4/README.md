**Project Init Steps**

start by creating a MySQL database named "lab4" and then run the following SQL commands to set up the users and permissions:

```sql
-- Create the database
CREATE DATABASE lab4;   
```

```sql
-- Create a read-only user
CREATE USER 'readonly_user'@'localhost' IDENTIFIED BY 'password123';
GRANT SELECT ON lab4.* TO 'readonly_user'@'localhost';
FLUSH PRIVILEGES;
```

**Server2**

run node server2/app.js to start the server
