const bossamaps = {
    renderSVG(mobile, svgName) {
      const svgPath = !mobile ? `https://api.iitrtclab.com/images/svgs/${svgName}-R.svg` : `https://api.iitrtclab.com/images/svgs/${svgName}.svg`;
  
      d3.xml(svgPath, function (xml) {
        try {
          $('.svgContainer').empty();
          $('.svgContainer').append(xml.documentElement);
          const svg = d3.select('svg');
          svg.attr('width', '100%');
          svg.attr('height', !mobile ? '87vh' : '100%');
        } catch (e) {
          throw new Error(e);
        }
      });
    },
  
    renderBossaBeacons(building, floor, mobile) {
      $.get(`https://api.iitrtclab.com/beacons/${building}/${floor}`).then((beacons) => {
        console.log(beacons);
        beacons.forEach((beacon) => {
          this.setBeaconWithTooltips(beacon, mobile);
        });
      });
    },
  
    mapX(x) {
      const origin = d3.select('.origin').filter('path').node().getBBox();
      const originTop = d3.select('.originTop').filter('path').node().getBBox();
      const in_min = 0;
      const in_max = parseFloat(d3.select('svg').attr('data-width'), 10);
      const out_min = origin.x;
      const out_max = originTop.x + originTop.width;
      return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    },
  
    inverseMapX(svgX) {
      const origin = d3.select('.origin').filter('path').node().getBBox();
      const originTop = d3.select('.originTop').filter('path').node().getBBox();
      const in_min = origin.x;
      const in_max = originTop.x + originTop.width;
      const out_min = 0;
      const out_max = parseFloat(d3.select('svg').attr('data-width'), 10);
      return (svgX - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    },
  
    mapY(y) {
      const origin = d3.select('.origin').filter('path').node().getBBox();
      const originTop = d3.select('.originTop').filter('path').node().getBBox();
      const in_min = 0;
      const in_max = parseFloat(d3.select('svg').attr('data-height'), 10);
      const out_min = origin.y + origin.height;
      const out_max = originTop.y;
      return (y - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    },
  
    inverseMapY(svgY) {
      const origin = d3.select('.origin').filter('path').node().getBBox();
      const originTop = d3.select('.originTop').filter('path').node().getBBox();
      const in_min = origin.y + origin.height;
      const in_max = originTop.y;
      const out_min = 0;
      const out_max = parseFloat(d3.select('svg').attr('data-height'), 10);
      return (svgY - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    },
  
    returnRGBColor(temp) {
      if (!temp) {
        return 'rgb(159, 161, 165)';
      }
      let max = 50;
      let avg = temp/max;
      let red = Math.round(avg*255);
      let green = avg >= 0.5 ? 1 : 0;
      let blue = Math.round((1 - avg) * 255);
      return `rgb(${red}, ${green}, ${blue})`;
    },
  
    renderBeacon(x, y, beacon) {
  
      var group = d3.select('svg').append('g').attr('class', 'beacons').attr('id', `${beacon.beacon_id}`);
  
      group.append('circle')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 15);
  
      group.append('circle')
        .attr('class', 'mainCircle')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .on('mouseover', function () {
          d3.select(this).transition()
            .duration(300)
            .attr("r", "100");
        })
        .on('mouseout', function () {
          d3.select(this).transition()
            .duration(300)
            .attr("r", "50");
        })
        .style("fill", 'rgb(13, 138, 221)')
        .style("fill-opacity", "0.6")
        .style("stroke", "black")
        .style("stroke-dasharray", "80, 50")
        .style("stroke-width", "8")
        .transition()
        .duration(300)
        .attr("r", 50)
        .attr("transform", "rotate(180deg)")
    },
  
    renderBeaconWithTooltips (x, y, beacon) {
      d3.select('svg').append('circle')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 1);
  
      d3.select('svg').append('circle')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .attr("data-toggle", "tooltip")
        .attr("title", `Temperature: ${beacon.temperature}Â°C \nHumidity: ${beacon.humidity}%\nLast Updated: ${moment(beacon.updatetimestamp).format('MMMM Do YYYY, h:mm:ss a')}`)
        .on('mouseover', function() {
          d3.select(this).transition()
            .duration(300)
            .attr("r", "9");
          $(this).tooltip();
          $(this).tooltip('show');
        })
        .on('mouseout', function () {
          d3.select(this).transition()
            .duration(300)
            .attr("r", "4.5");
        })
        .style("fill", this.returnRGBColor(beacon.temperature))
        .style("fill-opacity", "0.6")
        .style("stroke", "black")
        .style("stroke-dasharray", "9, 3")
        .style("stroke-width", "0.75")
        .transition()
        .duration(300)
        .attr("r", 4.5)
        .attr("transform", "rotate(180deg)");
    },
  
    setBeacon(beacon, mobile) {
      console.log(this);
      if (mobile) {
        this.renderBeacon(this.mapX(beacon.x), this.mapY(beacon.y), beacon);
      } else {
        const newX = this.mapX(parseFloat(d3.select('svg').attr('data-width'), 10)) - this.mapX(beacon.x);
        this.renderBeacon(this.mapY(beacon.y), newX, beacon);
      }
    },
  
    setBeaconWithTooltips(beacon, mobile) {
      if (mobile) {
        this.renderBeaconWithTooltips(this.mapX(beacon.x), this.mapY(beacon.y), beacon);
      } else {
        const newX = this.mapX(parseFloat(d3.select('svg').attr('data-width'), 10)) - this.mapX(beacon.x);
        this.renderBeaconWithTooltips(this.mapY(beacon.y), newX, beacon);
      }
    },
  
    // Gets aspect ratio for SVG Map. Should be same as real aspect ration of building floor.
    getAspectRatio() {
      const origin = d3.select('.origin').filter('path').node().getBBox();
      const originTop = d3.select('.originTop').filter('path').node().getBBox();
      return ((origin.y + origin.height) - originTop.y) / ((originTop.x + originTop.width) - origin.x)
    },
  
    // Gets aspect ratio for real building floor from meta-data embedded in SVG maps
    getRealAspectRatio() {
      return parseFloat(d3.select('svg').attr('data-height'), 10)/parseFloat(d3.select('svg').attr('data-width'), 10)
    }
  
   
  };
  