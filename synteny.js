
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                 //
// UI and File Upload                                                                                                              //
//                                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function readLocalFile(event, index, size_file) {
    // change element file name and file text
    var input = event.target;

    //console.log(input.files[0].name);

    var reader = new FileReader();
    reader.onload = function(){
        var text = reader.result;
        //var node = document.getElementById('output');
        //node.innerText = text;
        //console.log(reader.result.substring(0, 200));

        if (size_file) {
          input_object_mappings[index].size_file_name = input.files[0].name;
          input_object_mappings[index].size_file_text = text;
        } else {
          input_object_mappings[index].bed_file_name = input.files[0].name;
          input_object_mappings[index].bed_file_text = text;
        }

    };
    reader.readAsText(input.files[0]);

};


function SpecimentInputObject() {
  var instance = {};
  instance.name = "";

  instance.bed_file_name = "";
  instance.bed_file_text = "";

  instance.size_file_name = "";
  instance.size_file_text = "";
  return instance;
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function make_visibility(id) {
    var e = document.getElementById(id);
       e.style.display = 'block';
}
function disableBt(id) {
    var e = document.getElementById(id);
       e.style.display = 'none';
}




function addRowToTable() {
  let lastIndex = input_object_list[input_object_list.length - 1];
  newRow = new SpecimentInputObject();
  let randomId = makeid();
  input_object_list.push(randomId);
  input_object_mappings[randomId] = newRow;
  let markup = getListElementHtml(newRow, randomId);
  $("#species-table tbody").append(markup);
  if (newRow.name.length > 0) {
    $("#inputSpeciesName-" + randomId).val(newRow.name);
  }

  reloadfilestyle();
}

function removeRowFromTable(index) {
  $("#species-table tr[data-index='" + index + "']").remove();
  input_object_list.splice(index, 1);
  delete input_object_mappings[index];
  // TODO:
}

function changeName(value, index) {
  input_object_mappings[index].name = value;
}

// Only called on page reload
function getInputTableHTML(input_object_list) {
  var html = "<table id='species-table' style='border: 1px solid black'><tbody>";

  input_object_list.forEach(function(id) {
    html += getListElementHtml(input_object_mappings[id], id);
  });

  html += "</tbody></table>";
  html += "<br>&nbsp&nbsp"
  html += "<button type=\"button\" class=\"btn btn-primary\" onclick='plotGenomicsBarGraph()'>Plot Genomics Bar Graph</button>";
  html += "&nbsp&nbsp<button type=\"button\" id=\"add_row\" class=\"btn btn-primary\" onclick='addRowToTable()'>Add row</button>";
  return html;
}

function swap(list, i, j) {
  tmp = list[i];
  list[i]=list[j];
  list[j] = tmp;
}

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this;
};

function moveUp(index) {
  let i = input_object_list.indexOf(index);
  if (i == 0) return;
  let otherId = input_object_list[i-1];
  input_object_list.move(i, i-1);

  let thisone = $("#species-table tr[data-index='" + index + "']");
  let other = $("#species-table tr[data-index='" + otherId + "']");
  thisone.insertBefore(other);
}

function moveDown(index) {
  let i = input_object_list.indexOf(index);
  if (i == input_object_list.length - 1) return;
  let otherId = input_object_list[i+1];
  input_object_list.move(i, i+1);

  let thisone = $("#species-table tr[data-index='" + index + "']");
  let other = $("#species-table tr[data-index='" + otherId + "']");
  thisone.insertAfter(other);
}

function getListElementHtml(input_object, index) {
  return "  <tr data-index='"+index+"' style='border: 1px solid black; text-align: center; vertical-align:middle'> \
      <form> \
        <td style='border: 1px solid black; text-align: center; vertical-align:middle'><input type='text' name='org_name' id='inputSpeciesName-" + index + "' onchange='changeName(this.value, \""+index+"\")'  /> </td>\
        <td> \
          <input type='file' class='filestyle' data-btnClass='btn-primary' data-text='BED file' accept='.bed' onchange='readLocalFile(event, \""+index+"\", false)'> "+input_object.bed_file_name+"\
        </td> \
        <td> \
          <input type='file' class='filestyle' data-btnClass='btn-primary' data-text='Size file' accept='.sizes' onchange='readLocalFile(event, \""+index+"\", true)'> "+input_object.size_file_name+"\
        </td> \
        <td style='border: 1px solid black'> <button id='btn1' class=\"btn btn-danger\" name='subject1' onclick=removeRowFromTable('"+index+"') >Remove</button> </td> \
        <td style='border: 1px solid black'> <button id='btn1' class=\"btn btn-success\" name='moveup' onclick=moveUp('"+index+"') >Move Up</button> </td> \
        <td style='border: 1px solid black'> <button id='btn1' class=\"btn btn-success\" name='movedown' onclick=moveDown('"+index+"')   >Move Down</button> </td> \
      </form> \
    </tr> ";
}


 var selectedGeneInGeneSearch = "";
 function searchGene(gene_class, div_id) {

     if (!div_id) {
         div_id = "bar_genomics_graph_div";
     }

     if (gene_class == null) { gene_class = selectedGeneInGeneSearch };

     var svg = d3.selectAll('#'+div_id);


     var lineclass = (".lines") //".str12.lines"
     d3.selectAll(lineclass)
         .transition()
         .style("opacity", 0.2)

     d3.selectAll("#t"+selectedGeneInGeneSearch.split('.').join("")).remove();

     if (gene_class != "") {
         var lineclass = ("." + gene_class.split('.').join("")); //dots in gene name are removed to eliminate errors (eg. ".str12.lines")

         d3.selectAll(lineclass)
             .transition()
             .style("opacity", 1);
     }
     //d3.select("#t"  d[0].gname.split('.').join("")).remove();
     selectedGeneInGeneSearch = gene_class;
 }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                 //
// Parsing and processing .bed and .size files                                                                                     //
//                                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function loadBedFile(data) {
    datalines = data.split(/\r\n|\n/);
    var lines = [];
    for (var i = 0; i < datalines.length; i++) {
        var linearray = datalines[i].split("\t");
        lines.push({
            chr: linearray[0],
            start: linearray[1],
            stop: linearray[2],
            gname: linearray[3]
        });
    };
    return lines
}


function loadSizeFile(data) {
    datalines = data.split(/\r\n|\n/);
    var lines = [];
    for (var i = 0; i < datalines.length; i++) {
        var linearray = datalines[i].split("\t");
        lines.push({
            chr: linearray[0],
            size: linearray[1]
        });
    };
    return lines
}



function Genome(chrom_size_file, bed_file) {
    var instance = {}
    instance.bed = bed_file;
    instance.chrom_size = chrom_size_file;
    instance.org
    return instance;
}





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                 //
// Plot                                                                                                    //
//                                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function plotGenomicsBarGraph(genome_list, div_id) {

    //alert("here");
    if (!div_id) {
        div_id = "bar_genomics_graph_div";
    }
    make_visibility('search_bar');
    disableBt('add_row');
    if (!genome_list) {
        genome_list = Object.values(input_object_mappings);
    }
    d3.select("#"+div_id).select("svg").remove();

    //var arrorg = ["human", "marmoset", "mouse"]; //organism for comparison
    //var arrorg = ["human", "marmoset", "mouse", "mouse"]; //organism for comparison


    var stackdata = [];

    var arrorg = [];
    genome_list.forEach(function(element){
      arrorg.push(element.name);
    //});


      var org = element.name;

        window[org + "bed"] = loadBedFile(element.bed_file_text);


        //*************************************************************************************
        //load chromosome size (eg. human.chrom.sizes)

        window[org + "chrsize"] = loadSizeFile(element.size_file_text);

        //sum of chromosome sizes for each organism assigned to new variable (eg. humantotchrsize)
        window[org + "totchrsize"] = 0;
        window[org + "chrsize"].forEach(function(i) {
            if (i.size) {
                window[org + "totchrsize"] += i.size / 1;
            }
        });

        //Calculation of start(y0) and end point(y1) of stacked bars by using (eg humanchrsize) file
        function convstack(array) {
            arrofobj = [];
            var num = 0;
            array.forEach(function(i) {
                if (i.chr && i.chr !== "chrM") {
                    arrofobj.push({
                        name: i.chr,
                        y1: num / 1 + i.size / 1,
                        y0: num / 1
                    });
                    num += i.size / 1;
                }
            });
            return arrofobj
        }

        //Calculation of middle point of each gene(y) by using (eg humanbed) file
        function convlines(array) {
            arroflines = [];
            var num = 0;
            array.forEach(function(i) {
                if (i.chr) {
                    arroflines.push({
                        name: i.chr,
                        y: (i.start / 1 + i.stop / 1) / 2, //midde point of the gene
                        gname: i.gname
                    });
                }
            });
            return arroflines
        }

        //all converted data added to stackdata
        stackdata.push({
            xIndex: org, //selected organism
            total: window[org + "totchrsize"], //total chromosome size
            bars: convstack(window[org + "chrsize"]), //bar data
            LineCategory: convlines(window[org + "bed"]) //line data
        });


    });


    var data = stackdata;

    // d3 plot:
    var margin = {
        top: 50,
        right: 20,
        bottom: 30,
        left: 20
    };

    var barPad = .95; //padding between bars
    var width = 800 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#"+ div_id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "d3-plot")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    /// Adding Name in LineCategory
    data.forEach(function(d) {
        d.LineCategory.forEach(function(b) {
            b.xIndex = d.xIndex;
        })
    });

    //Assigning actual location of the genes on the plot:
    // Adding starting point of a horizontal bar to the y values of LineCategory for each chromosome
    data.forEach(function(d) {
        d.LineCategory.forEach(function(b) {
            var index = 0;
            d.bars.forEach(function(e) {
                if (b.name === e.name) {
                    //e.y0 ->chr start point on stacked bar
                    //b.y - >position within the chromosome
                    b.y = e.y0 + b.y // actual position on graph
                    return
                }
            });
        })
    });





    // Assigning min and max values of x and y axis
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], barPad)
        .domain(data.map(function(d) {
            return d.xIndex;
        }));

    var y = d3.scale.linear()
        .rangeRound([height, 0])
        .domain([0, d3.max(data, function(d) {
            return d.total;
        })]);
    // Add a X Axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    //Assigning position of the line based on x axis and y values
    //rangeBand used to find the width of the each bar. Center of the bar is found by dividing 2.
    var line = d3.svg.line().x(function(d) {
        return x(d.xIndex) + x.rangeBand() / 2;
    }).y(function(d) {
        return y(d.y)
    });

    //color scale assigned
    var color = d3.scale.category20()


    var Categories = [];
    // To Draw lines, first add (type: "line") into each element of linecategories
    data.forEach(function(d) {
        d.LineCategory.forEach(function(b) {
            if (Categories.findIndex(function(c) {
                    return c.gname === b.gname
                }) == -1) {
                b.Type = "line";
                Categories.push(b)
            }
        })
    });



    //Matching genes that are common for first and second organism, then second and third organism
    //This phase is performed by two nested for loops.
    //Alternatively sorting each array and matching would speed up the process.
    //Other alternative is using hash functions. Since overall data is small, nested two loops is chosen.
    function Linecreator(array) {
        var linebox = [];
        for (k = 0; k < array.length - 1; k++) {
            array[k].forEach(function(item) {
                array2 = array[k + 1].filter(function(elem) {
                    return elem.gname === item.gname
                });
                array2.forEach(function(d) {
                    linebox.push([item, d]);
                });
            });
        };
        return linebox;
    }

    // Processing Line data
    lineData = Linecreator(data.map(function(d) {
        return d.LineCategory
    }));

    // Line Coloring
    LineColor = d3.scale.ordinal();
    LineColor.domain(Categories.filter(function(d) {
        return d.Type == "line"
    }).map(function(d) {
        return d.gname
    }));
    LineColor.range(["#d40606", "#06bf00", "#98bdc5", "#671919", "#0b172b"])

    //  drawing lines
    svg.selectAll(".lines")
        .data(lineData)
        .enter()
        .append("g")
        .attr("class", function(d) {
            return d[0].gname.split('.').join("");
        })
        .classed("lines", true)
        .each(function(d) {
            gname = d[0].gname;
            d3.select(this).append("path").attr("d", function(b) {
                return line(b)
            }).style({
                "stroke-width": "2.5px",
                "fill": "none"
            }).style("stroke", LineColor(gname)).transition().duration(1500)
        });

    //On mouseover lines will show up and related gene text will be seen
    svg.selectAll(".lines")
        .on("mouseover", function(d, i) {
            var lineclass = ("." + d[0].gname.split('.').join("") + ".lines") //dots in gene name are removed to eliminate errors (eg. ".str12.lines")
            d3.selectAll(lineclass)
                .transition()
                .style("opacity", 1);

            // Label of the gene
            svg.append("text").attr({
                    id: "t" + d[0].gname.split('.').join(""), // dots in gene name are removed for errors
                    x: function() {
                        return x(d[0].xIndex) + 15;
                    },
                    y: function() {
                        return y(d[0].y) - 15;
                    }
                })

                .text(function() {
                    return d[0].gname // Gene name
                })


        })
        //On mouseout lines will become transparent and related gene text will be removed
        .on("mouseout", function(d, i) {
          if (selectedGeneInGeneSearch.split('.').join("") ==
                d[0].gname.split('.').join("")) return;

            var lineclass = ("." + d[0].gname.split('.').join("") + ".lines") //".str12.lines"
            d3.selectAll(lineclass)
                .transition()
                .style("opacity", 0.2)
            d3.select("#t" + d[0].gname.split('.').join("")).remove();
        });


    //  drawing bars
    var state = svg.selectAll(".bar")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {
            return "translate(" + x(d.xIndex) + ",0)";
        });

    var bars = state.selectAll("rect")
        .data(function(d) {
            return d.bars;
        })
        .enter().append("g")
        .attr("class", "subbar");

    bars.append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            return y(d.y1);
        })
        .attr("height", function(d) {
            return y(d.y0) - y(d.y1);
        })
        .style("fill", function(d) {
            return color(d.name);
        })
        .style("stroke", "#000")

    //chromosome number is located inside of the bar
    bars.append("text")
        .attr("x", x)
        .attr("y", function(d) {
            return y(d.y0)
        })
        .attr("dy", "-0.2em")
        .attr("dx", "0.2em")
        .style("font", "6px sans-serif")
        .style("text-anchor", "begin")
        .text(function(d) {
            return d.name.substring('chr'.length)
        });


    //x axis to show organisms
    svg.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .style("text-anchor", "end");

        searchGene(null);
}
