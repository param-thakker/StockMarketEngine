import requests
# import re
from datetime import datetime
# import dateutil
from dateutil.relativedelta import relativedelta
# import pytz
from datetime import datetime, timedelta
from dateutil.relativedelta import *
import json
import time

FinnhubAPIKey='c86qbmaad3ib8jk152u0'


def extract_summary(data,recData):
    return {"prevClose": data['pc'],
            "open": data['o'],
            "high": data['h'],
            "low": data['l'],
            "change": data['d'],
            "changePercent": data['dp'],
            'strong_sell': recData['strongSell'],
            'sell': recData['sell'],
            'hold': recData['hold'],
            'buy': recData['buy'],
            'strong_buy': recData['strongBuy']
            }


def extract_outlook(ori_outlook):
    ticker=ori_outlook["ticker"]
    return {"logo":ori_outlook["logo"],
            "name": ori_outlook["name"],
            "ticker": ori_outlook["ticker"],
            "exchangeCode": ori_outlook["exchange"],
            "startDate": ori_outlook["ipo"],
            "description": ori_outlook["finnhubIndustry"]}



def extract_articles(article):
    if ((article['image'] is not None and len(article['image'])!=0) and (article['url'] is not None and len(article['url'])!=0) and (article['headline'] is not None and len(article['headline'])!=0) and (str(article['datetime']) is not None and len(str(article['datetime']))!=0)):
        readableDate =datetime.fromtimestamp(article["datetime"]).strftime('%d %B, %Y')
        return {"headline": article["headline"],
                "image":article["image"],
                "url": article["url"],
                "datetime":readableDate
            }
    else:
        return {}
                

  


def company_summaryAPI(keyword):
   
    outlook_url = "https://finnhub.io/api/v1/stock/profile2?symbol=%s&token=%s" % (keyword, FinnhubAPIKey)
    ori_outlook = requests.get(outlook_url, headers={'Content-Type': 'application/json'}).json()
    try:
        company_outlook = extract_outlook(ori_outlook)
        return company_outlook
    except KeyError:
        return {}


def stock_summaryAPI(keyword):
    stock_summary_url = "https://finnhub.io/api/v1/quote?symbol=%s&token=%s" % (keyword, FinnhubAPIKey)
    recommendation_url = "https://finnhub.io/api/v1/stock/recommendation?symbol=%s&token=%s" % (keyword, FinnhubAPIKey)
   
    try:
        data = requests.get(stock_summary_url, headers={'Content-Type': 'application/json'}).json()
        recData = requests.get(recommendation_url, headers={'Content-Type': 'application/json'}).json()[0]
        stock_summary = extract_summary(data,recData)
        return stock_summary
    except IndexError:
        return {}


def stock_chartAPI(keyword):
    pass
  
def companyNewsAPI(keyword):
    articles = []
    date = datetime.now()
    currentDate=str(date).split()[0]
    prevDate=date-relativedelta(days=+30)
    fromDate=str(prevDate).split()[0]
    articles_url="https://finnhub.io/api/v1/company-news?symbol=%s&from=%s&to=%s&token=%s" %(keyword,fromDate,currentDate,FinnhubAPIKey)
    data = requests.get(articles_url, headers={'Content-Type': 'application/json'}).json()
   # l = list(data)

    for item in data: 
        article = extract_articles(item)
        if len(article)>0:
            articles.append(article)
            if len(articles)==5:
                return articles
        else:
            continue
      
def stockChartsAPI(keyword):
    
    date = datetime.now()
    currentDate=int(time.mktime(date.timetuple()))
    prevDate=date-relativedelta(months=+6,days=+1)
    fromDate=int(time.mktime(prevDate.timetuple()))
    charts_url="https://finnhub.io/api/v1/stock/candle?symbol=%s&resolution=D&from=%s&to=%s&token=%s" %(keyword,fromDate,currentDate,FinnhubAPIKey)
   
    data = requests.get(charts_url, headers={'Content-Type': 'application/json'}).json()
    l=[int(i)*1000 for i in data['t']]
    dateClosingPrice=list(zip(l,data['c']))
    dateVolumePrice=list(zip(l,data['v']))
    
    

    return {
        "ticker_name":keyword,
        "curr_date":datetime.now().strftime("%Y-%m-%d"),
        "date":data['t'],
        "stock_price":data['c'],
        "volume":data['v'],
        "price_date":dateClosingPrice,
        "vol_date":dateVolumePrice
    }
