import { initJQueryExtensions } from './scripts.js';

// Initialize jQuery extensions
initJQueryExtensions();

const LimitInfoMap = {
    ConcurrentAsyncGetReportInstances: { Title: "Concurrent Async Get Report Instances", Description: "Concurrent REST API requests for results of asynchronous report runs" },
    ConcurrentSyncReportRuns: { Title: "Concurrent Sync Report Runs", Description: "Concurrent synchronous report runs via REST API" },
    DailyAsyncApexExecutions: { Title: "Daily Async Apex Executions", Description: "Daily asynchronous Apex method executions (batch Apex, future methods, queueable Apex, and scheduled Apex)" },
    DailyBulkApiRequests: { Title: "Daily Bulk API Requests" },
    DailyDurableGenericStreamingApiEvents: { Title: "Daily Durable Generic Streaming Api Events" },
    DailyDurableStreamingApiEvents: { Title: "Daily Durable Streaming Api Events" },
    DailyGenericStreamingApiEvents: { Title: "Daily Generic Streaming Api Events", Description: "Daily generic streaming events (if generic streaming is enabled for your org)" },
    DailyStreamingApiEvents: { Title: "Daily Streaming Api Events" },
    DailyWorkflowEmails: { Title: "Daily Workflow Emails" },
    DurableStreamingApiConcurrentClients: { Title: "Durable Streaming Api Concurrent Clients" },
    HourlyAsyncReportRuns: { Title: "Hourly Async Report Runs", Description: "Hourly asynchronous report runs via REST API" },
    HourlyDashboardRefreshes: { Title: "Hourly Dashboard Refreshes", Description: "Hourly dashboard refreshes via REST API" },
    HourlyDashboardResults: { Title: "Hourly Dashboard Results", Description: "Hourly REST API requests for dashboard results" },
    HourlyDashboardStatuses: { Title: "Hourly Dashboard Statuses", Description: "Hourly dashboard status requests via REST API" },
    HourlyODataCallout: { Title: "Hourly OData Callout" },
    HourlySyncReportRuns: { Title: "Hourly Sync Report Runs", Description: "Hourly synchronous report runs via REST API" },
    HourlyTimeBasedWorkflow: { Title: "Hourly Time Based Workflow" },
    MassEmail: { Title: "Mass Email", Description: "Daily number of mass emails that are sent to external email addresses by using Apex or Force.com APIs" },
    SingleEmail: { Title: "Single Email", Description: "Daily number of single emails that are sent to external email addresses by using Apex or Force.com APIs" },
    StreamingApiConcurrentClients: { Title: "Streaming Api Concurrent Clients" }
};

const getSessionId = () => {
    return document.cookie.match("sid=([^;]*)")[1];
};

const getOrgLimits = (sessionId) => {
    return $.ajax({
        url: '/services/data/v40.0/limits/',
        headers: { 'Authorization': `Bearer ${sessionId}` }
    });
};

const processOrgLimitsResponse = (data, textStatus, jqXHR) => {
    if (textStatus === "success") {
        showOrgLimitsUI(data);
    } else {
        console.log(jqXHR);
    }
};

const showOrgLimitsUI = (orgLimits) => {
    const alreadyShownLimits = ['DailyApiRequests', 'DataStorageMB', 'FileStorageMB'];
    const numberFormatter = new Intl.NumberFormat();
    let orgLimitsUI = `
        <div class="panel-container">
            <span>
                <div class="panel">
                    <div class="top-line">
                        <h2>Other Org Limits</h2>
                        <img src="https://github.com/mattsimonis/boostr/blob/master/app/icon.png?raw=true" 
                             style="height:32px; width:32px; padding-left: 20px;" 
                             title="Provided by Boostr for Salesforce" />
                    </div>
                    <div class="content">
                        <div class="panelContent">`;

    Object.keys(orgLimits).forEach((limitName, index) => {
        if (alreadyShownLimits.includes(limitName)) return;

        const limitInfo = LimitInfoMap[limitName];
        if (!limitInfo) return;

        const limitRemaining = orgLimits[limitName].Remaining;
        const limitMax = orgLimits[limitName].Max;
        const limitUsed = limitMax - limitRemaining;
        const percentageUsed = Math.round((limitUsed / limitMax) * 100);
        const percentageAvailable = 100 - percentageUsed;

        const borderTopClass = index === 0 ? '' : 'border-top';
        const panelWarningClass = percentageUsed >= 80 ? 'usage-warn' : '';
        const barPositiveWarnClass = percentageUsed >= 80 ? 'bar-positive-warn' : '';

        orgLimitsUI += `
            <div class="panel-content-item ${borderTopClass} ${panelWarningClass}">
                <div class="panelLeft">
                    <div class="type">
                        <span class="title">${limitInfo.Title}</span>
                        ${limitInfo.Description ? `
                            <div class="mouseOverInfoOuter" onfocus="addMouseOver(this)" onmouseover="addMouseOver(this)" tabindex="0">
                                <img src="/img/s.gif" alt class="infoIcon" title>
                                <div class="mouseOverInfo" style="display:none; opacity: -0.2; left: 21px;">
                                    <div class="body">${limitInfo.Description}</div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="datalink">
                        <div class="num">${numberFormatter.format(limitUsed)}</div>
                    </div>
                    <div class="floatClear"></div>
                </div>
                <div class="panelRight">
                    <div class="visual">
                        <span>
                            <div class="bar-container">
                                <div class="bar">
                                    <div class="bar-positive ${barPositiveWarnClass}" style="width:${percentageUsed}px;"></div>
                                    <div class="bar-negative" style="width:${percentageAvailable}px;"></div>
                                </div>
                            </div>
                        </span>
                    </div>
                    <span>
                        <div align="right" class="desc">
                            <span class="desc-num">${percentageUsed}%</span>
                            (maximum ${numberFormatter.format(limitMax)})<br />
                        </div>
                    </span>
                </div>
                <div class="floatClear"></div>
            </div>`;
    });

    orgLimitsUI += `
                        </div>
                    </div>
                </div>
            </span>
        </div>`;

    $('#panel-board').append(orgLimitsUI);
};

const init = () => {
    const sessionId = getSessionId();
    getOrgLimits(sessionId).always(processOrgLimitsResponse);
};

init();
