var WORLDMAP = {
  data: {},
  world_data: {},
  selected_country : null,
  // ndx_fatal : null,
  // dateDim_fatal : null,

  unselect: function(){
    var that = this;
    var selected_country = null;
    that.selected_country = selected_country;
    circlesmap.update();
    that.ndx_fatal = ndx_fatal;
    that.dateDim_fatal = dateDim_fatal;
  },

  get3LetterMonth: function(month) {
    var name = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ];
    return name[month-1];
  },

  update: function (f_year, f_month, t_year, t_month) {
    this.world_data = {};
     $("#chart svg").remove();

    f_year = typeof f_year !== 'undefined' ? f_year : 2000;
    f_month = typeof f_month !== 'undefined' ? f_month : 1;
    t_year = typeof t_year !== 'undefined' ? t_year : 2011;
    t_month = typeof t_month !== 'undefined' ? t_month : 1;

    var totalKilled = 0;
    //console.log(data);

    for(var i=0; i < data.length; i++){
      var flag = true;
      
      if(data[i].year < f_year){
          flag = false;
      } else if(data[i].year == f_year){
        if(data[i].month < f_month)
          flag = false;
      };
      
      if(data[i].year > t_year){
        flag = false;
      } else if(data[i].year == t_year){
        if(data[i].month > t_month - 1)
          flag = false;
      };
     
      if(flag){
        var temp = parseInt(data[i].nkill);
        totalKilled += isNaN(temp) ? 0 : temp;
        if(this.world_data[data[i].country] == null){
          this.world_data[data[i].country] = data[i].nkill
        }
        else{
          this.world_data[data[i].country] = data[i].nkill + this.world_data[data[i].country];
        };  
      };
    };

    totalKilled = totalKilled.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


    var html = '<b>' + totalKilled + '</b> people were killed due to Terrorism between '
                  + this.get3LetterMonth(f_month)+', ' + f_year + " and "+ this.get3LetterMonth(t_month)+', '+ t_year+'.';
    //console.log(html);

    document.getElementById('totalKill').innerHTML = html;
    //console.log(this.world_data);

       var barchart = [];
    for (var country in this.world_data) {
      if(country == 'DZA'){
        a = 1;
      }
      var nkill = this.world_data[country];
      if( nkill != 0 && !isNaN(nkill)){
      var obj1 = {} 
      obj1['nkill'] = nkill;
      obj1['country'] = country;
      barchart.push(obj1); 
      } 
         
    }

    for (var country in this.world_data) {
      var obj = {}
      obj['fillKey'] = Math.ceil(this.colorScale(this.world_data[country]));
      obj['nkill'] = this.world_data[country];
      this.world_data[country] = obj;
    }
    console.log(this.world_data);
    
    
    //console.log(barchart);
    function compare(a,b) {
      if (a.nkill > b.nkill)
        return -1;
      if (a.nkill < b.nkill)
        return 1;
      return 0;
    }

    var sorted = barchart.sort(compare);
    //console.log(sorted);
    //barchart.sort(function(a, b){return b-a});
    var top9 = sorted.slice(0, 9);

     ////////////////////////////////////////////////////////////
  //(function(){

    var margin1 = {top: 50, bottom: 120, left:40, right: 40};
    var width = 700 - margin1.left - margin1.right;
    var height = 450 - margin1.top - margin1.bottom;

    var xScale = d3.scale.linear().range([0, width]);
    var yScale = d3.scale.ordinal().rangeRoundBands([0, height], 1.8,0);

    var numTicks = 5;
    var xAxis = d3.svg.axis().scale(xScale)
                    .orient("top")
                    .tickSize((-height))
                    .ticks(numTicks);

    var svg = d3.select("#chart").append("svg")
                .attr("width", width+margin1.left+margin1.right)
                .attr("height", height+margin1.top+margin1.bottom)
                .attr("class", "base-svg");

    var barSvg = svg.append("g")
                .attr("transform", "translate("+margin1.left+","+margin1.top+")")
                .attr("class", "bar-svg");

    var x = barSvg.append("g")
            .attr("class", "x-axis");

    //var url = "src/barchart.json";

    //d3.json(url, function(data) {
        var data1  = top9;
        var xMax = d3.max(data1, function(d) { return d.nkill; } );
        var xMin = 0;
        xScale.domain([xMin, xMax]);
        yScale.domain(data1.map(function(d) { return d.country; }));
        //console.log(xScale);

        d3.select(".base-svg").append("text")
            .attr("x", margin1.left)
            .attr("y", (margin1.top)/4)
            .attr("text-anchor", "start")
            .text("Countries suffering from most fatalities")
            .attr("class", "title");

        var groups = barSvg.append("g").attr("class", "labels")
                    .selectAll("text")
                    .data(data1)
                    .enter()
                    .append("g");

        groups.append("text")
                .attr("x", "0")
                .attr("y", function(d) { return yScale(d.country); })
                .text(function(d) { return d.country; })
                .attr("text-anchor", "end")
                .attr("dy", ".9em")
                .attr("dx", "-.32em")
                .attr("id", function(d,i) { return "label"+i; });

        var bars = groups
                    .attr("class", "bars")
                    .append("rect")
                    .attr("width", function(d) {return xScale(d.nkill); })
                    .attr("height", height/9)
                    .attr("x", xScale(xMin))
                    .attr("y", function(d) { return yScale(d.country); })
                    .attr("id", function(d,i) { return "bar"+i; });

        groups.append("text")
                .attr("x", function(d) { return xScale(d.nkill); })
                .attr("y", function(d) { return yScale(d.country); })
                .text(function(d) { return d.nkill; })
                .attr("text-anchor", "end")
                .attr("dy", "1.2em")
                .attr("dx", "-.32em")
                .attr("id", "precise-value");

        bars
            .on("mouseover", function() {
                var currentGroup = d3.select(this.parentNode);
                currentGroup.select("rect").style("fill", "brown");
                currentGroup.select("text").style("font-weight", "bold");
            })
            .on("mouseout", function() {
                var currentGroup = d3.select(this.parentNode);
                currentGroup.select("rect").style("fill", "steelblue");
                currentGroup.select("text").style("font-weight", "normal");
            })
            .on("click", function() {
                var currentGroup = d3.select(this.parentNode);
                currentGroup.select("rect").style("fill", "steelblue");
                currentGroup.select("text").style("font-weight", "normal");
            });

        // x.call(xAxis);
        // var grid = xScale.ticks(numTicks);
        // barSvg.append("g").attr("class", "grid")
        //     .selectAll("line")
        //     .data(grid, function(d) { return d; })
        //     .enter().append("line")
        //         .attr("y1", 0)
        //         .attr("y2", height+margin1.bottom)
        //         .attr("x1", function(d) { return xScale(d); })
        //         .attr("x2", function(d) { return xScale(d); })
        //         .attr("stroke", "white");

    //});//end of json function

//})();

    ///////////////////////////////////////////////////////////

    //var clicked = [];
    //console.log(this.world_data);
    $("#map svg").remove();
    console.log(this.world_data);
    var currentMap = new Datamap({
      element: document.getElementById('map'),
      //clicked: [],

      fills: {
        // 8: "#800000",
        // 7: "#8A1818",
        // 6: "#943131",
        // 5: "#9F4949",
        // 4: "#A96262",
        // 3: "#B37A7A",
        // 2: "#BE9393",
        // 1: "#C8ABAB",
        // 0: "#D2C4C4",
        // defaultFill: '#DDDDDD',
        8: "#B44010",
        7: "#E55300",
        6: "#FF6900",
        5: "#FF2B00",
        4: "#FF4023",
        3: "#FF5C00",
        2: "#FF8106",
        1: "#FF9F00",
        0: "#FEC34D",
        defaultFill: '#DDDDDD',

        
      },
      data: this.world_data,
      geographyConfig:{
        borderColor: 'hsl(0,0%,80%)',
        //highlightBorderColor: 'hsl(0,0%,4%)',
        //highlightBorderColor: '#ddd',
        highlightFillColor: 'hsl(0,0%,20%)',
        //highlightFillColor: '#FFFFFF',
        highlightOnHover: true,
        highlightBorderWidth: 0,
        fillOpacity: 0.9,
        popupTemplate: function(geography, data) {
          if(data)
            return '<div class="hoverinfo">' + geography.properties.name + '<br>' +  data.nkill + ' people killed' + 
                   '<br> Click to add/remove ' + '</div>'
          else
            return '<div class="hoverinfo">' + geography.properties.name + '<br>nobody killed</div>'; 
        }
      }
    });
  }, // end of update function
  
  currentMap: null,
  colorScale: null,
  countries :[],
  //selected_country: null,
  //country_names: [],
  init: function () {
    var countries=[];
    var that = this;
    var selected_country = null;
    // create the color scale on the world map
    this.colorScale = d3.scale.log()
                        .clamp(true)
                        .domain([1, 3000])
                        .range([0, 8])
                        .nice();

    var render = function() {
      var event;
      event = d3.mouse(this);
      total = d3.selectAll("div#map svg.datamap g.datamaps-subunits path")[0].length;

      var clickedCountry = d3.selectAll("div#map svg.datamap g.datamaps-subunits path")[0][total-1].getAttribute("class").split(" ")[1];

      //add countries to the array
      if(countries.indexOf(clickedCountry) == -1) {
        countries.push(clickedCountry);
        //console.log("add"+countries);
      } else {
        countries.splice(countries.indexOf(clickedCountry), 1);
        //console.log("remove"+countries);
      }
      //console.log(countries);

      // if(selected_country == clickedCountry){
      //   selected_country = null;
      // } else {
      //   selected_country = clickedCountry;
      // }
      selected_country = clickedCountry;

      //console.log(countries);
      that.selected_country = selected_country;
      that.countries = countries;
      // update circlesmap when clicked countries changes
      circlesmap.update();
      
      //var html ='';
      //for(var country in countries){
      //  html += '<p>' + countries[country] + '</p>';
      //}
      //document.getElementById('country_list').innerHTML = html;
    }
    
    svg = d3.select("div#map"); 
    svg.on("click", render);
    that.countries = countries;

    d3.json("data/gtd.json", function(error, data) {
      if (error) return console.warn(error);
      this.data = data;

      for(var i=0; i<data.length; i++) {
        data[i].year = parseInt(data[i].year);
        data[i].month = parseInt(data[i].month);
        data[i].nkill = parseInt(data[i].nkill,10);
      }

      slider.init();
      circlesmap.init();
    }); 
  } // end of init function
};
