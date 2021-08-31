const moment = require('moment-timezone');
const converter = require('json-2-csv');
const _ = require('underscore');
const sort = require('fast-sort');

const isSqlSafe = (sql) => {
  const t = sql.toLowerCase();

  return t.startsWith('select');
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const replaceEmptyValuesWithPlaceholder = (data, fieldsMetaData, placeholder) => {
  let tdata = data;
  tdata = tdata.map((e) => {
    let obj = e;
    let fieldsMetaDataLength = fieldsMetaData.length
    for (let i = 0; i < fieldsMetaDataLength; i++) {
      if (e.hasOwnProperty(fieldsMetaData[i].label) && !e[fieldsMetaData[i].label]) {
        obj = { ...obj, [`${fieldsMetaData[i].label}`]: fieldsMetaData[i].dataType === 'INTEGER' || fieldsMetaData[i].dataType === 'FLOAT' ? placeholder : null };
      }
    }
    return obj;
  });
  return tdata;
};
const sortJSON = (data, sortParam) => {
  data = sort(data).by(sortParam);
  return data;
};
const insertMissingTimeValues = (dateRange, data) => {
  let cdata = data;
  let objtemplate = data[0];
  objtemplate = Object.keys(objtemplate).reduce((accumulator, current) => {
    accumulator[current] = null;
    return accumulator;
  }, {});
  if (cdata[0].Date) {
    let startDate = moment(dateRange.startDate);
    let endDate = moment(dateRange.endDate);
    let dates = [];
    //cdata.sort((a, b) => a.Date.localeCompare(b.Date));
    cdata = _.groupBy(cdata, 'Date');
    let day = moment(startDate);
    while (day < endDate) {
      day.add(1, 'days');
      dates.push(day.format('YYYY-MM-DD'));
    }

    dates.unshift(startDate.format('YYYY-MM-DD'));
    for (let i = 0; i < dates.length; i++) {
      if (!cdata[dates[i]]) {
        cdata = {
          ...cdata,
          [`${dates[i]}`]: [{ ...objtemplate, Date: dates[i] }],
        };
      }
    }
    cdata = Object.keys(cdata).map((key) => cdata[key]);
    cdata = cdata.flat();
    cdata.sort((a, b) => a.Date.localeCompare(b.Date));
  } else if (cdata[0].Month) {
    if (cdata[0].Month.split('-').length === 3) {
      cdata = cdata.map((e) => {
        let Month = moment(e.Month).format('MM');
        return { ...e, Month: Month };
      });
    }

    let allMonths = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];

    cdata = _.groupBy(cdata, 'Month');

    for (let i = 0; i < allMonths.length; i++) {
      if (!cdata[allMonths[i]])
        cdata = {
          ...cdata,
          [`${allMonths[i]}`]: [{ ...objtemplate, Month: allMonths[i] }],
        };
    }
    cdata = Object.keys(cdata).map((key) => cdata[key]);
    cdata = cdata.flat();
    cdata.sort((a, b) => a.Month.localeCompare(b.Month));
  } else if (data[0].Year) {
    let startDate = moment(dateRange.startDate);
    let endDate = moment(dateRange.endDate);
    let dates = [];
    let day = moment(startDate);
    //console.log(endDate)
    while (day < endDate) {
      // console.log(day)
      day.add(1, 'Year');

      dates.push(day.format('YYYY'));
    }
    dates.splice(-1, 1);
    cdata = cdata.map((e) => {
      return { ...e, Year: castToType(e.Year, 'STRING') };
    });
    dates.unshift(startDate.format('YYYY'));
    cdata.sort((a, b) => a.Year.localeCompare(b.Year));
    cdata = _.groupBy(cdata, 'Year');
    for (let i = 0; i < dates.length; i++) {
      if (!cdata[dates[i]]) {
        cdata = {
          ...cdata,
          [`${dates[i]}`]: [{ ...objtemplate, Year: dates[i] }],
        };
      }
    }
    cdata = Object.keys(cdata).map((key) => cdata[key]);
    cdata = cdata.flat();
    cdata.sort((a, b) => a.Year.localeCompare(b.Year));
  } else if (data[0]['Month name']) {
    let allMonths = moment.months();

    allMonths = allMonths.map((e) => e.toUpperCase());

    cdata = _.groupBy(cdata, 'Month name');

    for (let i = 0; i < allMonths.length; i++) {
      if (!cdata[allMonths[i]])
        cdata = {
          ...cdata,
          [`${allMonths[i]}`]: [
            { ...objtemplate, ['Month name']: allMonths[i], Month: i },
          ],
        };
      else
        cdata[allMonths[i]] = cdata[allMonths[i]].map((e) => {
          return { ...e, Month: i };
        });
    }
    cdata = Object.keys(cdata).map((key) => cdata[key]);
    cdata = cdata.flat();

    cdata.sort((a, b) => parseFloat(a.Month) - parseFloat(b.Month));

    cdata = cdata.map((e) => {
      let obj = e;
      delete obj.Month;
      return obj;
    });
  }
  return cdata;
};

const dateRangeToDate = (dateRange, dateValues, latestDate, earliestDate) => {
  let startDate = null;
  let endDate = null;
  let startDateUnix = null;
  let endDateUnix = null;
  switch (dateRange) {
    case "today":
    case "custom":
      startDate = moment(dateValues.startDate);
      endDate = moment(dateValues.endDate);
      break;

    case "last_n_days":
      startDate = latestDate.clone().subtract(dateValues.n, "days");
      endDate = dateValues.including_this
        ? latestDate.clone()
        : latestDate.clone().subtract(1, "days");
      break;

    case "last_7_days":
      startDate = latestDate.clone().subtract(7, "days");
      endDate = latestDate.clone().subtract(1, "days");
      break;

    case "last_30_days":
      startDate = latestDate.clone().subtract(29, "days");
      endDate = latestDate.clone().subtract(1, "days");
      break;

    case "last_n_weeks_mon_sun":
      startDate = latestDate
        .clone()
        .subtract(dateValues.n, "isoWeek")
        .startOf("isoWeek");
      endDate = dateValues.including_this
        ? latestDate.clone()
        : latestDate.clone().subtract(1, "isoWeek").endOf("isoWeek");
      break;

    case "this_month":
      startDate = latestDate.clone().startOf("month");
      endDate = latestDate.clone();
      break;

    case "last_n_months":
      startDate = latestDate
        .clone()
        .subtract(dateValues.n, "month")
        .startOf("month");
      endDate = dateValues.including_this
        ? latestDate.clone()
        : latestDate.clone().subtract(1, "month").endOf("month");
      break;

    case "last_month":
      startDate = latestDate.clone().subtract(1, "month").startOf("month");
      endDate = latestDate.clone().subtract(1, "month").endOf("month");
      break;

    case "last_3_months":
      startDate = latestDate.clone().subtract(3, "month").startOf("month");
      endDate = latestDate.clone().subtract(1, "month").endOf("month");
      break;

    case "last_6_months":
      startDate = latestDate.clone().subtract(6, "month").startOf("month");
      endDate = latestDate.clone().subtract(1, "month").endOf("month");
      break;

    case "last_year":
      startDate = latestDate.clone().subtract(1, "year").startOf("year");
      endDate = latestDate.clone().subtract(1, "year").endOf("year");
      break;
    case "this_year":
      startDate = latestDate.clone().startOf("year");
      endDate = latestDate.clone();
      break;
    case "all_time":
      startDate = earliestDate.clone();
      endDate = latestDate.clone();
      break;
  }

  if (dateValues && dateValues.timeZone && dateValues.timeZone.length > 0) {
    startDate = moment(startDate).tz(dateValues.timeZone);
    endDate = moment(endDate).tz(dateValues.timeZone);
  }

  return {
    endDate: endDate.format('YYYY-MM-DD'),
    startDate: startDate.format('YYYY-MM-DD'),
    startDateUnix: startDate.unix(),
    endDateUnix: endDate.unix(),
  };
};

const filterJson = (jsonData, filters) => {
  console.log(
    '*************************************** FILTER *************************************************'
  );
  return jsonData.filter((item) => {
    let returnRow = true;

    // will work as all AND filters
    // let isConditionMet;
    for (const filter of filters) {
      let fieldValue = item[filter.field];
      filter.expression = castToType(filter.expression, filter.dataType);

      let isConditionMet = false;

      console.log('filterJson', filter);
      console.log('fieldValue', fieldValue);
      switch (filter.operator) {
        case 'contains':
          if (filter.dataType != 'STRING')
            throw new Error(
              `CONTAINS filter cannot be appplied on ${filter.field} as its not a string/text field`
            );
          if (fieldValue?.includes(filter.expression)) isConditionMet = true;
          break;
        case 'notContains':
          if (filter.dataType != 'STRING')
            throw new Error(
              `NOT CONTAINS filter cannot be appplied on ${filter.field} as its not a string/text field`
            );
          if (!fieldValue?.includes(filter.expression)) isConditionMet = true;
          break;
        case 'equals':
          if (fieldValue === filter.expression) isConditionMet = true;
          break;
        case 'notEquals':
          if (fieldValue != filter.expression) isConditionMet = true;
          break;
        case 'regexMatches':
          const regExpression = new RegExp(filter.expression);
          if (regExpression.test(fieldValue)) isConditionMet = true;
          break;
        case 'regexNotMatches':
          const regExpression2 = new RegExp(filter.expression);
          if (!regExpression2.test(fieldValue)) isConditionMet = true;
          break;
        case 'greaterThan':
          if (fieldValue > filter.expression) isConditionMet = true;
          break;
        case 'lesserThan':
          if (fieldValue < filter.expression) isConditionMet = true;
          break;
      }
      returnRow = returnRow && isConditionMet;
    }

    return returnRow;
  });
};

const castToType = (data, type) => {
  const measuredDataType = typeof data;

  if (data !== '' && measuredDataType !== 'undefined') {
    switch (type) {
      case 'STRING':
        data = measuredDataType !== 'string' ? JSON.stringify(data) : data;
        break;
      case 'INTEGER':
        data = parseInt(data);
        break;
      case 'FLOAT':
        data = parseFloat(data);
        break;
      case 'DATE':
        data = moment.parseZone(data).format('YYYY-MM-DD');
        break;
      case 'DATETIME':
        console.log(data);
        data = moment.parseZone(data).format('YYYY-MM-DD HH:mm:ss');
        console.log(data);
        break;
      default:
        break;
    }
  } else {
    data = '';
  }

  return data;
};

const jsonTo2D = (
  jsonData,
  orderedColumns,
  stringifyOutput = true,
  noHeader = false
) => {
  let headers;

  if (typeof orderedColumns == 'undefined') {
    if (
      typeof jsonData?.[0] !== 'object' ||
      jsonData?.[0] === null ||
      jsonData?.[0] === undefined
    ) {
      headers = [];
    } else {
      headers = Object.keys(jsonData[0]);
    }
  } else {
    headers = orderedColumns;
  }

  const twoD = jsonData.map((row) =>
    headers.map((fieldName) => {
      return row[fieldName] ?? '';
    })
  );

  console.log(twoD.length);
  console.log(headers.length);

  let result = {
    options: { noHeader: noHeader },
    twoD: twoD,
    headers: [headers],
    type: 'twoD',
  };

  if (stringifyOutput) {
    return JSON.stringify(result);
  } else {
    return result;
  }
};
let prettyPrint = (jsonString) =>
  console.log(JSON.stringify(JSON.parse(JSON.stringify(jsonString)), null, 2));

function isObject(obj) {
  return obj !== undefined && obj !== null && obj.constructor == Object;
}

const nestedjsonTo2D = async (data) => {
  let csv = await converter.json2csvAsync(data);
  let headers = [csv.split('\n')[0]];
  headers = headers.map((e) => e.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
  csv = csv.split('\n');
  csv.splice(0, 1);
  csv = csv.map((e) => e.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));

  return { twoD: csv, headers: headers };
};

const getStartAndEndDateByTimeZone = (startDate, endDate, timezone) => {
  // Both startDate and endDate starts from the beginning of the day (0th hour)
  startDate = moment(startDate).tz(timezone).format('YYYY-MM-DDT00:00:00.000Z')
  endDate = moment(endDate).tz(timezone).format('YYYY-MM-DDT00:00:00.000Z')

  return { startDate, endDate }
}

module.exports = {
  prettyPrint,
  isSqlSafe,
  jsonTo2D,
  filterJson,
  dateRangeToDate,
  sleep,
  isObject,
  castToType,
  nestedjsonTo2D,
  insertMissingTimeValues,
  sortJSON,
  replaceEmptyValuesWithPlaceholder,
  getStartAndEndDateByTimeZone
};
