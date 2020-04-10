# Hurricane Analysis of Affected Counties

### Demo

http://nautilytics.hurricane-map-animated.s3-website-us-east-1.amazonaws.com/

![hurricane-sandy-over-time](https://user-images.githubusercontent.com/1707103/77975207-64989100-72c7-11ea-9aee-dedf41a13abc.gif)

## Introduction

When a disaster strikes, many businesses rush to identify affected customers and reduce or remove late fees, offer no-fee loans, or take other actions to help customers in a time of need. The relevance of such strategies has never been more relevant than in the age of COVID-19, which is unlike any disaster we've ever seen. As I was rushing to find data on affected customers in the hardest hit areas of the United States, it occurred to me that there must be a quick and easy way to do this within minutes for disasters such as hurricanes or tornados. In this age of rich and abundant data, we can practically ask and answer questions before, during, and after disaster strikes.

## Instructions for getting up and running

- Install [Postgres](https://postgresapp.com/)
- Install [Node](https://nodejs.org/en/)
- Run `init` scripts
  - Run `./public/data/init-db.sh` to create and set-up database with PostGIS
  - Run `./public/data/init-counties.sh` to download and process the county shapefiles
  - Run `./public/data/init-hurricane-sandy-2012.sh`, to download and process Hurricane Sandy files and run/output the PostGIS intersection query
  - Run `./public/data/init-hurricane-katrina-2005.sh`, to download and process Hurricane Katrina files and run/output the PostGIS intersection query
- Install application dependencies and run the application
  ```bash
  yarn # install all dependencies
  yarn start # start the application
  ```
