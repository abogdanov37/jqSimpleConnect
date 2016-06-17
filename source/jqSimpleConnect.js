/* START jqSimpleConnect.js */
/* START jqSimpleConnect.js */
/*
 * «Copyright 2012 José F. Maldonado»
 *
 *  jqSimpleConnect is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published 
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  jqSimpleConnect is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with jqSimpleConnect. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Declare namespace
 */
jqSimpleConnect = new Object();

/**
 * This member is an auxiliary counter used for generate unique identifiers.
 */
jqSimpleConnect._idGenerator = 0;

/**
 * This member is an associative array which contains all the document's connections.
 */
jqSimpleConnect._connections = new Object();

/**
 * Positions a connection, acording to the position of the elements which connects.
 * 
 * @param {object} connection A connection object.
 */
jqSimpleConnect._positionConnection = function(connection) {
    // Calculate the positions of the element's center.
    var posA = connection.elementFrom.offset();
    posA.left = parseInt(posA.left, 10);
    posA.top = parseInt(posA.top, 10);
    posA.width = parseInt(connection.elementFrom.outerWidth(), 10);
    posA.height = parseInt(connection.elementFrom.outerHeight(), 10);

    var posB = connection.elementTo.offset();
    posB.left = parseInt(posB.left, 10);
    posB.top = parseInt(posB.top, 10);
	posB.width = parseInt(connection.elementTo.outerWidth(), 10);
    posB.height = parseInt(connection.elementTo.outerHeight(), 10);
	
	// Create HTML elements.
    var div = '<div id="divUniqueIdentifier" class="jqSimpleConnect '+connection.id+'" ' + 
              'style="width:'+connection.radius+'px; ' +
                     'height:'+connection.radius+'px; ' +
                     'background-color:'+connection.color+'; ' +
                     (connection.roundedCorners? 'border-radius:'+parseInt(connection.radius/2,10)+'px; -webkit-border-radius:'+parseInt(connection.radius/2,10)+'px; -moz-border-radius:'+parseInt(connection.radius/2,10)+'px; ' : '') + 
                     'position:absolute; z-index: 9999998;"></div>';
    	
	if (connection.path) {
		var previousCorner = null;
		for (var idx = 0; idx < connection.path.length; idx++) {
			var step = connection.path[idx];
			var line = $(div.replace('divUniqueIdentifier', connection.id + '_'+idx)).appendTo(jQuery('body'));
			switch (step.direction) {
				case "left": 
					var corner = {height: connection.radius,
								  width: connection.radius};
					if (idx == connection.path.length - 1) {
						jqSimpleConnect._positionHorizontalLine(line, posB, previousCorner, connection.radius, step.direction, connection.gapAfter);
						jqSimpleConnect._addArrow(posB.left - connection.gapAfter, posB.top + posB.height / 2, step.direction, connection.id);
					} else if (!previousCorner) {
						corner.top = posA.top + posA.height / 2;
						if (step.width) {
							corner.left = posA.left - step.width;
						} else {
							var nextStep = connection.path[idx + 1];
							corner.left = nextStep.left;
						}
						jqSimpleConnect._positionHorizontalLine(line, posA, corner, connection.radius, step.direction, connection.gapBefore);
						previousCorner = corner;
					} else {
						corner.top = previousCorner.top;
						if (step.width) {
							corner.left = previousCorner.left - step.width;
						} else {
							var nextStep = connection.path[idx + 1];
							if (idx + 1 == connection.path.length - 1) {
								switch (nextStep.direction) {
									case "up": 
									case "down": {
										corner.left = posB.left + posB.width / 2;
										break;
									}
									case "left": {
										corner.left = posB.left;
										break;
									}
									case "right": {
										corner.left = posB.left + posB.width;
										break;
									}
								}
							} else {
								corner.left = nextStep.left;
							}
						}
						jqSimpleConnect._positionHorizontalLine(line, previousCorner, corner, connection.radius, step.direction, 0);
						previousCorner = corner;
					}
					break;
				case "right": {
					var corner = {height: connection.radius,
								  width: connection.radius};
					if (idx == connection.path.length - 1) {
						jqSimpleConnect._positionHorizontalLine(line, posB, previousCorner, connection.radius, step.direction, connection.gapAfter);
						jqSimpleConnect._addArrow(posB.left + posB.width + connection.gapAfter, posB.top + posB.height / 2, step.direction, connection.id);
					} else if (!previousCorner) {
						corner.top = posA.top + posA.height / 2;
						if (step.width) {
							corner.left = posA.left + posA.width + step.width + connection.gapBefore;
						} else {
							var nextStep = connection.path[idx + 1];
							corner.left = nextStep.left;
						}
						jqSimpleConnect._positionHorizontalLine(line, posA, corner, connection.radius, step.direction, connection.gapBefore);
						previousCorner = corner;
					} else {
						corner.top = previousCorner.top;
						if (step.width) {
							corner.left = previousCorner.left + step.width;
						} else {
							var nextStep = connection.path[idx + 1];
							if (idx + 1 == connection.path.length - 1) {
								switch (nextStep.direction) {
									case "up": 
									case "down": {
										corner.left = posB.left + posB.width / 2;
										break;
									}
									case "left": {
										corner.left = posB.left;
										break;
									}
									case "right": {
										corner.left = posB.left + posB.width;
										break;
									}
								}
							} else {
								corner.left = nextStep.left;
							}
						}
						jqSimpleConnect._positionHorizontalLine(line, previousCorner, corner, connection.radius, step.direction, 0);
						previousCorner = corner;
					}
					break;	
				}
				case "up" : {
					var corner = {width: connection.radius,
								  height: connection.radius};
					if (idx == connection.path.length - 1) {
						jqSimpleConnect._positionHorizontalLine(line, posB, previousCorner, connection.radius, step.direction, connection.gapAfter);
						jqSimpleConnect._addArrow(posB.left + posB.width / 2, posB.top - connection.gapAfter, step.direction, connection.id);
					} else if (!previousCorner) {
						corner.left = posA.left + posA.width / 2;
						if (step.width) {
							corner.top = posA.top - step.width;
						} else {
							var nextStep = connection.path[idx + 1];
							corner.top = nextStep.top;
						}
						jqSimpleConnect._positionVerticalLine(line, posA, corner, connection.radius, step.direction, connection.gapBefore);
						previousCorner = corner;
					} else {
						corner.left = previousCorner.left;
						if (step.width) {
							corner.top = previousCorner.top - step.width;
						} else {
							var nextStep = connection.path[idx + 1];
							if (idx + 1 == connection.path.length - 1) {
								switch (nextStep.direction) {
									case "left": 
									case "right": {
										corner.top = posB.top + posB.height / 2;
										break;
									}
									case "up": {
										corner.top = posB.top;
										break;
									}
									case "down": {
										corner.top = posB.top + posB.height;
										break;
									}
								}
							} else {		
								corner.top = nextStep.top;
							}
						}
						jqSimpleConnect._positionVerticalLine(line, previousCorner, corner, connection.radius, step.direction, 0);
						previousCorner = corner;
					}
					break;
				}
				case "down": {
					var corner = {width: connection.radius,
								  height: connection.radius};
					if (idx == connection.path.length - 1) {
						jqSimpleConnect._positionHorizontalLine(line, posB, previousCorner, connection.radius, step.direction, connection.gapAfter);
						jqSimpleConnect._addArrow(posB.left + posB.width / 2, posB.top + posB.height + connection.gapAfter, step.direction, connection.id);
					} else if (!previousCorner) {
						corner.left = posA.left + posA.width / 2;
						if (step.width) {
							corner.top = posA.top + posA.height + step.width + connection.gapBefore;
						} else {
							var nextStep = connection.path[idx + 1];
							corner.top = nextStep.top;
						}
						jqSimpleConnect._positionVerticalLine(line, posA, corner, connection.radius, step.direction, connection.gapBefore);
						previousCorner = corner;
					} else {
						corner.left = previousCorner.left;
						if (step.width) {
							corner.top = previousCorner.top + step.width;
						} else {
							var nextStep = connection.path[idx + 1];
							if (idx + 1 == connection.path.length - 1) {
								switch (nextStep.direction) {
									case "left": 
									case"right": {
										corner.top = posB.top + posB.height / 2;
										break;
									}
									case "up": {
										corner.top = posB.top;
										break;
									}
									case "down": {
										corner.top = posB.top + posB.height;
										break;
									}
								}
							} else {		
								corner.top = nextStep.top;
							}
						}
						jqSimpleConnect._positionVerticalLine(line, previousCorner, corner, connection.radius, step.direction, 0);
						previousCorner = corner;
					}
					break;
				} 
					
				break;
			}
		}
	}	
}

/**
 * Draws a arrow at the end of line.
 *
 *@param {integer} left X coordinate.
 *@param {integer} top Y coordinate.
 *@param {sting} direction representing the direction of the line.
 *@param {string} connectionId Identifier of current connection.
 */
jqSimpleConnect._addArrow = function(left, top, direction, connectionId) {
    var arrow = $('<div class="jqSimpleConnect '+connectionId+'"></div>').appendTo(jQuery('body'));
	arrow.addClass("arrow");
	
	switch (direction) {	
		case "left": {
			arrow.addClass("right");
			arrow.css('top', (top - 4)  + 'px');
			arrow.css('left', (left - 3) + 'px');
			break;
		}
		case "right": {
			arrow.addClass("left");
			arrow.css('top', (top - 4) + 'px');
			arrow.css('left', (left - 3) + 'px');
			break;
		}
		case "up": {
			arrow.addClass("down");
			arrow.css('top', top + 'px');
			arrow.css('left', (left - 4) + 'px');
			break;
		}
		case "down": {
			arrow.addClass("up");
			arrow.css('top', (top - 3) + 'px');
			arrow.css('left', (left - 4) + 'px');
			break;
		}
    }
	return arrow;
}

/**
 * Draws a vertical line, between the two points, by changing the properties of a HTML element.
 *
 *@param {object} jqLineElement A jQuery object of the HTML element used for represent the line.
 *@param {object} point1 An object with the properties 'left' and 'top' representing the position of the first point.
 *@param {object} point2 An object with the properties 'left' and 'top' representing the position of the second point.
 *@param {integer} radius The line's radius.
 *@param {boolean} roundedCorners A boolean indicating if the corners are going to be round.
 */
jqSimpleConnect._positionVerticalLine = function(jqLineElement, point1, point2, radius, elementAnchor, lineGap) {
    var halfRadius = parseInt(radius/2, 10);
   	jqLineElement.css('left', (point1.left + (parseInt(point1.width / 2, 10) - halfRadius)) + 'px');
   	jqLineElement.css('width', radius + 'px');
   	if (elementAnchor == "up") {
   		jqLineElement.css('top', (point2.top - halfRadius) + 'px');
   		jqLineElement.css('height', (point1.top - point2.top - lineGap + radius) + 'px');
   	} else if (elementAnchor == 'down') {
  		jqLineElement.css('top', (point1.top + point1.height + lineGap) + 'px');
   		jqLineElement.css('height', (point2.top - point1.top - point1.height - lineGap + radius) + 'px');	
	}
}

/**
 * Draws a horizontal line, between the two points, by changing the properties of a HTML element.
 *
 *@param {object} jqLineElement A jQuery object of the HTML element used for represent the line.
 *@param {object} point1 An object with the properties 'left' and 'top' representing the position of the first point.
 *@param {object} point2 An object with the properties 'left' and 'top' representing the position of the second point.
 *@param {integer} radius The line's radius.
 *@param {boolean} roundedCorners A boolean indicating if the corners are going to be round.
 */
jqSimpleConnect._positionHorizontalLine = function (jqLineElement, point1, point2, radius, elementAnchor, lineGap) {
	var halfRadius = parseInt(radius / 2, 10);
	jqLineElement.css('top', (point1.top + (parseInt(point1.height / 2, 10) - halfRadius)) + 'px');
	jqLineElement.css('height', radius + 'px');
	if (elementAnchor == "left") {
		jqLineElement.css('left', (point2.left - halfRadius) + 'px');
		jqLineElement.css('width', (point1.left - point2.left - lineGap + radius) + 'px');
	} else if (elementAnchor == "right") {
		jqLineElement.css('left', (point1.left + point1.width + lineGap) + 'px');
		jqLineElement.css('width', (point2.left - point1.left - point1.width - lineGap + radius) + 'px');
	}
}

/**
 * Draws a connection between two elements.
 *
 * @param {object} elementFrom A CSS selector or a jQuery's object for select the first element.
 * @param {object} elementTo A CSS selector or a jQuery's object for select the second element.
 * @param {object} options An associative array with the properties 'color' (which defines the color of the connection), 'radius' (the width of the
 * connection), 'roundedCorners' (a boolean indicating if the corners must be round), 'anchorA' (the anchor type of the first element, which can be 
 * 'horizontal' or 'vertical') and 'anchorB' (the anchor type of second element).
 * @returns {string} The connection identifier or 'null' if the connection could not be draw.
 */
jqSimpleConnect.connect = function(elementFrom, elementTo, options) {
    // Verify if the element's selector are ok.
    if(elementFrom == null || jQuery(elementFrom).size() == 0 ||
       elementTo == null || jQuery(elementTo).size() == 0) {
       return null;
       }

    elementFrom = jQuery(elementFrom);
    if(elementFrom.size() > 1) elementFrom = elementFrom.first();
    elementTo = jQuery(elementTo);
    if(elementTo.size() > 1) elementTo = elementTo.first();

    // Create connection object.
    var connection = new Object();
    connection.id = 'jqSimpleConnect_' + jqSimpleConnect._idGenerator++;
    connection.elementFrom = elementFrom;
    connection.elementTo = elementTo;
    connection.color = (options != null && options.color != null)? options.color + '' : '#808080';
    connection.radius = (options != null && options.radius != null && !isNaN(options.radius))? parseInt(options.radius, 10) : 5;
    connection.path = options.path;
    connection.gapBefore = (options != null && options.gapBefore != null && !isNaN(options.gapBefore))? parseInt(options.gapBefore, 10) : 10;;
    connection.gapAfter = (options != null && options.gapAfter != null && !isNaN(options.gapAfter))? parseInt(options.gapAfter, 10) : 10;;
    connection.roundedCorners = options != null && options.roundedCorners != null && (options.roundedCorners == true || options.roundedCorners == 'true');

    // Add connection to the connection's list.
    jqSimpleConnect._connections[connection.id] = connection;

    // Position connection.
    jqSimpleConnect._positionConnection(connection);
    
	var resizeId;
	$(window).resize(function() {
		clearTimeout(resizeId);
		resizeId = setTimeout(jqSimpleConnect.repaintAll, 350);
	});

    // Return result.
    return connection.id;
}

/**
 * Repaints a connection.
 *
 * @param {string} connectionId The connection identifier.
 * @returns {boolean} 'true' if the operation was done, 'false' if the connection no exists.
 */
jqSimpleConnect.repaintConnection = function(connectionId) {
    var connection = jqSimpleConnect._connections[connectionId];
    if(connection != null) {
        jqSimpleConnect._positionConnection(connection);
        return true;
    }
    return false;
}

/**
 * Repaints all the connections.
 */
jqSimpleConnect.repaintAll = function() {
	jQuery('.jqSimpleConnect').remove();
    for(var key in jqSimpleConnect._connections) {
        jqSimpleConnect._positionConnection(jqSimpleConnect._connections[key]);
    }
}

/**
 * Removes a connection.
 *
 * @param {string} connectionId The connection identifier.
 * @returns {boolean} 'true' if the operation was done, 'false' if the connection no exists.
 */
jqSimpleConnect.removeConnection = function(connectionId) {
    if(jqSimpleConnect._connections[connectionId] != null) {
        // Remove HTML element.
        jQuery('.jqSimpleConnect.'+connectionId).remove();
        
        // Remove connection data.
        jqSimpleConnect._connections[connectionId] = null;
        delete jqSimpleConnect._connections[connectionId];
        
        // Return result.
        return true;
    }
    return false;
}

/**
 * Removes all the connections.
 */
jqSimpleConnect.removeAll = function() {
    // Remove HTML elements.
    jQuery('.jqSimpleConnect').remove();
    
    // Clear connections list.
    for(var key in jqSimpleConnect._connections) {
        jqSimpleConnect._connections[key] = null;
        delete jqSimpleConnect._connections[key];
    }
}