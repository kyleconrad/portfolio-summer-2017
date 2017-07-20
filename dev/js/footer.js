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





	// Map Motion - Mouse Hover (Pitch & Bearing)
	// var bearing = 0,
	// 	pitch = 0;

	// window.onmousemove = mapMouseHover;

	// function mapMouseHover( e ) {
	// 	var x = e.clientX,
	// 		y = e.clientY;

	// 	var halfWidth = windowWidth / 2,
	// 		halfHeight = windowHeight / 2;

	// 	bearing = ( ( x - halfWidth ) * -1 ) / 50;
	// 	pitch = ( ( y - windowHeight ) * -1 ) / 25;

	// 	if ( map.loaded() ) {
	// 		map.easeTo({
	// 			pitch: pitch,
	// 			// bearing: bearing,
	// 			animate: true,
	// 			easing: easing
	// 		});
	// 	}
	// }

	// function easing( t ) {
	// 	return t * ( 1.75 - t );
	// }





	// Map Motion - Scroll Panning
	var bodyHeight = $body.clientHeight,
		panDistance = 1000,
		currentPanDistance = panDistance / 100;
	var currentPos = window.pageYOffset,
		scrollPos = currentPos;

	window.addEventListener( 'scroll', mapScroll, false );

	function mapScroll() {
		currentPos = window.pageYOffset;

		if ( currentPos > scrollPos ) {
			currentPanDistance = panDistance / 100;
		}
		else if ( currentPos < scrollPos ) {
			currentPanDistance = ( panDistance / 100 ) * -1;
		}

		if ( map.loaded() ) {
			map.panBy( [ 0, currentPanDistance ], {
				animate: true,
				duration: 150,
				// easing: easingInOut
				easing: function (t) {
		            return t;
		        }
			})
		}

		scrollPos = currentPos;
	}

	// function bodyResize() {
	// 	new ResizeSensor( $body, function() {
	// 		bodyHeight = $body.clientHeight;
	// 	});

	// 	return bodyHeight - windowHeight;
	// }

	// function easingInOut( t ) {
	// 	return t < .5 ? 2 * t * t : -1 + ( 4 - 2 * t ) * t;
	// }


	// 	var scrollProgress = window.pageYOffset / bodyHeight,
	// 		panDistance;

	// 	currentPos = window.pageYOffset;

	// 	// console.log( scrollDistance );

	// 	if ( currentPos > scrollPos ) {
	// 		// console.log( 'down', currentPos );
	// 		panDistance = scrollProgress * 100;

	// 		console.log( 'down', panDistance );
	// 	}
	// 	else {
	// 		console.log( 'up', ( ( 1 - scrollProgress ) * 100 ) * -1 );
	// 		// console.log( 'up', ( scrollDistance * -1 ) );
	// 	}

	// 	scrollPos = currentPos;
	// }

	// var scrollHeight = $body.clientHeight - ( windowHeight / 2 );

	// 	scrollPos = window.pageYOffset,
	// 	currentPos,
	// 	sectionNum = 0,
		// sections = [],
		// sectionArray = [],
		// sectionCount = 14,
		// sectionHeight = scrollHeight / sectionCount;

	// for ( var i = 0; i <= sectionCount; i++ ) {
	// 	sectionArray.push( i * sectionHeight );
	// }
	// var mapTimeline = new TimelineMax({
	// 		paused: true,
	// 		smoothChildTiming: true,
	// 		useFrames: true,
	// 		ease: Strong.easeOut,
	// 		onUpdate: function() {
	// 			console.log( this.progress(), currentLatLong.lat, currentLatLong.long );

	// 			if ( map.loaded() ) {
	// 				map.easeTo({
	// 					speed: 0.2,
	// 					center: [ currentLatLong.long, currentLatLong.lat ]
	// 				});
	// 			}
	// 		}
	// 	});

	// mapTimeline.from( currentLatLong, 1, {
	// 	lat: latLong[0].lat
	// });
	// mapTimeline.add( TweenMax.from( currentLatLong, 1, { lat: latLong[0].lat } ) );

		// .to( currentLatLong, 1, { lat: 25 } )
		// .to( currentLatLong, 1, { lat: 250 } )
		// .to( currentLatLong, 1, { lat: 500 } );

	// for ( var i = 0; i < latLong.length; i++ ) {
	// 	mapTimeline.to( currentLatLong, 1, {
	// 		lat: latLong[i].lat,
	// 		long: latLong[i].lat
	// 	});
	// }

	// window.addEventListener( 'scroll', mapScroll, false );

	// function mapScroll() {
	// 	var scrollProgress = window.pageYOffset / scrollHeight;

	// 	mapTimeline.totalProgress( scrollProgress );
	// }





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