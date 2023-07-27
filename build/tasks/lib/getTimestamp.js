export default function getTimestamp() {
	const now = new Date();
	const hours = now.getHours().toString().padStart( 2, "0" );
	const minutes = now.getMinutes().toString().padStart( 2, "0" );
	const seconds = now.getSeconds().toString().padStart( 2, "0" );
	return `${ hours }:${ minutes }:${ seconds }`;
}
