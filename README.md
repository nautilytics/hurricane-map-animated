# Hurricane Analysis of Affected Counties

<img width="1130" alt="Screen Shot 2020-03-30 at 8 32 47 PM" src="https://user-images.githubusercontent.com/1707103/77974811-3bc3cc00-72c6-11ea-8557-9f9fdff8b34e.png">

## Introduction

When a disaster strikes, many businesses rush to identify affected customers and reduce or remove late fees, offer no-fee loans, or take other actions to help customers in a time of need. The relevance of such strategies has never been more relevant than in the age of COVID-19, which is unlike any disaster we've ever seen. As I was rushing to find data on affected customers in the hardest hit areas of the United States, it occurred to me that there must be a quick and easy way to do this within minutes for disasters such as hurricanes or tornados. In this age of rich and abundant data, we can practically ask and answer questions before, during, and after disaster strikes.

## Instructions for getting up and running

- Install [Postgres](https://postgresapp.com/)
- Install [Node](https://nodejs.org/en/)
- Run `./public/data/init.sh` to download and process the shapefiles, run the PostGIS intersection query, and output the necessary GeoJSON files
- Install application dependencies and run the application

```bash
yarn # install all dependencies
yarn start # start the application
```
