/**
 * To visualize a percent of people, shows a static row of people images
 * lighting up. e.g. 4 of 5 people light up to show 80%.
 */
PeopleDisplay = function(_parentElement, _numerator, _denominator) {
  this.parentElement = _parentElement;
  this.numerator = _numerator;
  this.denominator = _denominator;

  this.width = 400;
  this.height = 200;

  this.nodeSize = 80;
  this.nodePadding = 10;

  // this.render();
  this.initVis();
};

PeopleDisplay.prototype.initVis = function() {
  var vis = this;

  // make static data
  // have `denominator` objects, of which `numerator` are lit up
  vis.people = [];
  for (var i = 0; i < vis.denominator; i++) {
    var person = {
      active: i < vis.numerator
    };
    vis.people.push(person);
  }

  // make svg
  vis.svg = d3.select("#" + vis.parentElement)
    .append("svg")
    .attr({
      width: vis.width,
      height: vis.height
    })
    .append("g");
  // .attr("transform", "translate(70,70)");

  // make grid layout
  vis.grid = d3.layout.grid()
    .bands()
    .nodeSize([vis.nodeSize, vis.nodeSize])
    .padding([vis.nodePadding, vis.nodePadding]);
};

PeopleDisplay.prototype.render = function() {
  var vis = this;

  // draw rects with solid color that fades
  // draw a cut-out woman image on top of the rect so that it looks like
  // we have a woman whose color is fading

  // draw rects in the background
  var rect = vis.svg.selectAll(".rect")
    .data(vis.grid(vis.people));

  // enter
  rect.enter()
    .append("rect")
    .attr("class", "rect")

  // update
  // offset rectangle within woman to avoid rect going beyond edges of woman imag
  var rectInnerPadding = vis.nodeSize / 10;
  rect
    .attr("width", vis.grid.nodeSize()[0] - rectInnerPadding)
    .attr("height", vis.grid.nodeSize()[1] - rectInnerPadding)
    .attr("transform", function(d) {
      return "translate(" + (d.x + (rectInnerPadding / 2)) + "," + (d.y + (
        rectInnerPadding / 2)) + ")";
    })
    .attr("fill", "gray");

  // transition the fill
  rect.transition()
    .delay(function(d, i) {
      // fill in one at a time
      // wait time in milliseconds
      return i * 750;
    })
    .attr("fill", function(d) {
      var color = d.active ? "red" : "gray";
      return color;
    });

  // exit
  rect.exit()
    .transition()
    .remove();



  // DRAW WOMAN IMAGE
  var image = vis.svg.selectAll(".image")
    .data(vis.grid(vis.people));

  // enter
  image.enter()
    .append("image")
    .attr("class", "image")

  // update
  image
    .attr("width", vis.grid.nodeSize()[0])
    .attr("height", vis.grid.nodeSize()[1])
    .attr("transform", function(d) {
      return "translate(" + (d.x) + "," + d.y + ")";
    })
    .attr("xlink:href", "images/woman-outline.png");

  // exit
  image.exit()
    .transition()
    .remove();

}
