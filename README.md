
#  Solita Citybike application </f>
## Citybike webapp documentation 


### How to start Azure SQL in cloud

1. Create your Azure account
2. Short tutorial: https://www.youtube.com/watch?v=ov27ukpWgdQ
3. Create resource -> SQL Database + Create -> fill detailed information (From configure you found cheaper options for compute tier) and finally create
4. After that install Azure Datastudio and make connection to database, here is documentation:
https://learn.microsoft.com/en-us/sql/azure-data-studio/quickstart-sql-database?view=sql-server-ver16


### Creating Station Table

5. Importing data, choose INT value for FID, ID and Kapasiteet (all other string(nvarchar(50)), lets change x and y to decimal after import).
        - Choose CSV file
        - Give tablename: Station

6. In CSV file geolocation data is string and we have to modified x and y columns to decimal -> SQL:

alter table dbo.Station alter column x decimal (8,6);
        alter table dbo.Station alter column y decimal (9,6);

Choose from right-click over Station table (Design) then open new window, choose ID and right is Column Properties, choose Identity Specification. Is identity checked, identity seed: 1, identity increment: 1.

Now we have created database and importet data from CSV to Station table.

### Creating Citybitrips Table

7. Importing data, choose DATE for Departure and Return
choose INT for Departure/Return_station_id and duration_sec
        choose NVARCHAR(50) rest. Table name: Citybiketrips
        
After that change to decimal Covered_distance_m.

SQL: alter table Citybiketrips alter column Covered_distance_m decimal;

8. Modify more data here is some examples: https://github.com/gittjar/SQL/blob/main/citybiketrips.sql

Now we have created Citybiketrips table and imported data from CSV.

### Create user for database tables

```
USE master;
CREATE LOGIN UserName1 WITH password='VaikeaSalasana2';
GO
USE YourDabaseName;
CREATE USER UserName1 from LOGIN UserName1;
GO
EXEC sp_addrolemember 'db_datawriter', 'UserName1';
GO
ALTER ROLE db_datawriter ADD MEMBER kingdat4;
ALTER ROLE db_datareader ADD MEMBER kingdat4;
```

More information: https://learn.microsoft.com/en-us/sql/t-sql/statements/alter-role-transact-sql?view=sql-server-ver16

### Create API for frontend

1. Microsoft documentation:
        https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-7.0&tabs=visual-studio-mac

Reposito to Citybike API:  https://github.com/gittjar/CitybikeApi

- "Database first"
- Connect API to SQL server
- Create different Models for Database tables
- Used in this exercise only GET methods for create this API layer
- Serverside pagination

See running API in Cloud.

All stations:
        https://citybikeapi.azurewebsites.net/api/Stations

Stations by ID:
        https://citybikeapi.azurewebsites.net/api/Stations/23

Stations by name:
        https://citybikeapi.azurewebsites.net/api/StationsByName/haaga

CitybiketripsMay2021 server pagination:
        https://citybikeapi.azurewebsites.net/api/CitybikeTripsMay2021?pageNumber=1&pageSize=500

All citybiketrips:
        https://citybikeapi.azurewebsites.net/api/CitybikeTrips

### Citybike App frontend

1. This project used Angular 16 in frontend. 
        Angular documentation: https://angular.io

Frontend reposito:
        https://github.com/gittjar/CitybikeFrontend
 Cloud:
        https://solitacitybike.azurewebsites.net

Features

- Show all stations and detailed information on Google Map
- Detailed station information show TOP-5 return stations and average distance from station
- Show TOP-10 Departure stations and TOP-10 Return stations
- Different sorts for biketrips and free text search

### MVCCitybike (CRUD)

1. Microsoft documentation:
        https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-mvc-app/start-mvc?view=aspnetcore-7.0&tabs=visual-studio-mac

Reposito to MVCCitybike:
        https://github.com/gittjar/MVCCitybike

Cloud:
        https://citybikemvc.azurewebsites.net/

Features

- Create, Read, Update and Delete stations and citybiketrips
- Sort stations by city or free text search
- Sort citybiketrips by date or search by free text search
- Connected to Azure SQL server

### CI/CD pipelines Azure

1. Applications uses CI/CD pipelines Azure DevOps, see more: https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops

- Automated deploy for MVC every day when changes in development -branch
- For frontend Development must be approved in Azure when deployed in release pipeline
- Merge 'develop' to 'to-website' branch works triggered deployment:
<br>
```
git checkout develop
git pull
git checkout to-website
git merge develop
```

- API release pipeline manually
- Location Norway East, all OS: Windows
- Frontend runtime stack: Node 16, others Dotnet v7.0
- Publishing mode: Code

### E2E tests Cypress
#### terminal commands

- npm install -g @angular/cli
- git clone https://github.com/gittjar/CitybikeFrontend.git
- ng e2e (run tests)
- ng s -o (run application)

### TODO -list

- Make informative 404 page to Azure
- Small informative windows in App when loading data
- Small repairs for mobile layout
- Information page to App