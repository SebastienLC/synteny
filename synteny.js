
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                 //
// UI and File Upload                                                                                                              //
//                                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function readLocalFile(event, index, size_file) {
    // change element file name and file text
    //console.log(event.target);
    var input = event.target;

    //console.log(input.files[0].name);

    var reader = new FileReader();
    reader.onload = function(){
        var text = reader.result;

        if (size_file) {
          input_object_list[index].size_file_name = input.files[0].name;
          input_object_list[index].size_file_text = text;
        } else {
          input_object_list[index].bed_file_name = input.files[0].name;
          input_object_list[index].bed_file_text = text;
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

function addRowToTable() {
  newRow = new SpecimentInputObject();
  input_object_list.push(newRow);
  displayInputTable();
}

function removeRowFromTable(index) {
  input_object_list.splice(index, 1);
  displayInputTable();
}

function changeName(value, index) {
  input_object_list[index].name = value;
  displayInputTable();
}

function getInputTableHTML(input_object_list) {
  var html = "<table style='border: 1px solid black'>";

  input_object_list.forEach(function(element, index) {
    html += getListElementHtml(element, index);
  });

  html += "</table>";
  html += "<button onclick='plotGenomicsBarGraph()'>Plot Genomics Bar Graph</button>";
  html += "<button onclick='addRowToTable()'>Add row</button>";
  return html;
}

function swap(list, i, j) {
  tmp = list[i];
  list[i]=list[j];
  list[j] = tmp;
}

function moveUp(index) {
  swap(input_object_list, index, (index+1 + input_object_list.length) % input_object_list.length);
  displayInputTable();
}

function moveDown(index) {
  swap(input_object_list, index, (index-1 + input_object_list.length) % input_object_list.length);
  displayInputTable();
}

function getListElementHtml(input_object, index) {
  return "  <tr> \
      <form> \
        <td style='border: 1px solid black'><input type='text' name='org_name' value='"+input_object.name+"' onchange='changeName(this.value, "+index+")' /></td> \
        <td style='border: 1px solid black'>.bed file:<input type='file' onchange='readLocalFile(event, "+index+", false)'> "+input_object.bed_file_name+"</td> \
        <td style='border: 1px solid black'>.size file:<input type='file' onchange='readLocalFile(event, "+index+", true)'>"+input_object.size_file_name+"</td> \
        <td style='border: 1px solid black'> <button id='btn1' name='subject1' onclick=removeRowFromTable("+index+") >Remove</button> </td> \
        <td style='border: 1px solid black'> <button id='btn1' name='subject1' onclick=moveUp("+index+") >Move Down</button> </td> \
        <td style='border: 1px solid black'> <button id='btn1' name='subject2' onclick=moveDown("+index+")   >Move Up</button> </td> \
      </form> \
    </tr> ";
}


function setChromosome(index, chromosome) {
    chromosomes_to_compare[index][1] = chromosome;
}
function setChromosomeName(index, chromosome) {
    chromosomes_to_compare[index][0] = chromosome;
}

function setChromosomeRange(index, start, value) {
    if (start) {
        chromosomes_to_compare[index][3] = value;    
    } else {
        chromosomes_to_compare[index][4] = value;    
    }
}

var selectedGeneInGeneSearch = "";
function searchGene(gene_class, div_id) {

    if (!div_id) {
        div_id = "bar_genomics_graph_div";
    }

    if (gene_class == null) gene_class = selectedGeneInGeneSearch;

    var svg = d3.selectAll("#"+ div_id);


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
    //d3.select("#t" + d[0].gname.split('.').join("")).remove();
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
            gname: linearray[3],
            sign: linearray[5]
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
// Chromosome Plot                                                                                                                 //
//                                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function diplayChromosomesToCompare(genome_list, chromosome_list, div_id) {
    //alert("here");
    if (!div_id) {
        div_id = "chromesome_compare_graph";
    }

    if (!chromosome_list) {
        chromosome_list = chromosomes_to_compare;
    }

    if (!genome_list) {
        genome_list = input_object_list;
    }

    // first 
    var name_1 = chromosome_list[0][0];;
    var chromosome_1 = chromosome_list[0][1];
    var genome_1 = null;
    genome_list.forEach(function(element) {
        if (element.name == name_1) genome_1 = element;
    });
    if (!genome_1) alert("Wrong speciment name for 1st chromosome");
    var bed_file_1 = loadBedFile(genome_1.bed_file_text);
    var size_file_1 = loadSizeFile(genome_1.size_file_text);

    var chromosome_1_size = null;
    size_file_1.forEach(function(element) {
        if (element.chr == chromosome_1) {
            chromosome_1_size = element.size;
        }
    });
    if (!chromosome_1_size) alert("Wrong chromosome name for 1st specimen");


    chromosome_1_gene_list = [];
    bed_file_1.forEach(function(element) {
        if (element.chr == chromosome_1) chromosome_1_gene_list.push(element);
    });

    // second
    var name_2 = chromosome_list[1][0];;
    var chromosome_2 = chromosome_list[1][1];
    var genome_2 = null;
    genome_list.forEach(function(element) {
        if (element.name == name_2) genome_2 = element;
    });
    if (!genome_2) alert("Wrong speciment name for 2nd chromosome");
    var bed_file_2 = loadBedFile(genome_2.bed_file_text);
    var size_file_2 = loadSizeFile(genome_2.size_file_text);

    var chromosome_2_size = null;
    size_file_2.forEach(function(element) {
        if (element.chr == chromosome_2) {
            chromosome_2_size = element.size;
        }
    });
    if (!chromosome_2_size) alert("Wrong chromosome name for 2nd specimen");

    chromosome_2_gene_list = [];
    bed_file_2.forEach(function(element) {
        if (element.chr == chromosome_2) chromosome_2_gene_list.push(element);
    });

    function genePair(gene_name, gene_top_start, gene_top_end, gene_bottom_start, gene_botton_end, different_sign) {
        var instance = {};
        instance.gene_name = gene_name;
        instance.gene_top_start = gene_top_start;
        instance.gene_top_end = gene_top_end;
        instance.gene_bottom_start = gene_bottom_start;
        instance.gene_botton_end = gene_botton_end;
        instance.different_sign = different_sign;
        return instance;
    }

    gene_pairs = [];

    chromosome_1_gene_list.forEach(function(gene1) {
        chromosome_2_gene_list.forEach(function(gene2) {
            if (gene1.gname == gene2.gname) {
                var new_gene_pair = new genePair(gene1.gname, gene1.start, gene1.stop, gene2.start, gene2.stop, gene1.sign==gene2.sign);
                gene_pairs.push(new_gene_pair);
            }
        });
    });

////////////////////////////

    // d3 plot: 

    d3.select("#"+div_id).select("svg").remove();

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
        .attr("id", "d3-chr-plot")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var max_bar_width = width;
    var max_chr_size = Math.max(chromosome_1_size, chromosome_2_size);  
    var top_bar_width = chromosome_1_size / max_chr_size * max_bar_width
    var bottom_bar_width = chromosome_2_size / max_chr_size * max_bar_width

    //svg.remove();

    svg.append("rect")
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", top_bar_width)
        .attr("height", 20);

    svg.append("rect")
        .attr("x", 10)
        .attr("y", 200)
        .attr("width", bottom_bar_width)
        .attr("height", 20);

    gene_pairs.forEach(function(pair) {
        // { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
        // { "x": 40,  "y": 10}, { "x": 60,  "y": 40},
        // { "x": 80,  "y": 5},  { "x": 100, "y": 60}];
        var top_y = 30;
        var bottom_y = 200;
        var top_x_factor = top_bar_width / chromosome_1_size;
        var bottom_x_factor = bottom_bar_width / chromosome_2_size;
        var lineData = [];


        lineData.push({"x": Math.ceil(pair.gene_top_start*top_x_factor), "y":top_y});
        lineData.push({"x": Math.ceil(pair.gene_top_end*top_x_factor), "y":top_y});

        if (pair.different_sign) {
            lineData.push({"x": Math.ceil(pair.gene_botton_end*bottom_x_factor), "y":bottom_y});            
            lineData.push({"x": Math.ceil(pair.gene_bottom_start*bottom_x_factor), "y":bottom_y});
        } else {
            lineData.push({"x": Math.ceil(pair.gene_bottom_start*bottom_x_factor), "y":bottom_y});
            lineData.push({"x": Math.ceil(pair.gene_botton_end*bottom_x_factor), "y":bottom_y});            
        }

        var lineFunction = d3.svg.line()
                         .x(function(d) { return d.x; })
                         .y(function(d) { return d.y; })
                         .interpolate("linear");


        svg.append("path")
            .attr("d", lineFunction(lineData))
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "blue")

        .on("mouseover", function(d, i) {   
            svg.append("text").attr({
                        x: function() {
                            return  Math.ceil(pair.gene_top_end*bottom_x_factor);
                        },
                        y: function() {
                            return top_y+30;
                        }
                    })
                    .text(function() {
                        return pair.gene_name // Gene name
                    });
        })
        .on("mouseout", function(d, i) {
            svg.select("text").remove();
        });


    });
/////////////////////////

    console.log(gene_pairs);

    console.log("in diplayChromosomesToCompare " + chromosome_1_gene_list.length + " " + chromosome_2_gene_list.length)




}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                                 //
// Bar Plot                                                                                                                        //
//                                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function plotGenomicsBarGraph(genome_list, div_id) {
  
    //alert("here");
    if (!div_id) {
        div_id = "bar_genomics_graph_div";
    }

    if (!genome_list) {
        genome_list = input_object_list;
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




