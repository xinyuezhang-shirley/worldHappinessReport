//APCSP2021 Project
    
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
    
      function getValueFromCSV(csvData, row, column) {
        return csvData[row][column];
      }

      function getColumnFromCSV(csvData, column) {
        var myList=[];
        for(var i=0; i< 146; i++)
        {
          myList.push(csvData[i][column]);
        }
        return myList;
      }

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

    function setOutputMain(selectedValue){
      const output = document.getElementById("output");
      fetchDataFromCSV('2022.csv', function (data) {
          var score = getValueFromCSV(data, selectedValue, 2);
          var name = getValueFromCSV(data, selectedValue, 1);
          score= replaceCommaWithPeriod(score);
          output.textContent = name+' was ranked number ' + selectedValue+ ' out of 146 included countries and has an overall score of '+
          score+' out of 10 in the World Happiness Report of 2022 for the happiness of its inhabitants.';
        });

    }

    function setOutputData(selectedValue){
      const gdp = document.getElementById("gdp");
      const socialSupport = document.getElementById("socialSupport");
      const lifeExpectancy = document.getElementById("lifeExpectancy");
      const freedom = document.getElementById("freedom");
      const generosity = document.getElementById("generosity");
      const corruption = document.getElementById("corruption");
      const myCountry = document.getElementById("myCountry");

      fetchDataFromCSV('2022.csv', function (data) {
        var name = getValueFromCSV(data, selectedValue, 1);
        var gdpScore = getValueFromCSV(data, selectedValue, 6);
        var socialSupportScore = getValueFromCSV(data, selectedValue, 7);
        var lifeExpectancyScore = getValueFromCSV(data, selectedValue, 8);
        var freedomScore = getValueFromCSV(data, selectedValue, 9);
        var generosityScore = getValueFromCSV(data, selectedValue, 10);
        var corruptionScore = getValueFromCSV(data, selectedValue, 11);

        var allGDP = getColumnFromCSV(data,6);
        var allSocialSupport = getColumnFromCSV(data,7);
        var allLifeExpectancy = getColumnFromCSV(data,8);
        var allFreedom = getColumnFromCSV(data,9);
        var allGenerosity = getColumnFromCSV(data,10);
        var allCorruption = getColumnFromCSV(data,11);

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
        });
    }

    function betterThan(score,list) {
      worseCountries = 0;
      for (var i = 0; i < list.length; i++) {
        if (list[i]<score) {
          worseCountries = worseCountries+1;
    } }
    return 146-worseCountries;
  }