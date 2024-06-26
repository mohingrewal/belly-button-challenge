<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>D3 Bar Chart</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
<div>
    <!-- Dropdown menu -->
    <select id="selDataset"></select>

    <!-- Bar chart container -->
    <div id="bar-chart"></div>

    <script>
        // Fetch JSON data
        d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {
            // Parse data
            var samples = data.samples;
            var names = data.names;

            // Populate dropdown menu with names
            var dropdown = d3.select("#selDataset");
            names.forEach(function(name) {
                dropdown.append("option").text(name).property("value", name);
            });

            // Function to update bar chart
            function updateBarChart(selectedName) {
                var sample = samples.find(sample => sample.id === selectedName);
                var top10OTUs = sample.otu_ids.slice(0, 10).map(id => "OTU " + id);
                var top10Values = sample.sample_values.slice(0, 10);
                var top10Labels = sample.otu_labels.slice(0, 10);

                // Create horizontal bar chart
                var margin = {top: 60, right: 30, bottom: 80, left: 150}; // Adjusted margin for the title
                var width = 800 - margin.left - margin.right;
                var height = 400 - margin.top - margin.bottom;

                var svg = d3.select("#bar-chart")
                            .append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // Title
                svg.append("text")
                   .attr("x", width / 2)
                   .attr("y", -30)
                   .attr("text-anchor", "middle")
                   .style("font-size", "18px")
                   .text("Top 10 Bacteria Cultures Found");

                var x = d3.scaleLinear()
                          .domain([0, d3.max(top10Values)])
                          .range([0, width]);

                var y = d3.scaleBand()
                          .domain(top10OTUs)
                          .range([0, height])
                          .padding(0.1);

                var yAxis = d3.axisLeft(y);
                var xAxis = d3.axisBottom(x).tickSizeOuter(0);

                svg.append("g")
                   .attr("class", "y-axis")
                   .call(yAxis);

                svg.append("g")
                   .attr("class", "x-axis")
                   .attr("transform", "translate(0," + height + ")")
                   .call(xAxis)
                   .append("text")  // Add bottom axis title
                   .attr("x", width / 2)
                   .attr("y", 50)
                   .attr("fill", "#000")
                   .attr("text-anchor", "middle")
                   .text("Number of Bacteria");

                svg.selectAll(".bar")
                   .data(top10Values)
                   .enter().append("rect")
                   .attr("class", "bar")
                   .attr("x", 0)
                   .attr("y", function(d, i) { return y(top10OTUs[i]); })
                   .attr("width", function(d) { return x(d); })
                   .attr("height", y.bandwidth())
                   .attr("fill", "steelblue")
                   .append("title")
                   .text(function(d, i) { return top10Labels[i]; });
            }

            // Initial update with the first sample
            updateBarChart(names[0]);

            // Update chart when dropdown selection changes
            dropdown.on("change", function() {
                var selectedName = this.value;
                d3.select("#bar-chart").select("svg").remove(); // Remove existing chart
                updateBarChart(selectedName);
            });
        }).catch(function(error) {
            console.error("Error fetching data:", error);
        });
    </script>
</div>


<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bubble Chart</title>
    <!-- Load Plotly.js -->
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</head>
<div>
    <!-- Dropdown menu -->
    <select id="selDataset"></select>

    <!-- Bubble chart container -->
    <div id="bubble-chart"></div>

    <!-- Metadata panel -->
    <div id="sample-metadata"></div>

    <script>
        // Function to update bubble chart and metadata
        function updateCharts(selectedName) {
            // Fetch JSON data
            fetch("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
            .then(response => response.json())
            .then(function(data) {
                var samples = data.samples;
                var metadata = data.metadata;

                // Find sample data for selected name
                var sample = samples.find(sample => sample.id === selectedName);
                var sampleMetadata = metadata.find(item => item.id === parseInt(selectedName));

                // Bubble chart data
                var trace = {
                    x: sample.otu_ids,
                    y: sample.sample_values,
                    text: sample.otu_labels,
                    mode: 'markers',
                    marker: {
                        size: sample.sample_values,
                        color: sample.otu_ids,
                        colorscale: 'Earth'
                    }
                };

                var layout = {
                    title: 'Bubble Chart',
                    xaxis: { title: 'OTU ID' },
                    yaxis: { title: 'Sample Values' }
                };

                Plotly.newPlot('bubble-chart', [trace], layout);

                // Update metadata panel
                var metadataPanel = document.getElementById('sample-metadata');
                metadataPanel.innerHTML = ''; // Clear existing metadata

                // Loop through metadata and create text string
                Object.entries(sampleMetadata).forEach(([key, value]) => {
                    var p = document.createElement('p');
                    p.innerText = `${key}: ${value}`;
                    metadataPanel.appendChild(p);
                });
            })
            .catch(function(error) {
                console.error("Error fetching data:", error);
            });
        }

        // Populate dropdown menu
        fetch("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
        .then(response => response.json())
        .then(function(data) {
            var names = data.names;
            var dropdown = document.getElementById('selDataset');
            names.forEach(function(name) {
                var option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                dropdown.appendChild(option);
            });

            // Initial update with the first sample
            updateCharts(names[0]);

            // Update charts when dropdown selection changes
            dropdown.addEventListener('change', function() {
                var selectedName = this.value;
                updateCharts(selectedName);
            });
        })
        .catch(function(error) {
            console.error("Error fetching data:", error);
        });
    </script>
    </div>
</body>
</html>

