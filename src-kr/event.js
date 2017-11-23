define( [
	"./core",
	"./var/document",
	"./var/documentElement",
	"./var/rnothtmlwhite",
	"./var/slice",
	"./data/var/dataPriv",
	"./core/nodeName",

	"./core/init",
	"./selector"
], function( jQuery, document, documentElement, rnothtmlwhite, slice, dataPriv, nodeName ) {

"use strict";

var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// 지원 : IE <= 9 만
// 자세한 내용은 # 13393을 참조하십시오.
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// 유형은 유형 / 핸들러의 맵이 될 수 있습니다.
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// 이벤트에 정보가 포함되어 있으므로 빈 세트를 사용할 수 있습니다.
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// 발신자가 origFn을 사용하여 제거 할 수 있도록 동일한 GUID 사용
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * 이벤트 관리를위한 * 도우미 기능 - 공용 인터페이스의 일부가 아닙니다.
 * 많은 아이디어를 위해 Dean Edwards의 addEvent 라이브러리에 대한 소품
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// noData 또는 텍스트 / 주석 노드에 이벤트를 첨부하지 않습니다 (단, 일반 객체 허용).
		if ( !elemData ) {
			return;
		}

		// 호출자는 핸들러 대신 사용자 정의 데이터의 객체를 전달할 수 있습니다.
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// 잘못된 셀렉터가 연결시 예외를 throw하는지 확인합니다.
		// elem이 비 요소 노드 (예 : 문서) 인 경우 documentElement에 대한 평가
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// 핸들러가 고유 한 ID를 가지고 있는지 확인하여 나중에 찾거나 제거하는 데 사용합니다.
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// 요소의 이벤트 구조와 주 처리기를 초기화합니다 (첫 번째 경우).
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// jQuery.event.trigger ()의 두 번째 이벤트를 버립니다.
				// 페이지가 언로드 된 후 이벤트가 호출 될 때
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// 여러 이벤트를 공백으로 구분하여 처리합니다.
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// type *이어야합니다. 네임 스페이스 만있는 핸들러는 붙이지 않습니다.
			if ( !type ) {
				continue;
			}

			// 이벤트가 유형을 변경하면 변경된 유형에 대한 특수 이벤트 핸들러를 사용합니다.
			special = jQuery.event.special[ type ] || {};

			// selector가 정의 된 경우 특수 이벤트 api 유형을 결정하고 그렇지 않으면 지정된 유형을 결정합니다.
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// 새로 재설정 된 유형을 기반으로 특수 업데이트
			special = jQuery.event.special[ type ] || {};

			// handleObj가 모든 이벤트 핸들러에 전달됩니다.
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// 우리가 처음이라면 이벤트 핸들러 큐를 초기화한다.
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// 특수 이벤트 핸들러가 false를 반환하는 경우에만 addEventListener를 사용합니다.
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// 요소의 핸들러 목록에 대리자를 추가합니다.
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// 이벤트 최적화를 위해 어떤 이벤트가 사용되었는지 추적합니다.
			jQuery.event.global[ type ] = true;
		}

	},

	// 요소에서 이벤트 또는 이벤트 집합을 분리합니다.
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// 각 type.namespace 유형에 대해 한 번씩; 형식 생략 가능
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// 요소에 대한이 네임 스페이스의 모든 이벤트를 바인딩 해제합니다.
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// 일치하는 이벤트 제거
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// 뭔가를 제거하고 더 이상 처리기가없는 경우 일반 이벤트 처리기를 제거합니다.
			// (특별한 이벤트 처리기를 제거하는 동안 무한 재귀가 발생할 가능성이 없음)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// 더 이상 사용하지 않으면 데이터와 확장을 제거합니다.
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// 네이티브 이벤트 객체로부터 쓰기 가능한 jQuery.Event를 만든다.
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// (읽기 전용) 기본 이벤트가 아닌 수정 된 jQuery.Event를 사용하십시오.
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// 매핑 된 유형에 대해 preDispatch 훅을 호출하고 원하는 경우 보석금을 둡니다.
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// 핸들러를 결정한다.
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// 먼저 델리게이트를 실행합니다. 그들은 우리 밑에서 번식을 멈추고 싶어할지 모른다.
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// 트리거 된 이벤트는 1) 네임 스페이스가 없거나 2) 네임 스페이스가 있어야합니다.
				// 바운드 이벤트의 서브 세트 또는 서브 세트와 동일하거나 둘 다 (둘 다 네임 스페이스를 가질 수 없음).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// 매핑 된 유형에 대해 postDispatch 훅을 호출합니다.
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// 델리게이트 핸들러 찾기
		if ( delegateCount &&

			// 지원 : IE <= 9
			// 블랙홀 SVG <use> 인스턴스 트리 (trac-13180)
			cur.nodeType &&

			// 지원 : Firefox <= 42
			// 기본이 아닌 포인터 버튼을 나타내는 spec-violating 클릭을 억제합니다 (trac-3861).
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// 지원 : IE 11 만
			// ... 그러나 "button"-1 (gh-2343)을 가질 수있는 라디오 입력의 화살표 키 "클릭"이 아닙니다.
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// 비 요소 검사 안 함 (# 13208)
				// 사용 중지 된 요소에 대한 클릭을 처리하지 않습니다 (# 6911, # 8165, # 11382, # 11764).
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Object.prototype 속성과 충돌하지 않습니다 (# 13203).
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// 나머지 (직접 바인딩 된) 핸들러를 추가합니다.
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// 트리거 된 image.load 이벤트가 window.load로 버블 링되는 것을 방지합니다.
			noBubble: true
		},
		focus: {

			// 가능한 경우 네이티브 이벤트를 실행하므로 흐림 / 포커스 시퀀스가 ​​정확합니다.
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// 체크 상자의 경우 네이티브 이벤트를 실행하면 체크 된 상태가됩니다.
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// 브라우저 간 일관성 유지를 위해 링크에서 기본 .click ()을 실행하지 마십시오.
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// 지원 : Firefox 20 이상
				// returnValue 필드가 설정되어 있지 않으면 Firefox가 경고하지 않습니다..
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	//이 "if"가 일반 객체에 필요합니다.
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// 'new'키워드없이 인스턴스화 허용
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// 이벤트 객체
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// 문서 위로 부글 거리는 이벤트가 차단 된 것으로 표시되었을 수 있습니다.
		// 처리기가 트리를 아래로 내림; 올바른 값을 반영하십시오.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// 지원 : 안드로이드 <= 2.3 만
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// 대상 속성 만들기
		// 지원 : Safari <= 6 - 7 전용
		// 대상은 텍스트 노드가 아니어야합니다 (# 504, # 13143).
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// 이벤트 유형
	} else {
		this.type = src;
	}

	// 명시 적으로 제공된 속성을 이벤트 객체에 넣습니다.
	if ( props ) {
		jQuery.extend( this, props );
	}

	// 들어오는 이벤트에 타임 스탬프가 없으면 타임 스탬프를 만듭니다.
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// 고정으로 표시
	this[ jQuery.expando ] = true;
};

// jQuery.Event는 ECMAScript 언어 바인딩에 지정된 DOM3 이벤트를 기반으로합니다.
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// KeyEvent 및 MouseEvent 관련 소품을 포함한 모든 공통 이벤트 소품 포함
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// key 이벤트에 대한 추가
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// mouseover / out 및 event-time 검사를 사용하여 mouseenter / leave 이벤트 만들기
// 이벤트 위임이 jQuery에서 작동하도록합니다.
// pointerenter / pointerleave와 pointerover / pointerout에 대해 같은 작업을 수행합니다.
//
// 지원 : Safari 7 만 해당
// Safari가 mouseenter를 너무 자주 보냅니다. 만나다:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// 버그에 대한 설명 (이전 Chrome 버전에도 존재).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// mouseenter / leave의 경우 관련이 대상 외부에 있으면 처리기를 호출합니다.
			// NB : 마우스가 왼쪽 / 브라우저 창에 입력되면 관련 타겟 없음
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// (이벤트)가 jQuery.Event를 전달했습니다.
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );

return jQuery;
} );
