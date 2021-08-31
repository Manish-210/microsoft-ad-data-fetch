// Glossary:

/*

Mandatory Fields : these fields are mandatory and need to be setup for all child nodes

value - A unique value for the field to be used within our application
label - Label that will be presented in the UI
dataType - Data type of the field. For e.g., INTEGER, FLOAT, STRING,
description - A small description that explains the field
type - Whether the field is a METRIC or a DIMENSION


Provider Prefixed Fields : these fields are optional and are dependant on the type of API provider that the developer is working with.
Any logical connection that needs to be made between the API provider and the formData.js's metrics or dimension fields need to be handled by creating fields like providerParam, providerEndpoint, etc


IMPORTANT : the value field should not be the same as the providerParam field.

providerParam - The unique field value given by the provider
providerEndpoint - The URL needed to fetch the field from. (Optional)
...

*/

const dataTypes = {
  INTEGER: "INTEGER",
  FLOAT: "FLOAT",
  DOUBLE: "DOUBLE",
  STRING: "STRING",
  BOOLEAN: "BOOLEAN"
}

const metrics = {
  description: '',
  children: [
    {
      label: 'Basic',
      group: 'basic',
      children: [
        {
          value: 'impressions',
          label: 'Impressions',
          dataType: 'INTEGER',
          description: 'The number of times an ad has been displayed on search results pages.',
          type: 'METRIC',
          providerParam: 'Impressions',
          providerEndpoint: ''
        },
        {
          value: 'clicks',
          label: 'Clicks',
          dataType: 'INTEGER',
          description: 'Clicks are what you pay for. Clicks typically include a customer clicking an ad on a search results page or on a website on the search network.',
          type: 'METRIC',
          providerParam: 'Clicks',
          providerEndpoint: ''
        },
        // {
        //   value: 'adExtensionTotalClicks',
        //   label: 'Total ad extension clicks',
        //   dataType: 'INTEGER',
        //   description: 'The number of billable and non-billable times that an ad extension was clicked',
        //   type: 'METRIC',
        //   providerParam: '',
        //   providerEndpoint: ''
        // },
        {
          value: 'spend',
          label: 'Cost',
          dataType: 'DOUBLE',
          description: 'Campaign cost in the currency of the advertising account',
          type: 'METRIC',
          providerParam: 'Spend',
          providerEndpoint: ''
        },
        // {
        //   value: 'spend_usd',
        //   label: 'Cost (USD)',
        //   dataType: 'INTEGER',
        //   description: 'Campaign cost converted to US dollars',
        //   type: 'METRIC',
        //   providerParam: '',
        //   providerEndpoint: ''
        // },
        // {
        //   value: 'spend_gbp',
        //   label: 'Cost (GBP)',
        //   dataType: 'INTEGER',
        //   description: 'Campaign cost converted to British pounds dollars',
        //   type: 'METRIC',
        //   providerParam: '',
        //   providerEndpoint: ''
        // },
        // {
        //   value: 'spend_eur',
        //   label: 'Cost (EUR)',
        //   dataType: 'INTEGER',
        //   description: 'Campaign cost converted to euros',
        //   type: 'METRIC',
        //   providerParam: '',
        //   providerEndpoint: ''
        // },
        {
          value: 'ctr',
          label: 'CTR',
          dataType: 'DOUBLE',
          description: 'The click-through rate (CTR) is the number of times an ad was clicked, divided by the number of times the ad was shown (impressions)',
          type: 'METRIC',
          providerParam: 'Ctr',
          providerEndpoint: ''
        },
        {
          value: 'expectedCtr',
          label: 'Expected CTR (%)',
          dataType: 'DOUBLE',
          description: `How well your keyword competes against other keywords targeting the same traffic. Ads that are relevant to searchers' queries or other input are more likely to have a higher click-through rate. This metric tells you if a keyword is underperforming and causing a loss in impression share, so you can make keyword changes or remove ads altogether. A score of 3 is Above Average; a score of 2 is Average; and a score of 1 is considered Below Average. If you specify a time       period that spans multiple days, the score will be the same for each day in the time period, and the value is the most recent calculated score. Data for this field is typically updated 14-18 hours after the UTC day ends`,
          type: 'METRIC',
          providerParam: 'ExpectedCtr',
          providerEndpoint: ''
        },
        {
          value: 'historicExpectedCtr',
          label: 'Historic expected CTR average (%)',
          dataType: 'DOUBLE',
          description: 'Historical average of expected click-through rate scores going back as far as 18 months from the current date. This score may vary from the score in the ExpectedCtr column, which is the current score and same value for each day in the time period',
          type: 'METRIC',
          providerParam: 'HistoricalExpectedCtr',
          providerEndpoint: ''
        },
        {
          value: 'cpc',
          label: 'CPC',
          dataType: 'DOUBLE',
          description: 'Cost per click, cost divided by the number of clicks',
          type: 'METRIC',
          providerParam: 'AverageCpc',
          providerEndpoint: ''
        },
        {
          value: 'cpm',
          label: 'CPM',
          dataType: 'DOUBLE',
          description: 'Cost per thousand impressions, average cost to have your ad served 1000 times',
          type: 'METRIC',
          providerParam: 'AverageCpm',
          providerEndpoint: ''
        },
        {
          value: 'adRelevance',
          label: 'Ad Relevance',
          dataType: 'DOUBLE',
          description: `How closely related your ads is to the customer's search query or other input. It tells you how relevant your ad and landing page are to potential customers. A score of 3 is Above Average; a score of 2 is Average; and a score of 1 is considered Below Average.If you specify a time period that spans multiple days, the score will be the same for each day in the time period, and the value is the most recent calculated score`,
          type: 'METRIC',
          providerParam: 'AdRelevance',
          providerEndpoint: ''
        },
        {
          value: 'historicAdRelevance',
          label: 'Historic ad relevance average',
          dataType: 'DOUBLE',
          description: 'Historical average of ad relevance scores back as far as 18 months from the current date. This score may vary from the score in the AdRelevance column, which is the current score and same value for each day in the time period',
          type: 'METRIC',
          providerParam: 'HistoricalAdRelevance',
          providerEndpoint: ''
        },
        {
          value: 'qualityScore',
          label: 'Quality Score',
          dataType: 'DOUBLE',
          description: `The numeric score shows you how competitive your ads are in the marketplace by measuring how relevant your keywords and landing pages are to customers' search terms. The quality score is calculated by Microsoft Advertising using the ExpectedCtr, AdRelevance, and LandingPageExperience sub scores. If available, the quality score can range from a low of 1 to a high of 10. Quality score is based on the last rolling 30 days for the owned and operated search traffic. A quality score can be assigned without any impressions, in the case where a keyword bid did not win any auctions. Traffic for syndicated networks do not affect quality score`,
          type: 'METRIC',
          providerParam: 'QualityScore',
          providerEndpoint: ''
        },
        {
          value: 'historicQualityScore',
          label: 'Historic quality score average',
          dataType: 'DOUBLE',
          description: 'The historical quality score for each row is the value that was calculated for quality score on that date. Use The historical quality score to find out how the quality score may have changed over time',
          type: 'METRIC',
          providerParam: 'HistoricalQualityScore',
          providerEndpoint: ''
        },
        // {
        //   value: 'qualityImpact',
        //   label: 'Quality impact',
        //   dataType: 'INTEGER',
        //   description: 'The numeric score that indicates the possible increase in the number of impressions that the keyword could receive if the corresponding QualityScore column would rise above underperforming: 0 - Not available. Could be because the keyword is not underperforming; 1 - Low impact. Improving the quality score could increase impressions by less than 100 additional impressions per day; 2 - Medium impact. Improving the quality score could increase impressions by 100 to 500 additional impressions per day; 3 - High impact. Improving the quality score could increase impressions by more than 500 additional impressions per day',
        //   type: 'METRIC',
        //   providerParam: '',
        //   providerEndpoint: ''
        // },
        // {
        //   value: 'budget',
        //   label: 'Budget',
        //   dataType: 'INTEGER',
        //   description: 'Budget of the advertisement',
        //   type: 'METRIC',
        //   providerParam: '',
        //   providerEndpoint: ''
        // },
        // {
        //   value: 'impressionShares',
        //   label: 'Impression Shares',
        //   dataType: 'INTEGER',
        //   description: 'Impression Shares',
        //   type: 'METRIC',
        //   providerParam: '',
        //   providerEndpoint: ''
        // },
        {
          value: 'impressionSharePercent',
          label: 'Impression share (%)',
          dataType: 'DOUBLE',
          description: 'The estimated percentage of impressions you received, out of the total available impressions in the market you were targeting',
          type: 'METRIC',
          providerParam: 'ImpressionSharePercent',
          providerEndpoint: ''
        },
        {
          value: 'exactMatchImpressionSharePercent',
          label: 'Exact match impression share (%)',
          dataType: 'DOUBLE',
          description: 'The estimated percentage of impressions that your account received for searches that exactly matched your keyword, out of the total available exact match impressions you were eligible to receive',
          type: 'METRIC',
          providerParam: 'ExactMatchImpressionSharePercent',
          providerEndpoint: ''
        },
        // {
        //   value: 'impressionsLostToBudget',
        //   label: 'Impressions lost to budget',
        //   dataType: 'INTEGER',
        //   description: 'The estimated number of impressions your ad did not receive due to issues with your daily or monthly budget',
        //   type: 'METRIC',
        //   providerParam: '',
        //   providerEndpoint: ''
        // },
        {
          value: 'impressionLostToBudgetPercent',
          label: 'Impressions lost to budget (%)',
          dataType: 'DOUBLE',
          description: 'The estimated percentage of impressions your ad did not receive due to issues with your daily or monthly budget',
          type: 'METRIC',
          providerParam: 'AudienceImpressionLostToBudgetPercent',
          providerEndpoint: ''
        },
        // {
        //   value: 'impressionsLostToRankAgg',
        //   label: 'Impressions lost to rank (aggregated)',
        //   dataType: 'INTEGER',
        //   description: 'The estimated number of impressions your ad did not receive due to issues with your ad ranking',
        //   type: 'METRIC',
        //   providerParam: '',
        //   providerEndpoint: ''
        // },
        {
          value: 'impressionLostToRankAggPercent',
          label: 'Impressions lost to rank (% aggregated)',
          dataType: 'DOUBLE',
          description: 'The estimated percentage of impressions your ad did not receive due to issues with your ad ranking',
          type: 'METRIC',
          providerParam: 'ImpressionLostToRankAggPercent',
          providerEndpoint: ''
        },
        {
          value: 'clickSharePercent',
          label: 'Click share %',
          dataType: 'DOUBLE',
          description: `The percentage of clicks that went to your ads. It is the share of the prospective customer's mindshare and buying intent you captured. You can use this performance metric to see where your growth opportunities are. For example, your click share percent is 30% if 10 ads were clicked, and three of the 10 ads were yours`,
          type: 'METRIC',
          providerParam: 'ClickSharePercent',
          providerEndpoint: ''
        },
        // {
        //   value: 'availableImpressions',
        //   label: 'Available impressions',
        //   dataType: 'INTEGER',
        //   description: 'Available impressions',
        //   type: 'METRIC',
        //   providerParam: '',
        //   providerEndpoint: ''
        // },
      ]
    },
    {
      label: 'SampleMetric2',
      group: 'SampleMetric2',
      children: [
        {
          value: '',
          label: '',
          dataType: '',
          description: '',
          type: 'METRIC',
          providerParam: '',
          providerEndpoint: ''
        },
        {
          value: '',
          label: '',
          dataType: '',
          description: '',
          type: 'METRIC',
          providerParam: '',
          providerEndpoint: ''
        },
      ]
    }
  ]
}

const dimensions = {
  description: '',
  children: [
    {
      label: 'Account',
      group: 'account',
      description: '',
      children: [
        {
          value: 'account_Id',
          label: 'Account ID',
          dataType: 'INTEGER',
          description: 'The identifier of an account',
          type: 'DIMENSION',
          providerParam: 'AccountId',
          providerEndpoint: ''
        },
        {
          value: 'account_Name',
          label: 'Account name',
          dataType: 'STRING',
          description: 'The account name',
          type: 'DIMENSION',
          providerParam: 'AccountName',
          providerEndpoint: ''
        },
        {
          value: 'account_Number',
          label: 'Account number',
          dataType: 'INTEGER',
          description: 'The assigned number of an account',
          type: 'DIMENSION',
          providerParam: 'AccountNumber',
          providerEndpoint: ''
        },
        {
          value: 'account_Status',
          label: 'Account status',
          dataType: 'STRING',
          description: 'The Account Status',
          type: 'DIMENSION',
          providerParam: 'AccountStatus',
          providerEndpoint: ''
        },
        // {
        //   value: 'accountAccount_edit_link',
        //   label: 'Account edit link',
        //   dataType: 'STRING',
        //   description: 'Link to edit the advertising account',
        //   type: 'DIMENSION',
        //   providerParam: '',
        //   providerEndpoint: ''
        // },
        {
          value: 'account_CurrencyCode',
          label: 'Currency code',
          dataType: 'STRING',
          description: 'The account currency code',
          type: 'DIMENSION',
          providerParam: 'CurrencyCode',
          providerEndpoint: ''
        },
      ]
    },
    {
      label: 'Campaign',
      group: 'campaign',
      description: '',
      children: [
        {
          value: 'campaign_Id',
          label: 'Campaign ID',
          dataType: 'INTEGER',
          description: 'The assigned identifier of a campaign',
          type: 'DIMENSION',
          providerParam: 'CampaignId',
          providerEndpoint: ''
        },
        {
          value: 'campaign_Name',
          label: 'Campaign name',
          dataType: 'STRING',
          description: 'The campaign name',
          type: 'DIMENSION',
          providerParam: 'CampaignName',
          providerEndpoint: ''
        },
        {
          value: 'campaign_Type',
          label: 'Campaign type',
          dataType: 'STRING',
          description: 'Campaign type',
          type: 'DIMENSION',
          providerParam: 'CampaignType',
          providerEndpoint: ''
        },
        {
          value: 'campaign_Labels',
          label: 'Campaign Labels',
          dataType: 'STRING',
          description: 'The labels applied to a campaign',
          type: 'DIMENSION',
          providerParam: 'CampaignLabels',
          providerEndpoint: ''
        },
        {
          value: 'campaign_Status',
          label: 'Status',
          dataType: 'STRING',
          description: 'The campaign status',
          type: 'DIMENSION',
          providerParam: 'CampaignStatus',
          providerEndpoint: ''
        },
        {
          value: 'campaign_BudgetName',
          label: 'Budget name',
          dataType: 'STRING',
          description: 'The name of a budget. This will be empty for unshared budgets',
          type: 'DIMENSION',
          providerParam: 'BudgetName',
          providerEndpoint: ''
        },
        {
          value: 'campaign_BudgetStatus',
          label: 'Budget status',
          dataType: 'STRING',
          description: 'The budget status. The possible values are Active and Deleted. This will be empty for unshared budgets',
          type: 'DIMENSION',
          providerParam: 'BudgetStatus',
          providerEndpoint: ''
        },
        {
          value: 'campaign_BudgetAssociationStatus',
          label: 'Budget association status',
          dataType: 'STRING',
          description: 'Indicates whether or not the campaign is currently spending from the budget mentioned in the BudgetName column. The possible values are Current and Ended',
          type: 'DIMENSION',
          providerParam: 'BudgetAssociationStatus',
          providerEndpoint: ''
        },
        {
          value: 'campaign_TrackingTemplate',
          label: 'Tracking template',
          dataType: 'STRING',
          description: 'The current tracking template for a campaign',
          type: 'DIMENSION',
          providerParam: 'TrackingTemplate',
          providerEndpoint: ''
        },
        {
          value: 'campaign_CustomParameters',
          label: 'Custom parameters',
          dataType: 'STRING',
          description: 'The current set of custom parameters for a campaign. Each custom parameter is a key and value pair. The list of custom parameters is semicolon-delimited and each key is enclosed by braces and a leading underscore, for example {_key1}=value1;{_key2}=value2',
          type: 'DIMENSION',
          providerParam: 'CustomParameters',
          providerEndpoint: ''
        }
      ]
    },
    {
      label: 'Ad Group',
      group: 'adGroup',
      children: [
        {
          value: 'adGroup_Id',
          label: 'Ad group ID',
          dataType: 'INTEGER',
          description: 'The assigned identifier of an ad group.',
          type: 'METRIC',
          providerParam: 'AdGroupId',
          providerEndpoint: ''
        },
        {
          value: 'adGroup_Name',
          label: 'Ad group name',
          dataType: 'STRING',
          description: 'The ad group name.',
          type: 'METRIC',
          providerParam: 'AdGroupName',
          providerEndpoint: ''
        },
        {
          value: 'adGroup_Labels',
          label: 'Ad group Labels',
          dataType: 'STRING',
          description: 'The labels applied to an ad group. Labels are delimited by a semicolon (;)',
          type: 'METRIC',
          providerParam: 'AdGroupLabels',
          providerEndpoint: ''
        },
        {
          value: 'adGroup_Status',
          label: 'Ad group status',
          dataType: 'STRING',
          description: 'The ad group status',
          type: 'METRIC',
          providerParam: 'Status',
          providerEndpoint: ''
        },
        // {
        //   value: 'adGroup_CriterionId',
        //   label: 'Ad group criterion id',
        //   dataType: 'STRING',
        //   description: 'A list of unique identifiers that identify the criterions to delete',
        //   type: 'METRIC',
        //   providerParam: '',
        //   providerEndpoint: ''
        // },
        // {
        //   value: 'adGroup_AudienceTargetingSetting',
        //   label: 'Ad group audience target',
        //   dataType: 'STRING',
        //   description: 'Ad group audience target',
        //   type: 'METRIC',
        //   providerParam: '',
        //   providerEndpoint: ''
        // },
        {
          value: 'adGroup_Language',
          label: 'Language',
          dataType: 'STRING',
          description: 'The language of the country an ad is served in',
          type: 'METRIC',
          providerParam: 'Language',
          providerEndpoint: ''
        },
        {
          value: 'adGroup_Network',
          label: 'Ad group network',
          dataType: 'STRING',
          description: 'The current network setting of an ad group. The possible values include AOL search, Bing and Yahoo! search, Content, and Syndicated search partners',
          type: 'METRIC',
          providerParam: 'Network',
          providerEndpoint: ''
        },
      ]
    },
    {
      label: 'Ad',
      group: 'ad',
      description: '',
      children: [
        {
          value: 'ad_Id',
          label: 'Ad ID',
          dataType: 'INTEGER',
          description: 'The assigned identifier of an ad',
          type: 'DIMENSION',
          providerParam: 'AdId',
          providerEndpoint: ''
        },
        {
          value: 'ad_Title',
          label: 'Ad title',
          dataType: 'STRING',
          description: 'The ad title',
          type: 'DIMENSION',
          providerParam: 'AdTitle',
          providerEndpoint: ''
        },
        {
          value: 'ad_TitlePart1',
          label: 'Ad title part 1',
          dataType: 'STRING',
          description: 'The title part 1 attribute of an ad',
          type: 'DIMENSION',
          providerParam: 'TitlePart1',
          providerEndpoint: ''
        },
        {
          value: 'ad_TitlePart2',
          label: 'Ad title part 2',
          dataType: 'STRING',
          description: 'The title part 2 attribute of an ad',
          type: 'DIMENSION',
          providerParam: 'TitlePart2',
          providerEndpoint: ''
        },
        {
          value: 'ad_TitlePart3',
          label: 'Ad title part 3',
          dataType: 'STRING',
          description: 'The title part 3 attribute of an ad',
          type: 'DIMENSION',
          providerParam: 'TitlePart3',
          providerEndpoint: ''
        },
        {
          value: 'ad_Type',
          label: 'Ad type',
          dataType: 'STRING',
          description: 'The ad type',
          type: 'DIMENSION',
          providerParam: 'AdType',
          providerEndpoint: ''
        },
        {
          value: 'ad_Labels',
          label: 'Ad labels',
          dataType: 'STRING',
          description: 'The labels applied to an ad. Labels are delimited by a semicolon (;)',
          type: 'DIMENSION',
          providerParam: 'AdLabels',
          providerEndpoint: ''
        },
        {
          value: 'ad_Path1',
          label: 'Ad path part 1',
          dataType: 'STRING',
          description: 'The path 1 attribute of an ad',
          type: 'DIMENSION',
          providerParam: 'Path1',
          providerEndpoint: ''
        },
        {
          value: 'ad_Path2',
          label: 'Ad path part 2',
          dataType: 'STRING',
          description: 'The path 2 attribute of an ad',
          type: 'DIMENSION',
          providerParam: 'Path2',
          providerEndpoint: ''
        },
        {
          value: 'ad_Description',
          label: 'Ad description',
          dataType: 'STRING',
          description: 'The first ad description that appears below the path in an ad',
          type: 'DIMENSION',
          providerParam: 'AdDescription',
          providerEndpoint: ''
        },
        {
          value: 'ad_Description2',
          label: 'Ad description 2',
          dataType: 'STRING',
          description: 'The second ad description that appears below the path in an ad',
          type: 'DIMENSION',
          providerParam: 'AdDescription2',
          providerEndpoint: ''
        },
        {
          value: 'ad_Distribution',
          label: 'Ad distribution',
          dataType: 'STRING',
          description: 'The network where you want your ads to show',
          type: 'DIMENSION',
          providerParam: 'AdDistribution',
          providerEndpoint: ''
        },
        {
          value: 'ad_Status',
          label: 'Ad status',
          dataType: 'STRING',
          description: 'The ad status',
          type: 'DIMENSION',
          providerParam: 'AdStatus',
          providerEndpoint: ''
        },
        {
          value: 'ad_TopVsOther',
          label: 'Ad top position',
          dataType: 'STRING',
          description: 'The report will include a column that indicates whether the ad impression appeared in a top position or elsewhere',
          type: 'DIMENSION',
          providerParam: 'TopVsOther',
          providerEndpoint: ''
        },
        // {
        //   value: 'ad_ExtensionId',
        //   label: 'Ad extension id',
        //   dataType: 'STRING',
        //   description: 'The ad extension identifier',
        //   type: 'DIMENSION',
        //   providerParam: 'AdExtensionId',
        //   providerEndpoint: ''
        // },
      ]
    },
    {
      label: 'SampleDimension1',
      group: 'SampleDimension1',
      description: '',
      children: [
        {
          value: '',
          label: '',
          dataType: '',
          description: '',
          type: 'DIMENSION',
          providerParam: '',
          providerEndpoint: ''
        },
        {
          value: '',
          label: '',
          dataType: '',
          description: '',
          type: 'DIMENSION',
          providerParam: '',
          providerEndpoint: ''
        },
      ]
    },
    {
      label: 'SampleDimension1',
      group: 'SampleDimension1',
      description: '',
      children: [
        {
          value: '',
          label: '',
          dataType: '',
          description: '',
          type: 'DIMENSION',
          providerParam: '',
          providerEndpoint: ''
        },
        {
          value: '',
          label: '',
          dataType: '',
          description: '',
          type: 'DIMENSION',
          providerParam: '',
          providerEndpoint: ''
        },
      ]
    },
    {
      label: 'SampleDimension1',
      group: 'SampleDimension1',
      description: '',
      children: [
        {
          value: '',
          label: '',
          dataType: '',
          description: '',
          type: 'DIMENSION',
          providerParam: '',
          providerEndpoint: ''
        },
        {
          value: '',
          label: '',
          dataType: '',
          description: '',
          type: 'DIMENSION',
          providerParam: '',
          providerEndpoint: ''
        },
      ]
    }
  ]
}

const attributionWindow = [
  {
    value: '',
    label: '',
  },
  {
    value: '',
    label: '',
  }
]

module.exports = { dimensions, metrics, attributionWindow };
