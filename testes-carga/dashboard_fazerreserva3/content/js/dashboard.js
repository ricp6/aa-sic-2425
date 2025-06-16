/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.3625, "KoPercent": 0.6375};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.993625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.98, 500, 1500, "Criar Reserva"], "isController": false}, {"data": [0.996, 500, 1500, "Obter slots ocupados"], "isController": false}, {"data": [0.993, 500, 1500, "Obter Detalhes da Track Selecionada"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.994, 500, 1500, "Obter karts"], "isController": false}, {"data": [0.995, 500, 1500, "Obter Users"], "isController": false}, {"data": [1.0, 500, 1500, "Login"], "isController": false}, {"data": [0.991, 500, 1500, "Listar Pistas"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8000, 51, 0.6375, 23.690374999999975, 0, 461, 9.0, 80.0, 102.0, 170.0, 153.38305500699812, 188.0195963329467, 39.78183881717699], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Criar Reserva", 1000, 20, 2.0, 22.977000000000025, 0, 137, 15.0, 44.0, 60.0, 122.0, 21.46199081426793, 17.26405475356269, 12.226732686880284], "isController": false}, {"data": ["Obter slots ocupados", 1000, 4, 0.4, 13.615999999999993, 0, 130, 9.0, 28.0, 35.0, 55.0, 21.457846061412358, 65.4066789892818, 7.229680593255798], "isController": false}, {"data": ["Obter Detalhes da Track Selecionada", 1000, 7, 0.7, 12.729999999999988, 0, 112, 9.0, 26.0, 32.0, 55.930000000000064, 21.40685875754592, 38.56435152604144, 3.238372730872972], "isController": false}, {"data": ["Debug Sampler", 1000, 0, 0.0, 0.22099999999999986, 0, 15, 0.0, 1.0, 1.0, 1.0, 21.49104897810062, 20.56735361909265, 0.0], "isController": false}, {"data": ["Obter karts", 1000, 6, 0.6, 12.608000000000013, 0, 101, 8.0, 25.0, 34.94999999999993, 57.99000000000001, 21.40044512925869, 13.494757058134308, 6.905112766970553], "isController": false}, {"data": ["Obter Users", 1000, 5, 0.5, 11.409000000000002, 0, 128, 7.0, 23.899999999999977, 30.949999999999932, 49.960000000000036, 21.404109589041095, 17.272781999143834, 6.663596793396833], "isController": false}, {"data": ["Login", 1000, 0, 0.0, 108.19699999999995, 65, 461, 91.0, 159.0, 208.8499999999998, 300.99, 20.71808896347401, 18.63632567281994, 4.847709097312864], "isController": false}, {"data": ["Listar Pistas", 1000, 9, 0.9, 7.765000000000002, 0, 83, 5.0, 15.0, 19.949999999999932, 35.99000000000001, 20.791317545792875, 17.847011150643493, 3.0986778671226896], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:80 failed to respond", 37, 72.54901960784314, 0.4625], "isController": false}, {"data": ["400", 4, 7.8431372549019605, 0.05], "isController": false}, {"data": ["401", 4, 7.8431372549019605, 0.05], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalArgumentException/Non HTTP response message: bound must be greater than origin", 6, 11.764705882352942, 0.075], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8000, 51, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:80 failed to respond", 37, "Non HTTP response code: java.lang.IllegalArgumentException/Non HTTP response message: bound must be greater than origin", 6, "400", 4, "401", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Criar Reserva", 1000, 20, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:80 failed to respond", 6, "Non HTTP response code: java.lang.IllegalArgumentException/Non HTTP response message: bound must be greater than origin", 6, "400", 4, "401", 4, "", ""], "isController": false}, {"data": ["Obter slots ocupados", 1000, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:80 failed to respond", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Obter Detalhes da Track Selecionada", 1000, 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:80 failed to respond", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Obter karts", 1000, 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:80 failed to respond", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Obter Users", 1000, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:80 failed to respond", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Listar Pistas", 1000, 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:80 failed to respond", 9, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
