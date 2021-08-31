// Glossary:

/*


*/
function arrayToStringXmlFormat(xmlKeys, dataArray) {
  let stringInXml=``;
  for(let i = 0; i<dataArray.length ; i++)
  {
    stringInXml+=`<${xmlKeys}>`+`${dataArray[i]}`+`</${xmlKeys}>`;
  }
  return stringInXml;
}

const generateXmlForMetrics = (
  fieldName,
  authorizationData,
  aggregation,
  coloumnsAsked,
  accountId,
  startTime,
  endTime
) => {
  let xmlString = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                    <Header>
                      <AuthenticationToken xmlns="https://bingads.microsoft.com/Reporting/v13">${authorizationData.authenticationToken}</AuthenticationToken>
                      <CustomerAccountId xmlns="https://bingads.microsoft.com/Reporting/v13">${authorizationData.customerAccountId}</CustomerAccountId>
                      <CustomerId xmlns="https://bingads.microsoft.com/Reporting/v13">${authorizationData.customerId}</CustomerId>
                      <DeveloperToken xmlns="https://bingads.microsoft.com/Reporting/v13">${authorizationData.developerToken}</DeveloperToken>
                    </Header>
                    <Body>
                      <SubmitGenerateReportRequest xmlns="https://bingads.microsoft.com/Reporting/v13">
                        <ReportRequest i:type="${fieldName}PerformanceReportRequest" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
                          <Format>Csv</Format>
                          <Language>English</Language>
                          <ReportName>result</ReportName>
                          <ReturnOnlyCompleteData>false</ReturnOnlyCompleteData>
                          <Aggregation>${aggregation}</Aggregation>
                          <Columns>
                          ${arrayToStringXmlFormat(fieldName+'PerformanceReportColumn', coloumnsAsked)}
                          </Columns>
                          <Filter i:nil="true" />
                          <Scope>
                            <AccountIds xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
                              <a:long>${accountId}</a:long>
                            </AccountIds>
                            <AdGroups i:nil="true" />
                            <Campaigns i:nil="true" />
                          </Scope>
                          <Time>
                          <CustomDateRangeEnd>
                              <Day>${parseInt(endTime.substring(0, 2))}</Day>
                              <Month>${parseInt(endTime.substring(3, 5))}</Month>
                              <Year>${parseInt(endTime.substring(6, 11))}</Year>
                          </CustomDateRangeEnd>
                          <CustomDateRangeStart>
                              <Day>${parseInt(startTime.substring(0, 2))}</Day>
                              <Month>${parseInt(startTime.substring(3, 5))}</Month>
                              <Year>${parseInt(startTime.substring(6, 11))}</Year>
                          </CustomDateRangeStart>
                          </Time>
                        </ReportRequest>
                      </SubmitGenerateReportRequest>
                    </Body>
                  </Envelope>`
  console.log(xmlString);
  return xmlString;
}

const generateXmlForGenerateReport = (authorizationData, requestId) => {
  let xmlString = `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                    <Header>
                      <AuthenticationToken xmlns="https://bingads.microsoft.com/Reporting/v13">${authorizationData.authenticationToken}</AuthenticationToken>
                      <CustomerAccountId xmlns="https://bingads.microsoft.com/Reporting/v13">${authorizationData.customerAccountId}</CustomerAccountId>
                      <CustomerId xmlns="https://bingads.microsoft.com/Reporting/v13">${authorizationData.customerId}</CustomerId>
                      <DeveloperToken xmlns="https://bingads.microsoft.com/Reporting/v13">${authorizationData.developerToken}</DeveloperToken>
                    </Header>
                    <Body>
                    <PollGenerateReportRequest xmlns="https://bingads.microsoft.com/Reporting/v13">
                      <ReportRequestId>${requestId}</ReportRequestId>
                    </PollGenerateReportRequest>
                    </Body>
                  </Envelope>`
    return xmlString;
}



module.exports = { generateXmlForGenerateReport, generateXmlForMetrics };
