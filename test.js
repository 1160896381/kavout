require(['dep/highcharts'], function () {
    $(function () {
        Highcharts.setOptions({
            lang: {
                numericSymbols: ['K','M','B','T','P','E'],
                decimalPoint: '.',
                thousandsSep: ','
            }
        });
        $('.company-chart1').highcharts({
            credits:{
                enabled:false
            },
            chart: {
                type: 'spline',
                height: 300,
                borderColor: '#fff',
                borderWidth: 1,
            },
            title: {
               text: ''
            },
            subtitle: {
                text: ''
            },
            legend: {
                align: 'center',
                verticalAlign: 'top',
                x: 0,
                y: 0,
                itemWidth:180,
                itemStyle: {
                    color: '#29779f',
                    fontWeight: 'normal'
                }
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666',
                        lineWidth: 0
                    }
                 },
                series: {connectNulls: true}
            },

            tooltip: {
                crosshairs: true,
                shared: true,
                backgroundColor: '#f8f8f8',
                style: {
                  fontSize: '12px',
                  lineHeight:'20px',
                },
                 valueSuffix:' M'
            },
            xAxis: {
                categories: [
                {% for trend in trend_charts %}
                '{{trend.fdate}}',
                {% endfor %}
                ]
            },
            yAxis: {
                gridLineColor: '#f1f1f1',
                title: {
                    text: ''
                },
                labels: {
                  formatter: function () {
                      var num = parseFloat(this.value);          
                      num = String(num).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')+ 'M';
                      return num ;
                  }
                }
            },

            series: [
                {
                name: 'Revenue',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.total_revenue|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
                {
                    name: 'Gross Profit',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.gross_profit|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
                {
                    name: 'Operating Profit',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.operating_profit|chart_data_formatter}},
                        {% endfor %}
                    ],
                },

                {
                    name: 'Net Profit',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.net_income|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
            ]
        });
    });
});
//
require(['dep/highcharts'], function () {
    $(function () {
        Highcharts.setOptions({
            lang: {
                numericSymbols: ['K','M','B','T','P','E'],
                decimalPoint: '.',
                thousandsSep: ','
            }
        });
        $('.company-chart2').highcharts({
            credits:{
                enabled:false
            },
            chart: {
                type: 'spline',
                height: 300,
                borderColor: '#fff',
                borderWidth: 1,
            },
            title: {
               text: ''
            },
            subtitle: {
                text: ''
            },
            legend: {
                align: 'center', verticalAlign: 'top',
                x: 0,
                y: 0,
                itemWidth:180,
                itemStyle: {
                    color: '#29779f',
                    fontWeight: 'normal'
                }
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666',
                        lineWidth: 0
                    }
                 },
                series: {connectNulls: true}
            },

            tooltip: {
                crosshairs: true,
                shared: true,
                backgroundColor: '#f8f8f8',
                style: {
                  fontSize: '12px',
                  lineHeight:'20px',
                },
                valueSuffix:'%'
            },
            xAxis: {
                categories: [
                {% for trend in trend_charts %}
                '{{trend.fdate}}',
                {% endfor %}
                ]
            },
            yAxis: {
                gridLineColor: '#f1f1f1',
                title: {
                    text: ''
                },
                labels: {
                  formatter: function () {
                      var num = parseFloat(this.value);          
                      num = String(num).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')+ '%';
                      return num ;
                    

                 
                  }
                }
            },

            series: [
                {
                name: 'Revenue Growth',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.revenue_growth|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
                {
                    name: 'Gross Profit Growth',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.gross_profit_growth|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
                {
                    name: 'Operating Profit Growth',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.operating_profit_growth|chart_data_formatter}},
                        {% endfor %}
                    ],
                },

                {
                    name: 'Net Profit Growth',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.net_profit_growth|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
            ]
        });
    });
});
//
require(['dep/highcharts'], function () {
    $(function () {
        Highcharts.setOptions({
            lang: {
                numericSymbols: ['K','M','B','T','P','E'],
                decimalPoint: '.',
                thousandsSep: ','
            }
        });
        $('.company-chart3').highcharts({
            credits:{
                enabled:false
            },
            chart: {
                type: 'spline',
                height: 300,
                borderColor: '#fff',
                borderWidth: 1,
            },
            title: {
               text: '' 
            }, subtitle: {
                text: ''
            }, legend: {
                align: 'center',
                verticalAlign: 'top',
                x: 0,
                y: 0,
                itemWidth:180,
                itemStyle: {
                    color: '#29779f',
                    fontWeight: 'normal'
                }
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666',
                        lineWidth: 0
                    }
                 },
                series: {connectNulls: true}
            },

            tooltip: {
                crosshairs: true,
                shared: true,
                backgroundColor: '#f8f8f8',
                style: {
                  fontSize: '12px',
                  lineHeight:'20px',
                },
                valueSuffix:'%'
            },
            xAxis: {
                categories: [
                {% for trend in trend_charts %}
                '{{trend.fdate}}',
                {% endfor %}
                ]
            },
            yAxis: {
                gridLineColor: '#f1f1f1',
                title: {
                    text: ''
                },
                labels: {
                  formatter: function () {
                      var num = parseFloat(this.value);          
                      num = String(num).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')+ '%';
                      return num ;
                    

                 
                  }
                }
            },

            series: [
                {
                name: 'Gross Profit Margin',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.gross_margin|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
                {
                    name: 'Operating Margin',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.operating_margin|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
                {
                    name: 'Net Profit Margin',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.net_profit_margin|chart_data_formatter}},
                        {% endfor %}
                    ],
                },

                {
                    name: 'EBITDA Margin',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.ebitda_margin|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
            ]
        });
    });
});
//
require(['dep/highcharts'], function () {
    $(function () {
        Highcharts.setOptions({
            lang: {
                numericSymbols: ['K','M','B','T','P','E'],
                decimalPoint: '.',
                thousandsSep: ','
            }
        });
        $('.company-chart4').highcharts({
                        credits:{
                enabled:false
            },
            chart: {
                type: 'spline',
                height: 300,
                borderColor: '#fff',
                borderWidth: 1,
            },
            title: {
               text: ''
            },
            subtitle: {
                text: ''
            },
            legend: { align: 'center',
                verticalAlign: 'top',
                x: 0,
                y: 0,
                itemWidth:180,
                itemStyle: {
                    color: '#29779f',
                    fontWeight: 'normal'
                }
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666',
                        lineWidth: 0
                    }
                 },
                series: {connectNulls: true}
            },

            tooltip: {
                crosshairs: true,
                shared: true,
                backgroundColor: '#f8f8f8',
                style: {
                  fontSize: '12px',
                  lineHeight:'20px',
                },
                valueSuffix:'%'
            },
            xAxis: {
                categories: [
                {% for trend in trend_charts %}
                '{{trend.fdate}}',
                {% endfor %}
                ]
            },
            yAxis: {
                gridLineColor: '#f1f1f1',
                title: {
                    text: ''
                },
                labels: {
                  formatter: function () {
                      var num = parseFloat(this.value);          
                      num = String(num).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')+ '%';
                      return num ;
                    

                 
                  }
                }
            },

            series: [
                {
                name: 'Return on Equity',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.return_on_equity|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
                {
                    name: 'Return on Assets',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.return_on_assets|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
                {
                    name: 'ROIC',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.return_on_invested_capital|chart_data_formatter}},
                        {% endfor %}
                    ],
                },

                {
                    name: 'Greenblatt ROC',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.greenblatt_roc|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
            ]
        });
    });
});
//
require(['dep/highcharts'], function () {
    $(function () {
        Highcharts.setOptions({
            lang: {
                numericSymbols: ['K','M','B','T','P','E'],
                decimalPoint: '.',
                thousandsSep: ','
            }
        });
        $('.company-chart5').highcharts({
            credits:{
                enabled:false
            },
            chart: {
                type: 'spline',
                height: 300,
                borderColor: '#fff',
                borderWidth: 1,
            },
            title: {
               text: ''
            },
            subtitle: {
                text: ''
            },
            legend: { align: 'center',
                verticalAlign: 'top',
                x: 0,
                y: 0,
                itemWidth:180,
                itemStyle: {
                    color: '#29779f',
                    fontWeight: 'normal'
                }
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666',
                        lineWidth: 0
                    }
                 },
                series: {connectNulls: true}
            },

            tooltip: {
                crosshairs: true,
                shared: true,
                backgroundColor: '#f8f8f8',
                style: {
                  fontSize: '12px',
                  lineHeight:'20px',
                },
                valueSuffix:'M'
            },
            xAxis: {
                categories: [
                {% for trend in trend_charts %}
                '{{trend.fdate}}',
                {% endfor %}
                ]
            },
            yAxis: {
                gridLineColor: '#f1f1f1',
                title: {
                    text: ''
                },
                labels: {
                  formatter: function () {
                      var num = parseFloat(this.value);          
                      num = String(num).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + ' M';
                      return num ;
                    

                 
                  }
                }
            },

            series: [
                {
                name: 'Cash & Cash Equivalents',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.cash_and_cash_equivalents|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
                {
                    name: 'Total Aeests',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.total_assets|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
                {
                    name: 'Total Liabilities',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.total_liabilities|chart_data_formatter}},
                        {% endfor %}
                    ],
                },

                {
                    name: 'Sharebolders Equity',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.total_stockholders_equity|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
            ]
        });
    });
});
//
require(['dep/highcharts'], function () {
    $(function () {
        Highcharts.setOptions({
            lang: {
                numericSymbols: ['K','M','B','T','P','E'],
                decimalPoint: '.',
                thousandsSep: ','
            }
        });
        $('.company-chart6').highcharts({
            credits:{
                enabled:false
            },
            chart: {
                type: 'spline',
                height: 300,
                borderColor: '#fff',
                borderWidth: 1,
            },
            title: {
               text: ''
            },
            subtitle: {
                text: ''
            },
            legend: {
                align: 'center',
                verticalAlign: 'top',
                x: 0, y: 0, itemWidth:180,
                itemStyle: { color: '#29779f',
                    fontWeight: 'normal'
                }
            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666',
                        lineWidth: 0
                    }
                 },
                series: {connectNulls: true}
            },

            tooltip: {
                crosshairs: true,
                shared: true,
                backgroundColor: '#f8f8f8',
                style: {
                  fontSize: '12px',
                  lineHeight:'20px',
                },
                valueSuffix:'M'
            },
            xAxis: {
                categories: [
                {% for trend in trend_charts %}
                '{{trend.fdate}}',
                {% endfor %}
                ]
            },
            yAxis: {
                gridLineColor: '#f1f1f1',
                title: {
                    text: ''
                },
                labels: {
                  formatter: function () {
                      var num = parseFloat(this.value);          
                      num = String(num).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + ' M';
                      return num ;
                    

                 
                  }
                }
            },

            series: [
                {
                name: 'Cash from Operations',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.cash_from_operating_activities|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
                {
                    name: 'Cash from Investing',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.cash_from_investing_activities|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
                {
                    name: 'Cash from Financing',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.cash_from_financing_activities|chart_data_formatter}},
                        {% endfor %}
                    ],
                },

                {
                    name: 'Free Cash Flow',
                    data:[
                        {% for trend in trend_charts %}
                          {{trend.data.free_cash_flow|chart_data_formatter}},
                        {% endfor %}
                    ],
                },
            ]
        });
    });
});