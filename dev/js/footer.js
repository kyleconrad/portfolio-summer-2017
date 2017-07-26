$(document).ready(function() {
	// Base Variables
	var windowWidth = $( window ).width(),
		windowHeight = $( window ).height();
	var $body = document.getElementsByTagName( 'body' )[0];
	var isMobile = navigator.userAgent.match( /mobile/i ),
		isDesktop;





	// Mobile / Desktop Classes & Checks
	if ( isMobile ) {
		$body.classList.add( 'mobile' );
	}
	else if ( !isMobile ) {
		$body.classList.add( 'desktop' );
	}





	// Safari Font Fix
	// based on http://stackoverflow.com/a/31842229
	safariFontFix();

	function safariFontFix() {
		var is_chrome = navigator.userAgent.indexOf( 'Chrome' ) > -1,
			is_explorer = navigator.userAgent.indexOf( 'MSIE' ) > -1,
		    is_firefox = navigator.userAgent.indexOf( 'Firefox' ) > -1,
		    is_safari = navigator.userAgent.indexOf( 'Safari' ) > -1,
		    is_opera = navigator.userAgent.indexOf( 'Presto' ) > -1,
		    is_mac = (navigator.userAgent.indexOf( 'Mac OS' ) != -1);
		    is_windows = !is_mac;

	    if ( is_chrome && is_safari ) {
			is_safari = false;
	    }

	    if ( is_safari || is_windows ) {
			$body.classList.add( 'safari-font-fix' );
	    }
	}





	// Hero Sizing
	// prevent size jumping on iOS devices when toolbars scroll away
	setHeroHeight( 'block-size' );

	function setHeroHeight( className ) {
		var elements = document.getElementsByClassName( className );

		if ( isMobile ) {
			for ( var i = 0; i < elements.length; i++ ) {
				var thisItem = elements.item(i),
					heroHeight = $( thisItem ).outerHeight( false );

				$( thisItem ).css( 'height', heroHeight + 'px' );
			}
		}
	}





	// Nav Scrolling
	var scrollTop = $( '.hero' ).outerHeight( true ),
		footerTop = $( '.footer' ).offset().top - 150,
		navActive = false;

	window.addEventListener( 'scroll', navSwitch, false );

	function navSwitch() {
		footerTop = $( '.footer' ).offset().top - 150;
		
		if ( window.pageYOffset > scrollTop && !navActive ) {
			document.getElementsByClassName( 'nav__menu-right' )[0].classList.add( 'nav__menu--active' );

			navActive = true;
		}
		else if ( window.pageYOffset <= scrollTop && navActive ) {
			document.getElementsByClassName( 'nav__menu-right' )[0].classList.remove( 'nav__menu--active' );

			navActive = false;
		}

		if ( window.pageYOffset >= footerTop && navActive ) {
			document.getElementsByClassName( 'nav__menu-right' )[0].classList.remove( 'nav__menu--active' );

			navActive = false;
		}
	}





	// Map Loading
	// var currentLatLong = {
	// 	lat: 36.5604224,
	// 	long: -87.4166623
	// }
	var currentLatLong = {
		lat: 34.998,
		long: -83.247
	}
	// var latLong = [
	// 		{
	// 			label: 'Brooklyn, NY',
	// 			lat: 40.6453531,
	// 			long: -74.0150373
	// 		},
	// 		{
	// 			label: 'Hinesville, GA',
	// 			lat: 31.8281477,
	// 			long: -81.6588799
	// 		},
	// 		{
	// 			label: 'Providence, RI',
	// 			lat: 41.8170512,
	// 			long: -71.4561874
	// 		},
	// 		{
	// 			label: 'Fairfax, VA',
	// 			lat: 38.8522765,
	// 			long: -77.3193475
	// 		},
	// 		{
	// 			label: 'Virginia Beach, VA',
	// 			lat: 36.7676818,
	// 			long: -76.1877483
	// 		},
	// 		{
	// 			label: 'San Antonio, TX',
	// 			lat: 29.4816561,
	// 			long: -98.6544886
	// 		},
	// 		{
	// 			label: 'Richmond, VA',
	// 			lat: 37.5247764,
	// 			long: -77.5633013
	// 		}
	// 	]

	mapboxgl.accessToken = 'pk.eyJ1Ijoia3lsZWNvbnJhZCIsImEiOiJjajI4MWdhc2swMGw5MzJtbWp4ZmV2aWppIn0.wy3_dCqTbd2w33Kw9me8tw';
	var map = new mapboxgl.Map({
	    container: 'map',
	    style: 'mapbox://styles/kyleconrad/cj44c4fds0jz32rm3gqr9p7ji?optimize=true',
	    interactive: false,
	    // center: [ -83.247, 34.998 ],
	    center: [ currentLatLong.long, currentLatLong.lat ],
	    zoom: 13,
	    bearing: 0
	});

	var mapLoaded = setInterval( function() {
		if ( map.loaded() ) {
			document.getElementById( 'map' ).classList.add( 'loaded');

			map.resize();

			clearInterval( mapLoaded );
		}
	}, 10);





	// Map Motion - Scroll Panning
	var scroll = false;
	var bodyHeight = $body.clientHeight;
	var	panDistance = 1000,
		currentPanY = panDistance / 100,
		currentPanX = 0;
	var currentPos = window.pageYOffset,
		scrollPos = currentPos;

	window.addEventListener( 'scroll', mapScroll, false );

	function mapScroll() {
		var scrollDuration;

		scroll = true;

		currentPos = window.pageYOffset;
		currentPanY = ( ( panDistance / 100 ) * ( currentPos - scrollPos ) ) / 5;

		scrollDuration = Math.abs( ( currentPos - scrollPos ) * 75 );

		if ( map.loaded() && !map.isMoving() ) {
			map.panBy( [ 0, currentPanY ], {
				animate: true,
				duration: scrollDuration,
		  		easing: easingOut
			});
		}

		scrollPos = currentPos;
	}

	// function bodyResize() {
	// 	new ResizeSensor( $body, function() {
	// 		bodyHeight = $body.clientHeight;
	// 	});

	// 	return bodyHeight - windowHeight;
	// }





	// Map Motion - Mouse Hover
	[ 'mousemove', 'mouseenter', 'mouseover', 'mouseleave' ].forEach( function( y ) {
		window.addEventListener( y, mapHover, false );
	});

	function mapHover( e ) {
		var halfWidth = windowWidth / 2,
			halfHeight = windowHeight / 2;
		var x = e.clientX,
			y = e.clientY;
		var panDuration;

		var panX = Math.round( ( x - halfWidth ) / 10 ),
			panY = Math.round( ( y - halfHeight ) / 5 );

		if ( currentPos == scrollPos ) {
			scroll = false;
		}

		if ( panX > panY ) {
			panDuration = Math.abs( panX * 100 );
		}
		else {
			panDuration = Math.abs( panY * 100 );
		}

		if ( map.loaded() && !scroll && !map.isMoving() ) {
			map.panBy( [ panX, panY ], {
				animate: true,
				duration: panDuration,
		  		easing: easingInOut
			});
		}
	}





	// Easing Functions
	function easingInOut( t ) {
		return t < .5 ? 2 * t * t : -1 + ( 4 - 2 * t ) * t;
	}
	function easingOut( t ) {
		return t * ( 2 - t );
	}
	function easingLinear( t ) {
		return t;
	}





	// Lazy Loading
	lazyLoading();

	function lazyLoading() {
		$( '.video-load' ).lazyload({
			threshold: windowHeight * 2.25,
			load: function(element){
				$( '.grid--100, .grid--50' ).fitVids();
			}
		});
	}





	// Widow Control
	widowControl();

	function widowControl() {
		var windowWidth = $( window ).width(),
			widowElements = $( 'h4, p, .caption' );

		widowElements.each( function() {
			$( this ).html( $( this ).html().replace( /&nbsp;/g, ' ' ) );
		});

		if ( windowWidth > 700 ) {
			widowElements.each( function() {
			    $( this ).html( $( this ).html().replace( /\s((?=(([^\s<>]|<[^>]*>)+))\2)\s*$/, '&nbsp;$1' ) );
			});
		}
	};





	// Debounce Resize
	// based on http://stackoverflow.com/a/27923937
	$( window ).on( 'resize', function() {
		var newWindowWidth = $( window ).width();

		windowHeight = $( window ).height();

		// only fire on horizontal, not vertical - prevents weird iOS jumping when toolbars scroll away
		if ( windowWidth != newWindowWidth ) {
			clearTimeout( window.resizedFinished );

			window.resizedFinished = setTimeout( function(){
				widowControl();

				windowWidth = $( window ).width();
			}, 250);
		}
	});
});