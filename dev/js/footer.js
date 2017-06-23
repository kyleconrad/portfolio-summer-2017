$(document).ready(function() {
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
	// to prevent size jumping on iOS devices when toolbars scroll away
	setHeroHeight( 'hero-size' );

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





	// Map
	mapboxgl.accessToken = 'pk.eyJ1Ijoia3lsZWNvbnJhZCIsImEiOiJjajI4MWdhc2swMGw5MzJtbWp4ZmV2aWppIn0.wy3_dCqTbd2w33Kw9me8tw';
	var map = new mapboxgl.Map({
	    container: 'map',
	    style: 'mapbox://styles/kyleconrad/cj44c4fds0jz32rm3gqr9p7ji?optimize=true',
	    interactive: false,
	    center: [-83.247,34.998],
	    zoom: 13
	});

	var mapLoaded = setInterval( function() {
		if ( map.loaded() ) {
			document.getElementById( 'map' ).classList.add( 'loaded');

			clearInterval( mapLoaded );
		}
	}, 10);





	// Nav Scrolling
	var scrollTop = $( '.hero' ).outerHeight( true ),
		navActive = false;

	window.addEventListener( 'scroll', navSwitch, false );

	function navSwitch() {
		if ( window.pageYOffset > scrollTop && !navActive ) {
			document.getElementsByClassName( 'nav__menu-right' )[0].classList.add( 'nav__menu--active' );

			navActive = true;
		}
		else if ( window.pageYOffset <= scrollTop && navActive ) {
			document.getElementsByClassName( 'nav__menu-right' )[0].classList.remove( 'nav__menu--active' );

			navActive = false;
		}
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
			widowElements = $( 'p, .caption' );

		widowElements.each( function() {
			$( this ).html( $( this ).html().replace( /&nbsp;/g, ' ' ) );
		});

		if ( windowWidth > 700 ) {
			widowElements.each( function() {
			    $( this ).html( $( this ).html().replace( /\s((?=(([^\s<>]|<[^>]*>)+))\2)\s*$/, '&nbsp;$1' ) );
			});
		}
	};
});