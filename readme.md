## tinyLightbox is a small lightbox clone based on jquery. The main Idea was to enable different animations but having one core.

## Usage

	$('#selector').tinyLightbox();

	$('#selector').tinyLightbox(options);

## Default options can be overwritten by options param.

    // selector inside of container
    item: 'a',
    slideshowSpeed: 5000,
    slideshowAutostart: false,
    // zoom image path
    urlAttr: 'href',
    // description attribute
    descrAttr: 'title',
    // animations speed
    speed: 300,
    labelImage: 'Image',
    labelOf: 'of',
    //animation extension name
    animation: 'original',
    // keyboard navigation enabled/disabled
    keyNavigation: true,
    // go to the first item after the last one
    cycle: false,
    // if the image is smaller than minWidth,
    // minWidth will be used for the frame width instead
    minWidth: 250,
    minHeight: 190,
    overlayOpacity: 0.7,
    // fix selectboxes for ie6, using bgiframe plugin
    bgiframe: true,
    easing: 'swing',
    // pass an array with urls and titles if you don't want to use the markup
    // [{url: '', title: ''}]
    data: null

## Markup and needed files

See the demo for details


## License

Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
