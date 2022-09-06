const input = document.getElementsByName('ticker_name')[0];
const SubmitButton = document.getElementById('sButton');
const ResetButton = document.getElementById('cButton');
var searchResult = document.getElementById("result-area");
var searchErrorResult = document.getElementById("error_result");
var outlookContent = document.getElementById("outlook-content");
var summaryContent = document.getElementById("summary-content");
var newsContent = document.getElementById("news-content");
var chartsContent = document.getElementById("charts-content");

function companySummary(serverResponse) {
    searchErrorResult.style.display = "none";
    searchResult.style.display = "none";
    if (Object.keys(serverResponse).length === 0) {
        searchErrorResult.style.display = "block";
    } else {
        let table = "<div>"; 
        table += "<div class = \'content-body\'>"; 
        table +="<div><div class = \'imageDiv\'>" + 
                       "<img class=\'pImage\' alt=\'urlImage\' src=\'" + 
                       serverResponse["logo"] + 
                       "\'/></div></div>"; 
        table += "<div class = \'container\'><div class = \'rowTitle\'>Company Name</div><div class = \'rowValue\'>" + serverResponse["name"]+ "</div></div>"; 
        table += "<div class = \'container\'><div class = \'rowTitle\'>Stock Ticker Symbol</div><div class = \'rowValue\'>" + serverResponse["ticker"]+ "</div></div>"; 
        table += "<div class = \'container\'><div class = \'rowTitle\'>Stock Exchange Code</div><div class = \'rowValue\'>" + serverResponse["exchangeCode"]+ "</div></div>"; 
        table += "<div class = \'container\'><div class = \'rowTitle\'>Company Date</div><div class = \'rowValue\'>" + serverResponse["startDate"]+ "</div></div>"; 
        table += "<div class = \'container\'><div class = \'rowTitle\'>Category</div><div class = \'rowValue\'>" + serverResponse["description"]+ "</div></div>"; 
        table += "</div></div>";
        outlookContent.innerHTML = table;
        outlookContent.style.display="block";
        searchResult.style.display = "block";

    }
}

function stockSummary(serverResponse) {
 
     if (Object.keys(serverResponse).length >=1) {
        let table = "<div>"; 
        table += "<div class = \'sBody\'>"; 
        table += "<div class = \'container\'><div class = \'rowTitle\'>Stock Ticker Symbol</div><div class = \'rowValue\'>"+
                        input.value + "</div></div>"; 
        table += "<div class = \'container\'><div class = \'rowTitle\'>Previous Closing Price</div><div class = \'rowValue\'>"+
                        serverResponse["prevClose"] + "</div></div>"; 
        table += "<div class = \'container\'><div class = \'rowTitle\'>Opening Price</div><div class = \'rowValue\'>"+
                        serverResponse["open"] + "</div></div>"; 
        table += "<div class = \'container\'><div class = \'rowTitle\'>High Price</div><div class = \'rowValue\'>"+
                        serverResponse["high"] + "</div></div>";
        table += "<div class = \'container\'><div class = \'rowTitle\'>Low Price</div><div class = \'rowValue\'>"+
                        serverResponse["low"] + "</div></div>"; 
        table += "<div class = \'container\'><div class = \'rowTitle\'>Change</div><div class = \'rowValue\'>"+
                        serverResponse["change"] + "&nbsp;";
        if(parseFloat(serverResponse["change"]) < 0 ) {
            table += "<img class = 'arrow-direction' alt=\'urlImage\' src=\'/static/images/RedArrowDown.png\'/>"; 
        }
        else {
            table += "<img class = 'arrow-direction' alt=\'urlImage\' src=\'/static/images/GreenArrowUp.png\'/>"; 
        }
        table += "</div></div>";               
        table += "<div class = \'container\'><div class = \'rowTitle\'>Change Percent</div><div class = \'rowValue\'>"+
                        serverResponse["changePercent"] + "&nbsp;";  
        if(parseFloat(serverResponse["changePercent"]) < 0 ) {
            table += "<img class = 'arrow-direction' alt=\'urlImage\' src=\'/static/images/RedArrowDown.png\'/>"; 
        }
        else {
            table += "<img class = 'arrow-direction' alt=\'urlImage\' src=\'/static/images/GreenArrowUp.png\'/>"; 
        }
        table += "</div></div>"
        table += "<div class = \'container\'><div class=\'recommendation\'><div class = \'ss\'>Strong Sell</div><div class = \'sSell\'>" + 
                        serverResponse['strong_sell']+"</div><div class = \'sell\'>" + serverResponse['sell']+ "</div><div class = \'hold\'>"+
                        serverResponse['hold'] + "</div><div class = \'buy\'>" + serverResponse['buy'] + "</div><div class = \'sBuy\'>" + serverResponse['strong_buy'] + 
                        "</div><div class = \'sb\'>Strong Buy</div></div></div>";
        table += "<div class = \'footerInfo\'><div>Recommendation Trends </div></div>"
        table+="</div></div>";
        summaryContent.innerHTML = table;
    }
}

function newsSummary(serverResponse) {
    let serverResponseNews = serverResponse;
    console.log(JSON.stringify(serverResponseNews));
    let news = "";
    let newsNum = serverResponseNews.length;
    
    for (let i = 0; i < newsNum; i++) {
       news += "<div class=\'box\'><div class=\'center-crop-img\'>";
       news += "<img class=\'nImage\' alt=\'urlImage\' src=\'" + serverResponseNews[i]["image"] + "\'/></div>";
        news += "<div><p><b>" + serverResponseNews[i]["headline"] + "</b></p>";
        news += "<p> <span>" + serverResponseNews[i]["datetime"] + "</span></p>";
        news += "<p><a href=\'" + serverResponseNews[i]["url"] + "\' target=\"_blank\">See Original Post</a></p>";
        news += "</div></div>";
    }
    newsContent.innerHTML = news;
}
function chartsSummary(serverResponse){
    let tickerName = serverResponse['ticker_name'];
    let currentDate = serverResponse['curr_date'];

    let volume = serverResponse['vol_date'];
    let close_price = serverResponse['price_date']; 
    let dataLength = volume.length;
    

    Highcharts.stockChart('create_chart', {
        stockTools: {
            gui: {
                enabled: false
            }
        },

        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%e. %b}'
            }
        },

        yAxis: [{
            title: {text: 'Volume'},
            labels: {align: 'left'},
            min: 0,

        }, {
            title: {text: 'Stock Price'},
            opposite: false,
            min: 0,
        }],

        plotOptions: {
            column: {
                pointWidth: 2,
                color: '#404040'
            }
        },

        rangeSelector: {
            buttons: [{
                type: 'day',
                count: 7,
                text: '7d'
            }, {
                type: 'day',
                count: 15,
                text: '15d'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'month',
                count: 3,
                text: '3m'
            }, {
                type: 'month',
                count: 6,
                text: '6m'
            }],
            selected: 4,
            inputEnabled: false
        },

        title: {text: 'Stock Price ' + tickerName + " " + currentDate},

        subtitle: {
            text: '<a href="https://finnhub.io/" target="_blank">Source: Finnhub</a>',
            useHTML: true
        },

        series: [{
            type: 'area',
            name: tickerName,
            data: close_price,
            yAxis: 1,
            showInNavigator: true,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
        },
            {
                type: 'column',
                name: tickerName + ' Volume',
                data: volume,
                yAxis: 0,
                showInNavigator: false,
            }]
    });
    
}

function httpRequest(url, writeFunc) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            writeFunc(JSON.parse(request.responseText));
        } else {
            console.error(request.statusText);
        }
    };
    request.open("GET", url, true);
    request.send();
}

function newTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");

    if (searchErrorResult.style.display === "none") {
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName("tabs");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
       
    }
}

function resetTabs() {
    let tablinks, i, outlookLink;
    tablinks = document.getElementsByClassName("tabs");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    outlookLink = document.getElementsByClassName("tabs")[0];
    outlookLink.className = "tabs active";
}

SubmitButton.addEventListener("click", callAPI, false)
ResetButton.addEventListener("click", reset, false)


function callAPI(event) {
    let tickerName = input.value;
    let tickerNameLen = tickerName.length;
    if (tickerNameLen >= 1) {
        event.preventDefault();
        resetTabs();
        searchErrorResult.style.display = "none";
        searchResult.style.display = "none";
        httpRequest("/company/" + tickerName, companySummary);
        summaryContent.style.display = "none";
        httpRequest("/summary/" + tickerName, stockSummary);
        newsContent.style.display="none";
        httpRequest("/news/" + tickerName, newsSummary);
        chartsContent.style.display="none";
        httpRequest("/charts/" + tickerName, chartsSummary);

    }
}

function reset(event) {
    searchResult.style.display = "none";
    searchErrorResult.style.display = "none";
    resetTabs();
}