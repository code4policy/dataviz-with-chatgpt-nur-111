// Set the dimensions and margins of the graph
let margin = {top: 40, right: 30, bottom: 30, left: 250};
let width = 900 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

let showAll = false; // Track whether we're showing all data

// Append the svg object to the body of the page
let svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Add the title
d3.select("#chart svg").append("text")
    .attr("x", (width + margin.left + margin.right) / 2)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .style("fill", "#e74c3c")
    .text("The Top 10 Reasons for 311 Calls in the Past Year");

// Load the data from the CSV file
d3.csv("boston_311_2025_by_reason.csv").then(data => {
    // Convert count strings to numbers
    const allData = data.map(d => ({reason: d.reason, count: +d.Count}))
        .sort((a, b) => b.count - a.count);

    function updateChart(dataToShow) {
        // Remove previous chart elements
        svg.selectAll(".bar").remove();
        svg.selectAll(".bar-label").remove();
        svg.selectAll(".axis").remove();

        // Recalculate height based on data length
        const newHeight = Math.max(400, dataToShow.length * 25);
        d3.select("#chart svg")
            .attr("height", newHeight + margin.top + margin.bottom);

        // Update the main svg group's height attribute
        d3.select("#chart svg")
            .style("height", "auto");

        // Set the x and y scales
        const y = d3.scaleBand()
            .domain(dataToShow.map(d => d.reason))
            .range([newHeight, 0])
            .padding(0.1);

        const x = d3.scaleLinear()
            .domain([0, d3.max(dataToShow, d => d.count)])
            .nice()
            .range([0, width]);

        // Add the x-axis (bottom, for counts)
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0, ${newHeight})`)
            .call(d3.axisBottom(x));

        // Add the y-axis (left, for reasons)
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("font-size", "11px");

        // Create bars
        svg.selectAll(".bar")
            .data(dataToShow)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", d => y(d.reason))
            .attr("width", d => x(d.count))
            .attr("height", y.bandwidth());

        // Add text labels at the end of bars
        svg.selectAll(".bar-label")
            .data(dataToShow)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", d => x(d.count) + 5)
            .attr("y", d => y(d.reason) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .text(d => d.count);
    }

    // Initial chart with top 10
    const top10 = allData.slice(0, 10);
    updateChart(top10);

    // Add button toggle functionality
    d3.select("#toggleBtn").on("click", function() {
        showAll = !showAll;
        const dataToShow = showAll ? allData : top10;
        const buttonText = showAll ? "Show Top 10" : "Show All Reasons";
        d3.select(this).text(buttonText);

        // Update SVG height
        const newHeight = Math.max(400, dataToShow.length * 25);
        d3.select("#chart svg").attr("height", newHeight + margin.top + margin.bottom);
        
        updateChart(dataToShow);
    });
});