define( [
	"./core",
	"./var/document",
	"./var/documentElement",
	"./var/hasOwn",
	"./var/indexOf"
], function( jQuery, document, documentElement, hasOwn, indexOf ) {

"use strict";

/*
 * 사용자 정의 빌드를위한 옵션 (비 - 지글짐) 선택기 모듈.
 *
 *이 문서는 많은 문서화 된 jQuery를 지원하지 않습니다.
 작은 크기와 교환 할 수있는 기능 :
 *
 * 특성이 같지 않은 선택기
 * 위치 선택기 (: 첫 번째 : : eq (n); : 홀수 등)
 * 유형 선택기 (: 입력; : 체크 상자; : 버튼 등)
 * 상태 기반 선택자 (: 애니메이션 : 표시 : 숨김 등)
 * : has (선택자)
 * : not (복잡한 선택자)
 * Sizzle 확장을 통해 * 사용자 지정 선택기
 * 주요 조합 (예 : $ collection.find ( "> *"))
 XML 조각에 대한 신뢰할 수있는 기능
 * 선택기의 모든 부분에 문맥에 따라 요소를 일치 시키도록 요구
 * (예 : $ div.find ( "div> *")가 $ div의 하위 항목과 일치 함)
 * 비 요소에 대한 일치
 연결이 끊어진 노드의 신뢰할 수있는 정렬
 * querySelector 모든 버그 수정 (예 : 신뢰할 수 없음 : WebKit에 초점)
 *
 * 이들 중 하나라도 받아 들일 수없는 절충 사항이라면 Sizzle 또는
 *이 스텁을 프로젝트의 특정 요구에 맞게 사용자 정의하십시오.
 */

var hasDuplicate, sortInput,
	sortStable = jQuery.expando.split( "" ).sort( sortOrder ).join( "" ) === jQuery.expando,
	matches = documentElement.matches ||
		documentElement.webkitMatchesSelector ||
		documentElement.mozMatchesSelector ||
		documentElement.oMatchesSelector ||
		documentElement.msMatchesSelector,

	// CSS 문자열 / 식별자 직렬화
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U + 0000은 U + FFFD로 바뀝니다. 대체 문자
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// 제어 문자 및 (위치에 따라) 숫자가 코드 포인트로 이스케이프됩니다.
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// 다른 잠재적으로 특수한 ASCII 문자는 백 슬래시로 이스케이프 처리됩니다.
		return "\\" + ch;
	};

function sortOrder( a, b ) {

	// 중복 제거 플래그
	if ( a === b ) {
		hasDuplicate = true;
		return 0;
	}

	// 하나의 입력에만 compareDocumentPosition이 있으면 메서드 존재에 정렬
	var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
	if ( compare ) {
		return compare;
	}

	// 두 입력이 모두 같은 문서에 속한 경우 위치 계산
	compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
		a.compareDocumentPosition( b ) :

		// 그렇지 않으면 연결이 끊어져 있음을 알 수 있습니다.
		1;

	// Disconnected nodes
	if ( compare & 1 ) {

		// 원하는 문서와 관련된 첫 번째 요소를 선택합니다.
		if ( a === document || a.ownerDocument === document &&
			jQuery.contains( document, a ) ) {
			return -1;
		}
		if ( b === document || b.ownerDocument === document &&
			jQuery.contains( document, b ) ) {
			return 1;
		}

		// 원래 주문 유지
		return sortInput ?
			( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
			0;
	}

	return compare & 4 ? -1 : 1;
}

function uniqueSort( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	hasDuplicate = false;
	sortInput = !sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// 객체를 정렬하기 위해 정렬 한 후 입력 지우기
	// https://github.com/jquery/sizzle/pull/225를 참조하십시오.
	sortInput = null;

	return results;
}

function escape( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
}

jQuery.extend( {
	uniqueSort: uniqueSort,
	unique: uniqueSort,
	escapeSelector: escape,
	find: function( selector, context, results, seed ) {
		var elem, nodeType,
			i = 0;

		results = results || [];
		context = context || document;

		// Sizzle과 동일한 기본 보호 책
		if ( !selector || typeof selector !== "string" ) {
			return results;
		}

		// 컨텍스트가 요소 또는 문서가 아닌 경우 조기 반환
		if ( ( nodeType = context.nodeType ) !== 1 && nodeType !== 9 ) {
			return [];
		}

		if ( seed ) {
			while ( ( elem = seed[ i++ ] ) ) {
				if ( jQuery.find.matchesSelector( elem, selector ) ) {
					results.push( elem );
				}
			}
		} else {
			jQuery.merge( results, context.querySelectorAll( selector ) );
		}

		return results;
	},
	text: function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {

			// nodeType이없는 경우 배열로 예상됩니다.
			while ( ( node = elem[ i++ ] ) ) {

				// 주석 노드를 탐색하지 않습니다.
				ret += jQuery.text( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

			// 요소에 textContent 사용
			return elem.textContent;
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}

		// 주석 또는 처리 명령 노드를 포함하지 않습니다.

		return ret;
	},
	contains: function( a, b ) {
		var adown = a.nodeType === 9 ? a.documentElement : a,
			bup = b && b.parentNode;
		return a === bup || !!( bup && bup.nodeType === 1 && adown.contains( bup ) );
	},
	isXMLDoc: function( elem ) {

		// documentElement는 아직 존재하지 않는 경우에 대해 검증됩니다.
		// (예 : IE에서로드하는 iframe - # 4833)
		var documentElement = elem && ( elem.ownerDocument || elem ).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	},
	expr: {
		attrHandle: {},
		match: {
			bool: new RegExp( "^(?:checked|selected|async|autofocus|autoplay|controls|defer" +
				"|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$", "i" ),
			needsContext: /^[\x20\t\r\n\f]*[>+~]/
		}
	}
} );

jQuery.extend( jQuery.find, {
	matches: function( expr, elements ) {
		return jQuery.find( expr, null, null, elements );
	},
	matchesSelector: function( elem, expr ) {
		return matches.call( elem, expr );
	},
	attr: function( elem, name ) {
		var fn = jQuery.expr.attrHandle[ name.toLowerCase() ],

			// Object.prototype 속성에 속지 마십시오 (jQuery # 13807).
			value = fn && hasOwn.call( jQuery.expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, jQuery.isXMLDoc( elem ) ) :
				undefined;
		return value !== undefined ? value : elem.getAttribute( name );
	}
} );

} );
