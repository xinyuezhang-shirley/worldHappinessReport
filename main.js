//World Happiness Report 2022 Applet

// fetchDataFromCSV
// uses JQuery csv.toArrays to turn the csv file into a 2D array that can then extract data from
// input: csv file and what you want to do with the data
function fetchDataFromCSV(csvFile, callback) {
  $.ajax({
    url: csvFile,
    dataType: 'text',
    success: function (data) {
      var parsedData = $.csv.toArrays(data);
      callback(parsedData);
    },
    error: function (xhr, textStatus, error) {
      console.log(xhr.statusText);
    }
  });
}

// getValueFromCSV
// from csv data already as array, extract a specific element
// input: csvData from fetchDataFromCSV, item row, item column
// output: element from csv file
function getValueFromCSV(csvData, row, column) {
  return csvData[row][column];
}

// getVColumnFromCSV
// from csv data already as array, extract an entire column (all the same category)
// input: csvData from fetchDataFromCSV, column
// output: array of elements from csv file
function getColumnFromCSV(csvData, column) {
  var myList=[];
  for(var i=0; i< 146; i++)
  {
    myList.push(csvData[i][column]);
  }
  return myList;
}

//replaceCommaWithPeriod
//replace a comma with period in a string to make scores possible to be turned into a number
//input: string (the scores in csv file)
//output: string that can visibly be identified as a number (with decimal point)
function replaceCommaWithPeriod(str) {
  var result = '';
  for (var i = 0; i < str.length; i++) {
    if (str[i] === ',') {
      result += '.';
    } else {
      result += str[i];
    }
  }
  return result;
}

//setOutputMain
//set the output on main.html with the data from the selected country
//input: number representing the rank of the country, same as the number of the country in dropdown
//output: changed text in the output element on main.html showing rank and total score of country and graph of all country scores
function setOutputMain(selectedValue){
  const output = document.getElementById("output");
  fetchDataFromCSV('2022.csv', function (data) {
      var score = getValueFromCSV(data, selectedValue, 2);
      var name = getValueFromCSV(data, selectedValue, 1);
      score= replaceCommaWithPeriod(score);
      output.textContent = name+' was ranked number ' + selectedValue+ ' out of 146 included countries and has an overall score of '+
      score+' out of 10 in the World Happiness Report of 2022 for the happiness of its inhabitants.';
      highlightBar(selectedValue); //highlight the bar of the selected country in graph
    });
}

//setOutputData
//set the output on data.html with the data from the selected country
//input: number representing the rank of the country, same as the number of the country in dropdown
//output: changed text in the each of the six output elements on data.html showing subcategory scores, calculated ranks, and graph
function setOutputData(selectedValue){
  const gdp = document.getElementById("gdp");
  const socialSupport = document.getElementById("socialSupport");
  const lifeExpectancy = document.getElementById("lifeExpectancy");
  const freedom = document.getElementById("freedom");
  const generosity = document.getElementById("generosity");
  const corruption = document.getElementById("corruption");
  const myCountry = document.getElementById("myCountry");
  
  //make empty graph if no country is selected
  makeEmpty();

  //only fetch data if a country is selected
  if((selectedValue<=146)&&(selectedValue>=0)){
    fetchDataFromCSV('2022.csv', function (data) {
      var name = getValueFromCSV(data, selectedValue, 1);
      var gdpScore = getValueFromCSV(data, selectedValue, 6);
      var socialSupportScore = getValueFromCSV(data, selectedValue, 7);
      var lifeExpectancyScore = getValueFromCSV(data, selectedValue, 8);
      var freedomScore = getValueFromCSV(data, selectedValue, 9);
      var generosityScore = getValueFromCSV(data, selectedValue, 10);
      var corruptionScore = getValueFromCSV(data, selectedValue, 11);

      //arrays of all countries' scores in each category
      var allGDP = getColumnFromCSV(data,6);
      var allSocialSupport = getColumnFromCSV(data,7);
      var allLifeExpectancy = getColumnFromCSV(data,8);
      var allFreedom = getColumnFromCSV(data,9);
      var allGenerosity = getColumnFromCSV(data,10);
      var allCorruption = getColumnFromCSV(data,11);

      //calculates rank in each category
      var gdpRanking = betterThan(gdpScore,allGDP);
      var socialSupportRanking = betterThan(socialSupportScore,allSocialSupport);
      var lifeExpectancyRanking = betterThan(lifeExpectancyScore, allLifeExpectancy);
      var freedomRanking = betterThan(freedomScore,allFreedom);
      var generosityRanking = betterThan(generosityScore,allGenerosity);
      var corruptionRanking = betterThan(corruptionScore, allCorruption);
     
      gdpScore= replaceCommaWithPeriod(gdpScore);
      socialSupportScore= replaceCommaWithPeriod(socialSupportScore);
      lifeExpectancyScore= replaceCommaWithPeriod(lifeExpectancyScore);
      freedomScore= replaceCommaWithPeriod(freedomScore);
      generosityScore= replaceCommaWithPeriod(generosityScore);
      corruptionScore= replaceCommaWithPeriod(corruptionScore);

      myCountry.textContent= 'Your selected country is: '+name;
      gdp.textContent = name+' scored ' + gdpScore+ ' in GDP per Capita, ranking ' + gdpRanking+' out of 146 included countries in this category.';
      socialSupport.textContent = name+' scored ' + socialSupportScore+ ' in Social Support, ranking ' + socialSupportRanking+' out of 146 included countries in this category.';
      lifeExpectancy.textContent = name+' scored ' + lifeExpectancyScore+ ' in Life Expectancy, ranking ' + lifeExpectancyRanking+' out of 146 included countries in this category.';
      freedom.textContent = name+' scored ' + freedomScore+ ' in GDP per Capita, ranking ' + freedomRanking+' out of 146 included countries in this category.';
      generosity.textContent = name+' scored ' + generosityScore+ ' in Social Support, ranking ' + generosityRanking+' out of 146 included countries in this category.';
      corruption.textContent = name+' scored ' + corruptionScore+ ' in Life Expectancy, ranking ' + corruptionRanking+' out of 146 included countries in this category.';
      makeDataChart(selectedValue);
    });  
  }
}

//betterThan
//takes array of all country scores and finds rank of the selected country
//input: score of given country in given category, list of all scores in that category
//output: rank as a number
function betterThan(score,list) {
  worseCountries = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i]<score) {
      worseCountries = worseCountries+1;
} }
return 146-worseCountries;
}

/* all graphs */
var mainChart; //globally declared so it can be updated by highlightBar

//makeMainChart
//creates the graph in main.html using chart.js and d3
//idk why I did both this and jquery, please do nut judge my ill-planning
function makeMainChart(countries) {
    // countries is an array of objects , requested via d3, where each object is something like:
    // {
    //   "rank": "1",
    //   "Country": "Finland",
    //   ...
    // }
    var countryLabels = countries.map(function(d) {
      return d.Country;
    });
    var rankData = countries.map(function(d) {
      return d.rank;
    });
    var happinessData = countries.map(function(d){
      return Number(replaceCommaWithPeriod(d.happiness));
    });

     //chart created using chart.js
     mainChart = new Chart('chart', {
      type: "horizontalBar",
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false
        }
      },
      data: {
        labels: countryLabels,
        datasets: [
          {
            data: happinessData,
            borderWidth: 1
          }  
        ],
      }
    });
  }
  
  // Request data using D3
  d3
    .csv("2022.csv")
    .then(makeMainChart);
  
  //highlightBar
  //highlights the bar of the selected country
  //input: the index of the selected country, aka its rank and its value on dropdown
  function highlightBar(index) {
    const dataset = mainChart.data.datasets[0];
    const meta = mainChart.getDatasetMeta(0);
    
    // Set the same color for all bars
    const backgroundColor = 'rgba(0, 0, 0, 0.1)';
    dataset.backgroundColor = Array(dataset.data.length).fill(backgroundColor);
    
    // Set the selected bar to a different color
    const selectedBackgroundColor = 'rgba(255, 99, 132, 0.8)';
    dataset.backgroundColor[index-1] = selectedBackgroundColor;
    
    // Update the chart
     mainChart.update();
  }

  //makeEmpty
  //make empty gragh in data.html if no country is selected
  //no input, outputs empty graph with dummy values
  function makeEmpty() {
    var emptyValue = 0.001;
    var empty = new Chart('dataChart', {
      type: 'horizontalBar',
      data: {
        labels: ['No Data'],
        datasets: [
          {
            label: 'No Data',
            data: [emptyValue],
            backgroundColor: 'rgba(0, 0, 0, 0)', // Set transparent background
            borderColor: 'rgba(0, 0, 0, 0)', // Set transparent border color
            borderWidth: 0, // Set border width to 0
            barThickness: 10,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            beginAtZero: true,
            stacked: true,
          },
        },
      },
    });
  }

  //makeDataChart
  //creates the graph in data.html using chart.js and d3
  //input: index of the selected country
  function makeDataChart(selectedValue) {
    fetchDataFromCSV('2022.csv', function (data) {
      var dystopia = Number(replaceCommaWithPeriod(getValueFromCSV(data, selectedValue, 5)));
      var gdpScore = Number(replaceCommaWithPeriod(getValueFromCSV(data, selectedValue, 6)));
      var socialSupportScore = Number(replaceCommaWithPeriod(getValueFromCSV(data, selectedValue, 7)));
      var lifeExpectancyScore = Number(replaceCommaWithPeriod(getValueFromCSV(data, selectedValue, 8)));
      var freedomScore = Number(replaceCommaWithPeriod(getValueFromCSV(data, selectedValue, 9)));
      var generosityScore = Number(replaceCommaWithPeriod(getValueFromCSV(data, selectedValue, 10)));
      var corruptionScore = Number(replaceCommaWithPeriod(getValueFromCSV(data, selectedValue, 11)));

      //to stack all the values together, each category value needs to be its own data set
      var datasets = [
        {
          label: 'Dystopia Residual',
          data: [null,dystopia],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1,
          stacked: true,
          stack: 'Stack 0',
          barThickness: 10,
        },
        {
          label: 'GDP Per Capita',
          data: [null,gdpScore],
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
          stacked: true,
          stack: 'Stack 0',
          barThickness: 10,
        },
        {
          label: 'Social Support',
          data: [null,socialSupportScore],
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
          stacked: true,
          stack: 'Stack 0',
          barThickness: 10,
        },
        {
          label: 'Healthy Life Expectancy',
          data: [null,lifeExpectancyScore],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          stacked: true,
          stack: 'Stack 0',
          barThickness: 10,
        },
        {
          label: 'Freedom to Make Life Choices',
          data: [null,freedomScore],
          backgroundColor: 'rgb(54, 162, 235,0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
          stacked: true,
          stack: 'Stack 0',
          barThickness: 10,
        },
        {
          label: 'Generosity',
          data: [null,generosityScore],
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          stacked: true,
          stack: 'Stack 0',
          barThickness: 10,
        },
        {
          label: 'Perceptions of Corruption',
          data: [null,corruptionScore],
          backgroundColor: 'rgb(201, 203, 207,0.5)',
          borderColor: 'rgb(201, 203, 207)',
          borderWidth: 1,
          stacked: true,
          stack: 'Stack 0',
          barThickness: 10,
        }
      ];
      
      //create graph using chart.js
      var dataChart = new Chart('dataChart', {
        type: 'horizontalBar',
        data: {
          labels: ['','Score Breakdown',''],
          datasets: datasets,
        },
        options: {
          plugins: {
            title: {
                display: true,
                text: 'All Country Scores',
            }
          },
          responsive: true,
          scales: {
            x: {
              stacked: true
            },
            y: {
              beginAtZero: true,
              stacked: true,
            }
          }
        }
      });
    });
  }

  
  var gameRandom;//made global so it can be accessed by setGameResults

  //setRandomModal
  //randomly generates a country and outputs it to the rank guess game modal
  //input: index of the selected country

  function setRandomModal(selectedValue){
    gameRandom= selectedValue;
    const randomCountry = document.getElementById("randomCountry");
    fetchDataFromCSV('2022.csv', function (data) {
        var name = getValueFromCSV(data, selectedValue, 1);
        randomCountry.textContent = name;
      });
  }

  //setGameResults
  //outputs the game results by comparing the user input and the actual rank of the randomly generated country
  function setGameResults(){
    if((gameRandom<=146 & gameRandom>=0)){
      fetchDataFromCSV('2022.csv', function (data) {
        var rank = getValueFromCSV(data, gameRandom, 0);
        var name = getValueFromCSV(data, gameRandom, 1);
        const guessOutput= document.getElementById("guessOutput");
        const rangeInput = document.getElementById("customRange2").value;
        if(rangeInput==rank){
          guessOutput.textContent="Your guess is correct!"
        }
        else{
        guessOutput.textContent="You guessed " + rangeInput+ " out of 146 for " + name+ ". It's actual rank was " + rank + " out of 146."
        }
      });
    }
    else{
      guessOutput.textContent="You must generate a country and guess a rank to continue."
    }
  }