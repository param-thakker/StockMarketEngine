from flask import Flask, jsonify, abort, request, Response
import json
from stockAPI import *

app = Flask(__name__,
            static_folder='static')


@app.route("/")
@app.route("/index")
def index():
    return app.send_static_file('home.html')  

@app.route("/company/<string:ticker_name>", methods=['GET'])
def send_outlook(ticker_name):
    company_outlook = company_summaryAPI(ticker_name)
    return jsonify(company_outlook) 


@app.route("/summary/<string:ticker_name>", methods=['GET'])
def send_stock_summary(ticker_name):
    stock_summary = stock_summaryAPI(ticker_name)
    return jsonify(stock_summary)

@app.route("/news/<string:ticker_name>", methods=['GET'])
def send_news(ticker_name):
    news = companyNewsAPI(ticker_name)
    return jsonify(news) 

@app.route("/charts/<string:ticker_name>", methods=['GET'])
def send_charts(ticker_name):
    charts = stockChartsAPI(ticker_name)
    return jsonify(charts) 
   

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
