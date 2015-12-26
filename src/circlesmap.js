// event circlesmap
var circlesmap_generator = function(){
  var margin = {top:20, right:20, bottom: 20, left: 60},
      height = 40,
      cell_height = 40,
      canvas_width,
      width;

  var initCanvasSize = function(){
      canvas_width = +(d3.select('#circlesmap').style('width').replace('px', ''));
      width = canvas_width - margin.left - margin.right;
  }

  var current_month_range = [new Date(2007, 1), new Date(2008, 1)]

  var gtd_data = {};
  var fatal_data = {};
  var weapon_data = {};

  var formatting_data = function(raw_data) {
    // if gtd data is already formatted, then return it
    if (!_.isEmpty(gtd_data)) { return gtd_data; }

    //console.log(raw_data)
    for(var i=0; i < raw_data.length; i++){
      var country = raw_data[i].country,
      year    = +raw_data[i].year,
      month   = +raw_data[i].month,
      day     = +raw_data[i].day,
      nkill   = +raw_data[i].nkill;

      if(_.isEmpty(gtd_data[country])) { gtd_data[country] = []; }

      date = new Date(year, month-1, day)

      gtd_data[country].push({
        time  : date,
        nkill : nkill
      });
    }

    // sort all the events by time
    _.each(gtd_data, function(country_event_list){
      country_event_list = country_event_list.sort(function(a, b){
        return a.time - b.time;
      });
    });
    return gtd_data;
  };
  var parseDate = d3.time.format("%Y/%m/%d").parse;

  var dateDiff = function(from, to) {
    var milliseconds = to - from;
    return milliseconds / 86400000;

  };

  var update_view = function(time_range) {
    console.log("In update_view funciton")
    if(typeof time_range !== 'undefined'){
      current_month_range = time_range;
    };
    //console.log(current_month_range);
    var selected_country = WORLDMAP.selected_country;

    // countries added to list
    var countries = WORLDMAP.countries; // ["3_Letters_Country_Code"]
    var clickedCountry = WORLDMAP.clickedCountry; // ["3_Letters_Country_Code"]

//start of fatal
    var fatal_chart = dc.lineChart("#block");
    var ndx_fatal = crossfilter(fatal_data);
    var dateDim_fatal = ndx_fatal.dimension(function(d) {return d.idate;});
    var minDate_fatal = current_month_range[0];//dateDim_fatal.bottom(1)[0].idate;
    var maxDate_fatal = current_month_range[1];//dateDim_fatal.top(1)[0].idate;

    var nkillSumGroup = dateDim_fatal.group().reduceSum(function(d) {return isNaN(d.nkill) ? 0 : d.nkill;});
    var nwoundSumGroup = dateDim_fatal.group().reduceSum(function(d) {return isNaN(d.nwound) ? 0 : d.nwound;});

//show world
    if (selected_country == null)
      $(".added").remove();

    var fatal_chart = dc.lineChart("#fatal");
    var ndx_fatal = crossfilter(fatal_data);
    var dateDim_fatal = ndx_fatal.dimension(function(d) {return d.idate;});
    var minDate_fatal = current_month_range[0];//dateDim_fatal.bottom(1)[0].idate;
    var maxDate_fatal = current_month_range[1];//dateDim_fatal.top(1)[0].idate;

    var nkillSumGroup = dateDim_fatal.group().reduceSum(function(d) {return isNaN(d.nkill) ? 0 : d.nkill;});
    var nwoundSumGroup = dateDim_fatal.group().reduceSum(function(d) {return isNaN(d.nwound) ? 0 : d.nwound;});

    fatal_chart
        .width(1210)
        .height(400)
        .x(d3.time.scale().domain([minDate_fatal,maxDate_fatal]))
        .margins({left: 50, top: 60, right: 140, bottom: 60})

        .renderArea(true)
        .brushOn(false)
        .renderDataPoints(true)
        .clipPadding(10)
        .yAxisLabel("Deaths and injuries")          
        .dimension(dateDim_fatal)
        .group(nkillSumGroup,"Deaths")
        .stack(nwoundSumGroup,"Injuries")
        .legend(dc.legend().x(1080).y(10).itemHeight(13).gap(5));

    fatal_chart
        .renderTitle(true)
        .title(function(d){return "selected_country";});

    fatal_chart.render();
    
    d3.select("#fatal").select("svg")
      .attr("width", "100%")
      .attr("height", "140%")
      .attr("viewBox", "0 0 1210 400");

//start of stacked area - weapon
    var weapon_chart = dc.lineChart("#weapon");
    var ndx = crossfilter(weapon_data);
       
    var dateDim = ndx.dimension(function(d) {return d.idate;});
    var minDate = current_month_range[0];//dateDim.bottom(1)[0].idate;
    var maxDate = current_month_range[1];//dateDim.top(1)[0].idate;

    var attackSumGroup = {};
    attackSumGroup[1] = dateDim.group().reduceSum(function(d) {return isNaN(d.number[1]) ? 0 : d.number[1];});
    attackSumGroup[2] = dateDim.group().reduceSum(function(d) {return isNaN(d.number[2]) ? 0 : d.number[2];});
    attackSumGroup[3] = dateDim.group().reduceSum(function(d) {return isNaN(d.number[3]) ? 0 : d.number[3];});
    attackSumGroup[4] = dateDim.group().reduceSum(function(d) {return isNaN(d.number[4]) ? 0 : d.number[4];});
    attackSumGroup[5] = dateDim.group().reduceSum(function(d) {return isNaN(d.number[5]) ? 0 : d.number[5];});
    attackSumGroup[6] = dateDim.group().reduceSum(function(d) {return isNaN(d.number[6]) ? 0 : d.number[6];});
    attackSumGroup[7] = dateDim.group().reduceSum(function(d) {return isNaN(d.number[7]) ? 0 : d.number[7];});
    attackSumGroup[8] = dateDim.group().reduceSum(function(d) {return isNaN(d.number[8]) ? 0 : d.number[8];});
    attackSumGroup[9] = dateDim.group().reduceSum(function(d) {return isNaN(d.number[9]) ? 0 : d.number[9];});
    attackSumGroup[10] = dateDim.group().reduceSum(function(d) {return isNaN(d.number[10]) ? 0 : d.number[10];});
    attackSumGroup[11] = dateDim.group().reduceSum(function(d) {return isNaN(d.number[11]) ? 0 : d.number[11];});
    attackSumGroup[12] = dateDim.group().reduceSum(function(d) {return isNaN(d.number[12]) ? 0 : d.number[12];});

//Biological = 1; Chemical = 2; Explosives/Bombs/Dynamite = 3; Fake Weapons = 4; Firearms = 5;
//Incendiary = 6; Melee = 7; Other = 8; Radiological = 9; Sabotage Equipment = 10; 
//Unknown = 11; Vehicle =12;
    weapon_chart
        .width(1210)
        .height(400)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .margins({left: 50, top: 60, right: 140, bottom: 60})
        .renderArea(true)
        .brushOn(false)
        .renderDataPoints(true)
        .clipPadding(10)
        .yAxisLabel("Attacks by weapon type")
        .dimension(dateDim)
        .group(attackSumGroup[1],"Biological")
        .stack(attackSumGroup[2],"Chemical")
        .stack(attackSumGroup[3],"Explosives")
        .stack(attackSumGroup[4],"Fake Weapons")
        .stack(attackSumGroup[5],"Firearms")
        .stack(attackSumGroup[6],"Incendiary")
        .stack(attackSumGroup[7],"Melee")
        .stack(attackSumGroup[8],"Other")
        .stack(attackSumGroup[9],"Radiological")
        .stack(attackSumGroup[10],"Sabotage Equipment")
        .stack(attackSumGroup[11],"Unknown")
        .stack(attackSumGroup[12],"Vehicle")
        .legend(dc.legend().x(1080).y(10).itemHeight(13).gap(5));

        weapon_chart.render();
        d3.select("#weapon").select("svg")
          .attr("width", "100%")
          .attr("height", "140%")
          .attr("viewBox", "0 0 1210 400");


    if(countries.indexOf(selected_country) != -1)//show the country selected
    {
      console.log("countries: "+countries);
      console.log("Selected country not in countries");

      //add charts for this country
      var row = document.createElement('div');
      row.id = selected_country;
      row.className="row added";

      var title = document.createElement('div');
      title.innerHTML = "Country: " + selected_country;
      title.style.fontWeight  = "bold";


      var iDiv = document.createElement('div');
      //iDiv.id = selected_country+"1";
      iDiv.id = selected_country+'1';
      iDiv.className="col-sm-6";
      //iDiv.className = 'block';
      console.log(document.getElementById("fatal"));
      document.getElementById("sec1").appendChild(row);
      document.getElementById(selected_country).appendChild(title);
      document.getElementById(selected_country).appendChild(iDiv);

      var iDiv = document.createElement('div');
      //iDiv.id = selected_country+"2";
      iDiv.id = selected_country + '2';
      iDiv.className = "col-sm-6";
      //console.log(document.getElementById("fatal"));
      document.getElementById(selected_country).appendChild(iDiv);
      

      //update all countries
      for (var i in countries){
        var fatal_chart = dc.lineChart("#"+countries[i]+'1');

        var ndx_fatal = crossfilter(fatal_data);
        var dateDim_fatal = ndx_fatal.dimension(function(d) {return d.idate;});
        var minDate_fatal = current_month_range[0];//dateDim_fatal.bottom(1)[0].idate;
        var maxDate_fatal = current_month_range[1];//dateDim_fatal.top(1)[0].idate;

        var nkillSumGroup = dateDim_fatal.group().reduceSum(function(d) {return (d.country == countries[i])&&(!isNaN(d.nkill)) ?  d.nkill: 0;});
        var nwoundSumGroup = dateDim_fatal.group().reduceSum(function(d) {return (d.country == countries[i])&&(!isNaN(d.nwound)) ?  d.nwound: 0;});

        fatal_chart
            .width(1210)
            .height(400)
            .x(d3.time.scale().domain([minDate_fatal,maxDate_fatal]))
            .margins({left: 50, top: 60, right: 140, bottom: 60})

            .renderArea(true)
            .brushOn(false)
            .renderDataPoints(true)
            .clipPadding(10)
            .yAxisLabel("Deaths and injuries")          
            .dimension(dateDim_fatal)
            .group(nkillSumGroup,"Deaths")
            .stack(nwoundSumGroup,"Injuries")
            .legend(dc.legend().x(1080).y(10).itemHeight(13).gap(5));

        fatal_chart
            .renderTitle(true)
            .title(function(d){return "selected_country";});

        fatal_chart.render();
        d3.select("#" + countries[i]+'1').selectAll("svg")
              .attr("width", "100%")
              .attr("height", "140%")
              .attr("viewBox", "0 0 1210 400");
        

  //start of stacked area - weapon
        //console.log(document.getElementById("fatal").appendChild(iDiv));

        var weapon_chart = dc.lineChart("#" + countries[i]+'2');
        var ndx       = crossfilter(weapon_data);
           
        var dateDim = ndx.dimension(function(d) {return d.idate;});
        var minDate = current_month_range[0];//dateDim.bottom(1)[0].idate;
        var maxDate = current_month_range[1];//dateDim.top(1)[0].idate;

        var attackSumGroup = {};
        attackSumGroup[1] = dateDim.group().reduceSum(function(d) {return (d.country == countries[i])&&(!isNaN(d.number[1])) ?  d.number[1]: 0;});
        attackSumGroup[2] = dateDim.group().reduceSum(function(d) {return (d.country == countries[i])&&(!isNaN(d.number[2])) ?  d.number[2]: 0;});
        attackSumGroup[3] = dateDim.group().reduceSum(function(d) {return (d.country == countries[i])&&(!isNaN(d.number[3])) ?  d.number[3]: 0;});
        attackSumGroup[4] = dateDim.group().reduceSum(function(d) {return (d.country == countries[i])&&(!isNaN(d.number[4])) ?  d.number[4]: 0;});
        attackSumGroup[5] = dateDim.group().reduceSum(function(d) {return (d.country == countries[i])&&(!isNaN(d.number[5])) ?  d.number[5]: 0;});
        attackSumGroup[6] = dateDim.group().reduceSum(function(d) {return (d.country == countries[i])&&(!isNaN(d.number[6])) ?  d.number[6]: 0;});
        attackSumGroup[7] = dateDim.group().reduceSum(function(d) {return (d.country == countries[i])&&(!isNaN(d.number[7])) ?  d.number[7]: 0;});
        attackSumGroup[8] = dateDim.group().reduceSum(function(d) {return (d.country == countries[i])&&(!isNaN(d.number[8])) ?  d.number[8]: 0;});
        attackSumGroup[9] = dateDim.group().reduceSum(function(d) {return (d.country == countries[i])&&(!isNaN(d.number[9])) ?  d.number[9]: 0;});
        attackSumGroup[10] = dateDim.group().reduceSum(function(d) {return (d.country == countries[i])&&(!isNaN(d.number[10])) ?  d.number[10]: 0;});
        attackSumGroup[11] = dateDim.group().reduceSum(function(d) {return (d.country == countries[i])&&(!isNaN(d.number[11])) ?  d.number[11]: 0;});
        attackSumGroup[12] = dateDim.group().reduceSum(function(d) {return (d.country == countries[i])&&(!isNaN(d.number[12])) ?  d.number[12]: 0;});

  //Biological = 1; Chemical = 2; Explosives/Bombs/Dynamite = 3; Fake Weapons = 4; Firearms = 5;
  //Incendiary = 6; Melee = 7; Other = 8; Radiological = 9; Sabotage Equipment = 10; 
  //Unknown = 11; Vehicle =12;
        weapon_chart
            .width(1210)
            .height(400)
            .x(d3.time.scale().domain([minDate,maxDate]))
            .margins({left: 50, top: 60, right: 140, bottom: 60})
            .renderArea(true)
            .brushOn(false)
            .renderDataPoints(true)
            .clipPadding(10)
            .yAxisLabel("Attacks by weapon type")
            .dimension(dateDim)
            .group(attackSumGroup[1],"Biological")
            .stack(attackSumGroup[2],"Chemical")
            .stack(attackSumGroup[3],"Explosives")
            .stack(attackSumGroup[4],"Fake Weapons")
            .stack(attackSumGroup[5],"Firearms")
            .stack(attackSumGroup[6],"Incendiary")
            .stack(attackSumGroup[7],"Melee")
            .stack(attackSumGroup[8],"Other")
            .stack(attackSumGroup[9],"Radiological")
            .stack(attackSumGroup[10],"Sabotage Equipment")
            .stack(attackSumGroup[11],"Unknown")
            .stack(attackSumGroup[12],"Vehicle")
            .legend(dc.legend().x(1080).y(10).itemHeight(13).gap(5));

        weapon_chart.render();
        d3.select("#" + countries[i]+'2').selectAll("svg")
              .attr("width", "100%")
              .attr("height", "140%")
              .attr("viewBox", "0 0 1210 400");
    }
}else if(countries.indexOf(selected_country) == -1){
  console.log("Selected country already in countries");
  $("#" + selected_country).remove();
}



//new

    // end of drawing circlesmap
  };

  var init = function() {
    var that = this;
    initCanvasSize();
    d3.csv("data/fatal.csv", function(error, data1) {
      fatal_data = data1;
      for(var i=0; i<fatal_data.length; i++) {
        fatal_data[i].nkill = parseInt(fatal_data[i].nkill);
        fatal_data[i].nwound = parseInt(fatal_data[i].nwound);
        fatal_data[i].idate = parseDate(fatal_data[i].idate);
      }
    });

    d3.json("data/circles.json", function(error, data) {
      if (error) return console.warn(error);
      that.raw_data = data;
      formatting_data(data);
      update_view();
    }); 
  };

  d3.csv("data/weapon.csv", function(error, data2) {
    weapon_data = data2;
    for(var i=0; i<weapon_data.length; i++) {
      weapon_data[i].ntype = parseInt(weapon_data[i].ntype);
      weapon_data[i].number = {};
      weapon_data[i].nattack = parseInt(weapon_data[i].nattack);
      weapon_data[i].number[weapon_data[i].ntype] = weapon_data[i].nattack;
      weapon_data[i].idate = parseDate(weapon_data[i].idate);
    }
  });

  return {
    init: init,
    initCanvasSize: initCanvasSize,
    gtd_data: function() { return gtd_data; },
    update: update_view
  };
};


