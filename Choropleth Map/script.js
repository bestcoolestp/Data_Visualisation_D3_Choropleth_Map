const educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let educationData;
let countyData;

let canvas = d3.select("#canvas");
let tooltip = d3.select("#tooltip");
                


let drawMap = () => {
    canvas.selectAll("path")
            .data(countyData)
            .enter()
            .append("path") 
            .attr("d", d3.geoPath())
            .attr("class", "county")
            .attr("fill", (countyDataItem) => {
                // get the county fips code
                let id = countyDataItem.id;
                // get the county data
                let county = educationData.find((item) => {
                    return item.fips === id;
                })
                // get the percentage of bachelor or higher
                let percentage = county.bachelorsOrHigher;
                // return the color
                if (percentage <= 15) {
                    return "crimson";
                } else if (percentage <= 30) {
                    return "orange";
                } else if (percentage <= 45) {
                    return "lightgreen";
                } else {
                    return "green";
                }
                })
            .attr("data-fips", (countyDataItem) => {
                return countyDataItem.id;
                })
            .attr("data-education", (countyDataItem) => {
                let id = countyDataItem.id;
                let county = educationData.find((item) => {
                    return item.fips === id;
                })
                let percentage = county.bachelorsOrHigher;
                return percentage;
                })
            .on("mouseover", (countyDataItem) => {
                    tooltip.transition()
                            .style("visibility", "visible");
                    let id = countyDataItem.id;
                    let county = educationData.find((item) => {
                        return item.fips === id;
                    })
                    tooltip.text(county.fips + " - " + county.area_name + ", " + county.state + ' : '+ county.bachelorsOrHigher + "%");
                    tooltip.attr("data-education", county.bachelorsOrHigher);
                })
            .on("mouseout", (countyDataItem) => {
                    tooltip.transition()
                            .style("visibility", "hidden");
            })
}


// to fetch data from the API. not this time with xmlHttpRequest but with d3.json
d3.json(countyURL).then((data, error) => {
    if (error) {
        console.log(error);
    } else {
        // gojson format into topojson format with topojson.feature
        countyData = topojson.feature(data, data.objects.counties).features;
        console.log(countyData);

        d3.json(educationURL).then((data, error) => {
            if (error) {
                console.log(error);
            } else {
                educationData = data;
                console.log(educationData);
                drawMap();
            }
        })
    }
})

