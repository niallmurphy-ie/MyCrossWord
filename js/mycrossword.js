
var H5P = H5P || {};

var self;
var total = 0;//cells number
var cells = 0;
var prev_r = -1;//previous row
var prev_c = -1;//previous column
var attemps = 0;//attemps number = number of clicks on "check" button
var ACCENT; var UPPER; var DIFF;
	
function onFocus(ac, dw){
	if(ac != "undefined"){
		(H5P.jQuery("."+ac+" input")).addClass("focused");
		(H5P.jQuery("."+ac)).addClass("focused");
		(H5P.jQuery("."+ac)).select();
		// For Column, select outside iframe when Legend has been moved out
		if (window.location !== window.top.location) {
			(H5P.jQuery("."+ac, parent.document)).css("background", "#f2f2f2");
		}
	}
	if(dw != "undefined"){
		(H5P.jQuery("."+dw+" input")).addClass("focused");//css("backgroundColor", "blue");//
		(H5P.jQuery("."+dw)).addClass("focused");//css("backgroundColor", "red");//
		(H5P.jQuery("."+dw)).select();
		// For Column, select outside iframe when Legend has been moved out
		if (window.location !== window.top.location) {
			(H5P.jQuery("."+dw, parent.document)).css("background", "#f2f2f2");
		}
	}
}
function onBlur(ac, dw){
	if(ac != undefined){
		(H5P.jQuery("."+ac+" input")).removeClass("focused");
		(H5P.jQuery("."+ac)).removeClass("focused");
		// For Column, select outside iframe when Legend has been moved out
		if (window.location !== window.top.location) {
			(H5P.jQuery("."+ac, parent.document)).removeAttr("style");
		}
	}
	if(dw != undefined){
		(H5P.jQuery("."+dw+" input")).removeClass("focused");
		(H5P.jQuery("."+dw)).removeClass("focused");
		if (window.location !== window.top.location) {
			(H5P.jQuery("."+dw, parent.document)).removeAttr("style");
		}
	}
	//prev_c = -1; prev_r = -1;
}
function onClick(ac, dw, r, c){
	if(ac != "undefined"){
		//(H5P.jQuery("#input_"+r+'_'+c)).val('');//+"."+ac+" input"
		(H5P.jQuery("#input_"+r+'_'+c)).select();
	}
	if(dw != "undefined"){
		//(H5P.jQuery("#input_"+r+'_'+c)).val('');//"."+dw+" input"
		(H5P.jQuery("#input_"+r+'_'+c)).select();
	}
	prev_r = -1; prev_c = -1;
}
// Key Fix for Firefox and Mobile | input also rewritten way down
/* 	(H5P.jQuery('body')).on('keyup', '.noselect', function(e) {
		var kCd = e.keyCode || e.which;
		if (kCd == 0 || kCd == 229) { //for android chrome keycode fix
			kCd = getKeyCode(this.value);
		}
		alert(kCd);
	});
	// Helper function
	var getKeyCode = function (str) {
		return str.charCodeAt(str.length - 1);
	} */

function onKey(e, ac, dw, char, r, c){
	var key = e;
	console.log(key, ac, dw, char, r, c);
	switch(key){
		case(8)://back
			if( (H5P.jQuery('#input_'+r+'_'+c)).hasClass("solved")){
				(H5P.jQuery('#input_'+r+'_'+c)).removeClass("solved");
			}
			if(r > prev_r && c <= prev_c){//down word
				if((H5P.jQuery('#input_'+r+'_'+c)).val()==""){
					prev_r = r - 2;
					move(r,c,0,-1,false);
				}
			}
			else if(r <= prev_r && c > prev_c){//across word
				if((H5P.jQuery('#input_'+r+'_'+c)).val()==""){
					prev_c = c - 2;
					move(r,c,-1,0,false);
				}
			}
		break;
		case(37)://left
			prev_c = c - 2;
			move(r, c, -1, 0, false);
		break;
		case(38)://up
			prev_r = r - 2;
			move(r, c, 0, -1, false);
		break;
		case(39)://right
			move(r, c, 1, 0);
		break;
		case(40)://down
			move(r, c, 0, 1);
		break;
		default:
			if((key>47 && key<112) || (key>186 && key<222)){
				var value = (H5P.jQuery('#input_'+r+'_'+c)).val();
				if(!ACCENT){char = normalize(char); value = normalize(value);}
				if(!UPPER){char = char.toUpperCase(); value = value.toUpperCase();}
				
				if(char == value){
					if(!(H5P.jQuery('#input_'+r+'_'+c)).hasClass("solved")){
						(H5P.jQuery('#input_'+r+'_'+c)).addClass("solved");
						total--;
					}
				}
				else{
					if( (H5P.jQuery('#input_'+r+'_'+c)).hasClass("solved")){
						(H5P.jQuery('#input_'+r+'_'+c)).removeClass("solved");
						total++;
					}
				}
				// Keep the same direction
				if(r == prev_r ) move(r,c, 1, 0);
				else if(c == prev_c) move(r,c, 0, 1);
				// 
				else if(ac != "undefined" && dw == "undefined") move(r, c, 1, 0);
				else if(ac == "undefined" && dw != "undefined") move(r, c, 0, 1);
				else if(r > prev_r && c <=prev_c) move(r,c, 0, 1);
				else if(r <= prev_r && c > prev_c) move(r, c, 1, 0);
			}
		break;
	}
	self.triggerXAPI('attempted');
	//check();
}
function move(r, c, ac, dw, replace=true){
	var last = true;
	if(ac!=0){
		var tempc = parseInt(c)+ac;
		if((H5P.jQuery('.'+r+'_'+tempc))!= [] && !((H5P.jQuery('.'+r+'_'+tempc)).hasClass("empty"))){
			(H5P.jQuery('#input_'+r+'_'+tempc)).select();
			(H5P.jQuery('#input_'+r+'_'+tempc)).focus();
			last = false;
		}
	}
	else if(dw!=0){
		var tempr = parseInt(r)+dw;
		if((H5P.jQuery('.'+tempr+'_'+c))!= [] &&!((H5P.jQuery('.'+tempr+'_'+c)).hasClass("empty"))){
			(H5P.jQuery('#input_'+tempr+'_'+c)).select();
			(H5P.jQuery('#input_'+tempr+'_'+c)).focus();
			last = false;
		}
	}
	if(replace && !last) {prev_r = parseInt(r); prev_c = parseInt(c);}
}
function check(){
	if(DIFF == "normal"){(H5P.jQuery(".hide.solved")).removeClass("hide");}
	if (total<1){
		(H5P.jQuery(".hide.solved")).removeClass("hide");
		//alert("Enhorabuena! Has completado el crucigrama");//**cambiar este alert
		self.score(10-(10*total/cells)-(attemps),10, 'completed');
	}
	else {
		self.score(10-(10*total/cells)-(attemps),10, 'completed');
	}
}
var normalize = (function() {//funcion obtenida de http://www.etnassoft.com/2011/03/03/eliminar-tildes-con-javascript/
	var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
		to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
		mapping = {};

	for(var i = 0, j = from.length; i < j; i++ )
		mapping[ from.charAt( i ) ] = to.charAt( i );

	return function( str ) {
		var ret = [];
		for( var i = 0, j = str.length; i < j; i++ ) {
			var c = str.charAt( i );
			if( mapping.hasOwnProperty( str.charAt( i ) ) )
				ret.push( mapping[ c ] );
			else
				ret.push( c );
		}      
		return ret.join( '' );
	}
})();

H5P.CrossWord = (function (EventDispatcher, $) {

	function CrossWord(parameters, id){
		self = this;
		EventDispatcher.call(self);
		
		ACCENT = parameters.accent_mark;
		UPPER = parameters.upper;
		DIFF = parameters.difficulty;
		
		var cross = new CrossWord.CrossWord(parameters.words, id);
		
		self.score = function (score, max, label){
			var xAPIEvent = this.createXAPIEventTemplate('answered');
			xAPIEvent.setScoredResult(score, max, label);
			this.trigger(xAPIEvent);
		}
		self.attach = function($container) {
			var show_answers = false;
			grid = cross.getSquareGrid(20);
			if(grid){
				legend = cross.getLegend(grid);
				var html = "";
				// Bootstrap Adjustment for 8:4 ratio
				html += '<div class="crossword container-fluid" ><div class="row"><div class="crossword_col col-sm-8"><table>';
				this.triggerXAPI('attempted');
				var ac = 1;
				var dw = 1;
				var df = "";
				switch(DIFF){
					case("easy"):
						df = "";
					break;
					case("normal"):
						df = " hide ";
					break;
					case("hard"):
						df = " hide ";
					break;
				}	
				
				var hclasses = [];
				var vclasses = [];
				for (var r = 0; r < grid.length; r++){
					html += "<tr>";
					hclasses.push(new Array(grid[r].length));
					vclasses.push(new Array(grid[r].length));
					for (var c = 0; c < grid[r].length; c++){
						var label = 0;
						var cell = grid[r][c];
						var is_start_of_across_word = false;
						var is_start_of_down_word = false;
						if(cell == null){
							var char = '\xa0';
						}
						else {
							total++;
							var char = cell['char'];
							var is_start_of_across_word = (cell['across'] && cell['across']['is_start_of_word']);
							var is_start_of_down_word = (cell['down'] && cell['down']['is_start_of_word']);
						}
						
						if(is_start_of_across_word && !is_start_of_down_word) {
							html += "<td class='no-border h_word"+ac+" "+r+"_"+c+"' id='" + legend.across[ac-1].clue + "'title='" + legend.across[ac-1].clue + "'>";
							hclasses[r][c]="h_word"+ac;
							label = 1;
							ac++;								
						}
						else if(is_start_of_down_word && !is_start_of_across_word){
							html += "<td class='no-border v_word"+dw+" "+r+"_"+c+"' id='" + legend.down[dw-1].clue + "'title='" + legend.down[dw-1].clue + "'>";
							vclasses[r][c]="v_word"+dw;
							label = 2;
							dw++;								
						}
						else if(is_start_of_across_word && is_start_of_down_word){
							html += "<td class='no-border h_word"+ac+" v_word"+dw+" "+r+"_"+c+"' id='" + legend.down[dw-1].clue + "'title='" + legend.down[dw-1].clue + "'>";
							hclasses[r][c]="h_word"+ac;
							vclasses[r][c]="v_word"+dw;
							label = 3;
							ac++;
							dw++;
						}
						else {
							if(cell == null)
								html += "<td class='no-border empty "+r+"_"+c+"'>";
							else{
								html += "<td class='no-border ";
								if(cell['across']) html += hclasses[r][c-1]+" ";hclasses[r][c]=hclasses[r][c-1];
								if(cell['down'] && typeof vclasses[r-1][c] !== typeof undefined )   html += vclasses[r-1][c]+" ";vclasses[r][c]=vclasses[r-1][c];
								html +=  r+"_"+c+"'>";
								if (typeof vclasses[r-1][c] === typeof undefined) {
									console.log('find undefined');
								}
							}
						}
						if(show_answers  && char != '\xa0') {
							html += ('<input type="text" maxlength="1" class="noselect solved" id ="input_'+r+'_'+c+'" maxlength="1" value="'+char+'" type="text" tabindex="-1" onfocus="onFocus(\''+ 
							hclasses[r][c]+'\', \''+ vclasses[r][c]+'\')" onblur="onBlur(\''+hclasses[r][c]+'\', \''+ vclasses[r][c]+
							'\')" hclasses="' + hclasses[r][c] + '" vclasses="' + vclasses[r][c] + '" cell="' + cell["char"] + '" r="' + r + '" c="' + c + '" onclick="onClick(\''+
							hclasses[r][c]+'\', \''+ vclasses[r][c]+'\',\''+r+'\',\''+c+'\')" />');
							total = 0;
						} else if(char != '\xa0'){
							html += ('<input type="text" maxlength="1" class="noselect '+df+'" id ="input_'+r+'_'+c+'" maxlength="1" value=""         type="text" tabindex="-1" onfocus="onFocus(\''+ 
							hclasses[r][c]+'\', \''+ vclasses[r][c]+'\')"  onblur="onBlur(\''+hclasses[r][c]+'\', \''+ vclasses[r][c]+
							'\')" hclasses="' + hclasses[r][c] + '" vclasses="' + vclasses[r][c] + '" cell="' + cell["char"] + '" r="' + r + '" c="' + c + '" onclick="onClick(\''+
							hclasses[r][c]+'\', \''+ vclasses[r][c]+'\',\''+r+'\',\''+c+'\')" />');
						}
						switch(label){
							case 1:
								html += ('<span class="word_h">'+(ac-1)+'</span>');
							break;
							case 2:
								html += ('<span class="word_v">'+(dw-1)+'</span>');
							break;
							case 3:
								html += ('<span class="word_h">'+(ac-1)+'</span>');
								html += ('<span class="word_v">'+(dw-1)+'</span>');
							break;
						}
						html+= "</td></div>";
					}
					html += "</tr>";
				}
				cells = total;
				// End Bootstrap Column left
				html += "</table></div>";
				// Start Bootstrap Column Right
				var screen_width = (H5P.jQuery(window)).width();
				var fix = "";
				if (screen_width < 415) var fix ="legend_fixed";
				html += "<div class='legend_col col-sm-4 " + fix + "' id = 'legend'>"
				var across = '<div class ="across-legend"><h4> Across: </h4>';
				var down = '<div class="down-legend"><h4> Down: </h4>';
				var n = 1;
				for (var i = 0; i < legend.across.length; i++){
					across += "<span class=\"h_word"+(i+1)+"\">"+n + ".- " + legend.across[i].clue+"</span><br>";
					n++;
				}
				html+=across + '</div>';
				n = 1;
				for (var i = 0; i < legend.down.length; i++){
					down += "<span class=\"v_word"+(i+1)+"\">"+n + ".- " + legend.down[i].clue+"</span><br>";
					n++;
				}
				// End Bootstap
				html+=down + '<div class="legend_padding"></div></div></div></div>';
				$(html).appendTo($container);
			}
			else{
				alert("Por desgracia no se ha podido generar el crucigrama. Por favor, refresque la página.");
			}
		}
		
	}
		
	CrossWord.prototype = Object.create(EventDispatcher.prototype);
	CrossWord.prototype.constructor = CrossWord;
	return CrossWord;
	
})(H5P.EventDispatcher, H5P.jQuery);

H5P.jQuery(document).ready(function($){
	
	// Re-add Bootstrap if in Column iFrame
	if (window.location !== window.top.location) {
		$('head').append('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
	}
	
	// Hide Legend if on Mobile
	$('.legend_fixed').hide();
	
	// Attach clues outside parent iframe on mobile/small screen and if it's a column
	if (window.location !== window.top.location && $(window).width() < 415) {
		$('.legend_fixed').appendTo(parent.document.getElementsByClassName("body"));
			// Add missing css to make it fixed
			$('.legend_fixed', parent.document).css('position', 'fixed');
			$('.legend_fixed', parent.document).css('bottom', '0');
			$('.legend_fixed', parent.document).css('right', '0');
			$('.legend_fixed', parent.document).css('left', '0');
			$('.legend_fixed', parent.document).css('height', '100px');
			$('.legend_fixed', parent.document).css('background', '#fff');
			$('.legend_fixed', parent.document).css('overflow-y', 'auto');
			$('.legend_fixed', parent.document).css('border-top', 'solid');
			$('.legend_fixed', parent.document).css('border-width', '1px');
			$('.legend_fixed', parent.document).css('border-color', '#ddd');
			$('.legend_fixed', parent.document).css('z-index', '1000');
			$('.legend_padding', parent.document).css('height', '100px');
			// Temp
			$('body', parent.document).css('margin-bottom', '95px');
	}
	// On Key Press
	$('body').on('keyup', '.noselect', function(e) {
		var kCd = e.keyCode || e.which;
		if (kCd == 0 || kCd == 229) { //for android chrome keycode fix
			kCd = getKeyCode(this.value);
		}
		var k_hclasses = $(this).attr('hclasses');
		var k_vclasses = $(this).attr('vclasses');
		var k_cell = $(this).attr('cell');
		var k_r = $(this).attr('r');
		var k_c = $(this).attr('c');
		onKey( kCd, k_hclasses, k_vclasses, k_cell, k_r, k_c);
	});
	// Helper function for mobile
	var getKeyCode = function (str) {
		return str.charCodeAt(str.length - 1);
	}
	
	// Scroll Window and Clues
	// Set variables so screen doesn't scroll unnecessarily
	var lastHeight = "";
	var lastWidth = "";
	var lastClue = "";
	// Extra undeterminded height above down clues
	var extraV = 0;
	$('.crossword').on('focus', '.noselect', function(e) {
		// No scroll for bigger screens
		if ( $(window).width() > 414) {
			return;
		}
	//	console.log(e.currentTarget);
		scrollID = "#" + $(e.currentTarget).attr('id');
	//	console.log(scrollID);
		// Top
		if (window.location == window.top.location) {
			if ($(e.currentTarget).attr('r') != lastHeight) {
				$('html, body').animate({
					scrollTop: $(scrollID).offset().top - 50
				}, 500);
				lastHeight = $(e.currentTarget).attr('r');
			}
		}
		// Top if in Column | iFrame
		if (window.location != window.top.location) {
			// Get height of iFrame because of Column and add it
			var iFrameHeight = $(".h5p-iframe", parent.document).offset().top;
			if ($(e.currentTarget).attr('r') != lastHeight) {
				$('html, body', parent.document).animate({
					scrollTop: $(scrollID).offset().top - 50 + iFrameHeight
				}, 300);
				lastHeight = $(e.currentTarget).attr('r');
			}
		}
		// Side
		if (window.location == window.top.location) {
			var fromLeft =  $(scrollID).offset().left;
			console.log( fromLeft + " " + lastWidth );
			if ( $(e.currentTarget).attr('c') != lastWidth ) {
				$('.crossword_col').animate({scrollLeft: fromLeft - 50 },300);
				lastWidth = $(e.currentTarget).attr('c');
			}  
		}
		// Side if in Column | iFrame
		if (window.location != window.top.location) {
			var fromLeft =  $(scrollID).offset().left;
			console.log( fromLeft + "_" + lastWidth );
			var iFrameWidth = $(".h5p-iframe", parent.document).offset().left;
			if ( $(e.currentTarget).attr('c') != lastWidth ) {
				$('.crossword_col').animate({scrollLeft: fromLeft + iFrameWidth - 50 },300);
				lastWidth = $(e.currentTarget).attr('c');
			}			
		}
		
		// LEGEND - Scroll
		// Get class 
		if ( $(e.currentTarget).attr('hclasses') != "undefined" )  { 
			var clueClass = "." + $(e.currentTarget).attr('hclasses'); 
			extraV = 0;
		} else if ( $(e.currentTarget).attr('vclasses') != "undefined" ) {
			var clueClass = "." + $(e.currentTarget).attr('vclasses');
			extraV = 30;
		} else { clueClass = ""; }
		// Scroll to outside iFrame
		if ( clueClass != lastClue ) {
			if (window.location !== window.top.location) {
				var scrollDistance = $(clueClass, parent.document).offset().top - $(clueClass, parent.document).parent().offset().top - $(clueClass, parent.document).parent().scrollTop() + 10;
				$('.legend_fixed', parent.document).scrollTop(0);
				$('.legend_fixed', parent.document).animate({scrollTop: scrollDistance + extraV },500);
			} else { // Scroll to No iframe
				var scrollClass = ".legend_col " + clueClass;
				var scrollDistance = $(scrollClass).offset().top - $(scrollClass).parent().offset().top - $(scrollClass).parent().scrollTop() + 10;
				$('.legend_fixed').scrollTop(0);
				$('.legend_fixed').animate({scrollTop: scrollDistance + extraV },500);
			}
			lastClue = clueClass;
		}
			
	});
	
	// Autohide Legend
	$('body, html').on('click', function(event) {
		// iFrame
		if (window.location != window.top.location && $('.legend_fixed', parent.document).length ) {
			
			if (!$(event.target).closest('#legend', parent.document).length && !$(event.target).closest('.crossword').length) {
				$('#legend',parent.document).hide();
			} else {
				$('#legend',parent.document).show();
			}
			
		}
		// No iFrame
		if (window.location == window.top.location && $('.legend_fixed').length ) {
		
			if (!$(event.target).closest('#legend').length && !$(event.target).closest('.crossword').length) {
				$('#legend').hide();
			} else {
				$('#legend').show();
			}
		
		
		}
		
	});
	
	
}); 