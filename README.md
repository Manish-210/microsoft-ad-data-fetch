## Coding guidelines
 - Node version ^15
 - Use Yarn as package manager
 - This project is to written in Node.js
 - Use Javascript Classes wherever necessary
 - Use only Axios (npm package) for external GET/POST requests to the external API ( Dont use any native SDK to call the external API )

## Checklist

### - Project Start 

Sometimes the following Callback setup need to be completed to start the project.

- Redirection URL for OAuth be setup/approved in the original Provider Endpoint
- Access to the approved route (if not possible to get local route) the redirect results to the local host be setup

## SQL query to create credentials table
```CREATE TABLE credentials (emailId varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,dataSourceType varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,credentials varchar(3000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,updatedAt timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,authId varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,PRIMARY KEY (authId) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;```


# Understanding the overall project




This project is a boilerplate framework to develop a standalone API on top of it. This API will fetch fetch data and output the results in the CSV format.

Features
 - OAuth Handling/Persisting
 - Get Input data requirements via JSON 
 - Construct Dynamic Queries and hit the external API
 - Fetch response and format/transform it to our required format
 - Process mandatory request params - metrics, dimensions, daterange, filter, sort and options ( see /runquery in routes/dataSources/sample.js) and construct a structured output automatically
 - Sort, Filter data as required in the Input JSON 
 - Output data in CSV format)
  

## Metrics

Metrics are mostly numerical values representing some kind of performance data depending on the selected dimension. Eg. Clicks, Total Sales, Etc

## Dimensions

Dimensions are mostly categorical values that help group/represent metrics. Eg. Date, Campaign Name, Customer Type, Product Title
Relationships between the dimensions matter to group/represent data correctly. See example 3, where Ad Name is a subset within Campaign Name

## Example Data Output

In these example the hierarchical relationships between the dimensions( Date, Campaign Name, Ad Name) are Date > Campaign Name > Ad Name

### **Example 1 :** 

- Metrics : Impressions, Clicks
- Dimensions : Date

#### Expected Output

  | Date            | Impressions   | Clicks      |
  |-----------------|---------------|-------------|
  | 16/3/2021       | 21            | 7           |
  | 17/3/2021       | 11            | 4           |
  | 18/3/2021       | 8             | 3           |


### **Example 2 :** 

- Metrics : Impressions, Clicks
- Dimensions : Date, Campaign Name

#### Expected Output

  | Date            | Campaign Name | Impressions   | Clicks      |
  |-----------------|---------------|---------------|-------------|
  | 16/3/2021       | Sales Hero    | 11            | 5           |
  | 16/3/2021       | Promotion     | 10            | 2           |
  | 17/3/2021       | Promotion     | 11            | 4           |
  | 18/3/2021       | Sales Hero    | 8             | 3           |

### **Example 3 :** 

- Metrics : Impressions, Clicks 
- Dimensions : Date, Campaign Name, Ad Name

#### Expected Output

  | Date            | Campaign Name | Ad Name       | Impressions   | Clicks      |
  |-----------------|---------------|---------------|---------------|-------------|
  | 16/3/2021       | Sales Hero    | Clickbait     | 5             | 3           |
  | 16/3/2021       | Sales Hero    | Clickbait 2   | 6             | 2           |
  | 16/3/2021       | Promotion     | Ad 1          | 10            | 2           |
  | 17/3/2021       | Promotion     | Ad 1          | 11            | 4           |
  | 18/3/2021       | Sales Hero    | Clickbait     | 5             | 3           |
  | 18/3/2021       | Sales Hero    | Clickbait 2   | 3             | 0           |


### **Example 4 :** 

- Metrics : Impressions, Clicks 
- Dimensions : Campaign Name
- Date Rnge : Custom , Start Date : 16/3/2021, End Date : 18/3/2021

#### Expected Output

  | Campaign Name | Impressions   | Clicks      |
  |---------------|---------------|-------------|
  | Sales Hero    | 19            | 8           |
  | Promotion     | 21            | 6           |


## Things to be carefull when working with metrics

1. ### For single dimension:

  When a single dimension is selected, the metrics are fetched from that dimension breakdown (example 2 above, where Campaign was the breakdown ). If the dimension does not have the selected metrics, we need to figure out a way to get the accurate data corresponding to that dimension.

  ### **Example 5 :** 

  Query:

  ```
  queryObj : {
    ...
    metrics: [
      'metrics.impressions',
      'metrics.clicks',
    ],
    dimensions: [ 'campaign.name' ],
    ...
  }
  ```

  Response in CSV:

  | Campaign name   | Impressions   | Clicks      |
  |-----------------|---------------|-------------|
  | OFFEO - Main    | 21            | 7           |
  | Video           | 11            | 4           |
  | Real Estate     | 8             | 3           |


2. ### For multiple dimensions:

  When more than one dimensions are selected, the metrics are fetched from the dimension breakdown that has the least hierarchy level
  among the selected dimensions.

  In the below example, the campaign and ad are selected. Among the selected, ad has the least level in hierarchy. So, the metrics
  are fetched from the ad breakdown.

  ### **Example 6 :** 

  Query:
  ```
  queryObj : {
    ...
    metrics: [
      'metrics.impressions',
      'metrics.clicks',
    ],
    dimensions: [ 'campaign.name', 'ad.name' ],
    ...
  }
  ```

  Response in CSV:

  | Campaign name   | Ad name        | Impressions   | Clicks      |
  |-----------------|----------------|---------------|-------------|
  | OFFEO - Main    | New alt        | 21            | 7           |
  | Video           | Do diff        | 6             | 2           |
  | Video           | TrendY         | 5             | 2           |
  | Real Estate     | Pitch          | 5             | 2           |
  | Real Estate     | PlayState      | 3             | 1           |

  Here the campaigns 'Video' and 'Real Estate' has more than one ad each. Each ad is in separate object along with their campaign
  name, resulting repeated campaign names.


## Example for Filters
**Sample queryObj:**
```
  queryObj : {
    ...
    metrics: [
      'metrics.impressions',
      'metrics.clicks',
    ],
    dimensions: [ 'campaign.name' ],
    filters: [
      {
        ruleType: 'and',
        filterField: 'campaign.name',
        operator: 'contains',
        expression: 'Video'
      }
    ],
    ...
  }
```

**Before filtering:**

  | Campaign name      | Impressions   | Clicks      |
  |--------------------|---------------|-------------|
  | OFFEO - Main       | 21            | 7           |
  | Video              | 11            | 4           |
  | Real Estate        | 8             | 3           |
  | Video (Maker)      | 7             | 3           |
  | Social Media Video | 7             | 4           |


**After filtering:**

  | Campaign name      | Impressions   | Clicks      |
  |--------------------|---------------|-------------|
  | Video              | 11            | 4           |
  | Video (Maker)      | 7             | 3           |
  | Social Media Video | 7             | 4           |


## Example for Sort
**Sample queryObj:**
```
  queryObj : {
    ...
    metrics: [
      'metrics.impressions',
      'metrics.clicks',
    ],
    dimensions: [ 'campaign.name' ],
    sort: [
      {
        "sortField": "campaign.name",
        "operator": "asc"
      }
    ]
    ...
  }
```

**Before sorting:**

  | Campaign name      | Impressions   | Clicks      |
  |--------------------|---------------|-------------|
  | OFFEO - Main       | 21            | 7           |
  | Video              | 11            | 4           |
  | Real Estate        | 8             | 3           |
  | Video (Maker)      | 7             | 3           |
  | Social Media Video | 7             | 4           |


**After sorting:**

  | Campaign name      | Impressions   | Clicks      |
  |--------------------|---------------|-------------|
  | OFFEO - Main       | 21            | 7           |
  | Real Estate        | 8             | 3           |
  | Social Media Video | 7             | 4           |
  | Video              | 11            | 4           |
  | Video (Maker)      | 7             | 3           |
