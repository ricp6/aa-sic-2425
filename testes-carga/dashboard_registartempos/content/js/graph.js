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
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 12.0, "minX": 0.0, "maxY": 835.0, "series": [{"data": [[0.0, 12.0], [0.1, 13.0], [0.2, 14.0], [0.3, 14.0], [0.4, 14.0], [0.5, 15.0], [0.6, 15.0], [0.7, 16.0], [0.8, 16.0], [0.9, 17.0], [1.0, 17.0], [1.1, 17.0], [1.2, 18.0], [1.3, 18.0], [1.4, 18.0], [1.5, 18.0], [1.6, 18.0], [1.7, 18.0], [1.8, 19.0], [1.9, 19.0], [2.0, 19.0], [2.1, 19.0], [2.2, 19.0], [2.3, 19.0], [2.4, 19.0], [2.5, 20.0], [2.6, 20.0], [2.7, 20.0], [2.8, 20.0], [2.9, 20.0], [3.0, 20.0], [3.1, 20.0], [3.2, 20.0], [3.3, 20.0], [3.4, 21.0], [3.5, 21.0], [3.6, 21.0], [3.7, 21.0], [3.8, 21.0], [3.9, 21.0], [4.0, 21.0], [4.1, 21.0], [4.2, 22.0], [4.3, 22.0], [4.4, 22.0], [4.5, 22.0], [4.6, 22.0], [4.7, 22.0], [4.8, 22.0], [4.9, 22.0], [5.0, 23.0], [5.1, 23.0], [5.2, 23.0], [5.3, 23.0], [5.4, 23.0], [5.5, 23.0], [5.6, 23.0], [5.7, 23.0], [5.8, 23.0], [5.9, 23.0], [6.0, 23.0], [6.1, 24.0], [6.2, 24.0], [6.3, 24.0], [6.4, 24.0], [6.5, 24.0], [6.6, 24.0], [6.7, 24.0], [6.8, 24.0], [6.9, 24.0], [7.0, 24.0], [7.1, 24.0], [7.2, 24.0], [7.3, 24.0], [7.4, 24.0], [7.5, 24.0], [7.6, 25.0], [7.7, 25.0], [7.8, 25.0], [7.9, 25.0], [8.0, 25.0], [8.1, 25.0], [8.2, 25.0], [8.3, 25.0], [8.4, 25.0], [8.5, 25.0], [8.6, 25.0], [8.7, 25.0], [8.8, 25.0], [8.9, 26.0], [9.0, 26.0], [9.1, 26.0], [9.2, 26.0], [9.3, 26.0], [9.4, 26.0], [9.5, 26.0], [9.6, 26.0], [9.7, 26.0], [9.8, 26.0], [9.9, 26.0], [10.0, 26.0], [10.1, 26.0], [10.2, 26.0], [10.3, 26.0], [10.4, 26.0], [10.5, 26.0], [10.6, 26.0], [10.7, 26.0], [10.8, 26.0], [10.9, 27.0], [11.0, 27.0], [11.1, 27.0], [11.2, 27.0], [11.3, 27.0], [11.4, 27.0], [11.5, 27.0], [11.6, 27.0], [11.7, 27.0], [11.8, 27.0], [11.9, 27.0], [12.0, 27.0], [12.1, 27.0], [12.2, 28.0], [12.3, 28.0], [12.4, 28.0], [12.5, 28.0], [12.6, 28.0], [12.7, 28.0], [12.8, 28.0], [12.9, 28.0], [13.0, 28.0], [13.1, 29.0], [13.2, 29.0], [13.3, 29.0], [13.4, 29.0], [13.5, 29.0], [13.6, 29.0], [13.7, 29.0], [13.8, 29.0], [13.9, 29.0], [14.0, 29.0], [14.1, 29.0], [14.2, 30.0], [14.3, 30.0], [14.4, 30.0], [14.5, 30.0], [14.6, 30.0], [14.7, 30.0], [14.8, 30.0], [14.9, 30.0], [15.0, 30.0], [15.1, 30.0], [15.2, 30.0], [15.3, 31.0], [15.4, 31.0], [15.5, 31.0], [15.6, 31.0], [15.7, 31.0], [15.8, 31.0], [15.9, 31.0], [16.0, 31.0], [16.1, 31.0], [16.2, 31.0], [16.3, 31.0], [16.4, 31.0], [16.5, 31.0], [16.6, 31.0], [16.7, 31.0], [16.8, 31.0], [16.9, 31.0], [17.0, 31.0], [17.1, 31.0], [17.2, 32.0], [17.3, 32.0], [17.4, 32.0], [17.5, 32.0], [17.6, 32.0], [17.7, 32.0], [17.8, 32.0], [17.9, 32.0], [18.0, 33.0], [18.1, 33.0], [18.2, 33.0], [18.3, 33.0], [18.4, 33.0], [18.5, 33.0], [18.6, 33.0], [18.7, 33.0], [18.8, 33.0], [18.9, 33.0], [19.0, 33.0], [19.1, 33.0], [19.2, 33.0], [19.3, 33.0], [19.4, 33.0], [19.5, 34.0], [19.6, 34.0], [19.7, 34.0], [19.8, 34.0], [19.9, 34.0], [20.0, 34.0], [20.1, 34.0], [20.2, 34.0], [20.3, 34.0], [20.4, 34.0], [20.5, 34.0], [20.6, 34.0], [20.7, 34.0], [20.8, 34.0], [20.9, 34.0], [21.0, 35.0], [21.1, 35.0], [21.2, 35.0], [21.3, 35.0], [21.4, 35.0], [21.5, 35.0], [21.6, 35.0], [21.7, 35.0], [21.8, 35.0], [21.9, 35.0], [22.0, 35.0], [22.1, 35.0], [22.2, 35.0], [22.3, 35.0], [22.4, 35.0], [22.5, 36.0], [22.6, 36.0], [22.7, 36.0], [22.8, 36.0], [22.9, 36.0], [23.0, 36.0], [23.1, 36.0], [23.2, 36.0], [23.3, 36.0], [23.4, 36.0], [23.5, 36.0], [23.6, 36.0], [23.7, 36.0], [23.8, 36.0], [23.9, 36.0], [24.0, 36.0], [24.1, 37.0], [24.2, 37.0], [24.3, 37.0], [24.4, 37.0], [24.5, 37.0], [24.6, 37.0], [24.7, 37.0], [24.8, 37.0], [24.9, 37.0], [25.0, 37.0], [25.1, 37.0], [25.2, 37.0], [25.3, 37.0], [25.4, 37.0], [25.5, 38.0], [25.6, 38.0], [25.7, 38.0], [25.8, 38.0], [25.9, 38.0], [26.0, 38.0], [26.1, 38.0], [26.2, 38.0], [26.3, 38.0], [26.4, 38.0], [26.5, 38.0], [26.6, 38.0], [26.7, 38.0], [26.8, 38.0], [26.9, 38.0], [27.0, 38.0], [27.1, 39.0], [27.2, 39.0], [27.3, 39.0], [27.4, 39.0], [27.5, 39.0], [27.6, 39.0], [27.7, 39.0], [27.8, 39.0], [27.9, 39.0], [28.0, 39.0], [28.1, 39.0], [28.2, 39.0], [28.3, 39.0], [28.4, 39.0], [28.5, 39.0], [28.6, 39.0], [28.7, 39.0], [28.8, 40.0], [28.9, 40.0], [29.0, 40.0], [29.1, 40.0], [29.2, 40.0], [29.3, 40.0], [29.4, 40.0], [29.5, 40.0], [29.6, 40.0], [29.7, 40.0], [29.8, 40.0], [29.9, 40.0], [30.0, 40.0], [30.1, 40.0], [30.2, 40.0], [30.3, 40.0], [30.4, 41.0], [30.5, 41.0], [30.6, 41.0], [30.7, 41.0], [30.8, 41.0], [30.9, 41.0], [31.0, 41.0], [31.1, 41.0], [31.2, 41.0], [31.3, 41.0], [31.4, 41.0], [31.5, 41.0], [31.6, 42.0], [31.7, 42.0], [31.8, 42.0], [31.9, 42.0], [32.0, 42.0], [32.1, 42.0], [32.2, 42.0], [32.3, 42.0], [32.4, 42.0], [32.5, 42.0], [32.6, 42.0], [32.7, 43.0], [32.8, 43.0], [32.9, 43.0], [33.0, 43.0], [33.1, 43.0], [33.2, 43.0], [33.3, 43.0], [33.4, 43.0], [33.5, 43.0], [33.6, 43.0], [33.7, 43.0], [33.8, 43.0], [33.9, 44.0], [34.0, 44.0], [34.1, 44.0], [34.2, 44.0], [34.3, 44.0], [34.4, 44.0], [34.5, 44.0], [34.6, 44.0], [34.7, 44.0], [34.8, 44.0], [34.9, 44.0], [35.0, 44.0], [35.1, 45.0], [35.2, 45.0], [35.3, 45.0], [35.4, 45.0], [35.5, 45.0], [35.6, 45.0], [35.7, 45.0], [35.8, 45.0], [35.9, 45.0], [36.0, 45.0], [36.1, 45.0], [36.2, 45.0], [36.3, 46.0], [36.4, 46.0], [36.5, 46.0], [36.6, 46.0], [36.7, 46.0], [36.8, 46.0], [36.9, 46.0], [37.0, 46.0], [37.1, 46.0], [37.2, 46.0], [37.3, 46.0], [37.4, 47.0], [37.5, 47.0], [37.6, 47.0], [37.7, 47.0], [37.8, 47.0], [37.9, 47.0], [38.0, 47.0], [38.1, 47.0], [38.2, 47.0], [38.3, 47.0], [38.4, 47.0], [38.5, 47.0], [38.6, 47.0], [38.7, 47.0], [38.8, 48.0], [38.9, 48.0], [39.0, 48.0], [39.1, 48.0], [39.2, 48.0], [39.3, 48.0], [39.4, 48.0], [39.5, 48.0], [39.6, 48.0], [39.7, 48.0], [39.8, 48.0], [39.9, 48.0], [40.0, 48.0], [40.1, 48.0], [40.2, 49.0], [40.3, 49.0], [40.4, 49.0], [40.5, 49.0], [40.6, 49.0], [40.7, 49.0], [40.8, 49.0], [40.9, 49.0], [41.0, 49.0], [41.1, 50.0], [41.2, 50.0], [41.3, 50.0], [41.4, 50.0], [41.5, 50.0], [41.6, 50.0], [41.7, 50.0], [41.8, 50.0], [41.9, 51.0], [42.0, 51.0], [42.1, 51.0], [42.2, 51.0], [42.3, 51.0], [42.4, 51.0], [42.5, 51.0], [42.6, 51.0], [42.7, 51.0], [42.8, 51.0], [42.9, 51.0], [43.0, 51.0], [43.1, 51.0], [43.2, 51.0], [43.3, 52.0], [43.4, 52.0], [43.5, 52.0], [43.6, 52.0], [43.7, 52.0], [43.8, 52.0], [43.9, 52.0], [44.0, 52.0], [44.1, 52.0], [44.2, 52.0], [44.3, 52.0], [44.4, 53.0], [44.5, 53.0], [44.6, 53.0], [44.7, 53.0], [44.8, 53.0], [44.9, 53.0], [45.0, 53.0], [45.1, 53.0], [45.2, 53.0], [45.3, 53.0], [45.4, 53.0], [45.5, 54.0], [45.6, 54.0], [45.7, 54.0], [45.8, 54.0], [45.9, 54.0], [46.0, 54.0], [46.1, 54.0], [46.2, 54.0], [46.3, 55.0], [46.4, 55.0], [46.5, 55.0], [46.6, 55.0], [46.7, 55.0], [46.8, 55.0], [46.9, 56.0], [47.0, 56.0], [47.1, 56.0], [47.2, 56.0], [47.3, 56.0], [47.4, 56.0], [47.5, 56.0], [47.6, 56.0], [47.7, 56.0], [47.8, 57.0], [47.9, 57.0], [48.0, 57.0], [48.1, 57.0], [48.2, 57.0], [48.3, 57.0], [48.4, 57.0], [48.5, 57.0], [48.6, 57.0], [48.7, 58.0], [48.8, 58.0], [48.9, 58.0], [49.0, 58.0], [49.1, 58.0], [49.2, 58.0], [49.3, 58.0], [49.4, 58.0], [49.5, 58.0], [49.6, 59.0], [49.7, 59.0], [49.8, 59.0], [49.9, 59.0], [50.0, 59.0], [50.1, 59.0], [50.2, 60.0], [50.3, 60.0], [50.4, 60.0], [50.5, 60.0], [50.6, 60.0], [50.7, 60.0], [50.8, 60.0], [50.9, 60.0], [51.0, 61.0], [51.1, 61.0], [51.2, 61.0], [51.3, 61.0], [51.4, 61.0], [51.5, 61.0], [51.6, 61.0], [51.7, 62.0], [51.8, 62.0], [51.9, 62.0], [52.0, 62.0], [52.1, 62.0], [52.2, 62.0], [52.3, 62.0], [52.4, 63.0], [52.5, 63.0], [52.6, 63.0], [52.7, 63.0], [52.8, 63.0], [52.9, 63.0], [53.0, 63.0], [53.1, 63.0], [53.2, 64.0], [53.3, 64.0], [53.4, 64.0], [53.5, 64.0], [53.6, 64.0], [53.7, 64.0], [53.8, 64.0], [53.9, 64.0], [54.0, 65.0], [54.1, 65.0], [54.2, 65.0], [54.3, 65.0], [54.4, 65.0], [54.5, 65.0], [54.6, 65.0], [54.7, 65.0], [54.8, 65.0], [54.9, 66.0], [55.0, 66.0], [55.1, 66.0], [55.2, 66.0], [55.3, 66.0], [55.4, 66.0], [55.5, 66.0], [55.6, 66.0], [55.7, 66.0], [55.8, 67.0], [55.9, 67.0], [56.0, 67.0], [56.1, 67.0], [56.2, 67.0], [56.3, 67.0], [56.4, 67.0], [56.5, 67.0], [56.6, 67.0], [56.7, 68.0], [56.8, 68.0], [56.9, 68.0], [57.0, 68.0], [57.1, 68.0], [57.2, 68.0], [57.3, 69.0], [57.4, 69.0], [57.5, 69.0], [57.6, 69.0], [57.7, 69.0], [57.8, 69.0], [57.9, 69.0], [58.0, 70.0], [58.1, 70.0], [58.2, 70.0], [58.3, 70.0], [58.4, 70.0], [58.5, 70.0], [58.6, 70.0], [58.7, 71.0], [58.8, 71.0], [58.9, 71.0], [59.0, 71.0], [59.1, 71.0], [59.2, 71.0], [59.3, 71.0], [59.4, 71.0], [59.5, 71.0], [59.6, 71.0], [59.7, 71.0], [59.8, 71.0], [59.9, 71.0], [60.0, 72.0], [60.1, 72.0], [60.2, 72.0], [60.3, 72.0], [60.4, 72.0], [60.5, 72.0], [60.6, 72.0], [60.7, 73.0], [60.8, 73.0], [60.9, 73.0], [61.0, 73.0], [61.1, 73.0], [61.2, 74.0], [61.3, 74.0], [61.4, 74.0], [61.5, 74.0], [61.6, 74.0], [61.7, 74.0], [61.8, 74.0], [61.9, 74.0], [62.0, 74.0], [62.1, 75.0], [62.2, 75.0], [62.3, 75.0], [62.4, 75.0], [62.5, 75.0], [62.6, 75.0], [62.7, 76.0], [62.8, 76.0], [62.9, 76.0], [63.0, 76.0], [63.1, 76.0], [63.2, 76.0], [63.3, 76.0], [63.4, 76.0], [63.5, 76.0], [63.6, 77.0], [63.7, 77.0], [63.8, 77.0], [63.9, 77.0], [64.0, 78.0], [64.1, 78.0], [64.2, 78.0], [64.3, 78.0], [64.4, 79.0], [64.5, 79.0], [64.6, 79.0], [64.7, 79.0], [64.8, 80.0], [64.9, 80.0], [65.0, 80.0], [65.1, 81.0], [65.2, 81.0], [65.3, 81.0], [65.4, 81.0], [65.5, 81.0], [65.6, 81.0], [65.7, 81.0], [65.8, 81.0], [65.9, 81.0], [66.0, 81.0], [66.1, 82.0], [66.2, 82.0], [66.3, 82.0], [66.4, 82.0], [66.5, 82.0], [66.6, 82.0], [66.7, 83.0], [66.8, 83.0], [66.9, 83.0], [67.0, 83.0], [67.1, 83.0], [67.2, 83.0], [67.3, 83.0], [67.4, 83.0], [67.5, 84.0], [67.6, 84.0], [67.7, 84.0], [67.8, 84.0], [67.9, 84.0], [68.0, 84.0], [68.1, 84.0], [68.2, 84.0], [68.3, 84.0], [68.4, 85.0], [68.5, 85.0], [68.6, 85.0], [68.7, 85.0], [68.8, 85.0], [68.9, 85.0], [69.0, 85.0], [69.1, 86.0], [69.2, 86.0], [69.3, 86.0], [69.4, 86.0], [69.5, 86.0], [69.6, 86.0], [69.7, 86.0], [69.8, 86.0], [69.9, 86.0], [70.0, 87.0], [70.1, 87.0], [70.2, 87.0], [70.3, 87.0], [70.4, 87.0], [70.5, 87.0], [70.6, 88.0], [70.7, 88.0], [70.8, 88.0], [70.9, 88.0], [71.0, 88.0], [71.1, 88.0], [71.2, 89.0], [71.3, 89.0], [71.4, 89.0], [71.5, 89.0], [71.6, 89.0], [71.7, 89.0], [71.8, 89.0], [71.9, 89.0], [72.0, 90.0], [72.1, 90.0], [72.2, 90.0], [72.3, 90.0], [72.4, 90.0], [72.5, 90.0], [72.6, 90.0], [72.7, 91.0], [72.8, 91.0], [72.9, 91.0], [73.0, 91.0], [73.1, 92.0], [73.2, 92.0], [73.3, 92.0], [73.4, 93.0], [73.5, 93.0], [73.6, 93.0], [73.7, 93.0], [73.8, 93.0], [73.9, 94.0], [74.0, 94.0], [74.1, 94.0], [74.2, 94.0], [74.3, 95.0], [74.4, 95.0], [74.5, 95.0], [74.6, 95.0], [74.7, 95.0], [74.8, 95.0], [74.9, 96.0], [75.0, 96.0], [75.1, 96.0], [75.2, 97.0], [75.3, 97.0], [75.4, 97.0], [75.5, 97.0], [75.6, 97.0], [75.7, 97.0], [75.8, 98.0], [75.9, 98.0], [76.0, 98.0], [76.1, 98.0], [76.2, 98.0], [76.3, 99.0], [76.4, 99.0], [76.5, 99.0], [76.6, 99.0], [76.7, 99.0], [76.8, 99.0], [76.9, 99.0], [77.0, 99.0], [77.1, 100.0], [77.2, 100.0], [77.3, 100.0], [77.4, 101.0], [77.5, 101.0], [77.6, 102.0], [77.7, 102.0], [77.8, 102.0], [77.9, 102.0], [78.0, 102.0], [78.1, 103.0], [78.2, 104.0], [78.3, 104.0], [78.4, 104.0], [78.5, 104.0], [78.6, 104.0], [78.7, 105.0], [78.8, 105.0], [78.9, 106.0], [79.0, 106.0], [79.1, 107.0], [79.2, 107.0], [79.3, 107.0], [79.4, 107.0], [79.5, 107.0], [79.6, 107.0], [79.7, 108.0], [79.8, 108.0], [79.9, 108.0], [80.0, 108.0], [80.1, 109.0], [80.2, 109.0], [80.3, 109.0], [80.4, 109.0], [80.5, 111.0], [80.6, 111.0], [80.7, 111.0], [80.8, 111.0], [80.9, 112.0], [81.0, 112.0], [81.1, 112.0], [81.2, 112.0], [81.3, 112.0], [81.4, 113.0], [81.5, 113.0], [81.6, 114.0], [81.7, 115.0], [81.8, 115.0], [81.9, 115.0], [82.0, 115.0], [82.1, 115.0], [82.2, 115.0], [82.3, 115.0], [82.4, 116.0], [82.5, 116.0], [82.6, 116.0], [82.7, 117.0], [82.8, 117.0], [82.9, 117.0], [83.0, 117.0], [83.1, 118.0], [83.2, 118.0], [83.3, 118.0], [83.4, 118.0], [83.5, 119.0], [83.6, 119.0], [83.7, 119.0], [83.8, 120.0], [83.9, 120.0], [84.0, 121.0], [84.1, 121.0], [84.2, 121.0], [84.3, 121.0], [84.4, 121.0], [84.5, 121.0], [84.6, 121.0], [84.7, 122.0], [84.8, 122.0], [84.9, 122.0], [85.0, 123.0], [85.1, 123.0], [85.2, 123.0], [85.3, 123.0], [85.4, 124.0], [85.5, 125.0], [85.6, 125.0], [85.7, 125.0], [85.8, 125.0], [85.9, 125.0], [86.0, 126.0], [86.1, 126.0], [86.2, 126.0], [86.3, 126.0], [86.4, 127.0], [86.5, 127.0], [86.6, 127.0], [86.7, 128.0], [86.8, 128.0], [86.9, 128.0], [87.0, 130.0], [87.1, 130.0], [87.2, 130.0], [87.3, 131.0], [87.4, 132.0], [87.5, 132.0], [87.6, 132.0], [87.7, 133.0], [87.8, 133.0], [87.9, 134.0], [88.0, 136.0], [88.1, 136.0], [88.2, 137.0], [88.3, 138.0], [88.4, 139.0], [88.5, 140.0], [88.6, 140.0], [88.7, 140.0], [88.8, 141.0], [88.9, 141.0], [89.0, 142.0], [89.1, 142.0], [89.2, 143.0], [89.3, 144.0], [89.4, 145.0], [89.5, 145.0], [89.6, 146.0], [89.7, 147.0], [89.8, 147.0], [89.9, 147.0], [90.0, 148.0], [90.1, 148.0], [90.2, 149.0], [90.3, 149.0], [90.4, 150.0], [90.5, 150.0], [90.6, 151.0], [90.7, 153.0], [90.8, 153.0], [90.9, 155.0], [91.0, 156.0], [91.1, 156.0], [91.2, 158.0], [91.3, 158.0], [91.4, 160.0], [91.5, 160.0], [91.6, 161.0], [91.7, 162.0], [91.8, 163.0], [91.9, 163.0], [92.0, 167.0], [92.1, 167.0], [92.2, 168.0], [92.3, 169.0], [92.4, 169.0], [92.5, 170.0], [92.6, 170.0], [92.7, 173.0], [92.8, 176.0], [92.9, 176.0], [93.0, 177.0], [93.1, 177.0], [93.2, 179.0], [93.3, 179.0], [93.4, 180.0], [93.5, 182.0], [93.6, 183.0], [93.7, 183.0], [93.8, 183.0], [93.9, 185.0], [94.0, 189.0], [94.1, 189.0], [94.2, 190.0], [94.3, 190.0], [94.4, 191.0], [94.5, 192.0], [94.6, 193.0], [94.7, 194.0], [94.8, 194.0], [94.9, 196.0], [95.0, 198.0], [95.1, 199.0], [95.2, 200.0], [95.3, 200.0], [95.4, 203.0], [95.5, 206.0], [95.6, 206.0], [95.7, 207.0], [95.8, 208.0], [95.9, 210.0], [96.0, 211.0], [96.1, 212.0], [96.2, 214.0], [96.3, 218.0], [96.4, 231.0], [96.5, 231.0], [96.6, 232.0], [96.7, 239.0], [96.8, 241.0], [96.9, 246.0], [97.0, 256.0], [97.1, 258.0], [97.2, 268.0], [97.3, 272.0], [97.4, 284.0], [97.5, 294.0], [97.6, 298.0], [97.7, 312.0], [97.8, 321.0], [97.9, 328.0], [98.0, 335.0], [98.1, 357.0], [98.2, 363.0], [98.3, 379.0], [98.4, 388.0], [98.5, 403.0], [98.6, 422.0], [98.7, 578.0], [98.8, 608.0], [98.9, 681.0], [99.0, 688.0], [99.1, 688.0], [99.2, 688.0], [99.3, 688.0], [99.4, 810.0], [99.5, 821.0], [99.6, 822.0], [99.7, 826.0], [99.8, 826.0], [99.9, 835.0]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 1.0, "minX": 0.0, "maxY": 1233.0, "series": [{"data": [[0.0, 1233.0], [600.0, 10.0], [300.0, 14.0], [100.0, 289.0], [800.0, 10.0], [200.0, 40.0], [400.0, 3.0], [500.0, 1.0]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 800.0, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 21.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 1579.0, "series": [{"data": [[0.0, 1579.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 21.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 1.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 37.314285714285724, "minX": 1.75003764E12, "maxY": 84.11757188498396, "series": [{"data": [[1.7500377E12, 84.11757188498396], [1.75003764E12, 37.314285714285724]], "isOverall": false, "label": "Registar Voltas", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7500377E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 3600000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 24.333333333333332, "minX": 1.0, "maxY": 564.076923076923, "series": [{"data": [[2.0, 60.0], [3.0, 67.0], [4.0, 77.0], [5.0, 75.0], [6.0, 81.0], [7.0, 83.0], [8.0, 81.0], [9.0, 74.0], [10.0, 24.333333333333332], [11.0, 38.25], [12.0, 57.0], [13.0, 93.0], [14.0, 111.0], [15.0, 107.0], [16.0, 99.0], [17.0, 28.0], [18.0, 25.5], [19.0, 26.5], [20.0, 56.0], [21.0, 65.33333333333333], [22.0, 53.0], [24.0, 81.33333333333333], [25.0, 60.44444444444445], [26.0, 47.0], [27.0, 72.0], [28.0, 65.0], [29.0, 80.0], [30.0, 92.0], [31.0, 25.0], [33.0, 63.833333333333336], [32.0, 58.57142857142857], [35.0, 564.076923076923], [34.0, 39.0], [36.0, 48.0], [37.0, 424.16666666666663], [38.0, 54.25], [39.0, 38.666666666666664], [40.0, 30.0], [41.0, 32.55555555555556], [42.0, 44.8], [43.0, 26.5], [44.0, 28.5], [45.0, 29.0], [46.0, 68.36363636363636], [47.0, 56.93750000000001], [48.0, 108.31250000000001], [49.0, 79.54545454545455], [50.0, 35.33333333333333], [51.0, 27.5], [52.0, 37.83333333333333], [53.0, 39.06666666666666], [54.0, 41.5], [55.0, 31.666666666666668], [56.0, 42.27272727272727], [57.0, 68.3076923076923], [58.0, 77.07142857142858], [59.0, 78.71428571428571], [60.0, 105.125], [61.0, 43.3], [62.0, 37.142857142857146], [63.0, 38.5], [64.0, 39.4], [65.0, 59.10526315789474], [66.0, 41.57142857142857], [67.0, 50.58333333333333], [68.0, 51.44444444444444], [69.0, 38.125], [70.0, 40.764705882352935], [71.0, 51.52380952380952], [72.0, 43.72727272727273], [73.0, 33.142857142857146], [74.0, 33.4], [75.0, 35.714285714285715], [76.0, 28.2], [77.0, 34.125], [78.0, 36.0], [79.0, 46.61538461538461], [80.0, 37.5], [81.0, 51.0], [82.0, 58.6], [83.0, 33.57142857142857], [84.0, 25.28571428571429], [85.0, 32.6], [86.0, 33.14285714285714], [87.0, 63.888888888888886], [88.0, 68.18181818181819], [89.0, 45.916666666666664], [90.0, 52.666666666666664], [91.0, 41.272727272727266], [92.0, 45.214285714285715], [93.0, 35.0], [94.0, 30.25], [95.0, 50.87499999999999], [96.0, 27.0], [97.0, 30.5], [98.0, 24.57142857142857], [99.0, 35.27272727272727], [100.0, 92.35057471264368], [1.0, 62.0]], "isOverall": false, "label": "HTTP Request", "isController": false}, {"data": [[83.09374999999996, 83.5093749999999]], "isOverall": false, "label": "HTTP Request-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 115.55, "minX": 1.75003764E12, "maxY": 13460.083333333334, "series": [{"data": [[1.7500377E12, 13460.083333333334], [1.75003764E12, 301.5833333333333]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.7500377E12, 5169.45], [1.75003764E12, 115.55]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7500377E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 3600000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 74.40702875399377, "minX": 1.75003764E12, "maxY": 490.51428571428573, "series": [{"data": [[1.7500377E12, 74.40702875399377], [1.75003764E12, 490.51428571428573]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7500377E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 3600000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 74.37124600638964, "minX": 1.75003764E12, "maxY": 490.4857142857143, "series": [{"data": [[1.7500377E12, 74.37124600638964], [1.75003764E12, 490.4857142857143]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7500377E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 3600000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 0.06325878594249225, "minX": 1.75003764E12, "maxY": 49.11428571428569, "series": [{"data": [[1.7500377E12, 0.06325878594249225], [1.75003764E12, 49.11428571428569]], "isOverall": false, "label": "HTTP Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7500377E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 3600000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 12.0, "minX": 1.75003764E12, "maxY": 835.0, "series": [{"data": [[1.7500377E12, 488.0], [1.75003764E12, 835.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.7500377E12, 140.0], [1.75003764E12, 827.2]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.7500377E12, 298.67999999999984], [1.75003764E12, 835.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.7500377E12, 183.0], [1.75003764E12, 835.0]], "isOverall": false, "label": "95th percentile", "isController": false}, {"data": [[1.7500377E12, 12.0], [1.75003764E12, 24.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.7500377E12, 58.0], [1.75003764E12, 681.0]], "isOverall": false, "label": "Median", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7500377E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 3600000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 34.0, "minX": 9.0, "maxY": 125.5, "series": [{"data": [[35.0, 62.5], [9.0, 75.0], [43.0, 45.5], [54.0, 76.0], [55.0, 46.0], [64.0, 37.0], [67.0, 58.0], [72.0, 35.0], [76.0, 125.5], [20.0, 34.0], [84.0, 36.0], [87.0, 65.0], [90.0, 45.0], [88.0, 105.5], [91.0, 97.0], [92.0, 42.0], [95.0, 47.0], [97.0, 108.0], [30.0, 67.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 97.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 34.0, "minX": 9.0, "maxY": 125.5, "series": [{"data": [[35.0, 62.5], [9.0, 75.0], [43.0, 45.5], [54.0, 76.0], [55.0, 46.0], [64.0, 37.0], [67.0, 58.0], [72.0, 35.0], [76.0, 125.5], [20.0, 34.0], [84.0, 36.0], [87.0, 65.0], [90.0, 45.0], [88.0, 105.5], [91.0, 97.0], [92.0, 42.0], [95.0, 47.0], [97.0, 108.0], [30.0, 67.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 97.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 0.5833333333333334, "minX": 1.75003764E12, "maxY": 26.083333333333332, "series": [{"data": [[1.7500377E12, 26.083333333333332], [1.75003764E12, 0.5833333333333334]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7500377E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 3600000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 0.5833333333333334, "minX": 1.75003764E12, "maxY": 26.083333333333332, "series": [{"data": [[1.7500377E12, 26.083333333333332], [1.75003764E12, 0.5833333333333334]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7500377E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 3600000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 0.5833333333333334, "minX": 1.75003764E12, "maxY": 26.083333333333332, "series": [{"data": [[1.7500377E12, 26.083333333333332], [1.75003764E12, 0.5833333333333334]], "isOverall": false, "label": "HTTP Request-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7500377E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 3600000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 0.5833333333333334, "minX": 1.75003764E12, "maxY": 26.083333333333332, "series": [{"data": [[1.7500377E12, 26.083333333333332], [1.75003764E12, 0.5833333333333334]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7500377E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 3600000);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

