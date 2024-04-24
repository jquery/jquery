# jQuery

> jQuery is a fast, small, and feature-rich JavaScript library.

For information on how to get started and how to use jQuery, please see [jQuery's documentation](https://api.jquery.com/).
For source files and issues, please visit the [jQuery repo](https://github.com/jquery/jquery).

If upgrading, please see the [blog post for @VERSION](@BLOG_POST_LINK). This includes notable differences from the previous version and a more readable changelog.

## Including jQuery

Below are some of the most common ways to include jQuery.

### Browser

#### Script tag

```html
<script src="https://code.jquery.com/jquery-@VERSION.min.js"></script>
```

or, to use the jQuery ECMAScript module:

```html
<script type="module">
	import { $ } from "https://code.jquery.com/jquery-@VERSION.module.min.js";
</script>
```

or:

```html
<script type="module">
	import { jQuery } from "https://code.jquery.com/jquery-@VERSION.module.min.js";
</script>
```

All jQuery modules export named `$` & `jQuery` tokens; the further examples will just show `$`. The default import also works:

```html
<script type="module">
	import $ from "https://code.jquery.com/jquery-@VERSION.module.min.js";
</script>
```

However, named imports provide better interoperability across tooling and are therefore recommended.

Sometimes you don’t need AJAX, or you prefer to use one of the many standalone libraries that focus on AJAX requests. And often it is simpler to use a combination of CSS, class manipulation or the Web Animations API. Similarly, many projects opt into relying on native browser promises instead of jQuery Deferreds. Along with the regular version of jQuery that includes the `ajax`, `callbacks`, `deferred`, `effects` & `queue` modules, we’ve released a “slim” version that excludes these modules. You can load it as a regular script:

```html
<script src="https://code.jquery.com/jquery-@VERSION.slim.min.js"></script>
```

or as a module:

```html
<script type="module">
	import { $ } from "https://code.jquery.com/jquery-@VERSION.module.slim.min.js";
</script>
```

#### Import maps

To avoid repeating long import paths that change on each jQuery release, you can use import maps - they are now supported in every modern browser. Put the following script tag before any `<script type="module">`:

```html
<script type="importmap">
	{
		"imports": {
			"jquery": "https://code.jquery.com/jquery-@VERSION.module.min.js",
			"jquery/slim": "https://code.jquery.com/jquery-@VERSION.module.slim.min.js"
		}
	}
</script>
```

Now, the following will work to get the full version:

```html
<script type="module">
	import { $ } from "jquery";
	// Use $ here
</script>
```

and the following to get the slim one:

```html
<script type="module">
	import { $ } from "jquery/slim";
	// Use $ here
</script>
```

The advantage of these specific mappings is they match the ones embedded in the jQuery npm package, providing better interoperability between the environments.

You can also use jQuery from npm even in the browser setup. Read along for more details.

### Using jQuery from npm

There are several ways to use jQuery from npm. One is to use a build tool like [Webpack](https://webpack.js.org/), [Browserify](https://browserify.org/) or [Babel](https://babeljs.io/). For more information on using these tools, please refer to the corresponding project's documentation.

Another way is to use jQuery directly in Node.js. See the [Node.js pre-requisites](#nodejs-pre-requisites) section for more details on the Node.js-specific part of this.

To install the jQuery npm package, invoke:

```sh
npm install jquery
```

In the script, including jQuery will usually look like this:

```js
import { $ } from "jquery";
```

If you need to use jQuery in a file that's not an ECMAScript module, you can use the CommonJS syntax:

```js
const $ = require( "jquery" );
```

The CommonJS module _does not_ expose named `$` & `jQuery` exports.

#### Individual modules

jQuery is authored in ECMAScript modules; it's also possible to use them directly. They are contained in the `src/` folder; inspect the package contents to see what's there. Full file names are required, including the `.js` extension.

Be aware that this is an advanced & low-level interface, and we don't consider it stable, even between minor or patch releases - this is especially the case for modules in subdirectories or `src/`. If you rely on it, verify your setup before updating jQuery.

All top-level modules, i.e. files directly in the `src/` directory export jQuery. Importing multiple modules will all attach to the same jQuery instance.

Remember that some modules have other dependencies (e.g. the `event` module depends on the `selector` one) so in some cases you may get more than you expect.

Example usage:

```js
import { $ } from "jquery/src/css.js"; // adds the `.css()` method
import "jquery/src/event.js"; // adds the `.on()` method; pulls "selector" as a dependency
$( ".toggle" ).on( "click", function() {
	$( this ).css( "color", "red" );
} );
```

### AMD (Asynchronous Module Definition)

AMD is a module format built for the browser. For more information, we recommend [require.js' documentation](https://requirejs.org/docs/whyamd.html).

```js
define( [ "jquery" ], function( $ ) {

} );
```

Node.js doesn't understand AMD natively so this method is mostly used in a browser setup.

### Node.js pre-requisites

For jQuery to work in Node, a `window` with a `document` is required. Since no such window exists natively in Node, one can be mocked by tools such as [jsdom](https://github.com/jsdom/jsdom). This can be useful for testing purposes.

For Node-based environments that don't have a global `window`, jQuery exposes a dedicated `jquery/factory` entry point.

To `import` jQuery using this factory, use the following:

```js
import { JSDOM } from "jsdom";
const { window } = new JSDOM( "" );
import { jQueryFactory } from "jquery/factory";
const $ = jQueryFactory( window );
```

or, if you use `require`:

```js
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const { jQueryFactory } = require( "jquery/factory" );
const $ = jQueryFactory( window );
```

#### Slim build in Node.js

To use the slim build of jQuery in Node.js, use `"jquery/slim"` instead of `"jquery"` in both `require` or `import` calls above. To use the slim build in Node.js with factory mode, use `jquery/factory-slim` instead of `jquery/factory`.
