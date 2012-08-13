/*global module:false, window:false, moduleTeardown:false, console:false, test:false, equal:false, $:false, ok:false, alert:false, jQuery:false, document:false*/
/*jshint laxcomma:true */

(function( $ ) {
"use strict";

var _console, $console;

module( "clone", {
	setup: function() {
		$console = $( "#console" );
		$console.val( "" );
		_console = window.console || {};
		window.console = {
			log: function( message ) {
				if ( _console.log ) {
					// _console.log.apply( _console, arguments );
				}
				$console.val(function(index, value) {
					return value + ( value ? "\n" : "" ) + message;
				});
			}
		};
	},
	teardown: function() {
		window.console = _console;
		moduleTeardown();
	}
});

test( "Clearing Clone's Property Doesn't Clear Original Element's Property", function() {
	// Define styles from http://www.w3.org/TR/CSS/#indices
	// Array.prototype.forEach.call( document.querySelectorAll( "tr" ), function( row ) { var imgs = row.querySelectorAll( "img" ); if ( imgs[2] && imgs[2].attributes.alt.value === "no" && imgs[3] && imgs[3].attributes.alt.value === "yes" ) { console.log( "skipping" ); } else { row.style.display = "none"; } } );
	var baseUrl = document.location.href.replace( /([^\/]*)$/, "" ), count = 0;
	var styles = [
		{ name: "background-attachment", value: ["fixed"], expected: ["scroll"] },
		{ name: "background-color", value: ["rgb(255, 0, 0)", "rgb(255,0,0)"], expected: ["transparent"] },
		{
			name: "background-image",
			value: [
				'url("test.png")',
				'url(' + baseUrl + 'test.png)',
				'url("' + baseUrl + 'test.png")'
			],
			expected: ["none"]
		},
		{ name: "background-position", value: ["5% 5%"], expected: ["0% 0%"] },
		{ name: "background-repeat", value: ["repeat-y"], expected: ["repeat"] },
		{
			name: "background",
			value: [
				"rgb(255, 0, 0) 50% 50%",
				"50% 50% rgb(255, 0, 0)",
				"rgb(255,0,0) 50% 50%",
				"none repeat scroll 50% 50% rgb(255, 0, 0)"
			],
			expected: ["none", "none transparent scroll repeat 0% 0%"]
		},
		{ name: "border-collapse", value: ["collapse"], expected: ["separate"] },
		{ name: "border-color", value: ["rgb(255, 0, 0)", "rgb(255,0,0)"], expected: ["none", "#000000"] },
		// BEGIN
		{ name: "border-spacing", value: ["5px 5px", "5px"], expected: ["0px 0px"] },
		// END
		{ name: "border-style", value: ["dashed"], expected: ["none"] },
		{
			name: "border-top",
			value: ["thick double rgb(255, 0, 0)", "rgb(255,0,0) thick double"],
			expected: ["none", "medium none"]
		},
		{
			name: "border-right",
			value: ["thick double rgb(255, 0, 0)", "rgb(255,0,0) thick double"],
			expected: ["none", "medium none"]
		},
		{
			name: "border-bottom",
			value: ["thick double rgb(255, 0, 0)", "rgb(255,0,0) thick double"],
			expected: ["none", "medium none"]
		},
		{
			name: "border-left",
			value: ["thick double rgb(255, 0, 0)", "rgb(255,0,0) thick double"],
			expected: ["none", "medium none"]
		},
		{ name: "border-top-color", value: ["rgb(255, 0, 0)", "rgb(255,0,0)"], expected: ["rgb(0, 0, 0)", "#000000"] },
		{ name: "border-right-color", value: ["rgb(255, 0, 0)", "rgb(255,0,0)"], expected: ["rgb(0, 0, 0)", "#000000"] },
		{ name: "border-bottom-color", value: ["rgb(255, 0, 0)", "rgb(255,0,0)"], expected: ["rgb(0, 0, 0)", "#000000"] },
		{ name: "border-left-color", value: ["rgb(255, 0, 0)", "rgb(255,0,0)"], expected: ["rgb(0, 0, 0)", "#000000"] },
		{ name: "border-top-style", value: ["dotted"], expected: ["none"] },
		{ name: "border-right-style", value: ["dotted"], expected: ["none"] },
		{ name: "border-bottom-style", value: ["dotted"], expected: ["none"] },
		{ name: "border-left-style", value: ["dotted"], expected: ["none"] },
		// BEGIN - IE10 doesn't seem to apply these correctly getComputedStyle shows as 0px for thick
		// { name: "border-top-width", value: ["thick"], expected: ["medium"] },
		// { name: "border-right-width", value: ["thick"], expected: ["medium"] },
		// { name: "border-bottom-width", value: ["thick"], expected: ["medium"] },
		// { name: "border-left-width", value: ["thick"], expected: ["medium"] },
		// END
		{ name: "border-width", value: ["5px"], expected: ["0px", "medium"] },
		{ name: "border", value: ["5px solid rgb(255, 0, 0)", "rgb(255,0,0) 5px solid"], expected: ["none", undefined, "undefined"] },
		{ name: "bottom", value: ["5px"], expected: [] },
		{ name: "caption-side", value: ["bottom"], expected: ["top"] },
		{ name: "clear", value: ["right"], expected: ["none"] },
		{
			name: "clip",
			value: [
				"rect(110px 160px 170px 60px)",
				"rect(110px, 160px, 170px, 60px)",
				"rect(110px,160px,170px,60px)"
			],
			expected: [
				"rect(auto,auto,auto,auto)",
				"rect(auto auto auto auto)",
				"rect(0px, 0px, 0px, 0px)"
			]
		},
		{ name: "color", value: ["rgb(255, 0, 0)", "rgb(255,0,0)"], expected: ["rgb(0, 0, 0)", "#000000"] },
		// { name: "content", value: ["test"], expected: ["normal", "none"] }, // Content isn't found in DOM
		{ name: "counter-increment", value: ["section", "section 1"], expected: ["none"] },
		{ name: "counter-reset", value: ["section", "section 0"], expected: ["none"] },
		{ name: "cursor", value: ["crosshair"], expected: [] },
		{ name: "direction", value: ["rtl"], expected: ["ltr"] },
		{ name: "display", value: ["list-item"], expected: ["block"] },
		{ name: "empty-cells", value: ["hide"], expected: ["show"] },
		{ name: "float", value: ["right"], expected: ["none"] },
		{ name: "font-family", value: ["Georgia, serif"], expected: ["Times New Roman", "serif"] },
		{ name: "font-size", value: ["12px"], expected: ["16px"] },
		{ name: "font-style", value: ["italic"], expected: ["normal"] },
		{ name: "font-variant", value: ["small-caps"], expected: ["normal"] },
		{ name: "font-weight", value: ["700", 700], expected: ["400", 400, "700"] },
		{
			name: "font",
			value: [
				"italic 12px Georgia",
				"italic 12px/normal Georgia",
				"italic normal normal 12px/normal Georgia"
			],
			expected: ["italic 12px Georgia"]
		},
		{ name: "height", value: ["5px"], expected: ["0px"] },
		{ name: "left", value: ["5px"], expected: [] },
		{ name: "letter-spacing", value: ["5px"], expected: [0] },
		{ name: "line-height", value: ["12px"], expected: [1, "19.2px"] },
		{
			name: "list-style-image",
			value: [
				'url("test.png")',
				'url(' + baseUrl + 'test.png)',
				'url("' + baseUrl + 'test.png")'
			],
			expected: ["none"]
		},
		{ name: "list-style-position", value: ["inside"], expected: ["outside"] },
		{ name: "list-style-type", value: ["disc"], expected: ["disc"] },
		{
			name: "list-style",
			value: [
				'square url("test.png")',
				'square url(' + baseUrl + 'test.png)',
				'square url("' + baseUrl + 'test.png")',
				'square url(test.png)'
			],
			expected: ["none", undefined]
		},
		{ name: "margin-right", value: ["5px"], expected: ["0px"] },
		{ name: "margin-left", value: ["5px"], expected: ["0px"] },
		{ name: "margin-top", value: ["5px"], expected: ["0px"] },
		{ name: "margin-bottom", value: ["5px"], expected: ["0px"] },
		{ name: "margin", value: ["5px"], expected: ["", "0px"] },
		{ name: "max-height", value: ["5px"], expected: ["none"] },
		{ name: "max-width", value: ["5px"], expected: ["none"] },
		{ name: "min-height", value: ["5px"], expected: ["0px"] },
		{ name: "min-width", value: ["5px"], expected: ["0px"] },
		{ name: "opacity", value: ["0.5"], expected: [1, "1"] },
		{ name: "orphans", value: ["3", 3], expected: [0, "0"] },
		{
			name: "outline-color",
			value: ["rgb(255, 0, 0)", "rgb(255,0,0)"],
			expected: ["transparent", "rgb(0, 0, 0)", "#000000"]
		},
		{ name: "outline-style", value: ["dashed"], expected: ["none"] },
		// BEGIN - IE8 throws exception when trying to check for curCSS
		// { name: "outline", value: ["red dotted thick", "thick dotted red"], expected: ["none"] },
		// END
		{ name: "overflow", value: ["scroll"], expected: ["visible"] },
		{ name: "padding-top", value: ["5px"], expected: ["0px"] },
		{ name: "padding-right", value: ["5px"], expected: ["0px"] },
		{ name: "padding-bottom", value: ["5px"], expected: ["0px"] },
		{ name: "padding-left", value: ["5px"], expected: ["0px"] },
		{ name: "padding", value: ["5px"], expected: ["0px"] },
		{ name: "page-break-after", value: ["right"], expected: [] },
		{ name: "page-break-before", value: ["right"], expected: [] },
		{ name: "page-break-inside", value: ["avoid"], expected: [] },
		{ name: "position", value: ["absolute"], expected: ["static"] },
		{
			name: "quotes",
			value: [
				'"«" "»" "\'" "\'"',
				"«, », '\\'', '\\''",
				'"«" "»" "\\\'" "\\\'"'
			],
			expected: [
				'"“" "”" "‘" "’"',
				'"“" "”" "‘" "’"',
				'“, ”, ‘, ’'
			]
		},
		{ name: "right", value: ["5px"], expected: [] },
		{ name: "table-layout", value: ["fixed"], expected: [] },
		{ name: "text-align", value: ["right"], expected: ["left", "start"] },
		{ name: "text-decoration", value: ["underline"], expected: ["none"] },
		{ name: "text-indent", value: ["5px"], expected: ["0px"] },
		{ name: "text-transform", value: ["uppercase"], expected: ["none"] },
		{ name: "top", value: ["5px"], expected: [] },
		{ name: "unicode-bidi", value: ["bidi-override"], expected: ["normal"] },
		{ name: "vertical-align", value: ["text-top"], expected: ["baseline"] },
		{ name: "visibility", value: ["hidden"], expected: ["visible", "inherit"] },
		{ name: "white-space", value: ["nowrap"], expected: ["normal"] },
		{ name: "widows", value: ["2", 2], expected: [0, "0"] },
		{ name: "width", value: ["5px"], expected: ["0px"] },
		{ name: "word-spacing", value: ["5px"], expected: ["0px", "normal"] },
		{ name: "z-index", value: [100, "100"], expected: [0] },
		{ name: "alignment-adjust", value: ["middle"], expected: [] },
		{ name: "alignment-baseline", value: ["middle"], expected: ["baseline"] },
		{ name: "anchor-point", value: ["5px"], expected: ["none"] },
		{ name: "animation", value: ["test 5s infinite"], expected: ["none 0 ease 0 1 normal"] },
		{ name: "animation-delay", value: ["2s"], expected: ["0s"] },
		{ name: "animation-direction", value: ["alternate"], expected: ["normal"] },
		{ name: "animation-duration", value: ["2s"], expected: ["0s"] },
		{ name: "animation-iteration-count", value: ["3"], expected: ["1"] },
		{ name: "animation-name", value: ["test"], expected: ["none"] },
		{ name: "animation-play-state", value: ["paused"], expected: ["running"] },
		{
			name: "animation-timing-function",
			value: ["linear", "cubic-bezier(0, 0, 1, 1)"],
			expected: ["ease", "cubic-bezier(0.25, 0.1, 0.25, 1)"]
		},
		{ name: "appearance", value: ["button"], expected: ["normal"] },
		{ name: "backface-visibility", value: ["hidden"], expected: ["visible"] },
		{ name: "background-clip", value: ["content-box"], expected: ["border-box"] },
		{ name: "background-origin", value: ["content-box"], expected: ["padding-box"] },
		{ name: "background-size", value: ["80px 60px"], expected: [] },
		{ name: "baseline-shift", value: ["super"], expected: ["baseline"] },
		{
			name: "binding",
			value: ['url("test.png")'],
			expected: []
		},
		{ name: "bleed", value: ["3pt"], expected: ["6pt"] },
		{ name: "bookmark-label", value: ["test"], expected: ["content()"] },
		{ name: "bookmark-level", value: ["3"], expected: ["none"] },
		{ name: "bookmark-state", value: ["closed"], expected: ["open"] },
		{ name: "bookmark-target", value: ["attr(href, url)"], expected: ["none"] },
		{ name: "border-bottom-left-radius", value: ["32px", "32px 32px"], expected: ["0px"] },
		{ name: "border-bottom-right-radius", value: ["32px", "32px 32px"], expected: ["0px"] },
		// Setting border-image in Chrome splits out to border-image-source, border-image-slice, and border-image-repeate
		// { name: "border-image", value: ["url(border.png) 30 30 round"], expected: ["none 100% 1 0 stretch"] },
		{ name: "border-image-outset", value: ["30 30", "30"], expected: [0] },
		{ name: "border-image-repeat", value: ["round"], expected: ["stretch"] },
		{ name: "border-image-slice", value: ["50% 50%", "50%"], expected: ["100%"] },
		{
			name: "border-image-source",
			value: [
				'url("border.png")',
				'url(' + baseUrl + 'border.png)',
				'url("' + baseUrl + 'border.png")',
				'url(border.png)'
			],
			expected: ["none"]
		},
		{ name: "border-image-width", value: ["30 30", "30"], expected: [1] },
		// Setting border-radius in Chrome splits out to border-top-left-radius, etc...
		// { name: "border-radius", value: ["25px"], expected: [0] },
		{ name: "border-top-left-radius", value: ["32px", "32px 32px"], expected: ["0px"] },
		{ name: "border-top-right-radius", value: ["32px", "32px 32px"], expected: ["0px"] },
		{ name: "box-decoration-break", value: ["clone"], expected: ["slice"] },
		{
			name: "box-shadow",
			value: ["10px 10px 5px #cccccc", "rgb(204, 204, 204) 10px 10px 5px"],
			expected: ["none"]
		},
		{ name: "box-sizing", value: ["border-box"], expected: ["content-box"] },
		{ name: "break-after", value: ["right"], expected: [] },
		{ name: "break-before", value: ["right"], expected: [] },
		{ name: "break-inside", value: ["avoid"], expected: [] },
		// I can't seem to get this to take in Chrome
		// { name: "color-profile", value: ['url("http://eg.icm")'], expected: [] },
		{ name: "column-count", value: ["3"], expected: [] },
		{ name: "column-fill", value: ["auto"], expected: ["balance"] },
		{ name: "column-gap", value: ["40px"], expected: ["normal"] },
		{ name: "column-rule", value: ["3px outset rgb(255, 0, 255)"], expected: ["medium none black"] },
		{ name: "column-rule-color", value: ["#ff0000", "rgb(255, 0, 0)"], expected: ["rgb(0, 0, 0)"] },
		{ name: "column-rule-style", value: ["dotted"], expected: ["none"] },
		{ name: "column-rule-width", value: ["5px"], expected: ["medium"] },
		{ name: "column-span", value: ["all"], expected: ["1"] },
		{ name: "column-width", value: ["100px"], expected: [] },
		{ name: "columns", value: ["12em", "auto 12em"], expected: [] },
		{ name: "crop", value: ["rect(0px, 115px, 85px, 30px)"], expected: [] },
		{ name: "dominant-baseline", value: ["alphabetic"], expected: [] },
		{ name: "drop-initial-after-adjust", value: [""], expected: ["text-after-edge"] },
		{ name: "drop-initial-after-align", value: [""], expected: ["baseline"] },
		{ name: "drop-initial-before-adjust", value: [""], expected: ["text-before-edge"] },
		{ name: "drop-initial-before-align", value: [""], expected: ["caps-height"] },
		{ name: "drop-initial-size", value: [""], expected: [] },
		{ name: "drop-initial-value", value: [""], expected: ["initial"] },
		{ name: "fit", value: ["meet"], expected: ["fill"] },
		{ name: "fit-position", value: ["50% 50%"], expected: ["0% 0%"] },
		{ name: "align-items", value: ["baseline"], expected: ["streth"] },
		{ name: "align-self", value: ["baseline"], expected: [] },
		{ name: "align-content", value: ["center"], expected: ["stretch"] },
		{ name: "order", value: ["3"], expected: [0] },
		{ name: "justify-content", value: ["center"], expected: ["flex-start"] },
		{ name: "flex-grow", value: ["5"], expected: ["0"] },
		{ name: "flex-shrink", value: ["3"], expected: ["1"] },
		{ name: "flex-basis", value: ["22px"], expected: [] },
		{ name: "float-offset", value: ["-50% 3em"], expected: ["0 0"] },
		{ name: "font-feature-settings", value: ['"smcp" 1, "swsh" 2'], expected: ["normal"] },
		{ name: "font-kerning", value: ["normal"], expected: [] },
		{ name: "font-language-override", value: ["SRB"], expected: ["normal"] },
		// I can't seem to get this to take in Chrome
		// { name: "font-size-adjust", value: ["0.5"], expected: ["none"] },
		// I can't seem to get this to take in Chrome
		// { name: "font-stretch", value: ["condensed"], expected: ["normal"] },
		{ name: "font-synthesis", value: ["none"], expected: ["weight style"] },
		{ name: "font-variant-alternates", value: ["swash(flowing)"], expected: ["normal"] },
		{ name: "font-variant-caps", value: ["all-petite-caps"], expected: ["normal"] },
		{ name: "font-variant-east-asian", value: ["traditional"], expected: ["normal"] },
		{ name: "font-variant-ligatures", value: ["historical-ligatures"], expected: ["normal"] },
		{ name: "font-variant-numeric", value: ["diagonal-fractions"], expected: ["normal"] },
		{ name: "font-variant-position", value: ["super"], expected: ["normal"] },
		{ name: "hanging-punctuation", value: ["first"], expected: ["none"] },
		{ name: "hyphens", value: ["auto"], expected: ["manual"] },
		{ name: "icon", value: ['url("icon.png")'], expected: [] },
		{ name: "image-orientation", value: ["90deg"], expected: ["0deg"] },
		// I can't seem to get this to take in Chrome
		// { name: "image-rendering", value: ["optimizeQuality"], expected: [] },
		{ name: "image-resolution", value: ["300dpi"], expected: ["normal"] },
		{ name: "inline-box-align", value: ["initial"], expected: ["last"] },
		{ name: "line-break", value: ["strict"], expected: ["normal"] },
		{ name: "line-stacking", value: ["grid-height include-ruby disregard-shifts"], expected: [] },
		{ name: "line-stacking-ruby", value: ["include-ruby"], expected: ["exclude-ruby"] },
		{ name: "line-stacking-shift", value: ["disregard-shifts"], expected: ["consider-shifts"] },
		{ name: "line-stacking-strategy", value: ["grid-height"], expected: ["inline-line-height"] },
		{ name: "marks", value: ["cross"], expected: ["none"] },
		{ name: "marquee-direction", value: ["reverse"], expected: ["forward"] },
		{ name: "marquee-loop", value: ["5"], expected: [1] },
		{ name: "marquee-play-count", value: ["5"], expected: [1] },
		{ name: "marquee-speed", value: ["fast"], expected: ["normal"] },
		{ name: "marquee-style", value: ["alternate"], expected: ["scroll"] },
		{ name: "move-to", value: ["here"], expected: ["normal"] },
		{ name: "nav-down", value: ["#test"], expected: [] },
		{ name: "nav-index", value: ["5"], expected: [] },
		{ name: "nav-left", value: ["#test"], expected: [] },
		{ name: "nav-right", value: ["#test"], expected: [] },
		{ name: "nav-up", value: ["#test"], expected: [] },
		{ name: "opacity", value: ["0.5"], expected: ["1"] },
		{ name: "outline-offset", value: ["5px"], expected: [0] },
		{ name: "overflow-style", value: ["marquee-line"], expected: [] },
		{ name: "overflow-wrap", value: ["break-word"], expected: ["normal"] },
		{ name: "overflow-x", value: ["scroll"], expected: ["visible"] },
		{ name: "overflow-y", value: ["scroll"], expected: ["visible"] },
		{ name: "page", value: ["rotated"], expected: [] },
		{ name: "page-policy", value: ["last"], expected: ["start"] },
		{ name: "perspective", value: ["500px"], expected: ["none"] },
		{ name: "perspective-origin", value: ["10px 10px"], expected: ["50% 50%", "0px 0px"] },
		{ name: "presentation-level", value: ["same"], expected: [0] },
		{ name: "punctuation-trim", value: ["start"], expected: ["none"] },
		{ name: "rendering-intent", value: ["saturation"], expected: [] },
		{ name: "resize", value: ["horizontal"], expected: ["none"] },
		{ name: "rest", value: ["weak strong"], expected: [] },
		{ name: "rest-after", value: ["x-weak"], expected: [] },
		{ name: "rest-before", value: ["strong"], expected: [] },
		{ name: "rotation", value: ["180deg"], expected: [0] },
		{ name: "rotation-point", value: ["25% 75%"], expected: ["50% 50%"] },
		{ name: "ruby-align", value: ["center"], expected: [] },
		{ name: "ruby-overhang", value: ["whitespace"], expected: ["none"] },
		{ name: "ruby-position", value: ["inline"], expected: ["above"] },
		{ name: "ruby-span", value: ["attr(rbspan)"], expected: ["none"] },
		{ name: "size", value: ["landscape"], expected: ["auto"] },
		{ name: "speak-as", value: ["literal-punctuation"], expected: ["normal"] },
		{ name: "string-set", value: ["index content(first-letter)"], expected: ["none"] },
		{ name: "tab-size", value: ["4"], expected: [8] },
		{ name: "target", value: ["parent tab front"], expected: [] },
		{ name: "target-name", value: ["parent"], expected: ["current"] },
		{ name: "target-new", value: ["tab"], expected: ["window"] },
		{ name: "target-position", value: ["front"], expected: ["above"] },
		{ name: "text-align-last", value: ["right"], expected: [] },
		{ name: "text-decoration-color", value: ["rgb(255, 0, 0)"], expected: ["currentColor"] },
		{ name: "text-decoration-line", value: ["line-through"], expected: ["none"] },
		{ name: "text-decoration-skip", value: ["spaces"], expected: ["objects"] },
		{ name: "text-decoration-style", value: ["dotted"], expected: ["solid"] },
		{ name: "text-emphasis", value: ["double-circle"], expected: ["none"] },
		{ name: "text-emphasis-color", value: ["rgb(255, 0, 0)"], expected: ["currentColor"] },
		{ name: "text-emphasis-position", value: ["below left"], expected: ["above right"] },
		{ name: "text-emphasis-style", value: ["double-circle"], expected: ["none"] },
		{ name: "text-height", value: ["text-size"], expected: [] },
		// Unable to Set Style on Source Element
		// { name: "text-justify", value: ["distribute"], expected: [] },
		{ name: "text-outline", value: ["inter-word"], expected: ["none"] },
		{
			name: "text-shadow",
			value: ["2px 2px #ff0000", "rgb(255, 0, 0) 2px 2px"],
			expected: ["none"]
		},
		{ name: "text-space-collapse", value: ["preserve"], expected: ["collapse"] },
		{ name: "text-underline-position", value: ["below"], expected: [] },
		{ name: "text-wrap", value: ["avoid"], expected: ["normal"] },
		{ name: "transform", value: ["rotate(7deg)", "matrix(0.992546, 0.121869, -0.121869, 0.992546, 0, 0)"], expected: ["none"] },
		{ name: "transform-origin", value: ["20px 40px"], expected: ["50% 50% 0%", "0px 0px"] },
		{ name: "transform-style", value: ["flat"], expected: ["flat"] },
		{ name: "transition", value: ["background-color linear 1s", "background-color 1s linear"], expected: [] },
		{ name: "transition-delay", value: ["2s"], expected: [0, "0s"] },
		{ name: "transition-duration", value: ["5s"], expected: [0, "0s"] },
		{ name: "transition-property", value: ["width"], expected: ["all"] },
		{
			name: "transition-timing-function",
			value: ["linear", "cubic-bezier(0, 0, 1, 1)"],
			expected: ["ease", "cubic-bezier(0.25, 0.1, 0.25, 1)"]
		},
		{ name: "voice-balance", value: ["right"], expected: ["center"] },
		{ name: "voice-duration", value: ["+3s"], expected: [] },
		{ name: "voice-pitch", value: ["250Hz"], expected: ["medium"] },
		{ name: "voice-range", value: ["+20Hz"], expected: ["medium"] },
		{ name: "voice-rate", value: ["fast"], expected: ["normal"] },
		{ name: "voice-stress", value: ["strong"], expected: ["moderate"] },
		{ name: "voice-volume", value: ["soft"], expected: ["medium"] },
		{ name: "word-break", value: ["break-all"], expected: ["normal"] },
		{ name: "overflow-wrap", value: ["break-word"], expected: ["normal"] }
	];

	$.each( styles, function(index, style) {
		var defaultValue = {
			"background-attachment": "scroll"
			, "background-color": "transparent"
			, "background-image": "none"
			, "background-position": "0% 0%"
			, "background-repeat": "repeat"
			, "background-clip": "border-box"
			, "background-origin": "padding-box"
			, "background-size": "auto auto" // Fails in PhantomJS, but not IE10 or Chrome
			, "orphans": 0
			, "widows": 0
			, "quotes": '"“" "”" "‘" "’"'
			, "clip": "rect(auto,auto,auto,auto)"
		},
		domStyleName = cssPropertyToDomStyleProperty(style.name),
		newValue, $source, source, $clone, clone;

		// defaultValue = {}; // TODO: Remove this...

		count++;
		style.expected = style.expected.concat(["", "auto"]);
		$source = $("<div />");
		source = $source[0];
		if ( source.style[style.name] === undefined ) {
			console.log( "NOT SUPPORTED: " + style.name );
			return true;
		} else if ( window.getComputedStyle &&
			window.getComputedStyle(source)[domStyleName] === undefined ) {
			console.log( "SUPPORTED, BUT NOT REALLY: " + style.name );
			return true;
		}
		$source.css( style.name, style.value[0] );

		/*
		// By accessing the .css() getter it masks the bug we are trying to detect
		ok( ~$.inArray($source.css(style.name), style.value), "Style applied to source before cloning: " + style.name +
			"; result: " + $source.css(style.name) +
			"; expected: " + style.value.join(",") );
		if ( ~$.inArray($source.css(style.name), style.value) ) {
		*/
			$clone = $source.clone();
			clone = $clone[0];
			newValue = defaultValue[style.name] !== undefined ? defaultValue[style.name] : "";
			$clone.css( style.name, newValue );

			ok( source !== clone, "Verify objects different: " + style.name );
			ok( source.style !== clone.style, "Verify style properties different: " + style.name );

			ok( ~$.inArray($clone.css(style.name) !== undefined ? $clone.css(style.name) : "undefined", style.expected),
				"Clearing clone.css() works: " + style.name +
				"; result: " + $clone.css(style.name) +
				"; expected: " + style.expected.join(",") );
			ok( ~$.inArray($source.css(style.name), style.value),
				"Clearning clone.css() doesn't affect source.css(): " + style.name +
				"; result: " + $source.css(style.name) +
				"; expected: " + style.value.join(",") );
			if ( !~$.inArray($source.css(style.name), style.value) ) {
				console.log( "FAILED: " + style.name +
					"; result: " + $source.css(style.name) +
					"; expected: " + style.value.join(",") );
			}

			// IE actually clears out the source style in many cases, but
			// .css() still gets answer because it uses getComputedStyle
			ok( ~$.inArray(source.style[domStyleName], style.value),
				"Underlying source style unchanged: " + style.name +
				"; result: " + source.style[style.name] +
				"; expected: " + style.value.join(",") );
			if ( !~$.inArray(source.style[domStyleName], style.value) ) {
				console.log( "FAILED: Underlying Cleared: " + style.name +
					"; result: " + source.style[domStyleName] +
					"; expected: " + style.value.join(",") );
			}
			equal( clone.style[domStyleName], "",
				"Underlying clone style cleared: " + style.name );
		/*
		} else {
			console.log( "NOT WORKING: " + style.name );
		}
		*/
	});

	console.log( "Number of styles tested: " + count );
});

function cssPropertyToDomStyleProperty( name ) {
	return name .replace( /-(\w)/g, function(match, group) {
		return group.toUpperCase();
	});
}

})( jQuery );