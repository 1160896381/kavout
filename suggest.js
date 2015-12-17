define(function (require) {

    var $ = require('jquery');
    var Class = require('./class');
    var Control = require('./control');

    var IS_CHROME = /\s+chrome\/\d/i.test(navigator.userAgent);

    var exports = {};
    var doc = $(document);

    var cachedStockPrices = {};

    var Options = Control.extend({

        options: {
            stockServer: 'http://209.126.117.48:18088',
            stockPrices: 'price/latest/day/',
            tag: 'dl',
            'class': 'dropdown-menu',
            typeClass: 'suggest-',
            selectedClass: 'eon',
            item: '',
            tpl: ''
                + '<div>'
                +   '<div class="suggest-box suggest-box-inreport">'
                +       '<div class="suggest-word"></div>'
                +       '<h4>Company</h4>'
                +       '<div class="suggest-word"></div>'
                +       '<h4>Form Type</h4>'
                +       '<div class="suggest-word"></div>'
                +       '<h4>Income Statement</h4>'
                +       '<div class="suggest-word"></div>'
                +       '<h4>Balance Sheet</h4>'
                +       '<div class="suggest-word"></div>'
                +       '<h4>Cash Flow Statement</h4>'
                +       '<div class="suggest-word"></div>'
                +       '<h4>Ratio</h4>'
                +   '</div>'
                + '</div>'
        },

        binds: 'show, hide',

        init: function (options) {
            this.ignores = [];
            this.selectedIndex = -1;
            this.items = [];
            this.priceKeys = [];
        },

        render: function (form) {
            var options = this.options;

            var main = this.main = $(options.tpl).addClass(options['class']);

            var list = this.list = main.find('.suggest-word');
            'company,formtype,incstate,balsheet,casstate,ratio'.split(',').forEach(function (name, i) {
                this[name] = list.eq(i);
            }, this);

            this.main.insertAfter(form);

            this.delegate(this.main, 'click', this.onClick, 'a');
        },

        onClick: function (e) {
            var el = $(e.target).closest('a');

            if (!el.length || el.attr('href').slice(-1) === '#') {
                e.preventDefault();
                return;
            }

            this.hide(e);
        },

        selectItem: function (key) {
            
            // this.fire('change');
        },

        onScroll: function (e) {
            e.preventDefault();
            this.selectItem(this.selectedIndex + (e.wheel > 0 ? -1 : 1));
        },

        show: function () {
            if (!this.items.length) {
                return this.hide();
            }

            this.list.each(function (i, el) {
                el = $(el);
                var showOrHide = el.children().length ? 'show' : 'hide';
                el[showOrHide]().prev()[showOrHide]();
            });

            this.main.show();

            doc.on('click', this.hide);
            // doc.on('mousewheel', this.onScroll);

            this.fire('show');
            // this.getPrices();
        },

        hide: function (e) {
            if (e) {
                if (!$.contains(this.main[0], e.target)
                    && (
                        e.target.tagName === 'BODY'
                        || !this.ignores.some(function (item) {return item === e.target;})
                    )
                ) {
                    this.main.hide();
                    this.fire('hide');
                    doc.off('click', this.hide);
                    // doc.off('mousewheel', this.onScroll);
                }
            }
            else {
                this.main.hide();
                this.fire('hide');
                doc.off('click', this.hide);
            }
        },

        getPrices: function () {
            var priceKeys = this.priceKeys;
            var keys = priceKeys.filter(function (key) {return !cachedStockPrices[key];});

            if (keys.length) {
                var url = this.options.stockServer + this.options.stockPrices + keys.join(',') + '/';

                var self = this;
                $.ajax({
                    dataType: 'jsonp',
                    jsonp: 'callback',
                    url: url
                }).done(function (json) {
                    if (json.status === 0) {
                        delete json.status;
                        $.extend(cachedStockPrices, json, true);
                        self.updatePrices(priceKeys);
                    }
                });
            }
            else if (priceKeys.length) {
                this.updatePrices(priceKeys);
            }
        },

        updatePrices: function (keys) {
            var main = this.main;
            keys.forEach(function (key) {
                var json = cachedStockPrices[key];
                if (!json) {
                    return;
                }
                json = json.data;

                var el = $('#' + key.replace(/[@ ]/g, '-'), main);
                if (!('rate' in json && 'close' in json && 'change' in json)) {
                    el.hide('fast');
                }

                var change = json.rate;
                el.find('.s-4').text(json.close);
                el.find('.s-5 em')
                    .text(json.change)
                    .parent()
                        .addClass(change > 0.009 ? 'mod-stock-up' : (change < -0.009 ? 'mod-stock-down' : 'mod-stock-middle'));
                el.find('.s-5 cite').text( + change + '%');
            });
        },

        addIgnores: function () {
            this.ignores.push.apply(this.ignores, [].slice.call(arguments));
        },

        addItem: function (json, symbol, selected, key, itemType, clsType) {
            var options = this.options;
            clsType = clsType ? clsType.replace(/[^a-z]+/ig, '-') : '';
            itemType = itemType ? itemType.replace(/[^a-z]+/ig, '-') : 'Company';

            var finalType = (clsType ? clsType : itemType) || options.item;
            var typeElement = this[finalType.toLowerCase()];
            if (!typeElement) {
                return;
            }

            if (selected) {
                this.selectedIndex = this.items.length;
            }

            var Item = Options[itemType + 'Item'] || Options.Item;
            var item = new Item({
                text: json.name,
                value: json.cik,
                key: key,
                selected: selected,
            });
            item.render(json, symbol);
            this.items.push(item);
            typeElement.append(item.main);

            if (finalType === 'Stocks') {
                var cachedKey = (json.symbol + '@' + json.exchange).toLowerCase();
                this.priceKeys.push(cachedKey);
            }

        },

        addItems: function () {
            var items = this.items;
            var el = this.list;
            [].slice.call(arguments).forEach(function (item) {
                items.push(item);
                el.append(item.main);
            });
        },

        newItems: function () {
            this.list.empty();
            this.items = [];
            this.selectedIndex = -1;
            this.priceKeys = [];
            this.addItems.apply(this, arguments);
        },

        getValue: function () {
            var item = this.items[this.selectedIndex];
            return item ? item.value : '';
        },

        getText: function () {
            var item = this.items[this.selectedIndex];
            return item ? (item.getText ? item.getText() : item.text) : '';
        }
    });

    var replaceBold = function ($0, $1) {
        return '<b>' + $1 + '</b>';
    };

    var escapeRegex = function (reg) {
        return reg.replace(/[-\/\\\^\$\(\)\[\]]/g, '\\$&');
    };

    Options.Item = Control.extend({

        options: {
            tag: 'div',
            key: '',
            text: '',
            value: '',
            selected: false,
            selectedClass: 'eon',
            highlightClass: 'highlight'
        },

        render: function (json, symbol) {
            var options = this.options;
            this.main = $(document.createElement(options.tag)).addClass("word");

            this.data = json;
            this.symbol = symbol;

            this.key = options.key;
            this.text = options.text;
            this.value = options.value;
            this.selected = options.selected;

            delete options.key;
            delete options.text;
            delete options.value;
            delete options.selected;

            this.setHtml();
            if (this.selected) {
                this.select();
            }
        },

        setHtml: function () {
            this.main.html(this.text);
        },

        select: function () {
            this.main.addClass(this.options.selectedClass);
        },

        bold: function (text, key) {
            var keys = key.split(/\s+/).map(escapeRegex);
            key = keys.length > 1 ? keys.join('|') : keys[0];
            return text.replace(new RegExp('\\b(' + key + ')', 'gi'), replaceBold);
        },

        firstUp:function(str) {
            var  str = str.replace(/\b(\w)/g, function($0, $1) {return $1.toUpperCase();});
            return str.replace(/(\/\w{2}\/?)$/, function($0, $1) {return $1.toUpperCase();});
        },

        normal: function () {
            this.main.removeClass(this.options.selectedClass);
        }
    });

    Options.StocksItem = Options.Item.extend({

        setHtml: function () {
            var json = this.data;
            var key = this.key;
            var html = '<span class="s-1">';
            html += '<a href="/stock/'+ json.exchange + '/' + json.symbol + '/" target="_blank">';
            if (json.symbol) {
                html += this.bold(json.symbol, key) ;
            }
            html +=  ' (' +this.bold(json.name, key) + ')'+'</a>';
            html += '</span><span class="s-2">';
            if (json.exchange) {
                html += json.exchange;
            }
            html += '</span>';
            html += '<span class="s-4"></span><span class="s-5"><span><em></em>(<cite></cite>)</span></span>';
            html += '<span class="s-6"><a href="#" id="suggestLabel" data-toggle="dropdown" >Latest<i class="fa fa-angle-down"></i></a>';
            html += '<div class="dropdown-menu" role="menu" aria-labelledby="suggestLabel"><ul class="mod-drop-list">'
            html += '<li><a href="/stock/'+ json.exchange + '/' + json.symbol + '/" target="_blank">Stream</a></li>'
            if (json.reports) {
                json.reports.forEach(function (report) {
                    html += '<li><a  target="_blank" href="/notes/' + report.accession +  '/?layout=filing&item=summary" title="' + report.date + '">' + report.name + '</a></li>';
                });
            }

            html += '</ul></div></span>';
            html += '<span class="s-3"><a href="#" class="btn btn-xs follow-btn" data-id="' + json.cik + '"><i class="fa fa-check aaa"></i></a></span>';
            this.main.html(html).attr('id', [json.symbol, json.exchange.replace(/ /g, '-')].join('-').toLowerCase());
        }
    });

    Options.CompanyItem = Options.Item.extend({

        setHtml: function () {
            var json = this.data;
            var key = this.key;
            key = key ? key.replace(/[a-z]/g, function (a) {return a.toUpperCase()}) : '';
            var symbols = '';
            var symbolUrl = '';
            var symbolEntityTrue = this.symbol;
            var symbolOrName = false;

            for (var i=0; i<symbolEntityTrue.length; i++) {
                symbols += symbolEntityTrue[i] + ' ';
                symbolUrl += '&symbol=' + encodeURIComponent(symbolEntityTrue[i]);
            }

            var keyArr = key.split(/\s+/);
            if (json.symbol.indexOf(keyArr[keyArr.length-1]) >= 0) {
                symbolOrName = true; 
            }
            
            var query = '';
            if (json.symbol) {
                if (symbols) {
                    query += '<b>' + symbols + '</b>';    
                }
                query += this.bold(symbolOrName 
                        ? json.symbol 
                        : this.firstUp(json.name), key)
            }

            var queryText = $('<div></div>').html(query).text();
            var html = '';
            var url = '/search/?action=box&symbol=' 
                    + encodeURIComponent(json.symbol)
                    + symbolUrl 
                    + '&query=' 
                    + encodeURIComponent(queryText);
            html += '<a href="' + url + '">';
            html += query;
            html += '</a>';
            this.main.html(html);
        },
    });

    Options.FormtypeItem = Options.Item.extend({

        bold: function (text, key) {
            var scanDone = false;
            var keys = key.split(/\s+/).map(function(key) {
                var result = [];
                var token = '';
                var maxKey = key.length;
                var len = text.length;
                var match = false;

                if (scanDone || maxKey > len) {
                    return '';
                }

                for (var i = 0, j = 0; i < len; i++) {

                    switch (text[i]) {
                        case key[j]:
                            token += text[i];
                            j++;
                            if (!scanDone && j===maxKey) {
                                match = true;
                                result.push('<b>' + token + '</b>');
                                token = '';
                                j = 0;
                                scanDone = true;
                            }
                            break;

                        case '-':
                        case '/':
                            token += text[i];
                            break;

                        default:
                            token += text[i];
                            if (match === false) {
                                return '';
                            }
                            break;
                    }
                }

                if (token) {
                    result.push(token);
                }

                return result.join('');
            });

            return keys.join('');
        },

        setHtml: function () {
            var symbol = this.symbol;
            var symbolUrl = '';
            var symbols = '';

            for (var i=0; i<symbol.length; i++) {
                symbols += symbol[i] + ' ';
                symbolUrl += '&symbol=' + encodeURIComponent(symbol[i]);
            }

            var key = this.key;
            key = key ? key.replace(/[a-z]/g, function (a) {return a.toUpperCase()}) : '';
            var text = this.data.kw;
            text = text ? text.replace(/[a-z]/g, function (a) {return a.toUpperCase()}) : '';
            var query = '';
            if (text) {
                if (symbols) {
                    query += '<b>' + symbols + '</b>';
                }
                query += this.bold(text, key);
            }
            var queryText = $('<div></div>').html(query).text();
            var html = '';
            var url = '/search/?action=formtype' 
                    + symbolUrl 
                    + '&formtype=' 
                    + encodeURIComponent(this.data.name) 
                    + '&query=' 
                    + encodeURIComponent(queryText);
            html += '<a href="' + url + '">';
            html += query;
            html += '</a>';
            this.main.html(html);
        }
    });

    Options.FinancialItem = Options.Item.extend({

        setHtml: function () {
            var symbol = this.symbol;
            var symbolUrl = '';
            var symbols = '';

            for (var i=0; i<symbol.length; i++) {
                symbols += symbol[i] + ' ';
                symbolUrl += '&symbol=' + encodeURIComponent(symbol[i]);
            }

            var key = this.key;
            key = key ? key.replace(/[a-z]/g, function (a) {return a.toUpperCase()}) : '';
            var text = this.data.kw;
            text = text ? text.replace(/[a-z]/g, function (a) {return a.toUpperCase()}) : '';
            
            var query = '';
            if (text) {
                if (symbols) {
                    query += '<b>' + symbols + '</b>';    
                }
                query += this.bold(text, key);
            }
            var queryText = $('<div></div>').html(query).text();
            var html = '';
            var url = '/search/?action=box' 
                    + symbolUrl 
                    + '&ratio=' 
                    + encodeURIComponent(this.data.kw)
                    + '&name=' 
                    + encodeURIComponent(this.data.name)
                    + '&query=' 
                    + encodeURIComponent(queryText);
            html += '<a href="' + url + '">';
            html += query;
            html += '</a>';
            this.main.html(html);
        }
    });

    var store = {};
    var Suggest = Control.extend({

        options: {
            domain: 'http://209.126.98.23:8500/{type}/',
            url: '{domain}?q={key}',
            type: 'suggest',
            main: '#top-search-form',
            element: '#search-input',
            menu: {
                tag: 'ul',
                item: 'company'
            },
            data: {},
            min: 1,
            delay: 100,
            isChanged: null
        },

        binds: 'onChange, onSubmit',

        init: function (options) {
            this.selectedIndex = -1;
            this.getKey = options.getKey || this.getKey;
            this.isChanged = options.isChanged || this.isChanged;
        },

        render: function () {
            var options = this.options;
            var main = this.main = $(options.main);
            var el = this.element = $(options.element).attr('autocomplete', 'off');
            this.nosubmit = !!main.data('nosubmit');

            if (!main.length) {
                return;
            }

            var type = el.data('type') || options.type;
            options.url = options.url.replace(/\{domain\}/gi, options.domain).replace(/\{type\}/gi, type);

            this.menu = new Options(
                $.extend(
                    true,
                    options.menu || {},
                    {
                        width: el.width(),
                        main: main
                    }
                )
            );
            this.menu.render(main);
            this.menu.addIgnores(el[0]);

            this.keys = {};
            this.key = this.getKey();
            el.val(this.key || el[0].defaultValue);

            if (IS_CHROME) {
                el
                    .attr('x-webkit-speech', '')
                    .attr('x-webkit-grammar', 'builtin:search')
                    .attr('lang', 'en-US');
            }

            this
                .delegate(el, 'webkitspeechchange', this.onSpeech)
                .delegate(el, 'keyup', this.onKeyup)
                .delegate(el, 'focus', this.onFocus);

            this.menu.on('change', this.onChange).on('submit', this.onSubmit);

            this.onRequest = $.proxy(this, 'onRequest');
        },

        getKey: function () {
            var el = this.element;
            var val = $.trim(el.val());
            // el.val(val);
            return val;
        },

        isChanged: function () {
            this.selectedIndex = -1;
            var v = $.trim(this.element.val());
            return v != this.key;
        },

        onSpeech: function (e) {
            var el = this.element;
            el.val(el.val().replace(el[0].defaultValue, ''));
        },

        onSubmit: function (text) {
            var form = $(this.element[0].form);
            if (this.nosubmit) {
                return false;
            }
            form.trigger('submit', [{}, form]);
        },

        onKeyup: function (e) {
            if (this.nosubmit && e && e.keyCode === 13) {
                return false;
            }
            if (e && (e.keyCode >= 33 && e.keyCode <= 40) || !this.isChanged()) {
                switch(e.keyCode) {
                    case 38:
                        this.onChange("upKey");    
                        break;
                    case 40:
                        this.onChange("downKey");       
                        break;
                }
                return true;
            }

            var data;
            this.key = this.getKey();
            clearTimeout(this.timer);

            if (!this.key) {
                this.menu.hide();
            }

            data = store[this.key];
            if (data) {
                this.got(data, this.lastTime, this.key);
            }
            else {
                if (e.keyCode != 13) {
                    this.timer = setTimeout(this.onRequest, this.options.delay);    
                }
            }
        },

        got: function (data, time, key) {
            key = key || this.keys[time] || this.key;
            var menu = this.menu;

            if (!data) {
                menu.hide();
                return;
            }

            if (!store[key]) {
                store[key] = data;
            }

            if (time != this.lastTime) {
                return;
            }

            menu.newItems();

            var hasData = false;
            var map = {
                'formtype': 'Formtype',
                'company': 'Company',
                'financial': 'Financial',
                'Income Statement': 'Incstate',
                'Balance Sheet': 'Balsheet',
                'Cash Flow Statement': 'Casstate',
                'Ratio': 'Ratio'
            };

            var company = data.company;
            var symbols = [];
            for (var i = 0; i < company.length; i++) {
                if (company[i].entity) {
                    symbols.push(company[i].symbol);
                }
            }

            for (var group in data) {
                if (data.hasOwnProperty(group) && data[group] && data[group].length) {
                    hasData = true;
                    data[group].forEach(function (item) {
                        if (!item.entity) {
                            menu.addItem(item, symbols, item.name === key, key, map[group], map[item.cls]);
                        }
                    });
                }
            }

            if (!hasData) {
                menu.hide();
            }

            $(window).trigger('urlLoaded');

            menu.show();
        },

        onFocus: function () {
            var key = this.key = this.getKey();
            var data = store[key];

            clearTimeout(this.timer);
            if (data) {
                this.got(data, this.lastTime, key);
            }
            else {
                data = store[this.lastKey];
                if (data && data.some && data.some(function (item) {
                    return item.k == key;
                })) {
                    this.got(data, this.lastTime, this.lastKey);
                }
                else if (key) {
                    this.timer = setTimeout(this.onRequest, this.options.delay);
                }
            }
        },

        onChange: function (key) {
            this.element.val(this.menu.getText() || this.key);
            var smenu = $(".suggest-box-inreport");
            var menu = this.menu;
            var items = menu.items;
            
            if (key == "upKey") {
                if (this.selectedIndex <= 0) {
                    this.selectedIndex = items.length - 1;
                } else {
                    this.selectedIndex--;
                }
            } else if (key == "downKey") {
                if (this.selectedIndex >= items.length - 1) {
                    this.selectedIndex = 0;
                } else {
                    this.selectedIndex++;
                }
            }
            
            var ipt = smenu.find(".word")
                            .eq(this.selectedIndex)
                            .children();
            
            $(".search-input").val(ipt.text());

            smenu
                .find(".word")
                .removeClass("eon")
                .eq(this.selectedIndex)
                .addClass("eon");
        },

        onRequest: function () {
            var options = this.options;
            var key = this.key;
            var now;

            if (key.length < options.min) {
                return;
            }

            clearTimeout(this.timer);

            now = this.lastTime = +new Date();
            this.keys[this.lastTime] = key;
            this.lastKey = key;

            var self = this;
            $.ajax({
                dataType: 'jsonp',
                jsonp: 'cb',
                url: options.url.replace(/\{key\}/gi, encodeURIComponent(key))
            }).done(function (json) {
                self.got(json, now, key);
            });
        }
    });

    return Suggest;
});