export default function isWindow( obj ) {
	return obj != null && obj === obj.window;
}
