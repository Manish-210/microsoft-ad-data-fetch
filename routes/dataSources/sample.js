const router = require('express').Router();
const axios = require('axios');
const request = require('request');
const qs = require('qs');
const fs = require('fs');
const StreamZip = require('node-stream-zip');
const moment = require('moment-timezone');
const alasql = require('alasql');
const _ = require('lodash');
const Buffer = require('Buffer');
const AdmZip = require('adm-zip');
const {parseString} = require('xml2js');
const { getEmail } = require('../../controllers/credentials');
const { dimensions, metrics, attributionWindow } = require('./data/sampleFormData');
const { jsonTo2D, insertMissingTimeValues, replaceEmptyValuesWithPlaceholder, filterJson, sortJSON } = require('../../utils/ds');
const { getSampleDataSourceCredentials, getFieldMetaData } = require('../../utils/sample-helper');
const { generateXmlForGenerateReport, generateXmlForMetrics} = require('./data/xmlSamples');

var sampleDataMetrics = metrics;
var sampleDataDimensions = dimensions;

router.post('/testConnection', async (req, res) => {

  // Sample request body
  // { authId: 'datasource-UNIQUE_ID' }

  let authId = req.body.authId;

  try {
    await getEmail(authId).then(async (email) => {

      // Get your access credentials like access token by authId
      const access_token = getSampleDataSourceCredentials(authId)

      // Do API call with the access token and test the connection is valid



      // sample response
      res.json({
        userName: email,
        status: 'success'
      })

    });
  } catch (error) {
    // If the connection is wrong, send the error status and the neccessary error message
    console.log('testConnection failed');
    console.log(error);
    if (error?.response?.data) {
      console.log(error.response.data);
    }
    res.json({
      status: 'error',
      errorMessage: error.message,
    });
  }
});

// Querying may need initial form data to be loaded
router.post('/getInitialFormValues', async (req, res) => {
  console.log('getInitialFormValues');

  // Sample request body
  // {
  //   conn: {
  //     dataSourceType: '',
  //     auth: '',
  //     name: '',
  //     authId: 'dataSourceName-UNIQUE_ID',
  //     id: 1,
  //     userName: ''
  //   }
  // }

  try {
    const data = req.body;
    const authId = data.conn.authId;

    let initialValues = {}


    // initialValues = {
    //  adAccounts: [],    // adaccounts are fetched from API
    //  metrics: metrics,       // metrics meta data are stored locally in the './data/sampleFormData' directory
    //  dimensions: dimensions,    // dimensions meta data are stored locally in the './data/sampleFormData' directory
    // }


    res.status(200).send(initialValues)
  } catch (error) {
    console.log('getInitialValues failed');
    console.log(error);
    res.status(400).send(error.message);
  }
});

/*

Flow of getting token:
1. send a request given in index.js /authorize
2. this will ask for login credentials fill that
3. A code will be given in the url eg: https://login.microsoftonline.com/common/oauth2/nativeclient?code=M.R3_BAY.ec1341cc-2510-4e24-f222-98fe69bfcc2e&state=ClientStateGoesHere
   in this url the code is M.R3_BAY.ec1341cc-2510-4e24-f222-98fe69bfcc2e
4. paste the code in below getToken request body code parameter.
5. now again make request to getTOken you will get token and refresh token.
6. now copy the refresh token and store it in below getRefreshToken data parameter refresh token.
7. and send a request to getRefreshToken now You will get the token to use.
8. now we don't require user authorisation every time, we will just send a request to getRefreshToken.
9. store the authorization token in authorisationData in the runquery.

*/

/*
This will generate the access token and refresh token in the response.
Input: code
Output: Refresh Token and access token
*/
router.post('/getToken', async (req, res) => {

  var Ainformation = {
    method: 'post',
    url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
            'client_id': '892d14ee-4671-4bd3-976a-45798e81241a',
            'scope': 'https://ads.microsoft.com/msads.manage offline_access',
            'code': 'M.R3_BAY.9df02813-5850-4c42-771a-cc6b58739672',
            'redirect_uri': 'https://login.microsoftonline.com/common/oauth2/nativeclient',
            'grant_type': 'authorization_code',
            'client_secret': '.T82z445_orLnKHjLmQbMmv_I1N0bw.k2~'
          })
  };

  axios(Ainformation).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.log("This is the error: \n");
    console.log(error);
  });

});

/*
This will generate the access token and refresh token in the response
the difference between above getToken and getRefreshToken is that it
will generate token all the time after single call getToken (remember to change)
refresh token in it to the same refresh token that we got from getToken.
Input: first time refresh token after that no input.
Output: Refresh Token and access token
*/
router.post('/getRefreshToken', async (req, res) => {

  var Ainformation = {
    method: 'post',
    url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
            'client_id': '892d14ee-4671-4bd3-976a-45798e81241a',
            'scope': 'https://ads.microsoft.com/msads.manage offline_access',
            'refresh_token':'M.R3_BAY.-CXEmP6Xmsq73WPEULfkkXIZWK8B8WPfrRpRRwL041D5yIkjHJ4a7ec!TTPxzNFK3j5LQjUM1gFsCWRW*i520lQOULVKCRcj3i2eMUbzzFdOvy!pfeOJ6n1oIog*z*J14RDDL9mZCnUwEd9yWsXG1IBZdANjetQic4C0!q6!Dob5gIelJQZv7HWsXNt1cTJOX2C0IRUmWKkIptewz6RE32l6bdnGMA027JqG8TrN0Su!7*33c8DUfJl5oE4G36y*9lRc0yqCALSsVR4WBxCR0jEotLQeyYRRgw5mxrPG*kMNdgy6vqg8fBqgXE1mPAijV*AYGQlsYoZOS!eJIFr4DZ*Igtb!bvC2ZSUQYQ4KB4KoP',
            'grant_type': 'refresh_token',
            'client_secret': '.T82z445_orLnKHjLmQbMmv_I1N0bw.k2~'
          })
  };

  axios(Ainformation).then(function (response) {
    console.log(response.data);
  }).catch(function (error) {
    console.log("This is the error: \n");
    console.log(error);
  });

});

/*
This will get data from microsoft api
Input: body (string of xml of data to ask), soapAction (what type of soap action you wanted to perform like
submitGenerateRequest for generating a report).
Output: Response in the string format. Inside the string there will be xml body.
*/
async function makeSoapCallForMicrosoftApi(url, body, soapAction) {
  let config = {
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'text/xml',
      'SOAPAction': `${soapAction}`,
      },
    data : body
  };
  let dataToResponse='';
  await axios(config).then(function (response) {
    console.log(JSON.stringify(response.data));
    dataToResponse = response.data;
  }).catch(function (error) {
    dataToResponse = error;
  });
  return dataToResponse;
}

/*
Our Url will extract buffer from the zip file from which we have to extract the csv file in a string. This
function will extract the string of csv file.
Input: url
Output: string of the csv data in that.
*/
async function getCsvStringFromZipDownloadUrl(reportsDownloadUrl) {
  let finalResult;
  const response = await axios.get(reportsDownloadUrl,  { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data, "utf-8");
  let zip = new AdmZip(buffer);
  let zipEntries = zip.getEntries();
	zipEntries.forEach(function(zipEntry) {
    finalResult = zipEntry.getData().toString('utf8');
	});
  return finalResult;
}

/*
convert the csv string to a 2d array specific to microsoft only.
Input: string of csv file
Output: TwoD array.
*/
// Caution: check the double quotes used a split in this function
function convertcsvStringToTwoDArray(result) {
  let TwoDArray = [];
  const numberOfRowsInStringPosition = 8;
  const labelsInStringPosition = 10;
  let numbeOfRows = parseInt(result.split("\n")[numberOfRowsInStringPosition].substring(6));
  for(let i=labelsInStringPosition; i<=labelsInStringPosition+numbeOfRows; i++)
  {
    let rows=result.split("\n")[i].split(",");
    for(let j=0;j<rows.length;j++)
    {
      rows[j]=rows[j].split('"')[1];
    }
    TwoDArray.push(rows);
  }
  return TwoDArray;
}

/*
convert the two D Array to json (considering the first row as keys)
not specific to microsoft, generic function.
Input: Two D array.
Output: Json of the array.
*/
function TwoDArrayToJson(arr) {
	let keys = arr[0];
	let newArr = arr.slice(1, arr.length);
	let formatted = [],data = newArr, cols = keys, l = cols.length;
	for (let i=0; i<data.length; i++) {
			let d = data[i], o = {};
			for (var j=0; j<l; j++)
					o[cols[j]] = d[j];
			formatted.push(o);
	}
	return formatted;
}

/*
boolean function to check if inside an array a specific prefix is present or not
Input: array of string, string to check
Output: boolean
*/
function isDimensionGroupPresent(array, prefixOfDimension) {
  let valid =false;
  for(let i=0;i<array.length;i++)
  {
    if(array[i].indexOf(prefixOfDimension) == 0)
    {
      valid = true;
      break;
    }
  }
  return valid;
}

/*
function to get all the elements inside the array starting with a specific prefix
Input: array of string, string prefix
Output: array containing all the elements which have that prefix
*/
function getDimensionGroupFields(array, prefixOfDimension) {
  let resultArray=[];
  array.forEach(function(element) {
     if (element.indexOf(prefixOfDimension) == 0) {
       resultArray.push(element);
     }
  });
  return resultArray;
}

/*
handle all the steps that are involved for getting the data from the microsoft api
1. get string of xml by supplying all the requirements.
2. then get data for that coloumn (response will be a id inside an xml)
3. extract id from that xml
4. use that id to generate a link to download the reports (response will be url inside an xml).
5. use the link to download the zip
6. extract the response from csv file inside the zip, format it and send as response

Input:
1. dimensionGroup (string format), dimension from which data should be called. this is related to microsoft
dimension not form data. Eg: 'adGroup' should be supplied as 'AdGroup'
2. authorizationData: json , contains required data to authorize user.
3. aggregation (string): for now used as 'daily'. this will handle the time dimension
4. coloumns (array of string), must contain a metric and a dimension
5. accountId (string)
6. startTime (string) (eg: '01-01-2021')
7, endTime (string) (eg: '01-01-2021')

Output: JSON data of reports
*/
async function getReportsDataForADimension(
  dimensionGroup,
  authorizationData,
  aggregation,
  coloumns,
  accountId,
  startTime,
  endTime,
) {
  const reportingUrl = 'https://reporting.api.bingads.microsoft.com/Api/Advertiser/Reporting/V13/ReportingService.svc';
  let stringOfXmlMetrics = generateXmlForMetrics(dimensionGroup, authorizationData, aggregation, coloumns, accountId, startTime, endTime);
  let reportsDataId = await makeSoapCallForMicrosoftApi(reportingUrl, stringOfXmlMetrics, "SubmitGenerateReport");

  let reportsDownloadId='';
  parseString(reportsDataId, (parseError, result) => {
    if (parseError) { throw parseError; }
    reportsDownloadId = result['s:Envelope']['s:Body'][0]['SubmitGenerateReportResponse'][0]['ReportRequestId'][0];
   });

  let stringOfXmlPollGenerate = generateXmlForGenerateReport(authorizationData, reportsDownloadId);
  let reportsDownloadUrl = '';
  // microsoft may provide the the status as pending so we have to make requests multiple
  while (true)
  {
    // reports url expires in 5 minutes and hence we are using it in loop
    let reportsUrlResponse = await makeSoapCallForMicrosoftApi(reportingUrl, stringOfXmlPollGenerate, 'PollGenerateReport');
    let statusFromReport = '';
    parseString(reportsUrlResponse, (parseError, result) => {
      if (parseError) { throw parseError; }
      statusFromReport = result['s:Envelope']['s:Body'][0]['PollGenerateReportResponse'][0]['ReportRequestStatus'][0];
    });
    console.dir(statusFromReport);
    if(statusFromReport['Status'][0] == 'Pending')
    {
      continue;
    }
    else if(statusFromReport['Status'][0] == 'Error')
    {
      //
      throw "Error report cannot be downloaded";
    }
    else
    {
      reportsDownloadUrl = statusFromReport['ReportDownloadUrl'][0];
      break;
    }
  }
  let finalResult = await getCsvStringFromZipDownloadUrl(reportsDownloadUrl);
  finalResult = convertcsvStringToTwoDArray(finalResult);
  finalResult = TwoDArrayToJson(finalResult);
  return finalResult;
}

/*
function to convert Value to ProviderParam For Metrics And Dimensions
Input: form metrics or form Dimensions, dataToConvert
Output: data with provider param instead of value
*/
function convertValuetoProviderParamForMetricsAndDimensions(sampleDataMetricsOrDimensions, dataToConvert) {
  for(let i = 0; i < dataToConvert.length ; i ++)
  {
    let value = _(sampleDataMetricsOrDimensions.children)
                  .flatMap('children')
                  .find(p => p.value === dataToConvert[i]);
    dataToConvert[i] = value.providerParam;
  }
  return dataToConvert;
}

/*
function to convert ProviderParam to value For Metrics And Dimensions
Input: form metrics or form Dimensions, dataToConvert
Output: data with value instead of provider param
*/
function convertProviderParamToValueForMetricsAndDimensions(dataToConvert)
{
  for(let i = 0; i < dataToConvert.length ; i++)
  {
    for(let k in dataToConvert[i])
    {
      let valueInFormMetrics = _(sampleDataMetrics.children)
                                .flatMap('children')
                                .find(p => [p.providerParam] == k);
      if(valueInFormMetrics !==undefined)
      {
        let val = dataToConvert[i][k];
        delete dataToConvert[i][k];
        dataToConvert[i][valueInFormMetrics['value']] = val;
      }else
      {
        let valueInFormDimensions = _(sampleDataDimensions.children)
                                  .flatMap('children')
                                  .find(p => [p.providerParam] == k);
        if(valueInFormDimensions !==undefined)
        {
          let val = dataToConvert[i][k];
          delete dataToConvert[i][k];
          dataToConvert[i][valueInFormDimensions['value']] = val;
        }
      }
    }
  }
  return dataToConvert;
}

/*
function to remove a specific key-value pair from the json
Input: data from which we have to remove, the key which should be removed (string)
Output: data with that key removed.
*/
function removeTemporaryMetricAsked(dataToConvert, group)
{
  for(let i=0;i<dataToConvert.length;i++)
  {
    delete dataToConvert[i][group];
  }
  return dataToConvert;
}

/*
function to do alasql outer left join
Input: first data (json ), second data (json), id (string ) which should be common name in both first and second data;
Output: data with join performed
*/
function alasqlOuterLeftJoin(firstData, SecondData, id) {
  let dataAfterJoin = alasql(`SELECT * FROM ? AS firstData LEFT JOIN ? AS SecondData ON firstData.${id}
                              = SecondData.${id}`,[firstData, SecondData]);
  return dataAfterJoin;
}

/*
the array of data to insert contains some fields which should be entered in dataToCheck if not exists
Input: dataToCheck (string of array), arrayOfDataToInsert (string of array);
Output: data with correct array.
*/
function insertRequiredFieldsIfNotExists(dataToCheck, arrayOfDataToInsert)
{
  for( let data = 0; data<arrayOfDataToInsert.length; data++)
  {
    let present = false;
    for(let d=0; d<dataToCheck.length; d++)
    {
      if(arrayOfDataToInsert[data] == dataToCheck[d])
      {
        present = true;
        break;
      }
    }
    if(present==false)
    {
      dataToCheck.push(arrayOfDataToInsert[data]);
    }
  }
  return dataToCheck;
}

function convertValuetoLabels(valuesArray) {
  for(let v = 0; v<valuesArray.length; v++)
  {
    // check metrics
    let valueInFormMetrics = _(sampleDataMetrics.children)
                              .flatMap('children')
                              .find(p => p.value === valuesArray[v]);
    if(_.isEmpty(valueInFormMetrics))
    {
      // check dimensions
      let valueInFormDimensions = _(sampleDataDimensions.children)
                                  .flatMap('children')
                                  .find(p => p.value === valuesArray[v]);
      valuesArray[v] = valueInFormDimensions.label;
    }else
    {
      valuesArray[v] = valueInFormMetrics.label;
    }
  }
  return valuesArray;
}

router.post('/runQuery', async (req, res) => {
  console.log('runQuery');
  console.log(req.body);

  const queryAsked = {
    queryObj: {
      adAccount: ['141582240'],
      metrics: req.body.metrics,
      dimensions: req.body.dimensions,
      dateRange: req.body.dateRange,
      dateValues: req.body.dateValues,
      filters: req.body.filters,
    }
  }

  let authorizationData = {
    'authenticationToken':'eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkExMjhDQkMtSFMyNTYiLCJ4NXQiOiJFVkJyR1ZJZkRubnB5LXkybFE2NWVkVFJRUmsiLCJ6aXAiOiJERUYifQ.KszeCKf_0dcbEOdP-M5SjHs9RryDC98CHyhE19z8MiuDAxbp8s-7zVxm7nuBG1cg49m0ObUvKnsMtp0ci92W0tPb4SNMBifrdaOJ9ASle1ruXHm_rVI8IhL0GUQl1p2y13GRyZXla31LO1yqNr529xqJl7bhZYqdYmA_OfE6oSzEZTcEoG-AA9pZlBRqbd3NO2tviiX7O-39h9txah_AcyAA5HjiaWjqHjvFki7rIxagE4gQFkD0Kc1hRvV7wHjtwkL4Pbn-48bE4AeLAzuLrxoHEELFr6ihIPSAxCHxTP400dIof1mxk5-tA0BWCrXoBD3yCrXj2xEuJ9K4RCFk0w.g28NvSF4rdb9PaxCqdERiA.loW9a0eu2Kg6d7VcLjteY-G0JEajlfYNtfucnWa150cLcqlJpEUrsP11QzqO445b5stbPosZoFjOOHLDAi9XkiuF-7XDs-X7ZyF9TjwoPkg5kxgwkeYhBJuNUYclR2wWP91mDtUDG3nJXHLMx-6CDdlFA2fkNDPxIBvW9V51zBzrZK8O6RrArcYyHT5lq8duHpDa9TcSSuFb65VMEZtPPkMkP738LW21LbmtwPc5SsaezYyWGYw_uDdLqfCKNON7KlBon755ac9gDtwoxZOIlZoW5rVDbordCLVugYawDKnO143pX_Cf5uL2lJMX9yvEoLJHyppWjdj4q9rDoYaEd04jE6ZiCSeiVfKtFAuk_emabzU1TMavQJT6P24gmH5lTdc27JcbTD_3vKIN3SJaZjDvTfy1dHofYsJfLFZfoxX06vdbvq-f7Dwyhh5f1yAg04YticYdyVneWU2gzjPh7NDHRSnq6A1nyldmjzyA17bAeOr-VI_HrzyoBmyPIGrh_AIDfx0FkqAzMMEh9s20QztLn5Mu8iZWdmFh7yLLUg7L4-vVuPZTCpo2BHq0PAsbX1Y0bDcF4BD3dFqH5_CRKtB9CQzmM53AKz8JxIZZrSVqh1750cP33hsQ5Fx-rTJoE6bL5x0v-HRdrDuIIkHnvz42eoI7PKphLIoJV_OWvUbEVFEZvCM7Q5hp_fVOzuMAYeuVjYVgwRy2i0v4ivNVVwZjMZ5FINB3-9QNNIMNOM6aMuKdsbXqGJ7g-W2gWPNu_YAsm-yMAxhT8QQWxnnga-_niRk_Q6GbHHEjg37pIOWxSTomIxAusDJH8HzBAIq50kHI57D9kHAdi1HgVRluUneac9WnT_Chbgv2MRLJT7ZRWzMpDVEyd7lnRcQx9byNP8qF9RErSFfYjmnLMKeqGofFQImC8VSPGIOdCQLnITPOXkb_W473-m6WP8wrUn1y_BDcD1yGbydFL8lUtYCmjo1FhORxTe2J44QXdq-daCXGEEhVfC7LlM0ZH5H5msDKik95Twfai5RJUuW4QdyL-ofpl-rDADMhn8JRXYAkAV3K-FDbOoi50IMVL_UliaUdz7XBNzpGQ__XsDVeHcg4AwQ17J7qYmUgRQ_wnVyeqoOMjmy7KMc2bCaSgUDyHbc0Oe_MMVoOmlVkAjDif55IzO7EwxrI55r39lpSiQgMBE1tDs4vAwOKfQVLdh2zDsE5pu4dpRiYdsO1cvkqsiGEk5Rkz_3ql6GskjWLbJYNWt_MLQu2979N3dr0TvaZ74nbpM6IyBJ_3clEulydpm2Ac7cEafMNcgmwXCXBBDfcGbf4qhsEuQZdP_iQioY7baJAFRmY5EBy5bVJ-7eIc6KRZskh4d2aq79yMIv10he70T8.Trz_BgSFW7WbQujEwqS9rw',
    'customerAccountId':'141582240',
    'customerId':'251436126',
    'developerToken':'110R0JF25R929653'
  }

  try {

    let metrics = queryAsked.queryObj.metrics;
    let dimensions = queryAsked.queryObj.dimensions;
    let results = [];

    let columnsLabels = dimensions;
    columnsLabels = columnsLabels.concat(metrics);

    metrics = convertValuetoProviderParamForMetricsAndDimensions(sampleDataMetrics, metrics);
    if(isDimensionGroupPresent(dimensions, 'ad_'))
    {
      let adDimensionFields = getDimensionGroupFields(dimensions, 'ad_');
      adDimensionFields = convertValuetoProviderParamForMetricsAndDimensions(sampleDataDimensions, adDimensionFields);
      adDimensionFields = adDimensionFields.concat(metrics);
      adDimensionFields = insertRequiredFieldsIfNotExists(adDimensionFields, ['AccountId', 'CampaignId', 'AdGroupId', 'AdId']);
      adReports = await getReportsDataForADimension('Ad', authorizationData, 'Daily', adDimensionFields, '141582240', '01-06-2021', '20-06-2021');
      adReports = convertProviderParamToValueForMetricsAndDimensions(adReports);

      if(isDimensionGroupPresent(dimensions, 'adGroup_'))
      {
        let adGroupDimensionFields = getDimensionGroupFields(dimensions, 'adGroup_');
        adGroupDimensionFields = convertValuetoProviderParamForMetricsAndDimensions(sampleDataDimensions, adGroupDimensionFields);
        adGroupDimensionFields = insertRequiredFieldsIfNotExists(adGroupDimensionFields, ['Impressions', 'AdGroupId']);
        adGroupReports = await getReportsDataForADimension('AdGroup', authorizationData, 'Daily', adGroupDimensionFields, '141582240', '01-06-2021', '20-06-2021');
        adGroupReports = removeTemporaryMetricAsked(adGroupReports, 'Impressions');
        adGroupReports = convertProviderParamToValueForMetricsAndDimensions(adGroupReports);
        adReports = alasqlOuterLeftJoin(adReports, adGroupReports, 'adGroup_Id');
      }

      if(isDimensionGroupPresent(dimensions, 'campaign_'))
      {
        let campaignDimensionFields = getDimensionGroupFields(dimensions, 'campaign_');
        campaignDimensionFields = convertValuetoProviderParamForMetricsAndDimensions(sampleDataDimensions, campaignDimensionFields);
        campaignDimensionFields = insertRequiredFieldsIfNotExists(campaignDimensionFields, ['Impressions', 'CampaignId']);
        campaignReports = await getReportsDataForADimension('Campaign', authorizationData, 'Daily', campaignDimensionFields, '141582240', '01-06-2021', '20-06-2021');
        campaignReports = removeTemporaryMetricAsked(campaignReports, 'Impressions');
        campaignReports = convertProviderParamToValueForMetricsAndDimensions(campaignReports);
        adReports = alasqlOuterLeftJoin(adReports, campaignReports, 'campaign_Id');
      }

      if(isDimensionGroupPresent(dimensions, 'account_'))
      {
        let accountDimensionFields = getDimensionGroupFields(dimensions, 'account_');
        accountDimensionFields = convertValuetoProviderParamForMetricsAndDimensions(sampleDataDimensions, accountDimensionFields);
        accountDimensionFields = insertRequiredFieldsIfNotExists(accountDimensionFields, ['Impressions', 'AccountId']);
        accountGroupReports = await getReportsDataForADimension('Account', authorizationData, 'Daily', accountDimensionFields, '141582240', '01-06-2021', '20-06-2021');
        accountGroupReports = removeTemporaryMetricAsked(accountGroupReports, 'Impressions');
        accountGroupReports = convertProviderParamToValueForMetricsAndDimensions(accountGroupReports);
        adReports = alasqlOuterLeftJoin(adReports, accountGroupReports, 'account_Id');
      }
      results = adReports;
    }
    else if(isDimensionGroupPresent(dimensions, 'adGroup_'))
    {
      let adGroupDimensionFields = getDimensionGroupFields(dimensions, 'adGroup_');
      adGroupDimensionFields = convertValuetoProviderParamForMetricsAndDimensions(sampleDataDimensions, adGroupDimensionFields);
      adGroupDimensionFields = adGroupDimensionFields.concat(metrics);
      adGroupDimensionFields = insertRequiredFieldsIfNotExists(adGroupDimensionFields, ['AccountId', 'CampaignId', 'AdGroupId']);
      adGroupReports = await getReportsDataForADimension('AdGroup', authorizationData, 'Daily', adGroupDimensionFields, '141582240', '01-06-2021', '20-06-2021');
      adGroupReports = convertProviderParamToValueForMetricsAndDimensions(adGroupReports);
      console.log(adGroupReports);
      if(isDimensionGroupPresent(dimensions, 'campaign_'))
      {
        let campaignDimensionFields = getDimensionGroupFields(dimensions, 'campaign_');
        campaignDimensionFields = convertValuetoProviderParamForMetricsAndDimensions(sampleDataDimensions, campaignDimensionFields);
        campaignDimensionFields = insertRequiredFieldsIfNotExists(campaignDimensionFields, ['Impressions', 'CampaignId']);
        campaignReports = await getReportsDataForADimension('Campaign', authorizationData, 'Daily', campaignDimensionFields, '141582240', '01-06-2021', '20-06-2021');
        campaignReports = removeTemporaryMetricAsked(campaignReports, 'Impressions');
        campaignReports = convertProviderParamToValueForMetricsAndDimensions(campaignReports);
        adGroupReports = alasqlOuterLeftJoin(adGroupReports, campaignReports, 'campaign_Id');
      }
      if(isDimensionGroupPresent(dimensions, 'account_'))
      {
        let accountDimensionFields = getDimensionGroupFields(dimensions, 'account_');
        accountDimensionFields = convertValuetoProviderParamForMetricsAndDimensions(sampleDataDimensions, accountDimensionFields);
        accountDimensionFields = insertRequiredFieldsIfNotExists(accountDimensionFields, ['Impressions', 'AccountId']);
        accountGroupReports = await getReportsDataForADimension('Account', authorizationData, 'Daily', accountDimensionFields, '141582240', '01-06-2021', '20-06-2021');
        accountGroupReports = removeTemporaryMetricAsked(accountGroupReports, 'Impressions');
        accountGroupReports = convertProviderParamToValueForMetricsAndDimensions(accountGroupReports);
        adGroupReports = alasqlOuterLeftJoin(adGroupReports, accountGroupReports, 'account_Id');
      }
      results = adGroupReports;
    }
    else if(isDimensionGroupPresent(dimensions, 'campaign_'))
    {
      let campaignDimensionFields = getDimensionGroupFields(dimensions, 'campaign_');
      campaignDimensionFields = convertValuetoProviderParamForMetricsAndDimensions(sampleDataDimensions, campaignDimensionFields);
      campaignDimensionFields = campaignDimensionFields.concat(metrics);
      campaignDimensionFields = insertRequiredFieldsIfNotExists(campaignDimensionFields, ['AccountId', 'CampaignId']);
      campaignReports = await getReportsDataForADimension('Campaign', authorizationData, 'Daily', campaignDimensionFields, '141582240', '01-06-2021', '20-06-2021');
      campaignReports = convertProviderParamToValueForMetricsAndDimensions(campaignReports);
      console.log("campaign endpoint : \n", campaignReports);

      if(isDimensionGroupPresent(dimensions, 'account_'))
      {
        let accountDimensionFields = getDimensionGroupFields(dimensions, 'account_');
        accountDimensionFields = convertValuetoProviderParamForMetricsAndDimensions(sampleDataDimensions, accountDimensionFields);
        accountDimensionFields = insertRequiredFieldsIfNotExists(accountDimensionFields, ['Impressions', 'AccountId']);
        accountGroupReports = await getReportsDataForADimension('Account', authorizationData, 'Daily', accountDimensionFields, '141582240', '01-06-2021', '20-06-2021');
        accountGroupReports = removeTemporaryMetricAsked(accountGroupReports, 'Impressions');
        accountGroupReports = convertProviderParamToValueForMetricsAndDimensions(accountGroupReports);
        campaignReports = alasqlOuterLeftJoin(campaignReports, accountGroupReports, 'account_Id');
      }
      results = campaignReports;
    }
    else if(isDimensionGroupPresent(dimensions, 'account_'))
    {
      let accountDimensionFields = getDimensionGroupFields(dimensions, 'account_');
      accountDimensionFields = convertValuetoProviderParamForMetricsAndDimensions(sampleDataDimensions, accountDimensionFields);
      accountDimensionFields = accountDimensionFields.concat(metrics);
      accountDimensionFields = insertRequiredFieldsIfNotExists(accountDimensionFields, ['AccountId']);
      accountReports = await getReportsDataForADimension('Account', authorizationData, 'Daily', accountDimensionFields, '141582240', '01-06-2021', '20-06-2021');
      accountReports = convertProviderParamToValueForMetricsAndDimensions(accountReports);
      results = accountReports;
    }

    results = jsonTo2D(results, columnsLabels, false, true);
    console.log(results);
    let head = convertValuetoLabels(results.headers[0]);
    results.headers[0] = head;
    // write results to a csv file
    res.status(200).send(results);
  } catch (error) {
    console.log(error);

    let errorMessage = '';
    // give the necessary error message if required. else assign error.message

    res.status(400).send(errorMessage);
  }
});

module.exports = router
