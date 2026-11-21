(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();function Sy(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var gx={exports:{}},Eu={},vx={exports:{}},dt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var dl=Symbol.for("react.element"),My=Symbol.for("react.portal"),wy=Symbol.for("react.fragment"),by=Symbol.for("react.strict_mode"),Ey=Symbol.for("react.profiler"),Ty=Symbol.for("react.provider"),Ay=Symbol.for("react.context"),Ny=Symbol.for("react.forward_ref"),Cy=Symbol.for("react.suspense"),Ry=Symbol.for("react.memo"),Py=Symbol.for("react.lazy"),Nm=Symbol.iterator;function Ly(t){return t===null||typeof t!="object"?null:(t=Nm&&t[Nm]||t["@@iterator"],typeof t=="function"?t:null)}var xx={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},_x=Object.assign,yx={};function Xa(t,e,n){this.props=t,this.context=e,this.refs=yx,this.updater=n||xx}Xa.prototype.isReactComponent={};Xa.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Xa.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Sx(){}Sx.prototype=Xa.prototype;function qf(t,e,n){this.props=t,this.context=e,this.refs=yx,this.updater=n||xx}var Kf=qf.prototype=new Sx;Kf.constructor=qf;_x(Kf,Xa.prototype);Kf.isPureReactComponent=!0;var Cm=Array.isArray,Mx=Object.prototype.hasOwnProperty,Zf={current:null},wx={key:!0,ref:!0,__self:!0,__source:!0};function bx(t,e,n){var i,s={},r=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(r=""+e.key),e)Mx.call(e,i)&&!wx.hasOwnProperty(i)&&(s[i]=e[i]);var l=arguments.length-2;if(l===1)s.children=n;else if(1<l){for(var c=Array(l),u=0;u<l;u++)c[u]=arguments[u+2];s.children=c}if(t&&t.defaultProps)for(i in l=t.defaultProps,l)s[i]===void 0&&(s[i]=l[i]);return{$$typeof:dl,type:t,key:r,ref:o,props:s,_owner:Zf.current}}function Dy(t,e){return{$$typeof:dl,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Qf(t){return typeof t=="object"&&t!==null&&t.$$typeof===dl}function ky(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Rm=/\/+/g;function Xu(t,e){return typeof t=="object"&&t!==null&&t.key!=null?ky(""+t.key):e.toString(36)}function Mc(t,e,n,i,s){var r=typeof t;(r==="undefined"||r==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(r){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case dl:case My:o=!0}}if(o)return o=t,s=s(o),t=i===""?"."+Xu(o,0):i,Cm(s)?(n="",t!=null&&(n=t.replace(Rm,"$&/")+"/"),Mc(s,e,n,"",function(u){return u})):s!=null&&(Qf(s)&&(s=Dy(s,n+(!s.key||o&&o.key===s.key?"":(""+s.key).replace(Rm,"$&/")+"/")+t)),e.push(s)),1;if(o=0,i=i===""?".":i+":",Cm(t))for(var l=0;l<t.length;l++){r=t[l];var c=i+Xu(r,l);o+=Mc(r,e,n,c,s)}else if(c=Ly(t),typeof c=="function")for(t=c.call(t),l=0;!(r=t.next()).done;)r=r.value,c=i+Xu(r,l++),o+=Mc(r,e,n,c,s);else if(r==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function bl(t,e,n){if(t==null)return t;var i=[],s=0;return Mc(t,i,"","",function(r){return e.call(n,r,s++)}),i}function Iy(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var Vn={current:null},wc={transition:null},Uy={ReactCurrentDispatcher:Vn,ReactCurrentBatchConfig:wc,ReactCurrentOwner:Zf};function Ex(){throw Error("act(...) is not supported in production builds of React.")}dt.Children={map:bl,forEach:function(t,e,n){bl(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return bl(t,function(){e++}),e},toArray:function(t){return bl(t,function(e){return e})||[]},only:function(t){if(!Qf(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};dt.Component=Xa;dt.Fragment=wy;dt.Profiler=Ey;dt.PureComponent=qf;dt.StrictMode=by;dt.Suspense=Cy;dt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Uy;dt.act=Ex;dt.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=_x({},t.props),s=t.key,r=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(r=e.ref,o=Zf.current),e.key!==void 0&&(s=""+e.key),t.type&&t.type.defaultProps)var l=t.type.defaultProps;for(c in e)Mx.call(e,c)&&!wx.hasOwnProperty(c)&&(i[c]=e[c]===void 0&&l!==void 0?l[c]:e[c])}var c=arguments.length-2;if(c===1)i.children=n;else if(1<c){l=Array(c);for(var u=0;u<c;u++)l[u]=arguments[u+2];i.children=l}return{$$typeof:dl,type:t.type,key:s,ref:r,props:i,_owner:o}};dt.createContext=function(t){return t={$$typeof:Ay,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:Ty,_context:t},t.Consumer=t};dt.createElement=bx;dt.createFactory=function(t){var e=bx.bind(null,t);return e.type=t,e};dt.createRef=function(){return{current:null}};dt.forwardRef=function(t){return{$$typeof:Ny,render:t}};dt.isValidElement=Qf;dt.lazy=function(t){return{$$typeof:Py,_payload:{_status:-1,_result:t},_init:Iy}};dt.memo=function(t,e){return{$$typeof:Ry,type:t,compare:e===void 0?null:e}};dt.startTransition=function(t){var e=wc.transition;wc.transition={};try{t()}finally{wc.transition=e}};dt.unstable_act=Ex;dt.useCallback=function(t,e){return Vn.current.useCallback(t,e)};dt.useContext=function(t){return Vn.current.useContext(t)};dt.useDebugValue=function(){};dt.useDeferredValue=function(t){return Vn.current.useDeferredValue(t)};dt.useEffect=function(t,e){return Vn.current.useEffect(t,e)};dt.useId=function(){return Vn.current.useId()};dt.useImperativeHandle=function(t,e,n){return Vn.current.useImperativeHandle(t,e,n)};dt.useInsertionEffect=function(t,e){return Vn.current.useInsertionEffect(t,e)};dt.useLayoutEffect=function(t,e){return Vn.current.useLayoutEffect(t,e)};dt.useMemo=function(t,e){return Vn.current.useMemo(t,e)};dt.useReducer=function(t,e,n){return Vn.current.useReducer(t,e,n)};dt.useRef=function(t){return Vn.current.useRef(t)};dt.useState=function(t){return Vn.current.useState(t)};dt.useSyncExternalStore=function(t,e,n){return Vn.current.useSyncExternalStore(t,e,n)};dt.useTransition=function(){return Vn.current.useTransition()};dt.version="18.3.1";vx.exports=dt;var Y=vx.exports;const jr=Sy(Y);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Fy=Y,Oy=Symbol.for("react.element"),jy=Symbol.for("react.fragment"),By=Object.prototype.hasOwnProperty,zy=Fy.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Hy={key:!0,ref:!0,__self:!0,__source:!0};function Tx(t,e,n){var i,s={},r=null,o=null;n!==void 0&&(r=""+n),e.key!==void 0&&(r=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)By.call(e,i)&&!Hy.hasOwnProperty(i)&&(s[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)s[i]===void 0&&(s[i]=e[i]);return{$$typeof:Oy,type:t,key:r,ref:o,props:s,_owner:zy.current}}Eu.Fragment=jy;Eu.jsx=Tx;Eu.jsxs=Tx;gx.exports=Eu;var a=gx.exports,Ax={exports:{}},hi={},Nx={exports:{}},Cx={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(G,H){var X=G.length;G.push(H);e:for(;0<X;){var J=X-1>>>1,ve=G[J];if(0<s(ve,H))G[J]=H,G[X]=ve,X=J;else break e}}function n(G){return G.length===0?null:G[0]}function i(G){if(G.length===0)return null;var H=G[0],X=G.pop();if(X!==H){G[0]=X;e:for(var J=0,ve=G.length,Ie=ve>>>1;J<Ie;){var Qe=2*(J+1)-1,re=G[Qe],fe=Qe+1,E=G[fe];if(0>s(re,X))fe<ve&&0>s(E,re)?(G[J]=E,G[fe]=X,J=fe):(G[J]=re,G[Qe]=X,J=Qe);else if(fe<ve&&0>s(E,X))G[J]=E,G[fe]=X,J=fe;else break e}}return H}function s(G,H){var X=G.sortIndex-H.sortIndex;return X!==0?X:G.id-H.id}if(typeof performance=="object"&&typeof performance.now=="function"){var r=performance;t.unstable_now=function(){return r.now()}}else{var o=Date,l=o.now();t.unstable_now=function(){return o.now()-l}}var c=[],u=[],d=1,p=null,h=3,m=!1,v=!1,w=!1,x=typeof setTimeout=="function"?setTimeout:null,f=typeof clearTimeout=="function"?clearTimeout:null,g=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function S(G){for(var H=n(u);H!==null;){if(H.callback===null)i(u);else if(H.startTime<=G)i(u),H.sortIndex=H.expirationTime,e(c,H);else break;H=n(u)}}function y(G){if(w=!1,S(G),!v)if(n(c)!==null)v=!0,Q(b);else{var H=n(u);H!==null&&W(y,H.startTime-G)}}function b(G,H){v=!1,w&&(w=!1,f(_),_=-1),m=!0;var X=h;try{for(S(H),p=n(c);p!==null&&(!(p.expirationTime>H)||G&&!k());){var J=p.callback;if(typeof J=="function"){p.callback=null,h=p.priorityLevel;var ve=J(p.expirationTime<=H);H=t.unstable_now(),typeof ve=="function"?p.callback=ve:p===n(c)&&i(c),S(H)}else i(c);p=n(c)}if(p!==null)var Ie=!0;else{var Qe=n(u);Qe!==null&&W(y,Qe.startTime-H),Ie=!1}return Ie}finally{p=null,h=X,m=!1}}var T=!1,N=null,_=-1,C=5,R=-1;function k(){return!(t.unstable_now()-R<C)}function B(){if(N!==null){var G=t.unstable_now();R=G;var H=!0;try{H=N(!0,G)}finally{H?D():(T=!1,N=null)}}else T=!1}var D;if(typeof g=="function")D=function(){g(B)};else if(typeof MessageChannel<"u"){var P=new MessageChannel,j=P.port2;P.port1.onmessage=B,D=function(){j.postMessage(null)}}else D=function(){x(B,0)};function Q(G){N=G,T||(T=!0,D())}function W(G,H){_=x(function(){G(t.unstable_now())},H)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(G){G.callback=null},t.unstable_continueExecution=function(){v||m||(v=!0,Q(b))},t.unstable_forceFrameRate=function(G){0>G||125<G?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):C=0<G?Math.floor(1e3/G):5},t.unstable_getCurrentPriorityLevel=function(){return h},t.unstable_getFirstCallbackNode=function(){return n(c)},t.unstable_next=function(G){switch(h){case 1:case 2:case 3:var H=3;break;default:H=h}var X=h;h=H;try{return G()}finally{h=X}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(G,H){switch(G){case 1:case 2:case 3:case 4:case 5:break;default:G=3}var X=h;h=G;try{return H()}finally{h=X}},t.unstable_scheduleCallback=function(G,H,X){var J=t.unstable_now();switch(typeof X=="object"&&X!==null?(X=X.delay,X=typeof X=="number"&&0<X?J+X:J):X=J,G){case 1:var ve=-1;break;case 2:ve=250;break;case 5:ve=1073741823;break;case 4:ve=1e4;break;default:ve=5e3}return ve=X+ve,G={id:d++,callback:H,priorityLevel:G,startTime:X,expirationTime:ve,sortIndex:-1},X>J?(G.sortIndex=X,e(u,G),n(c)===null&&G===n(u)&&(w?(f(_),_=-1):w=!0,W(y,X-J))):(G.sortIndex=ve,e(c,G),v||m||(v=!0,Q(b))),G},t.unstable_shouldYield=k,t.unstable_wrapCallback=function(G){var H=h;return function(){var X=h;h=H;try{return G.apply(this,arguments)}finally{h=X}}}})(Cx);Nx.exports=Cx;var Vy=Nx.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Gy=Y,di=Vy;function de(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Rx=new Set,Ho={};function Br(t,e){Fa(t,e),Fa(t+"Capture",e)}function Fa(t,e){for(Ho[t]=e,t=0;t<e.length;t++)Rx.add(e[t])}var bs=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ah=Object.prototype.hasOwnProperty,Wy=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Pm={},Lm={};function $y(t){return ah.call(Lm,t)?!0:ah.call(Pm,t)?!1:Wy.test(t)?Lm[t]=!0:(Pm[t]=!0,!1)}function Xy(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function Yy(t,e,n,i){if(e===null||typeof e>"u"||Xy(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function Gn(t,e,n,i,s,r,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=s,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=r,this.removeEmptyString=o}var Mn={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Mn[t]=new Gn(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Mn[e]=new Gn(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Mn[t]=new Gn(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Mn[t]=new Gn(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Mn[t]=new Gn(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Mn[t]=new Gn(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Mn[t]=new Gn(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Mn[t]=new Gn(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Mn[t]=new Gn(t,5,!1,t.toLowerCase(),null,!1,!1)});var Jf=/[\-:]([a-z])/g;function ep(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Jf,ep);Mn[e]=new Gn(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Jf,ep);Mn[e]=new Gn(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Jf,ep);Mn[e]=new Gn(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Mn[t]=new Gn(t,1,!1,t.toLowerCase(),null,!1,!1)});Mn.xlinkHref=new Gn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Mn[t]=new Gn(t,1,!1,t.toLowerCase(),null,!0,!0)});function tp(t,e,n,i){var s=Mn.hasOwnProperty(e)?Mn[e]:null;(s!==null?s.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(Yy(e,n,s,i)&&(n=null),i||s===null?$y(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):s.mustUseProperty?t[s.propertyName]=n===null?s.type===3?!1:"":n:(e=s.attributeName,i=s.attributeNamespace,n===null?t.removeAttribute(e):(s=s.type,n=s===3||s===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Cs=Gy.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,El=Symbol.for("react.element"),pa=Symbol.for("react.portal"),ma=Symbol.for("react.fragment"),np=Symbol.for("react.strict_mode"),oh=Symbol.for("react.profiler"),Px=Symbol.for("react.provider"),Lx=Symbol.for("react.context"),ip=Symbol.for("react.forward_ref"),lh=Symbol.for("react.suspense"),ch=Symbol.for("react.suspense_list"),sp=Symbol.for("react.memo"),Bs=Symbol.for("react.lazy"),Dx=Symbol.for("react.offscreen"),Dm=Symbol.iterator;function no(t){return t===null||typeof t!="object"?null:(t=Dm&&t[Dm]||t["@@iterator"],typeof t=="function"?t:null)}var $t=Object.assign,Yu;function bo(t){if(Yu===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Yu=e&&e[1]||""}return`
`+Yu+t}var qu=!1;function Ku(t,e){if(!t||qu)return"";qu=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(u){var i=u}Reflect.construct(t,[],e)}else{try{e.call()}catch(u){i=u}t.call(e.prototype)}else{try{throw Error()}catch(u){i=u}t()}}catch(u){if(u&&i&&typeof u.stack=="string"){for(var s=u.stack.split(`
`),r=i.stack.split(`
`),o=s.length-1,l=r.length-1;1<=o&&0<=l&&s[o]!==r[l];)l--;for(;1<=o&&0<=l;o--,l--)if(s[o]!==r[l]){if(o!==1||l!==1)do if(o--,l--,0>l||s[o]!==r[l]){var c=`
`+s[o].replace(" at new "," at ");return t.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",t.displayName)),c}while(1<=o&&0<=l);break}}}finally{qu=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?bo(t):""}function qy(t){switch(t.tag){case 5:return bo(t.type);case 16:return bo("Lazy");case 13:return bo("Suspense");case 19:return bo("SuspenseList");case 0:case 2:case 15:return t=Ku(t.type,!1),t;case 11:return t=Ku(t.type.render,!1),t;case 1:return t=Ku(t.type,!0),t;default:return""}}function uh(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case ma:return"Fragment";case pa:return"Portal";case oh:return"Profiler";case np:return"StrictMode";case lh:return"Suspense";case ch:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Lx:return(t.displayName||"Context")+".Consumer";case Px:return(t._context.displayName||"Context")+".Provider";case ip:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case sp:return e=t.displayName||null,e!==null?e:uh(t.type)||"Memo";case Bs:e=t._payload,t=t._init;try{return uh(t(e))}catch{}}return null}function Ky(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return uh(e);case 8:return e===np?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function ir(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function kx(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function Zy(t){var e=kx(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var s=n.get,r=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return s.call(this)},set:function(o){i=""+o,r.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Tl(t){t._valueTracker||(t._valueTracker=Zy(t))}function Ix(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=kx(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function Hc(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function dh(t,e){var n=e.checked;return $t({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function km(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=ir(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Ux(t,e){e=e.checked,e!=null&&tp(t,"checked",e,!1)}function hh(t,e){Ux(t,e);var n=ir(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?fh(t,e.type,n):e.hasOwnProperty("defaultValue")&&fh(t,e.type,ir(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Im(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function fh(t,e,n){(e!=="number"||Hc(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Eo=Array.isArray;function Na(t,e,n,i){if(t=t.options,e){e={};for(var s=0;s<n.length;s++)e["$"+n[s]]=!0;for(n=0;n<t.length;n++)s=e.hasOwnProperty("$"+t[n].value),t[n].selected!==s&&(t[n].selected=s),s&&i&&(t[n].defaultSelected=!0)}else{for(n=""+ir(n),e=null,s=0;s<t.length;s++){if(t[s].value===n){t[s].selected=!0,i&&(t[s].defaultSelected=!0);return}e!==null||t[s].disabled||(e=t[s])}e!==null&&(e.selected=!0)}}function ph(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(de(91));return $t({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Um(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(de(92));if(Eo(n)){if(1<n.length)throw Error(de(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:ir(n)}}function Fx(t,e){var n=ir(e.value),i=ir(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function Fm(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Ox(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function mh(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Ox(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Al,jx=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,s){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,s)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Al=Al||document.createElement("div"),Al.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Al.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Vo(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Ro={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Qy=["Webkit","ms","Moz","O"];Object.keys(Ro).forEach(function(t){Qy.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Ro[e]=Ro[t]})});function Bx(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Ro.hasOwnProperty(t)&&Ro[t]?(""+e).trim():e+"px"}function zx(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,s=Bx(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,s):t[n]=s}}var Jy=$t({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function gh(t,e){if(e){if(Jy[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(de(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(de(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(de(61))}if(e.style!=null&&typeof e.style!="object")throw Error(de(62))}}function vh(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var xh=null;function rp(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var _h=null,Ca=null,Ra=null;function Om(t){if(t=pl(t)){if(typeof _h!="function")throw Error(de(280));var e=t.stateNode;e&&(e=Ru(e),_h(t.stateNode,t.type,e))}}function Hx(t){Ca?Ra?Ra.push(t):Ra=[t]:Ca=t}function Vx(){if(Ca){var t=Ca,e=Ra;if(Ra=Ca=null,Om(t),e)for(t=0;t<e.length;t++)Om(e[t])}}function Gx(t,e){return t(e)}function Wx(){}var Zu=!1;function $x(t,e,n){if(Zu)return t(e,n);Zu=!0;try{return Gx(t,e,n)}finally{Zu=!1,(Ca!==null||Ra!==null)&&(Wx(),Vx())}}function Go(t,e){var n=t.stateNode;if(n===null)return null;var i=Ru(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(de(231,e,typeof n));return n}var yh=!1;if(bs)try{var io={};Object.defineProperty(io,"passive",{get:function(){yh=!0}}),window.addEventListener("test",io,io),window.removeEventListener("test",io,io)}catch{yh=!1}function eS(t,e,n,i,s,r,o,l,c){var u=Array.prototype.slice.call(arguments,3);try{e.apply(n,u)}catch(d){this.onError(d)}}var Po=!1,Vc=null,Gc=!1,Sh=null,tS={onError:function(t){Po=!0,Vc=t}};function nS(t,e,n,i,s,r,o,l,c){Po=!1,Vc=null,eS.apply(tS,arguments)}function iS(t,e,n,i,s,r,o,l,c){if(nS.apply(this,arguments),Po){if(Po){var u=Vc;Po=!1,Vc=null}else throw Error(de(198));Gc||(Gc=!0,Sh=u)}}function zr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Xx(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function jm(t){if(zr(t)!==t)throw Error(de(188))}function sS(t){var e=t.alternate;if(!e){if(e=zr(t),e===null)throw Error(de(188));return e!==t?null:t}for(var n=t,i=e;;){var s=n.return;if(s===null)break;var r=s.alternate;if(r===null){if(i=s.return,i!==null){n=i;continue}break}if(s.child===r.child){for(r=s.child;r;){if(r===n)return jm(s),t;if(r===i)return jm(s),e;r=r.sibling}throw Error(de(188))}if(n.return!==i.return)n=s,i=r;else{for(var o=!1,l=s.child;l;){if(l===n){o=!0,n=s,i=r;break}if(l===i){o=!0,i=s,n=r;break}l=l.sibling}if(!o){for(l=r.child;l;){if(l===n){o=!0,n=r,i=s;break}if(l===i){o=!0,i=r,n=s;break}l=l.sibling}if(!o)throw Error(de(189))}}if(n.alternate!==i)throw Error(de(190))}if(n.tag!==3)throw Error(de(188));return n.stateNode.current===n?t:e}function Yx(t){return t=sS(t),t!==null?qx(t):null}function qx(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=qx(t);if(e!==null)return e;t=t.sibling}return null}var Kx=di.unstable_scheduleCallback,Bm=di.unstable_cancelCallback,rS=di.unstable_shouldYield,aS=di.unstable_requestPaint,Kt=di.unstable_now,oS=di.unstable_getCurrentPriorityLevel,ap=di.unstable_ImmediatePriority,Zx=di.unstable_UserBlockingPriority,Wc=di.unstable_NormalPriority,lS=di.unstable_LowPriority,Qx=di.unstable_IdlePriority,Tu=null,es=null;function cS(t){if(es&&typeof es.onCommitFiberRoot=="function")try{es.onCommitFiberRoot(Tu,t,void 0,(t.current.flags&128)===128)}catch{}}var ji=Math.clz32?Math.clz32:hS,uS=Math.log,dS=Math.LN2;function hS(t){return t>>>=0,t===0?32:31-(uS(t)/dS|0)|0}var Nl=64,Cl=4194304;function To(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function $c(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,s=t.suspendedLanes,r=t.pingedLanes,o=n&268435455;if(o!==0){var l=o&~s;l!==0?i=To(l):(r&=o,r!==0&&(i=To(r)))}else o=n&~s,o!==0?i=To(o):r!==0&&(i=To(r));if(i===0)return 0;if(e!==0&&e!==i&&!(e&s)&&(s=i&-i,r=e&-e,s>=r||s===16&&(r&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-ji(e),s=1<<n,i|=t[n],e&=~s;return i}function fS(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function pS(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,s=t.expirationTimes,r=t.pendingLanes;0<r;){var o=31-ji(r),l=1<<o,c=s[o];c===-1?(!(l&n)||l&i)&&(s[o]=fS(l,e)):c<=e&&(t.expiredLanes|=l),r&=~l}}function Mh(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Jx(){var t=Nl;return Nl<<=1,!(Nl&4194240)&&(Nl=64),t}function Qu(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function hl(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-ji(e),t[e]=n}function mS(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var s=31-ji(n),r=1<<s;e[s]=0,i[s]=-1,t[s]=-1,n&=~r}}function op(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-ji(n),s=1<<i;s&e|t[i]&e&&(t[i]|=e),n&=~s}}var Pt=0;function e0(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var t0,lp,n0,i0,s0,wh=!1,Rl=[],qs=null,Ks=null,Zs=null,Wo=new Map,$o=new Map,Gs=[],gS="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function zm(t,e){switch(t){case"focusin":case"focusout":qs=null;break;case"dragenter":case"dragleave":Ks=null;break;case"mouseover":case"mouseout":Zs=null;break;case"pointerover":case"pointerout":Wo.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":$o.delete(e.pointerId)}}function so(t,e,n,i,s,r){return t===null||t.nativeEvent!==r?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:r,targetContainers:[s]},e!==null&&(e=pl(e),e!==null&&lp(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,s!==null&&e.indexOf(s)===-1&&e.push(s),t)}function vS(t,e,n,i,s){switch(e){case"focusin":return qs=so(qs,t,e,n,i,s),!0;case"dragenter":return Ks=so(Ks,t,e,n,i,s),!0;case"mouseover":return Zs=so(Zs,t,e,n,i,s),!0;case"pointerover":var r=s.pointerId;return Wo.set(r,so(Wo.get(r)||null,t,e,n,i,s)),!0;case"gotpointercapture":return r=s.pointerId,$o.set(r,so($o.get(r)||null,t,e,n,i,s)),!0}return!1}function r0(t){var e=Sr(t.target);if(e!==null){var n=zr(e);if(n!==null){if(e=n.tag,e===13){if(e=Xx(n),e!==null){t.blockedOn=e,s0(t.priority,function(){n0(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function bc(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=bh(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);xh=i,n.target.dispatchEvent(i),xh=null}else return e=pl(n),e!==null&&lp(e),t.blockedOn=n,!1;e.shift()}return!0}function Hm(t,e,n){bc(t)&&n.delete(e)}function xS(){wh=!1,qs!==null&&bc(qs)&&(qs=null),Ks!==null&&bc(Ks)&&(Ks=null),Zs!==null&&bc(Zs)&&(Zs=null),Wo.forEach(Hm),$o.forEach(Hm)}function ro(t,e){t.blockedOn===e&&(t.blockedOn=null,wh||(wh=!0,di.unstable_scheduleCallback(di.unstable_NormalPriority,xS)))}function Xo(t){function e(s){return ro(s,t)}if(0<Rl.length){ro(Rl[0],t);for(var n=1;n<Rl.length;n++){var i=Rl[n];i.blockedOn===t&&(i.blockedOn=null)}}for(qs!==null&&ro(qs,t),Ks!==null&&ro(Ks,t),Zs!==null&&ro(Zs,t),Wo.forEach(e),$o.forEach(e),n=0;n<Gs.length;n++)i=Gs[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Gs.length&&(n=Gs[0],n.blockedOn===null);)r0(n),n.blockedOn===null&&Gs.shift()}var Pa=Cs.ReactCurrentBatchConfig,Xc=!0;function _S(t,e,n,i){var s=Pt,r=Pa.transition;Pa.transition=null;try{Pt=1,cp(t,e,n,i)}finally{Pt=s,Pa.transition=r}}function yS(t,e,n,i){var s=Pt,r=Pa.transition;Pa.transition=null;try{Pt=4,cp(t,e,n,i)}finally{Pt=s,Pa.transition=r}}function cp(t,e,n,i){if(Xc){var s=bh(t,e,n,i);if(s===null)ld(t,e,i,Yc,n),zm(t,i);else if(vS(s,t,e,n,i))i.stopPropagation();else if(zm(t,i),e&4&&-1<gS.indexOf(t)){for(;s!==null;){var r=pl(s);if(r!==null&&t0(r),r=bh(t,e,n,i),r===null&&ld(t,e,i,Yc,n),r===s)break;s=r}s!==null&&i.stopPropagation()}else ld(t,e,i,null,n)}}var Yc=null;function bh(t,e,n,i){if(Yc=null,t=rp(i),t=Sr(t),t!==null)if(e=zr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Xx(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Yc=t,null}function a0(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(oS()){case ap:return 1;case Zx:return 4;case Wc:case lS:return 16;case Qx:return 536870912;default:return 16}default:return 16}}var Xs=null,up=null,Ec=null;function o0(){if(Ec)return Ec;var t,e=up,n=e.length,i,s="value"in Xs?Xs.value:Xs.textContent,r=s.length;for(t=0;t<n&&e[t]===s[t];t++);var o=n-t;for(i=1;i<=o&&e[n-i]===s[r-i];i++);return Ec=s.slice(t,1<i?1-i:void 0)}function Tc(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Pl(){return!0}function Vm(){return!1}function fi(t){function e(n,i,s,r,o){this._reactName=n,this._targetInst=s,this.type=i,this.nativeEvent=r,this.target=o,this.currentTarget=null;for(var l in t)t.hasOwnProperty(l)&&(n=t[l],this[l]=n?n(r):r[l]);return this.isDefaultPrevented=(r.defaultPrevented!=null?r.defaultPrevented:r.returnValue===!1)?Pl:Vm,this.isPropagationStopped=Vm,this}return $t(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Pl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Pl)},persist:function(){},isPersistent:Pl}),e}var Ya={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},dp=fi(Ya),fl=$t({},Ya,{view:0,detail:0}),SS=fi(fl),Ju,ed,ao,Au=$t({},fl,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:hp,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==ao&&(ao&&t.type==="mousemove"?(Ju=t.screenX-ao.screenX,ed=t.screenY-ao.screenY):ed=Ju=0,ao=t),Ju)},movementY:function(t){return"movementY"in t?t.movementY:ed}}),Gm=fi(Au),MS=$t({},Au,{dataTransfer:0}),wS=fi(MS),bS=$t({},fl,{relatedTarget:0}),td=fi(bS),ES=$t({},Ya,{animationName:0,elapsedTime:0,pseudoElement:0}),TS=fi(ES),AS=$t({},Ya,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),NS=fi(AS),CS=$t({},Ya,{data:0}),Wm=fi(CS),RS={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},PS={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},LS={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function DS(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=LS[t])?!!e[t]:!1}function hp(){return DS}var kS=$t({},fl,{key:function(t){if(t.key){var e=RS[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Tc(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?PS[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:hp,charCode:function(t){return t.type==="keypress"?Tc(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Tc(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),IS=fi(kS),US=$t({},Au,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),$m=fi(US),FS=$t({},fl,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:hp}),OS=fi(FS),jS=$t({},Ya,{propertyName:0,elapsedTime:0,pseudoElement:0}),BS=fi(jS),zS=$t({},Au,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),HS=fi(zS),VS=[9,13,27,32],fp=bs&&"CompositionEvent"in window,Lo=null;bs&&"documentMode"in document&&(Lo=document.documentMode);var GS=bs&&"TextEvent"in window&&!Lo,l0=bs&&(!fp||Lo&&8<Lo&&11>=Lo),Xm=" ",Ym=!1;function c0(t,e){switch(t){case"keyup":return VS.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function u0(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var ga=!1;function WS(t,e){switch(t){case"compositionend":return u0(e);case"keypress":return e.which!==32?null:(Ym=!0,Xm);case"textInput":return t=e.data,t===Xm&&Ym?null:t;default:return null}}function $S(t,e){if(ga)return t==="compositionend"||!fp&&c0(t,e)?(t=o0(),Ec=up=Xs=null,ga=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return l0&&e.locale!=="ko"?null:e.data;default:return null}}var XS={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function qm(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!XS[t.type]:e==="textarea"}function d0(t,e,n,i){Hx(i),e=qc(e,"onChange"),0<e.length&&(n=new dp("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var Do=null,Yo=null;function YS(t){M0(t,0)}function Nu(t){var e=_a(t);if(Ix(e))return t}function qS(t,e){if(t==="change")return e}var h0=!1;if(bs){var nd;if(bs){var id="oninput"in document;if(!id){var Km=document.createElement("div");Km.setAttribute("oninput","return;"),id=typeof Km.oninput=="function"}nd=id}else nd=!1;h0=nd&&(!document.documentMode||9<document.documentMode)}function Zm(){Do&&(Do.detachEvent("onpropertychange",f0),Yo=Do=null)}function f0(t){if(t.propertyName==="value"&&Nu(Yo)){var e=[];d0(e,Yo,t,rp(t)),$x(YS,e)}}function KS(t,e,n){t==="focusin"?(Zm(),Do=e,Yo=n,Do.attachEvent("onpropertychange",f0)):t==="focusout"&&Zm()}function ZS(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Nu(Yo)}function QS(t,e){if(t==="click")return Nu(e)}function JS(t,e){if(t==="input"||t==="change")return Nu(e)}function eM(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var zi=typeof Object.is=="function"?Object.is:eM;function qo(t,e){if(zi(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var s=n[i];if(!ah.call(e,s)||!zi(t[s],e[s]))return!1}return!0}function Qm(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Jm(t,e){var n=Qm(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Qm(n)}}function p0(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?p0(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function m0(){for(var t=window,e=Hc();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Hc(t.document)}return e}function pp(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function tM(t){var e=m0(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&p0(n.ownerDocument.documentElement,n)){if(i!==null&&pp(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var s=n.textContent.length,r=Math.min(i.start,s);i=i.end===void 0?r:Math.min(i.end,s),!t.extend&&r>i&&(s=i,i=r,r=s),s=Jm(n,r);var o=Jm(n,i);s&&o&&(t.rangeCount!==1||t.anchorNode!==s.node||t.anchorOffset!==s.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(s.node,s.offset),t.removeAllRanges(),r>i?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var nM=bs&&"documentMode"in document&&11>=document.documentMode,va=null,Eh=null,ko=null,Th=!1;function eg(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Th||va==null||va!==Hc(i)||(i=va,"selectionStart"in i&&pp(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),ko&&qo(ko,i)||(ko=i,i=qc(Eh,"onSelect"),0<i.length&&(e=new dp("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=va)))}function Ll(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var xa={animationend:Ll("Animation","AnimationEnd"),animationiteration:Ll("Animation","AnimationIteration"),animationstart:Ll("Animation","AnimationStart"),transitionend:Ll("Transition","TransitionEnd")},sd={},g0={};bs&&(g0=document.createElement("div").style,"AnimationEvent"in window||(delete xa.animationend.animation,delete xa.animationiteration.animation,delete xa.animationstart.animation),"TransitionEvent"in window||delete xa.transitionend.transition);function Cu(t){if(sd[t])return sd[t];if(!xa[t])return t;var e=xa[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in g0)return sd[t]=e[n];return t}var v0=Cu("animationend"),x0=Cu("animationiteration"),_0=Cu("animationstart"),y0=Cu("transitionend"),S0=new Map,tg="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function ar(t,e){S0.set(t,e),Br(e,[t])}for(var rd=0;rd<tg.length;rd++){var ad=tg[rd],iM=ad.toLowerCase(),sM=ad[0].toUpperCase()+ad.slice(1);ar(iM,"on"+sM)}ar(v0,"onAnimationEnd");ar(x0,"onAnimationIteration");ar(_0,"onAnimationStart");ar("dblclick","onDoubleClick");ar("focusin","onFocus");ar("focusout","onBlur");ar(y0,"onTransitionEnd");Fa("onMouseEnter",["mouseout","mouseover"]);Fa("onMouseLeave",["mouseout","mouseover"]);Fa("onPointerEnter",["pointerout","pointerover"]);Fa("onPointerLeave",["pointerout","pointerover"]);Br("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Br("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Br("onBeforeInput",["compositionend","keypress","textInput","paste"]);Br("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Br("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Br("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ao="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),rM=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ao));function ng(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,iS(i,e,void 0,t),t.currentTarget=null}function M0(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],s=i.event;i=i.listeners;e:{var r=void 0;if(e)for(var o=i.length-1;0<=o;o--){var l=i[o],c=l.instance,u=l.currentTarget;if(l=l.listener,c!==r&&s.isPropagationStopped())break e;ng(s,l,u),r=c}else for(o=0;o<i.length;o++){if(l=i[o],c=l.instance,u=l.currentTarget,l=l.listener,c!==r&&s.isPropagationStopped())break e;ng(s,l,u),r=c}}}if(Gc)throw t=Sh,Gc=!1,Sh=null,t}function Ft(t,e){var n=e[Ph];n===void 0&&(n=e[Ph]=new Set);var i=t+"__bubble";n.has(i)||(w0(e,t,2,!1),n.add(i))}function od(t,e,n){var i=0;e&&(i|=4),w0(n,t,i,e)}var Dl="_reactListening"+Math.random().toString(36).slice(2);function Ko(t){if(!t[Dl]){t[Dl]=!0,Rx.forEach(function(n){n!=="selectionchange"&&(rM.has(n)||od(n,!1,t),od(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Dl]||(e[Dl]=!0,od("selectionchange",!1,e))}}function w0(t,e,n,i){switch(a0(e)){case 1:var s=_S;break;case 4:s=yS;break;default:s=cp}n=s.bind(null,e,n,t),s=void 0,!yh||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(s=!0),i?s!==void 0?t.addEventListener(e,n,{capture:!0,passive:s}):t.addEventListener(e,n,!0):s!==void 0?t.addEventListener(e,n,{passive:s}):t.addEventListener(e,n,!1)}function ld(t,e,n,i,s){var r=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var l=i.stateNode.containerInfo;if(l===s||l.nodeType===8&&l.parentNode===s)break;if(o===4)for(o=i.return;o!==null;){var c=o.tag;if((c===3||c===4)&&(c=o.stateNode.containerInfo,c===s||c.nodeType===8&&c.parentNode===s))return;o=o.return}for(;l!==null;){if(o=Sr(l),o===null)return;if(c=o.tag,c===5||c===6){i=r=o;continue e}l=l.parentNode}}i=i.return}$x(function(){var u=r,d=rp(n),p=[];e:{var h=S0.get(t);if(h!==void 0){var m=dp,v=t;switch(t){case"keypress":if(Tc(n)===0)break e;case"keydown":case"keyup":m=IS;break;case"focusin":v="focus",m=td;break;case"focusout":v="blur",m=td;break;case"beforeblur":case"afterblur":m=td;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":m=Gm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":m=wS;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":m=OS;break;case v0:case x0:case _0:m=TS;break;case y0:m=BS;break;case"scroll":m=SS;break;case"wheel":m=HS;break;case"copy":case"cut":case"paste":m=NS;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":m=$m}var w=(e&4)!==0,x=!w&&t==="scroll",f=w?h!==null?h+"Capture":null:h;w=[];for(var g=u,S;g!==null;){S=g;var y=S.stateNode;if(S.tag===5&&y!==null&&(S=y,f!==null&&(y=Go(g,f),y!=null&&w.push(Zo(g,y,S)))),x)break;g=g.return}0<w.length&&(h=new m(h,v,null,n,d),p.push({event:h,listeners:w}))}}if(!(e&7)){e:{if(h=t==="mouseover"||t==="pointerover",m=t==="mouseout"||t==="pointerout",h&&n!==xh&&(v=n.relatedTarget||n.fromElement)&&(Sr(v)||v[Es]))break e;if((m||h)&&(h=d.window===d?d:(h=d.ownerDocument)?h.defaultView||h.parentWindow:window,m?(v=n.relatedTarget||n.toElement,m=u,v=v?Sr(v):null,v!==null&&(x=zr(v),v!==x||v.tag!==5&&v.tag!==6)&&(v=null)):(m=null,v=u),m!==v)){if(w=Gm,y="onMouseLeave",f="onMouseEnter",g="mouse",(t==="pointerout"||t==="pointerover")&&(w=$m,y="onPointerLeave",f="onPointerEnter",g="pointer"),x=m==null?h:_a(m),S=v==null?h:_a(v),h=new w(y,g+"leave",m,n,d),h.target=x,h.relatedTarget=S,y=null,Sr(d)===u&&(w=new w(f,g+"enter",v,n,d),w.target=S,w.relatedTarget=x,y=w),x=y,m&&v)t:{for(w=m,f=v,g=0,S=w;S;S=Yr(S))g++;for(S=0,y=f;y;y=Yr(y))S++;for(;0<g-S;)w=Yr(w),g--;for(;0<S-g;)f=Yr(f),S--;for(;g--;){if(w===f||f!==null&&w===f.alternate)break t;w=Yr(w),f=Yr(f)}w=null}else w=null;m!==null&&ig(p,h,m,w,!1),v!==null&&x!==null&&ig(p,x,v,w,!0)}}e:{if(h=u?_a(u):window,m=h.nodeName&&h.nodeName.toLowerCase(),m==="select"||m==="input"&&h.type==="file")var b=qS;else if(qm(h))if(h0)b=JS;else{b=ZS;var T=KS}else(m=h.nodeName)&&m.toLowerCase()==="input"&&(h.type==="checkbox"||h.type==="radio")&&(b=QS);if(b&&(b=b(t,u))){d0(p,b,n,d);break e}T&&T(t,h,u),t==="focusout"&&(T=h._wrapperState)&&T.controlled&&h.type==="number"&&fh(h,"number",h.value)}switch(T=u?_a(u):window,t){case"focusin":(qm(T)||T.contentEditable==="true")&&(va=T,Eh=u,ko=null);break;case"focusout":ko=Eh=va=null;break;case"mousedown":Th=!0;break;case"contextmenu":case"mouseup":case"dragend":Th=!1,eg(p,n,d);break;case"selectionchange":if(nM)break;case"keydown":case"keyup":eg(p,n,d)}var N;if(fp)e:{switch(t){case"compositionstart":var _="onCompositionStart";break e;case"compositionend":_="onCompositionEnd";break e;case"compositionupdate":_="onCompositionUpdate";break e}_=void 0}else ga?c0(t,n)&&(_="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(_="onCompositionStart");_&&(l0&&n.locale!=="ko"&&(ga||_!=="onCompositionStart"?_==="onCompositionEnd"&&ga&&(N=o0()):(Xs=d,up="value"in Xs?Xs.value:Xs.textContent,ga=!0)),T=qc(u,_),0<T.length&&(_=new Wm(_,t,null,n,d),p.push({event:_,listeners:T}),N?_.data=N:(N=u0(n),N!==null&&(_.data=N)))),(N=GS?WS(t,n):$S(t,n))&&(u=qc(u,"onBeforeInput"),0<u.length&&(d=new Wm("onBeforeInput","beforeinput",null,n,d),p.push({event:d,listeners:u}),d.data=N))}M0(p,e)})}function Zo(t,e,n){return{instance:t,listener:e,currentTarget:n}}function qc(t,e){for(var n=e+"Capture",i=[];t!==null;){var s=t,r=s.stateNode;s.tag===5&&r!==null&&(s=r,r=Go(t,n),r!=null&&i.unshift(Zo(t,r,s)),r=Go(t,e),r!=null&&i.push(Zo(t,r,s))),t=t.return}return i}function Yr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function ig(t,e,n,i,s){for(var r=e._reactName,o=[];n!==null&&n!==i;){var l=n,c=l.alternate,u=l.stateNode;if(c!==null&&c===i)break;l.tag===5&&u!==null&&(l=u,s?(c=Go(n,r),c!=null&&o.unshift(Zo(n,c,l))):s||(c=Go(n,r),c!=null&&o.push(Zo(n,c,l)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var aM=/\r\n?/g,oM=/\u0000|\uFFFD/g;function sg(t){return(typeof t=="string"?t:""+t).replace(aM,`
`).replace(oM,"")}function kl(t,e,n){if(e=sg(e),sg(t)!==e&&n)throw Error(de(425))}function Kc(){}var Ah=null,Nh=null;function Ch(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Rh=typeof setTimeout=="function"?setTimeout:void 0,lM=typeof clearTimeout=="function"?clearTimeout:void 0,rg=typeof Promise=="function"?Promise:void 0,cM=typeof queueMicrotask=="function"?queueMicrotask:typeof rg<"u"?function(t){return rg.resolve(null).then(t).catch(uM)}:Rh;function uM(t){setTimeout(function(){throw t})}function cd(t,e){var n=e,i=0;do{var s=n.nextSibling;if(t.removeChild(n),s&&s.nodeType===8)if(n=s.data,n==="/$"){if(i===0){t.removeChild(s),Xo(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=s}while(n);Xo(e)}function Qs(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function ag(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var qa=Math.random().toString(36).slice(2),Zi="__reactFiber$"+qa,Qo="__reactProps$"+qa,Es="__reactContainer$"+qa,Ph="__reactEvents$"+qa,dM="__reactListeners$"+qa,hM="__reactHandles$"+qa;function Sr(t){var e=t[Zi];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Es]||n[Zi]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=ag(t);t!==null;){if(n=t[Zi])return n;t=ag(t)}return e}t=n,n=t.parentNode}return null}function pl(t){return t=t[Zi]||t[Es],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function _a(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(de(33))}function Ru(t){return t[Qo]||null}var Lh=[],ya=-1;function or(t){return{current:t}}function Bt(t){0>ya||(t.current=Lh[ya],Lh[ya]=null,ya--)}function It(t,e){ya++,Lh[ya]=t.current,t.current=e}var sr={},kn=or(sr),qn=or(!1),Cr=sr;function Oa(t,e){var n=t.type.contextTypes;if(!n)return sr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var s={},r;for(r in n)s[r]=e[r];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=s),s}function Kn(t){return t=t.childContextTypes,t!=null}function Zc(){Bt(qn),Bt(kn)}function og(t,e,n){if(kn.current!==sr)throw Error(de(168));It(kn,e),It(qn,n)}function b0(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var s in i)if(!(s in e))throw Error(de(108,Ky(t)||"Unknown",s));return $t({},n,i)}function Qc(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||sr,Cr=kn.current,It(kn,t),It(qn,qn.current),!0}function lg(t,e,n){var i=t.stateNode;if(!i)throw Error(de(169));n?(t=b0(t,e,Cr),i.__reactInternalMemoizedMergedChildContext=t,Bt(qn),Bt(kn),It(kn,t)):Bt(qn),It(qn,n)}var gs=null,Pu=!1,ud=!1;function E0(t){gs===null?gs=[t]:gs.push(t)}function fM(t){Pu=!0,E0(t)}function lr(){if(!ud&&gs!==null){ud=!0;var t=0,e=Pt;try{var n=gs;for(Pt=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}gs=null,Pu=!1}catch(s){throw gs!==null&&(gs=gs.slice(t+1)),Kx(ap,lr),s}finally{Pt=e,ud=!1}}return null}var Sa=[],Ma=0,Jc=null,eu=0,xi=[],_i=0,Rr=null,_s=1,ys="";function xr(t,e){Sa[Ma++]=eu,Sa[Ma++]=Jc,Jc=t,eu=e}function T0(t,e,n){xi[_i++]=_s,xi[_i++]=ys,xi[_i++]=Rr,Rr=t;var i=_s;t=ys;var s=32-ji(i)-1;i&=~(1<<s),n+=1;var r=32-ji(e)+s;if(30<r){var o=s-s%5;r=(i&(1<<o)-1).toString(32),i>>=o,s-=o,_s=1<<32-ji(e)+s|n<<s|i,ys=r+t}else _s=1<<r|n<<s|i,ys=t}function mp(t){t.return!==null&&(xr(t,1),T0(t,1,0))}function gp(t){for(;t===Jc;)Jc=Sa[--Ma],Sa[Ma]=null,eu=Sa[--Ma],Sa[Ma]=null;for(;t===Rr;)Rr=xi[--_i],xi[_i]=null,ys=xi[--_i],xi[_i]=null,_s=xi[--_i],xi[_i]=null}var ci=null,oi=null,zt=!1,Ui=null;function A0(t,e){var n=wi(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function cg(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,ci=t,oi=Qs(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,ci=t,oi=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Rr!==null?{id:_s,overflow:ys}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=wi(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,ci=t,oi=null,!0):!1;default:return!1}}function Dh(t){return(t.mode&1)!==0&&(t.flags&128)===0}function kh(t){if(zt){var e=oi;if(e){var n=e;if(!cg(t,e)){if(Dh(t))throw Error(de(418));e=Qs(n.nextSibling);var i=ci;e&&cg(t,e)?A0(i,n):(t.flags=t.flags&-4097|2,zt=!1,ci=t)}}else{if(Dh(t))throw Error(de(418));t.flags=t.flags&-4097|2,zt=!1,ci=t}}}function ug(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;ci=t}function Il(t){if(t!==ci)return!1;if(!zt)return ug(t),zt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Ch(t.type,t.memoizedProps)),e&&(e=oi)){if(Dh(t))throw N0(),Error(de(418));for(;e;)A0(t,e),e=Qs(e.nextSibling)}if(ug(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(de(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){oi=Qs(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}oi=null}}else oi=ci?Qs(t.stateNode.nextSibling):null;return!0}function N0(){for(var t=oi;t;)t=Qs(t.nextSibling)}function ja(){oi=ci=null,zt=!1}function vp(t){Ui===null?Ui=[t]:Ui.push(t)}var pM=Cs.ReactCurrentBatchConfig;function oo(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(de(309));var i=n.stateNode}if(!i)throw Error(de(147,t));var s=i,r=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===r?e.ref:(e=function(o){var l=s.refs;o===null?delete l[r]:l[r]=o},e._stringRef=r,e)}if(typeof t!="string")throw Error(de(284));if(!n._owner)throw Error(de(290,t))}return t}function Ul(t,e){throw t=Object.prototype.toString.call(e),Error(de(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function dg(t){var e=t._init;return e(t._payload)}function C0(t){function e(f,g){if(t){var S=f.deletions;S===null?(f.deletions=[g],f.flags|=16):S.push(g)}}function n(f,g){if(!t)return null;for(;g!==null;)e(f,g),g=g.sibling;return null}function i(f,g){for(f=new Map;g!==null;)g.key!==null?f.set(g.key,g):f.set(g.index,g),g=g.sibling;return f}function s(f,g){return f=nr(f,g),f.index=0,f.sibling=null,f}function r(f,g,S){return f.index=S,t?(S=f.alternate,S!==null?(S=S.index,S<g?(f.flags|=2,g):S):(f.flags|=2,g)):(f.flags|=1048576,g)}function o(f){return t&&f.alternate===null&&(f.flags|=2),f}function l(f,g,S,y){return g===null||g.tag!==6?(g=vd(S,f.mode,y),g.return=f,g):(g=s(g,S),g.return=f,g)}function c(f,g,S,y){var b=S.type;return b===ma?d(f,g,S.props.children,y,S.key):g!==null&&(g.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===Bs&&dg(b)===g.type)?(y=s(g,S.props),y.ref=oo(f,g,S),y.return=f,y):(y=Dc(S.type,S.key,S.props,null,f.mode,y),y.ref=oo(f,g,S),y.return=f,y)}function u(f,g,S,y){return g===null||g.tag!==4||g.stateNode.containerInfo!==S.containerInfo||g.stateNode.implementation!==S.implementation?(g=xd(S,f.mode,y),g.return=f,g):(g=s(g,S.children||[]),g.return=f,g)}function d(f,g,S,y,b){return g===null||g.tag!==7?(g=Nr(S,f.mode,y,b),g.return=f,g):(g=s(g,S),g.return=f,g)}function p(f,g,S){if(typeof g=="string"&&g!==""||typeof g=="number")return g=vd(""+g,f.mode,S),g.return=f,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case El:return S=Dc(g.type,g.key,g.props,null,f.mode,S),S.ref=oo(f,null,g),S.return=f,S;case pa:return g=xd(g,f.mode,S),g.return=f,g;case Bs:var y=g._init;return p(f,y(g._payload),S)}if(Eo(g)||no(g))return g=Nr(g,f.mode,S,null),g.return=f,g;Ul(f,g)}return null}function h(f,g,S,y){var b=g!==null?g.key:null;if(typeof S=="string"&&S!==""||typeof S=="number")return b!==null?null:l(f,g,""+S,y);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case El:return S.key===b?c(f,g,S,y):null;case pa:return S.key===b?u(f,g,S,y):null;case Bs:return b=S._init,h(f,g,b(S._payload),y)}if(Eo(S)||no(S))return b!==null?null:d(f,g,S,y,null);Ul(f,S)}return null}function m(f,g,S,y,b){if(typeof y=="string"&&y!==""||typeof y=="number")return f=f.get(S)||null,l(g,f,""+y,b);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case El:return f=f.get(y.key===null?S:y.key)||null,c(g,f,y,b);case pa:return f=f.get(y.key===null?S:y.key)||null,u(g,f,y,b);case Bs:var T=y._init;return m(f,g,S,T(y._payload),b)}if(Eo(y)||no(y))return f=f.get(S)||null,d(g,f,y,b,null);Ul(g,y)}return null}function v(f,g,S,y){for(var b=null,T=null,N=g,_=g=0,C=null;N!==null&&_<S.length;_++){N.index>_?(C=N,N=null):C=N.sibling;var R=h(f,N,S[_],y);if(R===null){N===null&&(N=C);break}t&&N&&R.alternate===null&&e(f,N),g=r(R,g,_),T===null?b=R:T.sibling=R,T=R,N=C}if(_===S.length)return n(f,N),zt&&xr(f,_),b;if(N===null){for(;_<S.length;_++)N=p(f,S[_],y),N!==null&&(g=r(N,g,_),T===null?b=N:T.sibling=N,T=N);return zt&&xr(f,_),b}for(N=i(f,N);_<S.length;_++)C=m(N,f,_,S[_],y),C!==null&&(t&&C.alternate!==null&&N.delete(C.key===null?_:C.key),g=r(C,g,_),T===null?b=C:T.sibling=C,T=C);return t&&N.forEach(function(k){return e(f,k)}),zt&&xr(f,_),b}function w(f,g,S,y){var b=no(S);if(typeof b!="function")throw Error(de(150));if(S=b.call(S),S==null)throw Error(de(151));for(var T=b=null,N=g,_=g=0,C=null,R=S.next();N!==null&&!R.done;_++,R=S.next()){N.index>_?(C=N,N=null):C=N.sibling;var k=h(f,N,R.value,y);if(k===null){N===null&&(N=C);break}t&&N&&k.alternate===null&&e(f,N),g=r(k,g,_),T===null?b=k:T.sibling=k,T=k,N=C}if(R.done)return n(f,N),zt&&xr(f,_),b;if(N===null){for(;!R.done;_++,R=S.next())R=p(f,R.value,y),R!==null&&(g=r(R,g,_),T===null?b=R:T.sibling=R,T=R);return zt&&xr(f,_),b}for(N=i(f,N);!R.done;_++,R=S.next())R=m(N,f,_,R.value,y),R!==null&&(t&&R.alternate!==null&&N.delete(R.key===null?_:R.key),g=r(R,g,_),T===null?b=R:T.sibling=R,T=R);return t&&N.forEach(function(B){return e(f,B)}),zt&&xr(f,_),b}function x(f,g,S,y){if(typeof S=="object"&&S!==null&&S.type===ma&&S.key===null&&(S=S.props.children),typeof S=="object"&&S!==null){switch(S.$$typeof){case El:e:{for(var b=S.key,T=g;T!==null;){if(T.key===b){if(b=S.type,b===ma){if(T.tag===7){n(f,T.sibling),g=s(T,S.props.children),g.return=f,f=g;break e}}else if(T.elementType===b||typeof b=="object"&&b!==null&&b.$$typeof===Bs&&dg(b)===T.type){n(f,T.sibling),g=s(T,S.props),g.ref=oo(f,T,S),g.return=f,f=g;break e}n(f,T);break}else e(f,T);T=T.sibling}S.type===ma?(g=Nr(S.props.children,f.mode,y,S.key),g.return=f,f=g):(y=Dc(S.type,S.key,S.props,null,f.mode,y),y.ref=oo(f,g,S),y.return=f,f=y)}return o(f);case pa:e:{for(T=S.key;g!==null;){if(g.key===T)if(g.tag===4&&g.stateNode.containerInfo===S.containerInfo&&g.stateNode.implementation===S.implementation){n(f,g.sibling),g=s(g,S.children||[]),g.return=f,f=g;break e}else{n(f,g);break}else e(f,g);g=g.sibling}g=xd(S,f.mode,y),g.return=f,f=g}return o(f);case Bs:return T=S._init,x(f,g,T(S._payload),y)}if(Eo(S))return v(f,g,S,y);if(no(S))return w(f,g,S,y);Ul(f,S)}return typeof S=="string"&&S!==""||typeof S=="number"?(S=""+S,g!==null&&g.tag===6?(n(f,g.sibling),g=s(g,S),g.return=f,f=g):(n(f,g),g=vd(S,f.mode,y),g.return=f,f=g),o(f)):n(f,g)}return x}var Ba=C0(!0),R0=C0(!1),tu=or(null),nu=null,wa=null,xp=null;function _p(){xp=wa=nu=null}function yp(t){var e=tu.current;Bt(tu),t._currentValue=e}function Ih(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function La(t,e){nu=t,xp=wa=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(Yn=!0),t.firstContext=null)}function Ti(t){var e=t._currentValue;if(xp!==t)if(t={context:t,memoizedValue:e,next:null},wa===null){if(nu===null)throw Error(de(308));wa=t,nu.dependencies={lanes:0,firstContext:t}}else wa=wa.next=t;return e}var Mr=null;function Sp(t){Mr===null?Mr=[t]:Mr.push(t)}function P0(t,e,n,i){var s=e.interleaved;return s===null?(n.next=n,Sp(e)):(n.next=s.next,s.next=n),e.interleaved=n,Ts(t,i)}function Ts(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var zs=!1;function Mp(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function L0(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Ss(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Js(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,yt&2){var s=i.pending;return s===null?e.next=e:(e.next=s.next,s.next=e),i.pending=e,Ts(t,n)}return s=i.interleaved,s===null?(e.next=e,Sp(i)):(e.next=s.next,s.next=e),i.interleaved=e,Ts(t,n)}function Ac(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,op(t,n)}}function hg(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var s=null,r=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};r===null?s=r=o:r=r.next=o,n=n.next}while(n!==null);r===null?s=r=e:r=r.next=e}else s=r=e;n={baseState:i.baseState,firstBaseUpdate:s,lastBaseUpdate:r,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function iu(t,e,n,i){var s=t.updateQueue;zs=!1;var r=s.firstBaseUpdate,o=s.lastBaseUpdate,l=s.shared.pending;if(l!==null){s.shared.pending=null;var c=l,u=c.next;c.next=null,o===null?r=u:o.next=u,o=c;var d=t.alternate;d!==null&&(d=d.updateQueue,l=d.lastBaseUpdate,l!==o&&(l===null?d.firstBaseUpdate=u:l.next=u,d.lastBaseUpdate=c))}if(r!==null){var p=s.baseState;o=0,d=u=c=null,l=r;do{var h=l.lane,m=l.eventTime;if((i&h)===h){d!==null&&(d=d.next={eventTime:m,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var v=t,w=l;switch(h=e,m=n,w.tag){case 1:if(v=w.payload,typeof v=="function"){p=v.call(m,p,h);break e}p=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=w.payload,h=typeof v=="function"?v.call(m,p,h):v,h==null)break e;p=$t({},p,h);break e;case 2:zs=!0}}l.callback!==null&&l.lane!==0&&(t.flags|=64,h=s.effects,h===null?s.effects=[l]:h.push(l))}else m={eventTime:m,lane:h,tag:l.tag,payload:l.payload,callback:l.callback,next:null},d===null?(u=d=m,c=p):d=d.next=m,o|=h;if(l=l.next,l===null){if(l=s.shared.pending,l===null)break;h=l,l=h.next,h.next=null,s.lastBaseUpdate=h,s.shared.pending=null}}while(!0);if(d===null&&(c=p),s.baseState=c,s.firstBaseUpdate=u,s.lastBaseUpdate=d,e=s.shared.interleaved,e!==null){s=e;do o|=s.lane,s=s.next;while(s!==e)}else r===null&&(s.shared.lanes=0);Lr|=o,t.lanes=o,t.memoizedState=p}}function fg(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],s=i.callback;if(s!==null){if(i.callback=null,i=n,typeof s!="function")throw Error(de(191,s));s.call(i)}}}var ml={},ts=or(ml),Jo=or(ml),el=or(ml);function wr(t){if(t===ml)throw Error(de(174));return t}function wp(t,e){switch(It(el,e),It(Jo,t),It(ts,ml),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:mh(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=mh(e,t)}Bt(ts),It(ts,e)}function za(){Bt(ts),Bt(Jo),Bt(el)}function D0(t){wr(el.current);var e=wr(ts.current),n=mh(e,t.type);e!==n&&(It(Jo,t),It(ts,n))}function bp(t){Jo.current===t&&(Bt(ts),Bt(Jo))}var Gt=or(0);function su(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var dd=[];function Ep(){for(var t=0;t<dd.length;t++)dd[t]._workInProgressVersionPrimary=null;dd.length=0}var Nc=Cs.ReactCurrentDispatcher,hd=Cs.ReactCurrentBatchConfig,Pr=0,Wt=null,on=null,gn=null,ru=!1,Io=!1,tl=0,mM=0;function bn(){throw Error(de(321))}function Tp(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!zi(t[n],e[n]))return!1;return!0}function Ap(t,e,n,i,s,r){if(Pr=r,Wt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Nc.current=t===null||t.memoizedState===null?_M:yM,t=n(i,s),Io){r=0;do{if(Io=!1,tl=0,25<=r)throw Error(de(301));r+=1,gn=on=null,e.updateQueue=null,Nc.current=SM,t=n(i,s)}while(Io)}if(Nc.current=au,e=on!==null&&on.next!==null,Pr=0,gn=on=Wt=null,ru=!1,e)throw Error(de(300));return t}function Np(){var t=tl!==0;return tl=0,t}function Yi(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return gn===null?Wt.memoizedState=gn=t:gn=gn.next=t,gn}function Ai(){if(on===null){var t=Wt.alternate;t=t!==null?t.memoizedState:null}else t=on.next;var e=gn===null?Wt.memoizedState:gn.next;if(e!==null)gn=e,on=t;else{if(t===null)throw Error(de(310));on=t,t={memoizedState:on.memoizedState,baseState:on.baseState,baseQueue:on.baseQueue,queue:on.queue,next:null},gn===null?Wt.memoizedState=gn=t:gn=gn.next=t}return gn}function nl(t,e){return typeof e=="function"?e(t):e}function fd(t){var e=Ai(),n=e.queue;if(n===null)throw Error(de(311));n.lastRenderedReducer=t;var i=on,s=i.baseQueue,r=n.pending;if(r!==null){if(s!==null){var o=s.next;s.next=r.next,r.next=o}i.baseQueue=s=r,n.pending=null}if(s!==null){r=s.next,i=i.baseState;var l=o=null,c=null,u=r;do{var d=u.lane;if((Pr&d)===d)c!==null&&(c=c.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),i=u.hasEagerState?u.eagerState:t(i,u.action);else{var p={lane:d,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};c===null?(l=c=p,o=i):c=c.next=p,Wt.lanes|=d,Lr|=d}u=u.next}while(u!==null&&u!==r);c===null?o=i:c.next=l,zi(i,e.memoizedState)||(Yn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=c,n.lastRenderedState=i}if(t=n.interleaved,t!==null){s=t;do r=s.lane,Wt.lanes|=r,Lr|=r,s=s.next;while(s!==t)}else s===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function pd(t){var e=Ai(),n=e.queue;if(n===null)throw Error(de(311));n.lastRenderedReducer=t;var i=n.dispatch,s=n.pending,r=e.memoizedState;if(s!==null){n.pending=null;var o=s=s.next;do r=t(r,o.action),o=o.next;while(o!==s);zi(r,e.memoizedState)||(Yn=!0),e.memoizedState=r,e.baseQueue===null&&(e.baseState=r),n.lastRenderedState=r}return[r,i]}function k0(){}function I0(t,e){var n=Wt,i=Ai(),s=e(),r=!zi(i.memoizedState,s);if(r&&(i.memoizedState=s,Yn=!0),i=i.queue,Cp(O0.bind(null,n,i,t),[t]),i.getSnapshot!==e||r||gn!==null&&gn.memoizedState.tag&1){if(n.flags|=2048,il(9,F0.bind(null,n,i,s,e),void 0,null),vn===null)throw Error(de(349));Pr&30||U0(n,e,s)}return s}function U0(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=Wt.updateQueue,e===null?(e={lastEffect:null,stores:null},Wt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function F0(t,e,n,i){e.value=n,e.getSnapshot=i,j0(e)&&B0(t)}function O0(t,e,n){return n(function(){j0(e)&&B0(t)})}function j0(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!zi(t,n)}catch{return!0}}function B0(t){var e=Ts(t,1);e!==null&&Bi(e,t,1,-1)}function pg(t){var e=Yi();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:nl,lastRenderedState:t},e.queue=t,t=t.dispatch=xM.bind(null,Wt,t),[e.memoizedState,t]}function il(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=Wt.updateQueue,e===null?(e={lastEffect:null,stores:null},Wt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function z0(){return Ai().memoizedState}function Cc(t,e,n,i){var s=Yi();Wt.flags|=t,s.memoizedState=il(1|e,n,void 0,i===void 0?null:i)}function Lu(t,e,n,i){var s=Ai();i=i===void 0?null:i;var r=void 0;if(on!==null){var o=on.memoizedState;if(r=o.destroy,i!==null&&Tp(i,o.deps)){s.memoizedState=il(e,n,r,i);return}}Wt.flags|=t,s.memoizedState=il(1|e,n,r,i)}function mg(t,e){return Cc(8390656,8,t,e)}function Cp(t,e){return Lu(2048,8,t,e)}function H0(t,e){return Lu(4,2,t,e)}function V0(t,e){return Lu(4,4,t,e)}function G0(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function W0(t,e,n){return n=n!=null?n.concat([t]):null,Lu(4,4,G0.bind(null,e,t),n)}function Rp(){}function $0(t,e){var n=Ai();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Tp(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function X0(t,e){var n=Ai();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Tp(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function Y0(t,e,n){return Pr&21?(zi(n,e)||(n=Jx(),Wt.lanes|=n,Lr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,Yn=!0),t.memoizedState=n)}function gM(t,e){var n=Pt;Pt=n!==0&&4>n?n:4,t(!0);var i=hd.transition;hd.transition={};try{t(!1),e()}finally{Pt=n,hd.transition=i}}function q0(){return Ai().memoizedState}function vM(t,e,n){var i=tr(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},K0(t))Z0(e,n);else if(n=P0(t,e,n,i),n!==null){var s=zn();Bi(n,t,i,s),Q0(n,e,i)}}function xM(t,e,n){var i=tr(t),s={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(K0(t))Z0(e,s);else{var r=t.alternate;if(t.lanes===0&&(r===null||r.lanes===0)&&(r=e.lastRenderedReducer,r!==null))try{var o=e.lastRenderedState,l=r(o,n);if(s.hasEagerState=!0,s.eagerState=l,zi(l,o)){var c=e.interleaved;c===null?(s.next=s,Sp(e)):(s.next=c.next,c.next=s),e.interleaved=s;return}}catch{}finally{}n=P0(t,e,s,i),n!==null&&(s=zn(),Bi(n,t,i,s),Q0(n,e,i))}}function K0(t){var e=t.alternate;return t===Wt||e!==null&&e===Wt}function Z0(t,e){Io=ru=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function Q0(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,op(t,n)}}var au={readContext:Ti,useCallback:bn,useContext:bn,useEffect:bn,useImperativeHandle:bn,useInsertionEffect:bn,useLayoutEffect:bn,useMemo:bn,useReducer:bn,useRef:bn,useState:bn,useDebugValue:bn,useDeferredValue:bn,useTransition:bn,useMutableSource:bn,useSyncExternalStore:bn,useId:bn,unstable_isNewReconciler:!1},_M={readContext:Ti,useCallback:function(t,e){return Yi().memoizedState=[t,e===void 0?null:e],t},useContext:Ti,useEffect:mg,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,Cc(4194308,4,G0.bind(null,e,t),n)},useLayoutEffect:function(t,e){return Cc(4194308,4,t,e)},useInsertionEffect:function(t,e){return Cc(4,2,t,e)},useMemo:function(t,e){var n=Yi();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=Yi();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=vM.bind(null,Wt,t),[i.memoizedState,t]},useRef:function(t){var e=Yi();return t={current:t},e.memoizedState=t},useState:pg,useDebugValue:Rp,useDeferredValue:function(t){return Yi().memoizedState=t},useTransition:function(){var t=pg(!1),e=t[0];return t=gM.bind(null,t[1]),Yi().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=Wt,s=Yi();if(zt){if(n===void 0)throw Error(de(407));n=n()}else{if(n=e(),vn===null)throw Error(de(349));Pr&30||U0(i,e,n)}s.memoizedState=n;var r={value:n,getSnapshot:e};return s.queue=r,mg(O0.bind(null,i,r,t),[t]),i.flags|=2048,il(9,F0.bind(null,i,r,n,e),void 0,null),n},useId:function(){var t=Yi(),e=vn.identifierPrefix;if(zt){var n=ys,i=_s;n=(i&~(1<<32-ji(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=tl++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=mM++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},yM={readContext:Ti,useCallback:$0,useContext:Ti,useEffect:Cp,useImperativeHandle:W0,useInsertionEffect:H0,useLayoutEffect:V0,useMemo:X0,useReducer:fd,useRef:z0,useState:function(){return fd(nl)},useDebugValue:Rp,useDeferredValue:function(t){var e=Ai();return Y0(e,on.memoizedState,t)},useTransition:function(){var t=fd(nl)[0],e=Ai().memoizedState;return[t,e]},useMutableSource:k0,useSyncExternalStore:I0,useId:q0,unstable_isNewReconciler:!1},SM={readContext:Ti,useCallback:$0,useContext:Ti,useEffect:Cp,useImperativeHandle:W0,useInsertionEffect:H0,useLayoutEffect:V0,useMemo:X0,useReducer:pd,useRef:z0,useState:function(){return pd(nl)},useDebugValue:Rp,useDeferredValue:function(t){var e=Ai();return on===null?e.memoizedState=t:Y0(e,on.memoizedState,t)},useTransition:function(){var t=pd(nl)[0],e=Ai().memoizedState;return[t,e]},useMutableSource:k0,useSyncExternalStore:I0,useId:q0,unstable_isNewReconciler:!1};function ki(t,e){if(t&&t.defaultProps){e=$t({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function Uh(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:$t({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Du={isMounted:function(t){return(t=t._reactInternals)?zr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=zn(),s=tr(t),r=Ss(i,s);r.payload=e,n!=null&&(r.callback=n),e=Js(t,r,s),e!==null&&(Bi(e,t,s,i),Ac(e,t,s))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=zn(),s=tr(t),r=Ss(i,s);r.tag=1,r.payload=e,n!=null&&(r.callback=n),e=Js(t,r,s),e!==null&&(Bi(e,t,s,i),Ac(e,t,s))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=zn(),i=tr(t),s=Ss(n,i);s.tag=2,e!=null&&(s.callback=e),e=Js(t,s,i),e!==null&&(Bi(e,t,i,n),Ac(e,t,i))}};function gg(t,e,n,i,s,r,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,r,o):e.prototype&&e.prototype.isPureReactComponent?!qo(n,i)||!qo(s,r):!0}function J0(t,e,n){var i=!1,s=sr,r=e.contextType;return typeof r=="object"&&r!==null?r=Ti(r):(s=Kn(e)?Cr:kn.current,i=e.contextTypes,r=(i=i!=null)?Oa(t,s):sr),e=new e(n,r),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Du,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=s,t.__reactInternalMemoizedMaskedChildContext=r),e}function vg(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&Du.enqueueReplaceState(e,e.state,null)}function Fh(t,e,n,i){var s=t.stateNode;s.props=n,s.state=t.memoizedState,s.refs={},Mp(t);var r=e.contextType;typeof r=="object"&&r!==null?s.context=Ti(r):(r=Kn(e)?Cr:kn.current,s.context=Oa(t,r)),s.state=t.memoizedState,r=e.getDerivedStateFromProps,typeof r=="function"&&(Uh(t,e,r,n),s.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(e=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),e!==s.state&&Du.enqueueReplaceState(s,s.state,null),iu(t,n,s,i),s.state=t.memoizedState),typeof s.componentDidMount=="function"&&(t.flags|=4194308)}function Ha(t,e){try{var n="",i=e;do n+=qy(i),i=i.return;while(i);var s=n}catch(r){s=`
Error generating stack: `+r.message+`
`+r.stack}return{value:t,source:e,stack:s,digest:null}}function md(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function Oh(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var MM=typeof WeakMap=="function"?WeakMap:Map;function e_(t,e,n){n=Ss(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){lu||(lu=!0,Yh=i),Oh(t,e)},n}function t_(t,e,n){n=Ss(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var s=e.value;n.payload=function(){return i(s)},n.callback=function(){Oh(t,e)}}var r=t.stateNode;return r!==null&&typeof r.componentDidCatch=="function"&&(n.callback=function(){Oh(t,e),typeof i!="function"&&(er===null?er=new Set([this]):er.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function xg(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new MM;var s=new Set;i.set(e,s)}else s=i.get(e),s===void 0&&(s=new Set,i.set(e,s));s.has(n)||(s.add(n),t=UM.bind(null,t,e,n),e.then(t,t))}function _g(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function yg(t,e,n,i,s){return t.mode&1?(t.flags|=65536,t.lanes=s,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Ss(-1,1),e.tag=2,Js(n,e,1))),n.lanes|=1),t)}var wM=Cs.ReactCurrentOwner,Yn=!1;function jn(t,e,n,i){e.child=t===null?R0(e,null,n,i):Ba(e,t.child,n,i)}function Sg(t,e,n,i,s){n=n.render;var r=e.ref;return La(e,s),i=Ap(t,e,n,i,r,s),n=Np(),t!==null&&!Yn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~s,As(t,e,s)):(zt&&n&&mp(e),e.flags|=1,jn(t,e,i,s),e.child)}function Mg(t,e,n,i,s){if(t===null){var r=n.type;return typeof r=="function"&&!Op(r)&&r.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=r,n_(t,e,r,i,s)):(t=Dc(n.type,null,i,e,e.mode,s),t.ref=e.ref,t.return=e,e.child=t)}if(r=t.child,!(t.lanes&s)){var o=r.memoizedProps;if(n=n.compare,n=n!==null?n:qo,n(o,i)&&t.ref===e.ref)return As(t,e,s)}return e.flags|=1,t=nr(r,i),t.ref=e.ref,t.return=e,e.child=t}function n_(t,e,n,i,s){if(t!==null){var r=t.memoizedProps;if(qo(r,i)&&t.ref===e.ref)if(Yn=!1,e.pendingProps=i=r,(t.lanes&s)!==0)t.flags&131072&&(Yn=!0);else return e.lanes=t.lanes,As(t,e,s)}return jh(t,e,n,i,s)}function i_(t,e,n){var i=e.pendingProps,s=i.children,r=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},It(Ea,ai),ai|=n;else{if(!(n&1073741824))return t=r!==null?r.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,It(Ea,ai),ai|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=r!==null?r.baseLanes:n,It(Ea,ai),ai|=i}else r!==null?(i=r.baseLanes|n,e.memoizedState=null):i=n,It(Ea,ai),ai|=i;return jn(t,e,s,n),e.child}function s_(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function jh(t,e,n,i,s){var r=Kn(n)?Cr:kn.current;return r=Oa(e,r),La(e,s),n=Ap(t,e,n,i,r,s),i=Np(),t!==null&&!Yn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~s,As(t,e,s)):(zt&&i&&mp(e),e.flags|=1,jn(t,e,n,s),e.child)}function wg(t,e,n,i,s){if(Kn(n)){var r=!0;Qc(e)}else r=!1;if(La(e,s),e.stateNode===null)Rc(t,e),J0(e,n,i),Fh(e,n,i,s),i=!0;else if(t===null){var o=e.stateNode,l=e.memoizedProps;o.props=l;var c=o.context,u=n.contextType;typeof u=="object"&&u!==null?u=Ti(u):(u=Kn(n)?Cr:kn.current,u=Oa(e,u));var d=n.getDerivedStateFromProps,p=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function";p||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==i||c!==u)&&vg(e,o,i,u),zs=!1;var h=e.memoizedState;o.state=h,iu(e,i,o,s),c=e.memoizedState,l!==i||h!==c||qn.current||zs?(typeof d=="function"&&(Uh(e,n,d,i),c=e.memoizedState),(l=zs||gg(e,n,l,i,h,c,u))?(p||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=c),o.props=i,o.state=c,o.context=u,i=l):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,L0(t,e),l=e.memoizedProps,u=e.type===e.elementType?l:ki(e.type,l),o.props=u,p=e.pendingProps,h=o.context,c=n.contextType,typeof c=="object"&&c!==null?c=Ti(c):(c=Kn(n)?Cr:kn.current,c=Oa(e,c));var m=n.getDerivedStateFromProps;(d=typeof m=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==p||h!==c)&&vg(e,o,i,c),zs=!1,h=e.memoizedState,o.state=h,iu(e,i,o,s);var v=e.memoizedState;l!==p||h!==v||qn.current||zs?(typeof m=="function"&&(Uh(e,n,m,i),v=e.memoizedState),(u=zs||gg(e,n,u,i,h,v,c)||!1)?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,v,c),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,v,c)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&h===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&h===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=v),o.props=i,o.state=v,o.context=c,i=u):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&h===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&h===t.memoizedState||(e.flags|=1024),i=!1)}return Bh(t,e,n,i,r,s)}function Bh(t,e,n,i,s,r){s_(t,e);var o=(e.flags&128)!==0;if(!i&&!o)return s&&lg(e,n,!1),As(t,e,r);i=e.stateNode,wM.current=e;var l=o&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&o?(e.child=Ba(e,t.child,null,r),e.child=Ba(e,null,l,r)):jn(t,e,l,r),e.memoizedState=i.state,s&&lg(e,n,!0),e.child}function r_(t){var e=t.stateNode;e.pendingContext?og(t,e.pendingContext,e.pendingContext!==e.context):e.context&&og(t,e.context,!1),wp(t,e.containerInfo)}function bg(t,e,n,i,s){return ja(),vp(s),e.flags|=256,jn(t,e,n,i),e.child}var zh={dehydrated:null,treeContext:null,retryLane:0};function Hh(t){return{baseLanes:t,cachePool:null,transitions:null}}function a_(t,e,n){var i=e.pendingProps,s=Gt.current,r=!1,o=(e.flags&128)!==0,l;if((l=o)||(l=t!==null&&t.memoizedState===null?!1:(s&2)!==0),l?(r=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(s|=1),It(Gt,s&1),t===null)return kh(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,t=i.fallback,r?(i=e.mode,r=e.child,o={mode:"hidden",children:o},!(i&1)&&r!==null?(r.childLanes=0,r.pendingProps=o):r=Uu(o,i,0,null),t=Nr(t,i,n,null),r.return=e,t.return=e,r.sibling=t,e.child=r,e.child.memoizedState=Hh(n),e.memoizedState=zh,t):Pp(e,o));if(s=t.memoizedState,s!==null&&(l=s.dehydrated,l!==null))return bM(t,e,o,i,l,s,n);if(r){r=i.fallback,o=e.mode,s=t.child,l=s.sibling;var c={mode:"hidden",children:i.children};return!(o&1)&&e.child!==s?(i=e.child,i.childLanes=0,i.pendingProps=c,e.deletions=null):(i=nr(s,c),i.subtreeFlags=s.subtreeFlags&14680064),l!==null?r=nr(l,r):(r=Nr(r,o,n,null),r.flags|=2),r.return=e,i.return=e,i.sibling=r,e.child=i,i=r,r=e.child,o=t.child.memoizedState,o=o===null?Hh(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},r.memoizedState=o,r.childLanes=t.childLanes&~n,e.memoizedState=zh,i}return r=t.child,t=r.sibling,i=nr(r,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Pp(t,e){return e=Uu({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Fl(t,e,n,i){return i!==null&&vp(i),Ba(e,t.child,null,n),t=Pp(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function bM(t,e,n,i,s,r,o){if(n)return e.flags&256?(e.flags&=-257,i=md(Error(de(422))),Fl(t,e,o,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(r=i.fallback,s=e.mode,i=Uu({mode:"visible",children:i.children},s,0,null),r=Nr(r,s,o,null),r.flags|=2,i.return=e,r.return=e,i.sibling=r,e.child=i,e.mode&1&&Ba(e,t.child,null,o),e.child.memoizedState=Hh(o),e.memoizedState=zh,r);if(!(e.mode&1))return Fl(t,e,o,null);if(s.data==="$!"){if(i=s.nextSibling&&s.nextSibling.dataset,i)var l=i.dgst;return i=l,r=Error(de(419)),i=md(r,i,void 0),Fl(t,e,o,i)}if(l=(o&t.childLanes)!==0,Yn||l){if(i=vn,i!==null){switch(o&-o){case 4:s=2;break;case 16:s=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:s=32;break;case 536870912:s=268435456;break;default:s=0}s=s&(i.suspendedLanes|o)?0:s,s!==0&&s!==r.retryLane&&(r.retryLane=s,Ts(t,s),Bi(i,t,s,-1))}return Fp(),i=md(Error(de(421))),Fl(t,e,o,i)}return s.data==="$?"?(e.flags|=128,e.child=t.child,e=FM.bind(null,t),s._reactRetry=e,null):(t=r.treeContext,oi=Qs(s.nextSibling),ci=e,zt=!0,Ui=null,t!==null&&(xi[_i++]=_s,xi[_i++]=ys,xi[_i++]=Rr,_s=t.id,ys=t.overflow,Rr=e),e=Pp(e,i.children),e.flags|=4096,e)}function Eg(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),Ih(t.return,e,n)}function gd(t,e,n,i,s){var r=t.memoizedState;r===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:s}:(r.isBackwards=e,r.rendering=null,r.renderingStartTime=0,r.last=i,r.tail=n,r.tailMode=s)}function o_(t,e,n){var i=e.pendingProps,s=i.revealOrder,r=i.tail;if(jn(t,e,i.children,n),i=Gt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Eg(t,n,e);else if(t.tag===19)Eg(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(It(Gt,i),!(e.mode&1))e.memoizedState=null;else switch(s){case"forwards":for(n=e.child,s=null;n!==null;)t=n.alternate,t!==null&&su(t)===null&&(s=n),n=n.sibling;n=s,n===null?(s=e.child,e.child=null):(s=n.sibling,n.sibling=null),gd(e,!1,s,n,r);break;case"backwards":for(n=null,s=e.child,e.child=null;s!==null;){if(t=s.alternate,t!==null&&su(t)===null){e.child=s;break}t=s.sibling,s.sibling=n,n=s,s=t}gd(e,!0,n,null,r);break;case"together":gd(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Rc(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function As(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Lr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(de(153));if(e.child!==null){for(t=e.child,n=nr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=nr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function EM(t,e,n){switch(e.tag){case 3:r_(e),ja();break;case 5:D0(e);break;case 1:Kn(e.type)&&Qc(e);break;case 4:wp(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,s=e.memoizedProps.value;It(tu,i._currentValue),i._currentValue=s;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(It(Gt,Gt.current&1),e.flags|=128,null):n&e.child.childLanes?a_(t,e,n):(It(Gt,Gt.current&1),t=As(t,e,n),t!==null?t.sibling:null);It(Gt,Gt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return o_(t,e,n);e.flags|=128}if(s=e.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),It(Gt,Gt.current),i)break;return null;case 22:case 23:return e.lanes=0,i_(t,e,n)}return As(t,e,n)}var l_,Vh,c_,u_;l_=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Vh=function(){};c_=function(t,e,n,i){var s=t.memoizedProps;if(s!==i){t=e.stateNode,wr(ts.current);var r=null;switch(n){case"input":s=dh(t,s),i=dh(t,i),r=[];break;case"select":s=$t({},s,{value:void 0}),i=$t({},i,{value:void 0}),r=[];break;case"textarea":s=ph(t,s),i=ph(t,i),r=[];break;default:typeof s.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=Kc)}gh(n,i);var o;n=null;for(u in s)if(!i.hasOwnProperty(u)&&s.hasOwnProperty(u)&&s[u]!=null)if(u==="style"){var l=s[u];for(o in l)l.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(Ho.hasOwnProperty(u)?r||(r=[]):(r=r||[]).push(u,null));for(u in i){var c=i[u];if(l=s!=null?s[u]:void 0,i.hasOwnProperty(u)&&c!==l&&(c!=null||l!=null))if(u==="style")if(l){for(o in l)!l.hasOwnProperty(o)||c&&c.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in c)c.hasOwnProperty(o)&&l[o]!==c[o]&&(n||(n={}),n[o]=c[o])}else n||(r||(r=[]),r.push(u,n)),n=c;else u==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,l=l?l.__html:void 0,c!=null&&l!==c&&(r=r||[]).push(u,c)):u==="children"?typeof c!="string"&&typeof c!="number"||(r=r||[]).push(u,""+c):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(Ho.hasOwnProperty(u)?(c!=null&&u==="onScroll"&&Ft("scroll",t),r||l===c||(r=[])):(r=r||[]).push(u,c))}n&&(r=r||[]).push("style",n);var u=r;(e.updateQueue=u)&&(e.flags|=4)}};u_=function(t,e,n,i){n!==i&&(e.flags|=4)};function lo(t,e){if(!zt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function En(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var s=t.child;s!==null;)n|=s.lanes|s.childLanes,i|=s.subtreeFlags&14680064,i|=s.flags&14680064,s.return=t,s=s.sibling;else for(s=t.child;s!==null;)n|=s.lanes|s.childLanes,i|=s.subtreeFlags,i|=s.flags,s.return=t,s=s.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function TM(t,e,n){var i=e.pendingProps;switch(gp(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return En(e),null;case 1:return Kn(e.type)&&Zc(),En(e),null;case 3:return i=e.stateNode,za(),Bt(qn),Bt(kn),Ep(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(Il(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Ui!==null&&(Zh(Ui),Ui=null))),Vh(t,e),En(e),null;case 5:bp(e);var s=wr(el.current);if(n=e.type,t!==null&&e.stateNode!=null)c_(t,e,n,i,s),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(de(166));return En(e),null}if(t=wr(ts.current),Il(e)){i=e.stateNode,n=e.type;var r=e.memoizedProps;switch(i[Zi]=e,i[Qo]=r,t=(e.mode&1)!==0,n){case"dialog":Ft("cancel",i),Ft("close",i);break;case"iframe":case"object":case"embed":Ft("load",i);break;case"video":case"audio":for(s=0;s<Ao.length;s++)Ft(Ao[s],i);break;case"source":Ft("error",i);break;case"img":case"image":case"link":Ft("error",i),Ft("load",i);break;case"details":Ft("toggle",i);break;case"input":km(i,r),Ft("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!r.multiple},Ft("invalid",i);break;case"textarea":Um(i,r),Ft("invalid",i)}gh(n,r),s=null;for(var o in r)if(r.hasOwnProperty(o)){var l=r[o];o==="children"?typeof l=="string"?i.textContent!==l&&(r.suppressHydrationWarning!==!0&&kl(i.textContent,l,t),s=["children",l]):typeof l=="number"&&i.textContent!==""+l&&(r.suppressHydrationWarning!==!0&&kl(i.textContent,l,t),s=["children",""+l]):Ho.hasOwnProperty(o)&&l!=null&&o==="onScroll"&&Ft("scroll",i)}switch(n){case"input":Tl(i),Im(i,r,!0);break;case"textarea":Tl(i),Fm(i);break;case"select":case"option":break;default:typeof r.onClick=="function"&&(i.onclick=Kc)}i=s,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=s.nodeType===9?s:s.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Ox(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=o.createElement(n,{is:i.is}):(t=o.createElement(n),n==="select"&&(o=t,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):t=o.createElementNS(t,n),t[Zi]=e,t[Qo]=i,l_(t,e,!1,!1),e.stateNode=t;e:{switch(o=vh(n,i),n){case"dialog":Ft("cancel",t),Ft("close",t),s=i;break;case"iframe":case"object":case"embed":Ft("load",t),s=i;break;case"video":case"audio":for(s=0;s<Ao.length;s++)Ft(Ao[s],t);s=i;break;case"source":Ft("error",t),s=i;break;case"img":case"image":case"link":Ft("error",t),Ft("load",t),s=i;break;case"details":Ft("toggle",t),s=i;break;case"input":km(t,i),s=dh(t,i),Ft("invalid",t);break;case"option":s=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},s=$t({},i,{value:void 0}),Ft("invalid",t);break;case"textarea":Um(t,i),s=ph(t,i),Ft("invalid",t);break;default:s=i}gh(n,s),l=s;for(r in l)if(l.hasOwnProperty(r)){var c=l[r];r==="style"?zx(t,c):r==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,c!=null&&jx(t,c)):r==="children"?typeof c=="string"?(n!=="textarea"||c!=="")&&Vo(t,c):typeof c=="number"&&Vo(t,""+c):r!=="suppressContentEditableWarning"&&r!=="suppressHydrationWarning"&&r!=="autoFocus"&&(Ho.hasOwnProperty(r)?c!=null&&r==="onScroll"&&Ft("scroll",t):c!=null&&tp(t,r,c,o))}switch(n){case"input":Tl(t),Im(t,i,!1);break;case"textarea":Tl(t),Fm(t);break;case"option":i.value!=null&&t.setAttribute("value",""+ir(i.value));break;case"select":t.multiple=!!i.multiple,r=i.value,r!=null?Na(t,!!i.multiple,r,!1):i.defaultValue!=null&&Na(t,!!i.multiple,i.defaultValue,!0);break;default:typeof s.onClick=="function"&&(t.onclick=Kc)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return En(e),null;case 6:if(t&&e.stateNode!=null)u_(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(de(166));if(n=wr(el.current),wr(ts.current),Il(e)){if(i=e.stateNode,n=e.memoizedProps,i[Zi]=e,(r=i.nodeValue!==n)&&(t=ci,t!==null))switch(t.tag){case 3:kl(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&kl(i.nodeValue,n,(t.mode&1)!==0)}r&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[Zi]=e,e.stateNode=i}return En(e),null;case 13:if(Bt(Gt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(zt&&oi!==null&&e.mode&1&&!(e.flags&128))N0(),ja(),e.flags|=98560,r=!1;else if(r=Il(e),i!==null&&i.dehydrated!==null){if(t===null){if(!r)throw Error(de(318));if(r=e.memoizedState,r=r!==null?r.dehydrated:null,!r)throw Error(de(317));r[Zi]=e}else ja(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;En(e),r=!1}else Ui!==null&&(Zh(Ui),Ui=null),r=!0;if(!r)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||Gt.current&1?ln===0&&(ln=3):Fp())),e.updateQueue!==null&&(e.flags|=4),En(e),null);case 4:return za(),Vh(t,e),t===null&&Ko(e.stateNode.containerInfo),En(e),null;case 10:return yp(e.type._context),En(e),null;case 17:return Kn(e.type)&&Zc(),En(e),null;case 19:if(Bt(Gt),r=e.memoizedState,r===null)return En(e),null;if(i=(e.flags&128)!==0,o=r.rendering,o===null)if(i)lo(r,!1);else{if(ln!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=su(t),o!==null){for(e.flags|=128,lo(r,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)r=n,t=i,r.flags&=14680066,o=r.alternate,o===null?(r.childLanes=0,r.lanes=t,r.child=null,r.subtreeFlags=0,r.memoizedProps=null,r.memoizedState=null,r.updateQueue=null,r.dependencies=null,r.stateNode=null):(r.childLanes=o.childLanes,r.lanes=o.lanes,r.child=o.child,r.subtreeFlags=0,r.deletions=null,r.memoizedProps=o.memoizedProps,r.memoizedState=o.memoizedState,r.updateQueue=o.updateQueue,r.type=o.type,t=o.dependencies,r.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return It(Gt,Gt.current&1|2),e.child}t=t.sibling}r.tail!==null&&Kt()>Va&&(e.flags|=128,i=!0,lo(r,!1),e.lanes=4194304)}else{if(!i)if(t=su(o),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),lo(r,!0),r.tail===null&&r.tailMode==="hidden"&&!o.alternate&&!zt)return En(e),null}else 2*Kt()-r.renderingStartTime>Va&&n!==1073741824&&(e.flags|=128,i=!0,lo(r,!1),e.lanes=4194304);r.isBackwards?(o.sibling=e.child,e.child=o):(n=r.last,n!==null?n.sibling=o:e.child=o,r.last=o)}return r.tail!==null?(e=r.tail,r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Kt(),e.sibling=null,n=Gt.current,It(Gt,i?n&1|2:n&1),e):(En(e),null);case 22:case 23:return Up(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?ai&1073741824&&(En(e),e.subtreeFlags&6&&(e.flags|=8192)):En(e),null;case 24:return null;case 25:return null}throw Error(de(156,e.tag))}function AM(t,e){switch(gp(e),e.tag){case 1:return Kn(e.type)&&Zc(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return za(),Bt(qn),Bt(kn),Ep(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return bp(e),null;case 13:if(Bt(Gt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(de(340));ja()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return Bt(Gt),null;case 4:return za(),null;case 10:return yp(e.type._context),null;case 22:case 23:return Up(),null;case 24:return null;default:return null}}var Ol=!1,Rn=!1,NM=typeof WeakSet=="function"?WeakSet:Set,Be=null;function ba(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){Xt(t,e,i)}else n.current=null}function Gh(t,e,n){try{n()}catch(i){Xt(t,e,i)}}var Tg=!1;function CM(t,e){if(Ah=Xc,t=m0(),pp(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var s=i.anchorOffset,r=i.focusNode;i=i.focusOffset;try{n.nodeType,r.nodeType}catch{n=null;break e}var o=0,l=-1,c=-1,u=0,d=0,p=t,h=null;t:for(;;){for(var m;p!==n||s!==0&&p.nodeType!==3||(l=o+s),p!==r||i!==0&&p.nodeType!==3||(c=o+i),p.nodeType===3&&(o+=p.nodeValue.length),(m=p.firstChild)!==null;)h=p,p=m;for(;;){if(p===t)break t;if(h===n&&++u===s&&(l=o),h===r&&++d===i&&(c=o),(m=p.nextSibling)!==null)break;p=h,h=p.parentNode}p=m}n=l===-1||c===-1?null:{start:l,end:c}}else n=null}n=n||{start:0,end:0}}else n=null;for(Nh={focusedElem:t,selectionRange:n},Xc=!1,Be=e;Be!==null;)if(e=Be,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,Be=t;else for(;Be!==null;){e=Be;try{var v=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var w=v.memoizedProps,x=v.memoizedState,f=e.stateNode,g=f.getSnapshotBeforeUpdate(e.elementType===e.type?w:ki(e.type,w),x);f.__reactInternalSnapshotBeforeUpdate=g}break;case 3:var S=e.stateNode.containerInfo;S.nodeType===1?S.textContent="":S.nodeType===9&&S.documentElement&&S.removeChild(S.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(de(163))}}catch(y){Xt(e,e.return,y)}if(t=e.sibling,t!==null){t.return=e.return,Be=t;break}Be=e.return}return v=Tg,Tg=!1,v}function Uo(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var s=i=i.next;do{if((s.tag&t)===t){var r=s.destroy;s.destroy=void 0,r!==void 0&&Gh(e,n,r)}s=s.next}while(s!==i)}}function ku(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Wh(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function d_(t){var e=t.alternate;e!==null&&(t.alternate=null,d_(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Zi],delete e[Qo],delete e[Ph],delete e[dM],delete e[hM])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function h_(t){return t.tag===5||t.tag===3||t.tag===4}function Ag(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||h_(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function $h(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Kc));else if(i!==4&&(t=t.child,t!==null))for($h(t,e,n),t=t.sibling;t!==null;)$h(t,e,n),t=t.sibling}function Xh(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(Xh(t,e,n),t=t.sibling;t!==null;)Xh(t,e,n),t=t.sibling}var xn=null,Ii=!1;function Ds(t,e,n){for(n=n.child;n!==null;)f_(t,e,n),n=n.sibling}function f_(t,e,n){if(es&&typeof es.onCommitFiberUnmount=="function")try{es.onCommitFiberUnmount(Tu,n)}catch{}switch(n.tag){case 5:Rn||ba(n,e);case 6:var i=xn,s=Ii;xn=null,Ds(t,e,n),xn=i,Ii=s,xn!==null&&(Ii?(t=xn,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):xn.removeChild(n.stateNode));break;case 18:xn!==null&&(Ii?(t=xn,n=n.stateNode,t.nodeType===8?cd(t.parentNode,n):t.nodeType===1&&cd(t,n),Xo(t)):cd(xn,n.stateNode));break;case 4:i=xn,s=Ii,xn=n.stateNode.containerInfo,Ii=!0,Ds(t,e,n),xn=i,Ii=s;break;case 0:case 11:case 14:case 15:if(!Rn&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){s=i=i.next;do{var r=s,o=r.destroy;r=r.tag,o!==void 0&&(r&2||r&4)&&Gh(n,e,o),s=s.next}while(s!==i)}Ds(t,e,n);break;case 1:if(!Rn&&(ba(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(l){Xt(n,e,l)}Ds(t,e,n);break;case 21:Ds(t,e,n);break;case 22:n.mode&1?(Rn=(i=Rn)||n.memoizedState!==null,Ds(t,e,n),Rn=i):Ds(t,e,n);break;default:Ds(t,e,n)}}function Ng(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new NM),e.forEach(function(i){var s=OM.bind(null,t,i);n.has(i)||(n.add(i),i.then(s,s))})}}function Ri(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var s=n[i];try{var r=t,o=e,l=o;e:for(;l!==null;){switch(l.tag){case 5:xn=l.stateNode,Ii=!1;break e;case 3:xn=l.stateNode.containerInfo,Ii=!0;break e;case 4:xn=l.stateNode.containerInfo,Ii=!0;break e}l=l.return}if(xn===null)throw Error(de(160));f_(r,o,s),xn=null,Ii=!1;var c=s.alternate;c!==null&&(c.return=null),s.return=null}catch(u){Xt(s,e,u)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)p_(e,t),e=e.sibling}function p_(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Ri(e,t),Wi(t),i&4){try{Uo(3,t,t.return),ku(3,t)}catch(w){Xt(t,t.return,w)}try{Uo(5,t,t.return)}catch(w){Xt(t,t.return,w)}}break;case 1:Ri(e,t),Wi(t),i&512&&n!==null&&ba(n,n.return);break;case 5:if(Ri(e,t),Wi(t),i&512&&n!==null&&ba(n,n.return),t.flags&32){var s=t.stateNode;try{Vo(s,"")}catch(w){Xt(t,t.return,w)}}if(i&4&&(s=t.stateNode,s!=null)){var r=t.memoizedProps,o=n!==null?n.memoizedProps:r,l=t.type,c=t.updateQueue;if(t.updateQueue=null,c!==null)try{l==="input"&&r.type==="radio"&&r.name!=null&&Ux(s,r),vh(l,o);var u=vh(l,r);for(o=0;o<c.length;o+=2){var d=c[o],p=c[o+1];d==="style"?zx(s,p):d==="dangerouslySetInnerHTML"?jx(s,p):d==="children"?Vo(s,p):tp(s,d,p,u)}switch(l){case"input":hh(s,r);break;case"textarea":Fx(s,r);break;case"select":var h=s._wrapperState.wasMultiple;s._wrapperState.wasMultiple=!!r.multiple;var m=r.value;m!=null?Na(s,!!r.multiple,m,!1):h!==!!r.multiple&&(r.defaultValue!=null?Na(s,!!r.multiple,r.defaultValue,!0):Na(s,!!r.multiple,r.multiple?[]:"",!1))}s[Qo]=r}catch(w){Xt(t,t.return,w)}}break;case 6:if(Ri(e,t),Wi(t),i&4){if(t.stateNode===null)throw Error(de(162));s=t.stateNode,r=t.memoizedProps;try{s.nodeValue=r}catch(w){Xt(t,t.return,w)}}break;case 3:if(Ri(e,t),Wi(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{Xo(e.containerInfo)}catch(w){Xt(t,t.return,w)}break;case 4:Ri(e,t),Wi(t);break;case 13:Ri(e,t),Wi(t),s=t.child,s.flags&8192&&(r=s.memoizedState!==null,s.stateNode.isHidden=r,!r||s.alternate!==null&&s.alternate.memoizedState!==null||(kp=Kt())),i&4&&Ng(t);break;case 22:if(d=n!==null&&n.memoizedState!==null,t.mode&1?(Rn=(u=Rn)||d,Ri(e,t),Rn=u):Ri(e,t),Wi(t),i&8192){if(u=t.memoizedState!==null,(t.stateNode.isHidden=u)&&!d&&t.mode&1)for(Be=t,d=t.child;d!==null;){for(p=Be=d;Be!==null;){switch(h=Be,m=h.child,h.tag){case 0:case 11:case 14:case 15:Uo(4,h,h.return);break;case 1:ba(h,h.return);var v=h.stateNode;if(typeof v.componentWillUnmount=="function"){i=h,n=h.return;try{e=i,v.props=e.memoizedProps,v.state=e.memoizedState,v.componentWillUnmount()}catch(w){Xt(i,n,w)}}break;case 5:ba(h,h.return);break;case 22:if(h.memoizedState!==null){Rg(p);continue}}m!==null?(m.return=h,Be=m):Rg(p)}d=d.sibling}e:for(d=null,p=t;;){if(p.tag===5){if(d===null){d=p;try{s=p.stateNode,u?(r=s.style,typeof r.setProperty=="function"?r.setProperty("display","none","important"):r.display="none"):(l=p.stateNode,c=p.memoizedProps.style,o=c!=null&&c.hasOwnProperty("display")?c.display:null,l.style.display=Bx("display",o))}catch(w){Xt(t,t.return,w)}}}else if(p.tag===6){if(d===null)try{p.stateNode.nodeValue=u?"":p.memoizedProps}catch(w){Xt(t,t.return,w)}}else if((p.tag!==22&&p.tag!==23||p.memoizedState===null||p===t)&&p.child!==null){p.child.return=p,p=p.child;continue}if(p===t)break e;for(;p.sibling===null;){if(p.return===null||p.return===t)break e;d===p&&(d=null),p=p.return}d===p&&(d=null),p.sibling.return=p.return,p=p.sibling}}break;case 19:Ri(e,t),Wi(t),i&4&&Ng(t);break;case 21:break;default:Ri(e,t),Wi(t)}}function Wi(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(h_(n)){var i=n;break e}n=n.return}throw Error(de(160))}switch(i.tag){case 5:var s=i.stateNode;i.flags&32&&(Vo(s,""),i.flags&=-33);var r=Ag(t);Xh(t,r,s);break;case 3:case 4:var o=i.stateNode.containerInfo,l=Ag(t);$h(t,l,o);break;default:throw Error(de(161))}}catch(c){Xt(t,t.return,c)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function RM(t,e,n){Be=t,m_(t)}function m_(t,e,n){for(var i=(t.mode&1)!==0;Be!==null;){var s=Be,r=s.child;if(s.tag===22&&i){var o=s.memoizedState!==null||Ol;if(!o){var l=s.alternate,c=l!==null&&l.memoizedState!==null||Rn;l=Ol;var u=Rn;if(Ol=o,(Rn=c)&&!u)for(Be=s;Be!==null;)o=Be,c=o.child,o.tag===22&&o.memoizedState!==null?Pg(s):c!==null?(c.return=o,Be=c):Pg(s);for(;r!==null;)Be=r,m_(r),r=r.sibling;Be=s,Ol=l,Rn=u}Cg(t)}else s.subtreeFlags&8772&&r!==null?(r.return=s,Be=r):Cg(t)}}function Cg(t){for(;Be!==null;){var e=Be;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Rn||ku(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!Rn)if(n===null)i.componentDidMount();else{var s=e.elementType===e.type?n.memoizedProps:ki(e.type,n.memoizedProps);i.componentDidUpdate(s,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var r=e.updateQueue;r!==null&&fg(e,r,i);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}fg(e,o,n)}break;case 5:var l=e.stateNode;if(n===null&&e.flags&4){n=l;var c=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":c.autoFocus&&n.focus();break;case"img":c.src&&(n.src=c.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var u=e.alternate;if(u!==null){var d=u.memoizedState;if(d!==null){var p=d.dehydrated;p!==null&&Xo(p)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(de(163))}Rn||e.flags&512&&Wh(e)}catch(h){Xt(e,e.return,h)}}if(e===t){Be=null;break}if(n=e.sibling,n!==null){n.return=e.return,Be=n;break}Be=e.return}}function Rg(t){for(;Be!==null;){var e=Be;if(e===t){Be=null;break}var n=e.sibling;if(n!==null){n.return=e.return,Be=n;break}Be=e.return}}function Pg(t){for(;Be!==null;){var e=Be;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{ku(4,e)}catch(c){Xt(e,n,c)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var s=e.return;try{i.componentDidMount()}catch(c){Xt(e,s,c)}}var r=e.return;try{Wh(e)}catch(c){Xt(e,r,c)}break;case 5:var o=e.return;try{Wh(e)}catch(c){Xt(e,o,c)}}}catch(c){Xt(e,e.return,c)}if(e===t){Be=null;break}var l=e.sibling;if(l!==null){l.return=e.return,Be=l;break}Be=e.return}}var PM=Math.ceil,ou=Cs.ReactCurrentDispatcher,Lp=Cs.ReactCurrentOwner,Ei=Cs.ReactCurrentBatchConfig,yt=0,vn=null,tn=null,Sn=0,ai=0,Ea=or(0),ln=0,sl=null,Lr=0,Iu=0,Dp=0,Fo=null,Xn=null,kp=0,Va=1/0,ps=null,lu=!1,Yh=null,er=null,jl=!1,Ys=null,cu=0,Oo=0,qh=null,Pc=-1,Lc=0;function zn(){return yt&6?Kt():Pc!==-1?Pc:Pc=Kt()}function tr(t){return t.mode&1?yt&2&&Sn!==0?Sn&-Sn:pM.transition!==null?(Lc===0&&(Lc=Jx()),Lc):(t=Pt,t!==0||(t=window.event,t=t===void 0?16:a0(t.type)),t):1}function Bi(t,e,n,i){if(50<Oo)throw Oo=0,qh=null,Error(de(185));hl(t,n,i),(!(yt&2)||t!==vn)&&(t===vn&&(!(yt&2)&&(Iu|=n),ln===4&&Ws(t,Sn)),Zn(t,i),n===1&&yt===0&&!(e.mode&1)&&(Va=Kt()+500,Pu&&lr()))}function Zn(t,e){var n=t.callbackNode;pS(t,e);var i=$c(t,t===vn?Sn:0);if(i===0)n!==null&&Bm(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Bm(n),e===1)t.tag===0?fM(Lg.bind(null,t)):E0(Lg.bind(null,t)),cM(function(){!(yt&6)&&lr()}),n=null;else{switch(e0(i)){case 1:n=ap;break;case 4:n=Zx;break;case 16:n=Wc;break;case 536870912:n=Qx;break;default:n=Wc}n=w_(n,g_.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function g_(t,e){if(Pc=-1,Lc=0,yt&6)throw Error(de(327));var n=t.callbackNode;if(Da()&&t.callbackNode!==n)return null;var i=$c(t,t===vn?Sn:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=uu(t,i);else{e=i;var s=yt;yt|=2;var r=x_();(vn!==t||Sn!==e)&&(ps=null,Va=Kt()+500,Ar(t,e));do try{kM();break}catch(l){v_(t,l)}while(!0);_p(),ou.current=r,yt=s,tn!==null?e=0:(vn=null,Sn=0,e=ln)}if(e!==0){if(e===2&&(s=Mh(t),s!==0&&(i=s,e=Kh(t,s))),e===1)throw n=sl,Ar(t,0),Ws(t,i),Zn(t,Kt()),n;if(e===6)Ws(t,i);else{if(s=t.current.alternate,!(i&30)&&!LM(s)&&(e=uu(t,i),e===2&&(r=Mh(t),r!==0&&(i=r,e=Kh(t,r))),e===1))throw n=sl,Ar(t,0),Ws(t,i),Zn(t,Kt()),n;switch(t.finishedWork=s,t.finishedLanes=i,e){case 0:case 1:throw Error(de(345));case 2:_r(t,Xn,ps);break;case 3:if(Ws(t,i),(i&130023424)===i&&(e=kp+500-Kt(),10<e)){if($c(t,0)!==0)break;if(s=t.suspendedLanes,(s&i)!==i){zn(),t.pingedLanes|=t.suspendedLanes&s;break}t.timeoutHandle=Rh(_r.bind(null,t,Xn,ps),e);break}_r(t,Xn,ps);break;case 4:if(Ws(t,i),(i&4194240)===i)break;for(e=t.eventTimes,s=-1;0<i;){var o=31-ji(i);r=1<<o,o=e[o],o>s&&(s=o),i&=~r}if(i=s,i=Kt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*PM(i/1960))-i,10<i){t.timeoutHandle=Rh(_r.bind(null,t,Xn,ps),i);break}_r(t,Xn,ps);break;case 5:_r(t,Xn,ps);break;default:throw Error(de(329))}}}return Zn(t,Kt()),t.callbackNode===n?g_.bind(null,t):null}function Kh(t,e){var n=Fo;return t.current.memoizedState.isDehydrated&&(Ar(t,e).flags|=256),t=uu(t,e),t!==2&&(e=Xn,Xn=n,e!==null&&Zh(e)),t}function Zh(t){Xn===null?Xn=t:Xn.push.apply(Xn,t)}function LM(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var s=n[i],r=s.getSnapshot;s=s.value;try{if(!zi(r(),s))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Ws(t,e){for(e&=~Dp,e&=~Iu,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-ji(e),i=1<<n;t[n]=-1,e&=~i}}function Lg(t){if(yt&6)throw Error(de(327));Da();var e=$c(t,0);if(!(e&1))return Zn(t,Kt()),null;var n=uu(t,e);if(t.tag!==0&&n===2){var i=Mh(t);i!==0&&(e=i,n=Kh(t,i))}if(n===1)throw n=sl,Ar(t,0),Ws(t,e),Zn(t,Kt()),n;if(n===6)throw Error(de(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,_r(t,Xn,ps),Zn(t,Kt()),null}function Ip(t,e){var n=yt;yt|=1;try{return t(e)}finally{yt=n,yt===0&&(Va=Kt()+500,Pu&&lr())}}function Dr(t){Ys!==null&&Ys.tag===0&&!(yt&6)&&Da();var e=yt;yt|=1;var n=Ei.transition,i=Pt;try{if(Ei.transition=null,Pt=1,t)return t()}finally{Pt=i,Ei.transition=n,yt=e,!(yt&6)&&lr()}}function Up(){ai=Ea.current,Bt(Ea)}function Ar(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,lM(n)),tn!==null)for(n=tn.return;n!==null;){var i=n;switch(gp(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&Zc();break;case 3:za(),Bt(qn),Bt(kn),Ep();break;case 5:bp(i);break;case 4:za();break;case 13:Bt(Gt);break;case 19:Bt(Gt);break;case 10:yp(i.type._context);break;case 22:case 23:Up()}n=n.return}if(vn=t,tn=t=nr(t.current,null),Sn=ai=e,ln=0,sl=null,Dp=Iu=Lr=0,Xn=Fo=null,Mr!==null){for(e=0;e<Mr.length;e++)if(n=Mr[e],i=n.interleaved,i!==null){n.interleaved=null;var s=i.next,r=n.pending;if(r!==null){var o=r.next;r.next=s,i.next=o}n.pending=i}Mr=null}return t}function v_(t,e){do{var n=tn;try{if(_p(),Nc.current=au,ru){for(var i=Wt.memoizedState;i!==null;){var s=i.queue;s!==null&&(s.pending=null),i=i.next}ru=!1}if(Pr=0,gn=on=Wt=null,Io=!1,tl=0,Lp.current=null,n===null||n.return===null){ln=1,sl=e,tn=null;break}e:{var r=t,o=n.return,l=n,c=e;if(e=Sn,l.flags|=32768,c!==null&&typeof c=="object"&&typeof c.then=="function"){var u=c,d=l,p=d.tag;if(!(d.mode&1)&&(p===0||p===11||p===15)){var h=d.alternate;h?(d.updateQueue=h.updateQueue,d.memoizedState=h.memoizedState,d.lanes=h.lanes):(d.updateQueue=null,d.memoizedState=null)}var m=_g(o);if(m!==null){m.flags&=-257,yg(m,o,l,r,e),m.mode&1&&xg(r,u,e),e=m,c=u;var v=e.updateQueue;if(v===null){var w=new Set;w.add(c),e.updateQueue=w}else v.add(c);break e}else{if(!(e&1)){xg(r,u,e),Fp();break e}c=Error(de(426))}}else if(zt&&l.mode&1){var x=_g(o);if(x!==null){!(x.flags&65536)&&(x.flags|=256),yg(x,o,l,r,e),vp(Ha(c,l));break e}}r=c=Ha(c,l),ln!==4&&(ln=2),Fo===null?Fo=[r]:Fo.push(r),r=o;do{switch(r.tag){case 3:r.flags|=65536,e&=-e,r.lanes|=e;var f=e_(r,c,e);hg(r,f);break e;case 1:l=c;var g=r.type,S=r.stateNode;if(!(r.flags&128)&&(typeof g.getDerivedStateFromError=="function"||S!==null&&typeof S.componentDidCatch=="function"&&(er===null||!er.has(S)))){r.flags|=65536,e&=-e,r.lanes|=e;var y=t_(r,l,e);hg(r,y);break e}}r=r.return}while(r!==null)}y_(n)}catch(b){e=b,tn===n&&n!==null&&(tn=n=n.return);continue}break}while(!0)}function x_(){var t=ou.current;return ou.current=au,t===null?au:t}function Fp(){(ln===0||ln===3||ln===2)&&(ln=4),vn===null||!(Lr&268435455)&&!(Iu&268435455)||Ws(vn,Sn)}function uu(t,e){var n=yt;yt|=2;var i=x_();(vn!==t||Sn!==e)&&(ps=null,Ar(t,e));do try{DM();break}catch(s){v_(t,s)}while(!0);if(_p(),yt=n,ou.current=i,tn!==null)throw Error(de(261));return vn=null,Sn=0,ln}function DM(){for(;tn!==null;)__(tn)}function kM(){for(;tn!==null&&!rS();)__(tn)}function __(t){var e=M_(t.alternate,t,ai);t.memoizedProps=t.pendingProps,e===null?y_(t):tn=e,Lp.current=null}function y_(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=AM(n,e),n!==null){n.flags&=32767,tn=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{ln=6,tn=null;return}}else if(n=TM(n,e,ai),n!==null){tn=n;return}if(e=e.sibling,e!==null){tn=e;return}tn=e=t}while(e!==null);ln===0&&(ln=5)}function _r(t,e,n){var i=Pt,s=Ei.transition;try{Ei.transition=null,Pt=1,IM(t,e,n,i)}finally{Ei.transition=s,Pt=i}return null}function IM(t,e,n,i){do Da();while(Ys!==null);if(yt&6)throw Error(de(327));n=t.finishedWork;var s=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(de(177));t.callbackNode=null,t.callbackPriority=0;var r=n.lanes|n.childLanes;if(mS(t,r),t===vn&&(tn=vn=null,Sn=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||jl||(jl=!0,w_(Wc,function(){return Da(),null})),r=(n.flags&15990)!==0,n.subtreeFlags&15990||r){r=Ei.transition,Ei.transition=null;var o=Pt;Pt=1;var l=yt;yt|=4,Lp.current=null,CM(t,n),p_(n,t),tM(Nh),Xc=!!Ah,Nh=Ah=null,t.current=n,RM(n),aS(),yt=l,Pt=o,Ei.transition=r}else t.current=n;if(jl&&(jl=!1,Ys=t,cu=s),r=t.pendingLanes,r===0&&(er=null),cS(n.stateNode),Zn(t,Kt()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)s=e[n],i(s.value,{componentStack:s.stack,digest:s.digest});if(lu)throw lu=!1,t=Yh,Yh=null,t;return cu&1&&t.tag!==0&&Da(),r=t.pendingLanes,r&1?t===qh?Oo++:(Oo=0,qh=t):Oo=0,lr(),null}function Da(){if(Ys!==null){var t=e0(cu),e=Ei.transition,n=Pt;try{if(Ei.transition=null,Pt=16>t?16:t,Ys===null)var i=!1;else{if(t=Ys,Ys=null,cu=0,yt&6)throw Error(de(331));var s=yt;for(yt|=4,Be=t.current;Be!==null;){var r=Be,o=r.child;if(Be.flags&16){var l=r.deletions;if(l!==null){for(var c=0;c<l.length;c++){var u=l[c];for(Be=u;Be!==null;){var d=Be;switch(d.tag){case 0:case 11:case 15:Uo(8,d,r)}var p=d.child;if(p!==null)p.return=d,Be=p;else for(;Be!==null;){d=Be;var h=d.sibling,m=d.return;if(d_(d),d===u){Be=null;break}if(h!==null){h.return=m,Be=h;break}Be=m}}}var v=r.alternate;if(v!==null){var w=v.child;if(w!==null){v.child=null;do{var x=w.sibling;w.sibling=null,w=x}while(w!==null)}}Be=r}}if(r.subtreeFlags&2064&&o!==null)o.return=r,Be=o;else e:for(;Be!==null;){if(r=Be,r.flags&2048)switch(r.tag){case 0:case 11:case 15:Uo(9,r,r.return)}var f=r.sibling;if(f!==null){f.return=r.return,Be=f;break e}Be=r.return}}var g=t.current;for(Be=g;Be!==null;){o=Be;var S=o.child;if(o.subtreeFlags&2064&&S!==null)S.return=o,Be=S;else e:for(o=g;Be!==null;){if(l=Be,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:ku(9,l)}}catch(b){Xt(l,l.return,b)}if(l===o){Be=null;break e}var y=l.sibling;if(y!==null){y.return=l.return,Be=y;break e}Be=l.return}}if(yt=s,lr(),es&&typeof es.onPostCommitFiberRoot=="function")try{es.onPostCommitFiberRoot(Tu,t)}catch{}i=!0}return i}finally{Pt=n,Ei.transition=e}}return!1}function Dg(t,e,n){e=Ha(n,e),e=e_(t,e,1),t=Js(t,e,1),e=zn(),t!==null&&(hl(t,1,e),Zn(t,e))}function Xt(t,e,n){if(t.tag===3)Dg(t,t,n);else for(;e!==null;){if(e.tag===3){Dg(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(er===null||!er.has(i))){t=Ha(n,t),t=t_(e,t,1),e=Js(e,t,1),t=zn(),e!==null&&(hl(e,1,t),Zn(e,t));break}}e=e.return}}function UM(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=zn(),t.pingedLanes|=t.suspendedLanes&n,vn===t&&(Sn&n)===n&&(ln===4||ln===3&&(Sn&130023424)===Sn&&500>Kt()-kp?Ar(t,0):Dp|=n),Zn(t,e)}function S_(t,e){e===0&&(t.mode&1?(e=Cl,Cl<<=1,!(Cl&130023424)&&(Cl=4194304)):e=1);var n=zn();t=Ts(t,e),t!==null&&(hl(t,e,n),Zn(t,n))}function FM(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),S_(t,n)}function OM(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,s=t.memoizedState;s!==null&&(n=s.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(de(314))}i!==null&&i.delete(e),S_(t,n)}var M_;M_=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||qn.current)Yn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return Yn=!1,EM(t,e,n);Yn=!!(t.flags&131072)}else Yn=!1,zt&&e.flags&1048576&&T0(e,eu,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;Rc(t,e),t=e.pendingProps;var s=Oa(e,kn.current);La(e,n),s=Ap(null,e,i,t,s,n);var r=Np();return e.flags|=1,typeof s=="object"&&s!==null&&typeof s.render=="function"&&s.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,Kn(i)?(r=!0,Qc(e)):r=!1,e.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,Mp(e),s.updater=Du,e.stateNode=s,s._reactInternals=e,Fh(e,i,t,n),e=Bh(null,e,i,!0,r,n)):(e.tag=0,zt&&r&&mp(e),jn(null,e,s,n),e=e.child),e;case 16:i=e.elementType;e:{switch(Rc(t,e),t=e.pendingProps,s=i._init,i=s(i._payload),e.type=i,s=e.tag=BM(i),t=ki(i,t),s){case 0:e=jh(null,e,i,t,n);break e;case 1:e=wg(null,e,i,t,n);break e;case 11:e=Sg(null,e,i,t,n);break e;case 14:e=Mg(null,e,i,ki(i.type,t),n);break e}throw Error(de(306,i,""))}return e;case 0:return i=e.type,s=e.pendingProps,s=e.elementType===i?s:ki(i,s),jh(t,e,i,s,n);case 1:return i=e.type,s=e.pendingProps,s=e.elementType===i?s:ki(i,s),wg(t,e,i,s,n);case 3:e:{if(r_(e),t===null)throw Error(de(387));i=e.pendingProps,r=e.memoizedState,s=r.element,L0(t,e),iu(e,i,null,n);var o=e.memoizedState;if(i=o.element,r.isDehydrated)if(r={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=r,e.memoizedState=r,e.flags&256){s=Ha(Error(de(423)),e),e=bg(t,e,i,n,s);break e}else if(i!==s){s=Ha(Error(de(424)),e),e=bg(t,e,i,n,s);break e}else for(oi=Qs(e.stateNode.containerInfo.firstChild),ci=e,zt=!0,Ui=null,n=R0(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(ja(),i===s){e=As(t,e,n);break e}jn(t,e,i,n)}e=e.child}return e;case 5:return D0(e),t===null&&kh(e),i=e.type,s=e.pendingProps,r=t!==null?t.memoizedProps:null,o=s.children,Ch(i,s)?o=null:r!==null&&Ch(i,r)&&(e.flags|=32),s_(t,e),jn(t,e,o,n),e.child;case 6:return t===null&&kh(e),null;case 13:return a_(t,e,n);case 4:return wp(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=Ba(e,null,i,n):jn(t,e,i,n),e.child;case 11:return i=e.type,s=e.pendingProps,s=e.elementType===i?s:ki(i,s),Sg(t,e,i,s,n);case 7:return jn(t,e,e.pendingProps,n),e.child;case 8:return jn(t,e,e.pendingProps.children,n),e.child;case 12:return jn(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,s=e.pendingProps,r=e.memoizedProps,o=s.value,It(tu,i._currentValue),i._currentValue=o,r!==null)if(zi(r.value,o)){if(r.children===s.children&&!qn.current){e=As(t,e,n);break e}}else for(r=e.child,r!==null&&(r.return=e);r!==null;){var l=r.dependencies;if(l!==null){o=r.child;for(var c=l.firstContext;c!==null;){if(c.context===i){if(r.tag===1){c=Ss(-1,n&-n),c.tag=2;var u=r.updateQueue;if(u!==null){u=u.shared;var d=u.pending;d===null?c.next=c:(c.next=d.next,d.next=c),u.pending=c}}r.lanes|=n,c=r.alternate,c!==null&&(c.lanes|=n),Ih(r.return,n,e),l.lanes|=n;break}c=c.next}}else if(r.tag===10)o=r.type===e.type?null:r.child;else if(r.tag===18){if(o=r.return,o===null)throw Error(de(341));o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),Ih(o,n,e),o=r.sibling}else o=r.child;if(o!==null)o.return=r;else for(o=r;o!==null;){if(o===e){o=null;break}if(r=o.sibling,r!==null){r.return=o.return,o=r;break}o=o.return}r=o}jn(t,e,s.children,n),e=e.child}return e;case 9:return s=e.type,i=e.pendingProps.children,La(e,n),s=Ti(s),i=i(s),e.flags|=1,jn(t,e,i,n),e.child;case 14:return i=e.type,s=ki(i,e.pendingProps),s=ki(i.type,s),Mg(t,e,i,s,n);case 15:return n_(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,s=e.pendingProps,s=e.elementType===i?s:ki(i,s),Rc(t,e),e.tag=1,Kn(i)?(t=!0,Qc(e)):t=!1,La(e,n),J0(e,i,s),Fh(e,i,s,n),Bh(null,e,i,!0,t,n);case 19:return o_(t,e,n);case 22:return i_(t,e,n)}throw Error(de(156,e.tag))};function w_(t,e){return Kx(t,e)}function jM(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function wi(t,e,n,i){return new jM(t,e,n,i)}function Op(t){return t=t.prototype,!(!t||!t.isReactComponent)}function BM(t){if(typeof t=="function")return Op(t)?1:0;if(t!=null){if(t=t.$$typeof,t===ip)return 11;if(t===sp)return 14}return 2}function nr(t,e){var n=t.alternate;return n===null?(n=wi(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Dc(t,e,n,i,s,r){var o=2;if(i=t,typeof t=="function")Op(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case ma:return Nr(n.children,s,r,e);case np:o=8,s|=8;break;case oh:return t=wi(12,n,e,s|2),t.elementType=oh,t.lanes=r,t;case lh:return t=wi(13,n,e,s),t.elementType=lh,t.lanes=r,t;case ch:return t=wi(19,n,e,s),t.elementType=ch,t.lanes=r,t;case Dx:return Uu(n,s,r,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Px:o=10;break e;case Lx:o=9;break e;case ip:o=11;break e;case sp:o=14;break e;case Bs:o=16,i=null;break e}throw Error(de(130,t==null?t:typeof t,""))}return e=wi(o,n,e,s),e.elementType=t,e.type=i,e.lanes=r,e}function Nr(t,e,n,i){return t=wi(7,t,i,e),t.lanes=n,t}function Uu(t,e,n,i){return t=wi(22,t,i,e),t.elementType=Dx,t.lanes=n,t.stateNode={isHidden:!1},t}function vd(t,e,n){return t=wi(6,t,null,e),t.lanes=n,t}function xd(t,e,n){return e=wi(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function zM(t,e,n,i,s){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Qu(0),this.expirationTimes=Qu(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Qu(0),this.identifierPrefix=i,this.onRecoverableError=s,this.mutableSourceEagerHydrationData=null}function jp(t,e,n,i,s,r,o,l,c){return t=new zM(t,e,n,l,c),e===1?(e=1,r===!0&&(e|=8)):e=0,r=wi(3,null,null,e),t.current=r,r.stateNode=t,r.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Mp(r),t}function HM(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:pa,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function b_(t){if(!t)return sr;t=t._reactInternals;e:{if(zr(t)!==t||t.tag!==1)throw Error(de(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(Kn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(de(171))}if(t.tag===1){var n=t.type;if(Kn(n))return b0(t,n,e)}return e}function E_(t,e,n,i,s,r,o,l,c){return t=jp(n,i,!0,t,s,r,o,l,c),t.context=b_(null),n=t.current,i=zn(),s=tr(n),r=Ss(i,s),r.callback=e??null,Js(n,r,s),t.current.lanes=s,hl(t,s,i),Zn(t,i),t}function Fu(t,e,n,i){var s=e.current,r=zn(),o=tr(s);return n=b_(n),e.context===null?e.context=n:e.pendingContext=n,e=Ss(r,o),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=Js(s,e,o),t!==null&&(Bi(t,s,o,r),Ac(t,s,o)),o}function du(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function kg(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Bp(t,e){kg(t,e),(t=t.alternate)&&kg(t,e)}function VM(){return null}var T_=typeof reportError=="function"?reportError:function(t){console.error(t)};function zp(t){this._internalRoot=t}Ou.prototype.render=zp.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(de(409));Fu(t,e,null,null)};Ou.prototype.unmount=zp.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Dr(function(){Fu(null,t,null,null)}),e[Es]=null}};function Ou(t){this._internalRoot=t}Ou.prototype.unstable_scheduleHydration=function(t){if(t){var e=i0();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Gs.length&&e!==0&&e<Gs[n].priority;n++);Gs.splice(n,0,t),n===0&&r0(t)}};function Hp(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function ju(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Ig(){}function GM(t,e,n,i,s){if(s){if(typeof i=="function"){var r=i;i=function(){var u=du(o);r.call(u)}}var o=E_(e,i,t,0,null,!1,!1,"",Ig);return t._reactRootContainer=o,t[Es]=o.current,Ko(t.nodeType===8?t.parentNode:t),Dr(),o}for(;s=t.lastChild;)t.removeChild(s);if(typeof i=="function"){var l=i;i=function(){var u=du(c);l.call(u)}}var c=jp(t,0,!1,null,null,!1,!1,"",Ig);return t._reactRootContainer=c,t[Es]=c.current,Ko(t.nodeType===8?t.parentNode:t),Dr(function(){Fu(e,c,n,i)}),c}function Bu(t,e,n,i,s){var r=n._reactRootContainer;if(r){var o=r;if(typeof s=="function"){var l=s;s=function(){var c=du(o);l.call(c)}}Fu(e,o,t,s)}else o=GM(n,e,t,s,i);return du(o)}t0=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=To(e.pendingLanes);n!==0&&(op(e,n|1),Zn(e,Kt()),!(yt&6)&&(Va=Kt()+500,lr()))}break;case 13:Dr(function(){var i=Ts(t,1);if(i!==null){var s=zn();Bi(i,t,1,s)}}),Bp(t,1)}};lp=function(t){if(t.tag===13){var e=Ts(t,134217728);if(e!==null){var n=zn();Bi(e,t,134217728,n)}Bp(t,134217728)}};n0=function(t){if(t.tag===13){var e=tr(t),n=Ts(t,e);if(n!==null){var i=zn();Bi(n,t,e,i)}Bp(t,e)}};i0=function(){return Pt};s0=function(t,e){var n=Pt;try{return Pt=t,e()}finally{Pt=n}};_h=function(t,e,n){switch(e){case"input":if(hh(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var s=Ru(i);if(!s)throw Error(de(90));Ix(i),hh(i,s)}}}break;case"textarea":Fx(t,n);break;case"select":e=n.value,e!=null&&Na(t,!!n.multiple,e,!1)}};Gx=Ip;Wx=Dr;var WM={usingClientEntryPoint:!1,Events:[pl,_a,Ru,Hx,Vx,Ip]},co={findFiberByHostInstance:Sr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},$M={bundleType:co.bundleType,version:co.version,rendererPackageName:co.rendererPackageName,rendererConfig:co.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Cs.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Yx(t),t===null?null:t.stateNode},findFiberByHostInstance:co.findFiberByHostInstance||VM,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Bl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Bl.isDisabled&&Bl.supportsFiber)try{Tu=Bl.inject($M),es=Bl}catch{}}hi.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=WM;hi.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Hp(e))throw Error(de(200));return HM(t,e,null,n)};hi.createRoot=function(t,e){if(!Hp(t))throw Error(de(299));var n=!1,i="",s=T_;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(s=e.onRecoverableError)),e=jp(t,1,!1,null,null,n,!1,i,s),t[Es]=e.current,Ko(t.nodeType===8?t.parentNode:t),new zp(e)};hi.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(de(188)):(t=Object.keys(t).join(","),Error(de(268,t)));return t=Yx(e),t=t===null?null:t.stateNode,t};hi.flushSync=function(t){return Dr(t)};hi.hydrate=function(t,e,n){if(!ju(e))throw Error(de(200));return Bu(null,t,e,!0,n)};hi.hydrateRoot=function(t,e,n){if(!Hp(t))throw Error(de(405));var i=n!=null&&n.hydratedSources||null,s=!1,r="",o=T_;if(n!=null&&(n.unstable_strictMode===!0&&(s=!0),n.identifierPrefix!==void 0&&(r=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=E_(e,null,t,1,n??null,s,!1,r,o),t[Es]=e.current,Ko(t),i)for(t=0;t<i.length;t++)n=i[t],s=n._getVersion,s=s(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,s]:e.mutableSourceEagerHydrationData.push(n,s);return new Ou(e)};hi.render=function(t,e,n){if(!ju(e))throw Error(de(200));return Bu(null,t,e,!1,n)};hi.unmountComponentAtNode=function(t){if(!ju(t))throw Error(de(40));return t._reactRootContainer?(Dr(function(){Bu(null,null,t,!1,function(){t._reactRootContainer=null,t[Es]=null})}),!0):!1};hi.unstable_batchedUpdates=Ip;hi.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!ju(n))throw Error(de(200));if(t==null||t._reactInternals===void 0)throw Error(de(38));return Bu(t,e,n,!1,i)};hi.version="18.3.1-next-f1338f8080-20240426";function A_(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(A_)}catch(t){console.error(t)}}A_(),Ax.exports=hi;var XM=Ax.exports,N_,Ug=XM;N_=Ug.createRoot,Ug.hydrateRoot;const YM=()=>a.jsxs("svg",{width:"26",height:"22",viewBox:"0 0 36 30",fill:"none",stroke:"#FF2D95",strokeWidth:1.8,strokeLinejoin:"round",strokeLinecap:"round",style:{filter:"drop-shadow(0 0 6px rgba(255,45,149,.7))"},children:[a.jsx("path",{d:"M4 24 L4 9 L12 16 L18 5 L24 16 L32 9 L32 24 Z"}),a.jsx("line",{x1:"7",y1:"28",x2:"29",y2:"28"})]}),qM=[{id:"dashboard",label:"Dashboard"},{id:"paperbot",label:"Paper Bot"},{id:"seo",label:"SEO Agent"},{id:"ceo",label:"CEO"},{id:"sales",label:"Sales"},{id:"projects",label:"Projects"},{id:"studio",label:"Studio"},{id:"brain",label:"Brain"},{id:"command",label:"Command"},{id:"stats",label:"Statistics"},{id:"settings",label:"Settings"}],KM=({active:t,onChange:e,onLogout:n})=>a.jsxs("aside",{className:"sidebar",children:[a.jsxs("div",{className:"brand",children:[a.jsx(YM,{}),a.jsx("span",{className:"name",children:"BlackCrown"})]}),qM.map(i=>a.jsxs("button",{className:`nav-item${t===i.id?" active":""}`,onClick:()=>!i.soon&&e(i.id),disabled:i.soon,children:[i.label,i.soon?a.jsx("span",{className:"soon",children:"Soon"}):null]},i.id)),a.jsxs("div",{className:"sidebar-foot",children:["BlackCrownVxJ LLC",n?a.jsx("button",{className:"logout",onClick:n,children:"Sign out"}):null]})]}),Ye="";async function ZM(){try{const t=await fetch(`${Ye}/api/config`);return t.ok?t.json():null}catch{return null}}async function QM(){const t=await fetch(`${Ye}/api/brief`);return t.ok?(await t.json()).brief??"":""}async function JM(t){const e=await fetch(`${Ye}/api/brief`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({brief:t})});if(!e.ok){const i=await e.json().catch(()=>({}));throw new Error(i.error||`Save failed (${e.status})`)}return(await e.json()).brief??t}async function ew(){return(await(await fetch(`${Ye}/api/brief`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reset:!0})})).json()).brief??""}async function Vp(){try{const t=await fetch(`${Ye}/api/stats`,{cache:"no-store"});return t.ok?t.json():null}catch{return null}}async function Gp(t=!1){try{const e=await fetch(`${Ye}/api/uptime${t?"?now=1":""}`,{cache:"no-store"});if(!e.ok)return[];const n=await e.json();return Array.isArray(n.sites)?n.sites:[]}catch{return[]}}async function tw(){try{const t=await fetch(`${Ye}/api/system`,{cache:"no-store"});return t.ok?t.json():null}catch{return null}}async function nw(){try{const t=await fetch(`${Ye}/api/money`);return t.ok?t.json():null}catch{return null}}async function iw(t){const e=await fetch(`${Ye}/api/money`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!e.ok){const n=await e.json().catch(()=>({}));throw new Error(n.error||`Save failed (${e.status})`)}}async function sw(t){await fetch(`${Ye}/api/money/${encodeURIComponent(t)}`,{method:"DELETE"})}async function C_(t=!1){try{const e=await fetch(`${Ye}/api/revenue${t?"?fresh=1":""}`,{cache:"no-store"}),n=await e.json().catch(()=>null);return e.ok||n&&n.configured?n:null}catch{return null}}async function kc(){try{const t=await fetch(`${Ye}/api/seo`,{cache:"no-store"});return t.ok?t.json():null}catch{return null}}async function rw(){const t=await fetch(`${Ye}/api/seo/audit`,{method:"POST"}),e=await t.json().catch(()=>({}));if(!t.ok)throw new Error(e.error||`Audit failed (${t.status})`);return e}async function aw(t){const e=await fetch(`${Ye}/api/seo/review`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({file:t})}),n=await e.json().catch(()=>({}));if(!e.ok)throw new Error(n.error||`Review failed (${e.status})`);return n.review}async function Qh(){try{const t=await fetch(`${Ye}/api/agent`,{cache:"no-store"});return t.ok?t.json():null}catch{return null}}async function ow(){const t=await fetch(`${Ye}/api/agent/cycle`,{method:"POST"}),e=await t.json().catch(()=>({}));if(!t.ok)throw new Error(e.error||`Cycle failed (${t.status})`);return e.state}async function lw(t){return(await(await fetch(`${Ye}/api/agent/enabled`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({on:t})})).json().catch(()=>({}))).state||null}async function cw(t){await fetch(`${Ye}/api/agent/task`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:t})})}async function uw(){const t=await fetch(`${Ye}/api/agent/test`,{method:"POST"});if(!t.ok){const e=await t.json().catch(()=>({}));throw new Error(e.error||`Test failed (${t.status})`)}}async function R_(t,e,n=""){const i=await fetch(`${Ye}/api/agent/proposal/${encodeURIComponent(t)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:e,note:n})}),s=await i.json().catch(()=>({}));if(!i.ok)throw new Error(s.error||`Decision failed (${i.status})`);return s.proposal}async function dw(t){await fetch(`${Ye}/api/agent/proposal/${encodeURIComponent(t)}/retry`,{method:"POST"})}async function hw(t,e){const n=await fetch(`${Ye}/api/agent/brain/file`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:t,body:e})});if(!n.ok){const i=await n.json().catch(()=>({}));throw new Error(i.error||`Save failed (${n.status})`)}}async function fw(){try{const t=await fetch(`${Ye}/api/agent/brain`);return t.ok?(await t.json()).files||[]:[]}catch{return[]}}async function pw(t){const e=await fetch(`${Ye}/api/agent/brain/file?name=${encodeURIComponent(t)}`);return e.ok&&(await e.json()).body||""}const mw=`${Ye}/api/agent/brain.tgz`;async function gw(){try{const t=await fetch(`${Ye}/api/jobs`,{cache:"no-store"});return t.ok?(await t.json()).jobs||[]:[]}catch{return[]}}async function vw(t){await fetch(`${Ye}/api/jobs/${encodeURIComponent(t)}/run`,{method:"POST"})}async function xw(t){await fetch(`${Ye}/api/jobs/${encodeURIComponent(t)}/toggle`,{method:"POST"})}async function _w(t){await fetch(`${Ye}/api/jobs/${encodeURIComponent(t)}`,{method:"DELETE"})}async function P_(){const t=await fetch(`${Ye}/api/discord/expressions`,{method:"POST"}),e=await t.json().catch(()=>({}));if(!t.ok)throw new Error(e.error||`Upload failed (${t.status})`);return e}async function Fg(){try{const t=await fetch(`${Ye}/api/wire`,{cache:"no-store"});return t.ok?(await t.json()).wire||[]:[]}catch{return[]}}async function L_(){try{const t=await fetch(`${Ye}/api/staff`,{cache:"no-store"});return t.ok?(await t.json()).agents||[]:[]}catch{return[]}}async function yw(t){const e=await fetch(`${Ye}/api/staff/${encodeURIComponent(t)}/cycle`,{method:"POST"});if(!e.ok){const n=await e.json().catch(()=>({}));throw new Error(n.error||`Cycle failed (${e.status})`)}}async function Sw(t,e){await fetch(`${Ye}/api/staff/${encodeURIComponent(t)}/enabled`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({on:e})})}async function Mw(t,e){await fetch(`${Ye}/api/staff/${encodeURIComponent(t)}/task`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:e})})}async function D_(){try{const t=await fetch(`${Ye}/api/ceo`,{cache:"no-store"});return t.ok?t.json():null}catch{return null}}async function ww(t){await fetch(`${Ye}/api/ceo/enabled`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({on:t})})}async function bw(){try{const t=await fetch(`${Ye}/api/ceo/brain`);return t.ok?(await t.json()).files||[]:[]}catch{return[]}}async function Ew(t){const e=await fetch(`${Ye}/api/ceo/brain/file?name=${encodeURIComponent(t)}`);return e.ok&&(await e.json()).body||""}async function Tw(t,e){if(!(await fetch(`${Ye}/api/ceo/brain/file`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:t,body:e})})).ok)throw new Error("Save failed")}const Aw=`${Ye}/api/ceo/brain.tgz`;async function Nw(){try{const t=await fetch(`${Ye}/api/me`);return t.ok?t.json():null}catch{return null}}async function Cw(t,e){const n=await fetch(`${Ye}/api/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user:t,pass:e})});if(!n.ok){const i=await n.json().catch(()=>({}));throw new Error(i.error||`Login failed (${n.status})`)}}async function Rw(){await fetch(`${Ye}/api/logout`,{method:"POST"})}async function Pw(){try{const t=await fetch(`${Ye}/api/brain-graph`,{cache:"no-store",credentials:"include"});return t.ok?await t.json():null}catch{return null}}async function Lw(t){try{const e=await fetch(`${Ye}/api/brain-note?id=${encodeURIComponent(t)}`,{cache:"no-store",credentials:"include"});return e.ok?await e.json():null}catch{return null}}async function Dw(){try{const t=await fetch(`${Ye}/api/intel`,{cache:"no-store"});return t.ok?t.json():null}catch{return null}}async function kw(){try{const t=await fetch(`${Ye}/api/compass/live`,{cache:"no-store"});return t.ok?t.json():null}catch{return null}}async function Iw(){try{const t=await fetch(`${Ye}/api/intel/live`,{cache:"no-store"});return t.ok?t.json():null}catch{return null}}async function Uw(){try{const t=await fetch(`${Ye}/api/usage`,{cache:"no-store"});if(!t.ok)return null;const e=await t.json();return e&&e.budget?e:null}catch{return null}}async function Fw(){try{const t=await fetch(`${Ye}/api/intel/lab`,{cache:"no-store"});return t.ok?t.json():null}catch{return null}}async function Ow(t){const e=await fetch(`${Ye}/api/crew/tickets/${encodeURIComponent(t)}/close`,{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"}),n=await e.json().catch(()=>({}));if(!e.ok)throw new Error(n.error||`Close failed (${e.status})`);return n.stats||null}async function jw(){try{const t=await fetch(`${Ye}/api/tuning`);return t.ok?t.json():null}catch{return null}}async function Bw(t){const e=await fetch(`${Ye}/api/tuning`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({patch:t})}),n=await e.json().catch(()=>({}));if(!e.ok)throw new Error(n.error||`Save failed (${e.status})`);return n}async function zw(){try{const t=await fetch(`${Ye}/api/premarket`);return t.ok?t.json():null}catch{return null}}async function Hw(t){const e=await fetch(`${Ye}/api/premarket/music?name=${encodeURIComponent(t.name)}`,{method:"POST",headers:{"content-type":"application/octet-stream"},body:t});return e.json().catch(()=>({ok:!1,error:`HTTP ${e.status}`}))}async function Vw(t){return(await fetch(`${Ye}/api/premarket/music?name=${encodeURIComponent(t)}`,{method:"DELETE"})).json().catch(()=>({ok:!1}))}async function Gw(){const t=await fetch(`${Ye}/api/premarket/run`,{method:"POST"});return t.json().catch(()=>({ok:!1,error:`HTTP ${t.status}`}))}async function Og(){try{return(await fetch(`${Ye}/api/discord/expressions`)).json()}catch{return null}}const kr=({on:t,label:e,onChange:n,disabled:i})=>a.jsxs("label",{className:`switch${i?" sw-dis":""}`,children:[a.jsx("input",{type:"checkbox",checked:t,disabled:i,onChange:s=>n(s.target.checked)}),a.jsx("span",{className:"sw-track",children:a.jsx("span",{className:"sw-knob"})}),a.jsx("span",{className:"sw-label",children:e})]}),Ww=()=>{try{return localStorage.getItem("bc_live")!=="0"}catch{return!0}},Jh=t=>{if(!t)return"never";const e=Math.round((Date.now()-t)/6e4);if(e<1)return"just now";if(e<60)return`${e}m ago`;const n=Math.round(e/60);return n<48?`${n}h ago`:`${Math.round(n/24)}d ago`},$w=t=>t>=85?"good":t>=60?"mid":"bad",jg=({p:t,onDecide:e})=>{const[n,i]=Y.useState(t.status==="pending"),[s,r]=Y.useState(!1),o=async l=>{r(!0);try{await e(t.id,l)}finally{r(!1)}};return a.jsxs("div",{className:`prop ${t.status}`,children:[a.jsxs("div",{className:"prop-head",onClick:()=>i(!n),children:[a.jsxs("span",{className:"prop-num",children:["#",t.number]}),a.jsx("span",{className:"prop-sum",children:t.summary}),a.jsx("span",{className:`prop-status s-${t.status}`,children:t.status})]}),n?a.jsxs("div",{className:"prop-body",children:[a.jsxs("div",{className:"prop-meta",children:[t.page," · ",t.kind," · ",Jh(t.createdAt),t.note?` · note: ${t.note}`:""]}),a.jsx("pre",{className:"prop-detail",children:t.detail}),t.kind==="creative"?a.jsx("div",{className:"prop-meta",style:{color:"#f2c94c"},children:"Green light renders this creative via Bloom (spends credits), Herald finalizes the caption for its target, and the package posts to Discord."}):null,t.status==="pending"?a.jsxs("div",{className:"seo-actions",children:[a.jsx("button",{className:"btn",disabled:s,onClick:()=>o("approve"),children:"Approve"}),a.jsx("button",{className:"mini-btn",style:{marginLeft:0},disabled:s,onClick:()=>o("reject"),children:"Reject"})]}):null,t.status==="approved"&&t.kind==="creative"?a.jsx("div",{className:"seo-actions",children:a.jsx("button",{className:"mini-btn",style:{marginLeft:0},disabled:s,onClick:async()=>{r(!0);try{await dw(t.id)}finally{r(!1)}},children:"Re-render via Bloom"})}):null]}):null]})},Xw=()=>{const[t,e]=Y.useState([]),[n,i]=Y.useState(""),[s,r]=Y.useState(""),[o,l]=Y.useState(!1),[c,u]=Y.useState(!1);Y.useEffect(()=>{fw().then(e)},[]);const d=async h=>{i(h),l(!1),r(await pw(h))},p=async()=>{u(!0);try{await hw(n,s),l(!1)}finally{u(!1)}};return a.jsxs("div",{className:"brain",children:[a.jsxs("div",{className:"brain-side",children:[t.map(h=>a.jsx("button",{className:`brain-file${n===h.name?" active":""}`,onClick:()=>d(h.name),children:h.name},h.name)),a.jsx("a",{className:"mini-btn brain-dl",href:mw,children:"Download vault"})]}),a.jsx("div",{className:"brain-view",children:n?a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"seo-bar",style:{marginBottom:8},children:o?a.jsxs(a.Fragment,{children:[a.jsx("button",{className:"mini-btn",style:{marginLeft:0},onClick:p,disabled:c,children:c?"Saving...":"Save"}),a.jsx("button",{className:"mini-btn",style:{marginLeft:0},onClick:()=>d(n),disabled:c,children:"Cancel"})]}):a.jsx("button",{className:"mini-btn",style:{marginLeft:0},onClick:()=>l(!0),children:"Edit"})}),o?a.jsx("textarea",{className:"brain-edit",value:s,onChange:h=>r(h.target.value)}):a.jsx("pre",{className:"brain-pre",children:s||"(empty)"})]}):a.jsx("div",{className:"bl-empty",children:"The brain is an Obsidian vault of markdown. Pick a file, or download the vault and open the folder in Obsidian."})})]})},Yw=({page:t,review:e,onReview:n})=>{const[i,s]=Y.useState(!1),[r,o]=Y.useState(!1),l=async()=>{o(!0);try{await n(t.file),s(!0)}finally{o(!1)}};return a.jsxs("div",{className:"seo-card",children:[a.jsxs("div",{className:"seo-head",onClick:()=>s(!i),children:[a.jsx("span",{className:`seo-score ${$w(t.score)}`,children:t.score}),a.jsxs("div",{className:"seo-id",children:[a.jsx("div",{className:"seo-file",children:t.file}),a.jsx("div",{className:"seo-title",children:t.title||"No title tag"})]}),a.jsx("span",{className:"seo-issue-count",children:t.issues.length?`${t.issues.length} issue${t.issues.length===1?"":"s"}`:"clean"}),a.jsx("span",{className:"seo-caret",children:i?"v":">"})]}),i?a.jsxs("div",{className:"seo-body",children:[t.issues.length?a.jsx("ul",{className:"seo-issues",children:t.issues.map((c,u)=>a.jsxs("li",{className:`sev-${c.sev}`,children:[a.jsx("span",{className:"sev-tag",children:c.sev}),c.msg]},u))}):a.jsx("div",{className:"bl-empty",children:"No mechanical issues found."}),a.jsx("div",{className:"seo-actions",children:a.jsx("button",{className:"btn",onClick:l,disabled:r,children:r?"Thinking...":e?"Re-run page review":"Run page review"})}),e?a.jsx("pre",{className:"seo-review",children:e.text}):null]}):null]})},qw=()=>{const[t,e]=Y.useState(null),[n,i]=Y.useState(null),[s,r]=Y.useState(""),[o,l]=Y.useState(""),[c,u]=Y.useState(""),[d,p]=Y.useState(!1),[h,m]=Y.useState(Ww),[v,w]=Y.useState(0),x=async()=>{const[N,_]=await Promise.all([Qh(),kc()]);N&&e(N),_&&i(_),w(Date.now())};Y.useEffect(()=>{if(x(),!h)return;const N=window.setInterval(()=>{Qh().then(C=>{C&&e(C),w(Date.now())})},5e3),_=window.setInterval(()=>kc().then(C=>C&&i(C)),6e4);return()=>{window.clearInterval(N),window.clearInterval(_)}},[h]);const f=N=>{m(N);try{localStorage.setItem("bc_live",N?"1":"0")}catch{}},g=async(N,_)=>{l(""),r(N);try{await _(),x()}catch(C){l(C instanceof Error?C.message:"Something failed.")}finally{r("")}},S=async(N,_)=>{await R_(N,_),x()},y=async N=>{await aw(N);const _=await kc();i(_)},b=Y.useMemo(()=>((t==null?void 0:t.proposals)||[]).filter(N=>N.status==="pending"),[t]),T=Y.useMemo(()=>((t==null?void 0:t.proposals)||[]).filter(N=>N.status!=="pending").slice(0,8),[t]);return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"page-head",children:[a.jsx("span",{className:"eyebrow",children:"SEO Agent"}),a.jsxs("h1",{children:[(t==null?void 0:t.name)||"Corvid",", on the clock."]}),a.jsx("p",{children:"Your autonomous SEO operator. It studies the numbers daily, keeps its own brain, reports to your Discord channel, and waits on your word."})]}),a.jsxs("div",{className:"pulse",children:[a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"State"}),a.jsxs("span",{className:"pulse-v",children:[a.jsx("span",{className:`dot ${t?t.status==="error"?"down":t.enabled?"ok":"unknown":"unknown"}`}),t?t.status:"..."]})]}),a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Last cycle"}),a.jsx("span",{className:"pulse-v",style:{fontSize:16},children:Jh(t==null?void 0:t.lastCycleAt)})]}),a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Cadence"}),a.jsx("span",{className:"pulse-v",style:{fontSize:16},children:t?t.cycleEveryMin?`every ${t.cycleEveryMin}min`:t.cycleEveryH?`every ${t.cycleEveryH}h`:`daily ${t.cycleHourEt}:00 ET`:"..."})]}),a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Discord"}),a.jsxs("span",{className:"pulse-v",style:{fontSize:16},children:[a.jsx("span",{className:`dot ${(t==null?void 0:t.discordMode)==="none"?"down":"ok"}`}),(t==null?void 0:t.discordMode)==="bot"?"two-way":(t==null?void 0:t.discordMode)==="webhook"?"send only":"not linked"]})]})]}),a.jsxs("div",{className:"seo-bar",style:{marginTop:14,flexWrap:"wrap",alignItems:"center",gap:14},children:[a.jsx(kr,{on:(t==null?void 0:t.enabled)!==!1,disabled:!t||!!s,label:(t==null?void 0:t.enabled)===!1?"Auto-run off":"Auto-run 24/7",onChange:N=>g("auto",()=>lw(N))}),a.jsx(kr,{on:h,label:h?"Live feed":"Live feed off",onChange:f}),a.jsx("button",{className:"btn",onClick:()=>g("cycle",ow),disabled:!!s,children:s==="cycle"?"Thinking...":"Run cycle now"}),a.jsx("button",{className:"mini-btn",style:{marginLeft:0},onClick:()=>g("test",uw),disabled:!!s,children:s==="test"?"Sending...":"Test Discord"}),a.jsx("button",{className:"mini-btn",style:{marginLeft:0},onClick:()=>g("refresh",x),disabled:!!s,children:s==="refresh"?"Refreshing...":"Refresh"}),a.jsxs("span",{className:"sync-stamp",children:[a.jsx("span",{className:`dot ${h?"ok":"unknown"}`}),v?`synced ${new Date(v).toLocaleTimeString()}`:"..."]})]}),o?a.jsx("div",{className:"status err",children:o}):null,a.jsxs("div",{className:"sgroup",style:{marginTop:18},children:[a.jsx("div",{className:"sgroup-h",children:"Thinking"}),a.jsx("div",{className:"agent-focus",children:(t==null?void 0:t.currentFocus)||"..."}),t!=null&&t.lastThought?a.jsx("p",{className:"agent-thought",children:t.lastThought}):null]}),a.jsxs("div",{className:"stat-grid",style:{marginTop:18},children:[a.jsxs("div",{className:"sgroup",children:[a.jsxs("div",{className:"sgroup-h",children:["Proposals waiting on you (",b.length,")"]}),b.length?b.map(N=>a.jsx(jg,{p:N,onDecide:S},N.id)):a.jsx("div",{className:"bl-empty",children:"Nothing pending. New proposals land here and in Discord after each cycle."}),T.length?a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"sgroup-h",style:{fontSize:12,marginTop:14},children:"Decided"}),T.map(N=>a.jsx(jg,{p:N,onDecide:S},N.id))]}):null]}),a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Task queue"}),((t==null?void 0:t.tasks)||[]).length?a.jsx("div",{className:"bl",children:((t==null?void 0:t.tasks)||[]).map(N=>a.jsxs("div",{className:"agent-task",children:[a.jsx("span",{className:`t-chip t-${N.status}`,children:N.status}),a.jsx("span",{children:N.title})]},N.id))}):a.jsx("div",{className:"bl-empty",children:"No tasks yet."}),a.jsxs("form",{className:"gen-custom",onSubmit:async N=>{N.preventDefault(),c.trim()&&(await cw(c.trim()),u(""),x())},children:[a.jsx("input",{placeholder:"Hand the agent a task...",value:c,onChange:N=>u(N.target.value)}),a.jsx("button",{className:"btn gen-go",type:"submit",disabled:!c.trim(),children:"Add"})]})]})]}),a.jsxs("div",{className:"stat-grid",style:{marginTop:18},children:[a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Live log"}),a.jsxs("div",{className:"agent-log",children:[((t==null?void 0:t.log)||[]).map((N,_)=>a.jsxs("div",{className:"log-row",children:[a.jsx("span",{className:"log-t",children:new Date(N.t).toLocaleTimeString()}),a.jsx("span",{className:`log-k k-${N.kind}`,children:N.kind}),a.jsx("span",{className:"log-x",children:N.text})]},_)),((t==null?void 0:t.log)||[]).length?null:a.jsx("div",{className:"bl-empty",children:"Quiet so far."})]})]}),a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"The brain (Obsidian vault)"}),a.jsx(Xw,{})]})]}),a.jsxs("div",{className:"sgroup",style:{marginTop:18},children:[a.jsxs("div",{className:"sgroup-h",children:["Site audit, the agent's dataset",a.jsx("button",{className:"mini-btn",onClick:()=>p(!d),children:d?"Hide":"Show"}),a.jsx("button",{className:"mini-btn",onClick:()=>g("audit",async()=>i(await rw())),disabled:!!s,children:s==="audit"?"Auditing...":"Re-run audit"})]}),d?n&&n.pages.length?a.jsx("div",{className:"seo-list",children:[...n.pages].sort((N,_)=>N.score-_.score).map(N=>a.jsx(Yw,{page:N,review:n.reviews[N.file],onReview:y},N.file))}):a.jsx("div",{className:"bl-empty",children:"No audit stored yet. The agent runs one every cycle."}):a.jsx("div",{className:"bl-empty",children:n!=null&&n.auditedAt?`Last audited ${Jh(n.auditedAt)} · ${n.pages.length} pages`:"No audit yet, the agent runs one every cycle."})]})]})},Kw=()=>{try{return localStorage.getItem("bc_live")!=="0"}catch{return!0}},Zw=t=>{if(!t)return"never";const e=Math.round((Date.now()-t)/6e4);if(e<1)return"just now";if(e<60)return`${e}m ago`;const n=Math.round(e/60);return n<48?`${n}h ago`:`${Math.round(n/24)}d ago`},Qw=()=>{const[t,e]=Y.useState([]),[n,i]=Y.useState(""),[s,r]=Y.useState(""),[o,l]=Y.useState(!1),[c,u]=Y.useState(!1);Y.useEffect(()=>{bw().then(e)},[]);const d=async h=>{i(h),l(!1),r(await Ew(h))},p=async()=>{u(!0);try{await Tw(n,s),l(!1)}finally{u(!1)}};return a.jsxs("div",{className:"brain",children:[a.jsxs("div",{className:"brain-side",children:[t.map(h=>a.jsx("button",{className:`brain-file${n===h.name?" active":""}`,onClick:()=>d(h.name),children:h.name},h.name)),a.jsx("a",{className:"mini-btn brain-dl",href:Aw,children:"Download vault"})]}),a.jsx("div",{className:"brain-view",children:n?a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"seo-bar",style:{marginBottom:8},children:o?a.jsxs(a.Fragment,{children:[a.jsx("button",{className:"mini-btn",style:{marginLeft:0},onClick:p,disabled:c,children:c?"Saving...":"Save"}),a.jsx("button",{className:"mini-btn",style:{marginLeft:0},onClick:()=>d(n),disabled:c,children:"Cancel"})]}):a.jsx("button",{className:"mini-btn",style:{marginLeft:0},onClick:()=>l(!0),children:"Edit"})}),o?a.jsx("textarea",{className:"brain-edit",value:s,onChange:h=>r(h.target.value)}):a.jsx("pre",{className:"brain-pre",children:s||"(empty)"})]}):a.jsx("div",{className:"bl-empty",children:"The Charter is how you shape Regent's judgment. Edit it any time."})})]})},Jw=()=>{const[t,e]=Y.useState(null),[n,i]=Y.useState(""),[s,r]=Y.useState(Kw),[o,l]=Y.useState(0),[c,u]=Y.useState(!1),d=async()=>{const m=await D_();m&&e(m),l(Date.now())};Y.useEffect(()=>{if(d(),!s)return;const m=window.setInterval(d,5e3);return()=>window.clearInterval(m)},[s]);const p=m=>{r(m);try{localStorage.setItem("bc_live",m?"1":"0")}catch{}},h=async(m,v)=>{i(m);try{await R_(m,v),d()}finally{i("")}};return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"page-head",children:[a.jsx("span",{className:"eyebrow",children:"CEO"}),a.jsxs("h1",{children:[(t==null?void 0:t.name)||"Regent",", by your authority."]}),a.jsx("p",{children:"Reviews every agent filing, vetoes the weak ones, brings you the rest, and executes the moment you say approve. Your word, its hands."})]}),a.jsxs("div",{className:"pulse",children:[a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"State"}),a.jsxs("span",{className:"pulse-v",children:[a.jsx("span",{className:`dot ${t&&t.enabled?"ok":"unknown"}`}),t?t.status:"..."]})]}),a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Channel"}),a.jsxs("span",{className:"pulse-v",style:{fontSize:16},children:[a.jsx("span",{className:`dot ${(t==null?void 0:t.channel)==="none"?"down":"ok"}`}),(t==null?void 0:t.channel)==="own"?"its own":(t==null?void 0:t.channel)==="shared"?"shared with Corvid":"not linked"]})]}),a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Waiting on you"}),a.jsx("span",{className:"pulse-v",children:t?t.asks.length:"..."})]}),a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Executed"}),a.jsx("span",{className:"pulse-v",children:t?t.executed.length:"..."})]}),a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Model"}),a.jsx("span",{className:"pulse-v",style:{fontSize:14},children:(t==null?void 0:t.model)||"..."})]})]}),a.jsxs("div",{className:"seo-bar",style:{marginTop:14,flexWrap:"wrap",alignItems:"center",gap:14},children:[a.jsx(kr,{on:(t==null?void 0:t.enabled)!==!1,disabled:!t,label:(t==null?void 0:t.enabled)===!1?"Auto-run off":"Auto-run 24/7",onChange:async m=>{await ww(m),d()}}),a.jsx(kr,{on:s,label:s?"Live feed":"Live feed off",onChange:p}),a.jsx("button",{className:"mini-btn",style:{marginLeft:0},disabled:c,onClick:async()=>{u(!0);try{await d()}finally{u(!1)}},children:c?"Refreshing...":"Refresh"}),a.jsxs("span",{className:"sync-stamp",children:[a.jsx("span",{className:`dot ${s?"ok":"unknown"}`}),o?`synced ${new Date(o).toLocaleTimeString()}`:"..."]})]}),a.jsxs("div",{className:"stat-grid",style:{marginTop:18},children:[a.jsxs("div",{className:"sgroup",children:[a.jsxs("div",{className:"sgroup-h",children:["Asks waiting on your word (",(t==null?void 0:t.asks.length)||0,")"]}),t&&t.asks.length?t.asks.map(m=>a.jsxs("div",{className:"prop pending",children:[a.jsxs("div",{className:"prop-head",children:[a.jsxs("span",{className:"prop-num",children:["#",m.number]}),a.jsxs("span",{className:"prop-sum",children:[m.page," · ",m.summary]})]}),a.jsxs("div",{className:"prop-body",style:{paddingTop:10},children:[a.jsx("pre",{className:"prop-detail",children:m.detail}),a.jsxs("div",{className:"seo-actions",children:[a.jsx("button",{className:"btn",disabled:n===m.id,onClick:()=>h(m.id,"approve"),children:"Approve, Regent executes"}),a.jsx("button",{className:"mini-btn",style:{marginLeft:0},disabled:n===m.id,onClick:()=>h(m.id,"reject"),children:"Reject"})]})]})]},m.id)):a.jsx("div",{className:"bl-empty",children:"Nothing waiting. New asks land here and in Discord."})]}),a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Executed by Regent"}),t&&t.executed.length?a.jsx("div",{className:"bl",children:t.executed.map((m,v)=>a.jsxs("div",{className:"agent-task",children:[a.jsx("span",{className:`t-chip ${m.ok?"t-done":""}`,style:m.ok?{}:{color:"#ff7a7a"},children:m.ok?"done":"failed"}),a.jsxs("span",{children:["#",m.number," ",m.summary,a.jsxs("span",{style:{color:"var(--mute)",fontSize:12},children:[" · ",m.result," · ",Zw(m.at)]})]})]},v))}):a.jsx("div",{className:"bl-empty",children:"No executions yet."})]})]}),a.jsxs("div",{className:"stat-grid",style:{marginTop:18},children:[a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Live log"}),a.jsxs("div",{className:"agent-log",children:[((t==null?void 0:t.log)||[]).map((m,v)=>a.jsxs("div",{className:"log-row",children:[a.jsx("span",{className:"log-t",children:new Date(m.t).toLocaleTimeString()}),a.jsx("span",{className:`log-k k-${m.kind}`,children:m.kind}),a.jsx("span",{className:"log-x",children:m.text})]},v)),((t==null?void 0:t.log)||[]).length?null:a.jsx("div",{className:"bl-empty",children:"Quiet so far."})]})]}),a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"The Charter (Regent's brain)"}),a.jsx(Qw,{})]})]})]})},Hs=t=>t.toLocaleString("en-US",{style:"currency",currency:"USD"}),_d=({label:t,pct:e,detail:n})=>a.jsxs("div",{className:"meter",children:[a.jsxs("div",{className:"meter-top",children:[a.jsx("span",{className:"meter-k",children:t}),a.jsxs("span",{className:`meter-pct${e>=85?" hot":""}`,children:[e,"%"]})]}),a.jsx("div",{className:"bar",children:a.jsx("i",{style:{width:`${Math.min(100,Math.max(2,e))}%`},className:e>=85?"hot":""})}),a.jsx("div",{className:"meter-detail",children:n})]}),eb=({sites:t,today:e})=>a.jsxs("div",{className:"pulse",children:[a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Visits today"}),a.jsx("span",{className:"pulse-v",children:e?e.visits:"..."})]}),a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Clicks today"}),a.jsx("span",{className:"pulse-v",children:e?e.clicks:"..."})]}),t.map(n=>a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:n.label.replace(".com","").replace(".industries","")}),a.jsxs("span",{className:"pulse-v",children:[a.jsx("span",{className:`dot ${n.up===null?"unknown":n.up?"ok":"down"}`}),n.up===null?"...":n.up?"up":"down"]})]},n.key))]}),tb=[{title:"Deploy brand site",note:"After a push to BlackCrownVxJ.LLC",cmd:"cd /var/www/blackcrown && git pull"},{title:"Deploy admin (full)",note:"After a push that touched the frontend",cmd:"cd ~/blackcrown-studio && git stash && git pull && npm run build && sudo systemctl restart blackcrown-render"},{title:"Deploy admin (server only)",note:"When only server.mjs changed",cmd:"cd ~/blackcrown-studio && git pull && sudo systemctl restart blackcrown-render"},{title:"Restart services",note:"Render service, support relay, nginx",cmd:"sudo systemctl restart blackcrown-render && sudo systemctl restart blackcrown-support && sudo systemctl reload nginx"},{title:"Tail admin logs",note:"Last 50 lines of the render service",cmd:"sudo journalctl -u blackcrown-render -n 50 --no-pager"},{title:"Check cert renewal",note:"Certbot renews on its own; this is the dry run",cmd:"sudo certbot renew --dry-run"},{title:"Refresh cloud ad renderer",note:"After editing Remotion compositions",cmd:"cd ~/blackcrown-studio && npm run deploy:site"}],nb=()=>{const[t,e]=Y.useState([]),[n,i]=Y.useState(""),s=()=>gw().then(e);Y.useEffect(()=>{s()},[]);const r=async(l,c)=>{i(l);try{await c(),await s()}finally{i("")}},o=l=>`${l.kind==="weekly"?l.day:"daily"} ${String(l.hour).padStart(2,"0")}:${String(l.minute).padStart(2,"0")} ET`;return t.length?a.jsx("div",{className:"bl",children:t.map(l=>a.jsxs("div",{className:"agent-task",children:[a.jsx("span",{className:`t-chip ${l.enabled?"t-doing":""}`,children:l.enabled?"on":"off"}),a.jsxs("span",{style:{flex:1},children:[l.name,a.jsxs("span",{style:{color:"var(--mute)",fontSize:12},children:[" ","· ",o(l)," · to ",l.channel,l.lastRunAt?` · last ran ${new Date(l.lastRunAt).toLocaleString()}`:" · never ran yet"]})]}),a.jsx("button",{className:"mini-btn",disabled:n===l.id,onClick:()=>r(l.id,()=>vw(l.id)),children:"Run now"}),a.jsx("button",{className:"mini-btn",disabled:n===l.id,onClick:()=>r(l.id,()=>xw(l.id)),children:l.enabled?"Pause":"Resume"}),a.jsx("button",{className:"m-del",disabled:n===l.id,onClick:()=>r(l.id,()=>_w(l.id)),children:"x"})]},l.id))}):a.jsx("div",{className:"bl-empty",children:'No jobs yet. When an agent files a kind "job" proposal and you approve it, the server registers it here and runs it on schedule, no Make needed.'})},ib=()=>{const[t,e]=Y.useState(!1),[n,i]=Y.useState(""),s=async()=>{e(!0),i("");try{const r=await P_();i([...r.emojis,...r.stickers].join(" · "))}catch(r){i(r instanceof Error?r.message:"Upload failed.")}finally{e(!1)}};return a.jsxs("div",{className:"bl",children:[a.jsx("div",{className:"bl-empty",style:{marginBottom:8},children:"8 branded emojis (crown, raven, check, pulse...) and 3 stickers, uploaded to Eclipse-X by the bot. Needs DISCORD_GUILD_ID in .env and Manage Expressions permission. Safe to re-run, duplicates are skipped by Discord."}),a.jsx("button",{className:"btn",onClick:s,disabled:t,style:{alignSelf:"flex-start"},children:t?"Uploading...":"Stock the server"}),n?a.jsx("div",{className:"bl-empty",style:{marginTop:8},children:n}):null]})},sb=()=>{const[t,e]=Y.useState(null),n=async i=>{try{await navigator.clipboard.writeText(i),e(i),window.setTimeout(()=>e(null),1300)}catch{e(null)}};return a.jsx("div",{className:"rb",children:tb.map(i=>a.jsxs("div",{className:"rb-row",children:[a.jsxs("div",{className:"rb-head",children:[a.jsx("span",{className:"rb-title",children:i.title}),a.jsx("span",{className:"rb-note",children:i.note}),a.jsx("button",{className:"mini-btn",onClick:()=>n(i.cmd),children:t===i.cmd?"Copied":"Copy"})]}),a.jsx("code",{className:"rb-cmd",children:i.cmd})]},i.title))})},rb=({expenseThisMonth:t})=>{const[e,n]=Y.useState(null),[i,s]=Y.useState(!1),r=(u=!1)=>{s(!0),C_(u).then(d=>{n(d),s(!1)})};if(Y.useEffect(()=>r(),[]),!e)return a.jsx("div",{className:"bl-empty",children:"Reading Stripe..."});if(!e.configured)return a.jsxs("div",{className:"notice",children:[a.jsx("div",{className:"notice-h",children:"Connect Stripe for live revenue"}),a.jsxs("p",{children:["In Stripe: Developers, API keys, Create restricted key, give it Read on everything. Then on the server add"," ",a.jsx("span",{className:"mono",children:"STRIPE_SECRET_KEY=rk_live_..."})," to .env and restart blackcrown-render. MRR, subscribers and payments will appear here on their own."]})]});if(e.error)return a.jsxs("div",{className:"status err",children:["Stripe: ",e.error]});const o=Math.round(((e.monthGross||0)-t)*100)/100,l=Object.entries(e.products||{}).sort((u,d)=>d[1]-u[1]),c=Math.max(1,...l.map(([,u])=>u));return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"cards",style:{marginBottom:16},children:[a.jsxs("div",{className:"card",children:[a.jsx("div",{className:"k",children:"MRR"}),a.jsx("div",{className:"v money-in",children:Hs(e.mrr||0)})]}),a.jsxs("div",{className:"card",children:[a.jsx("div",{className:"k",children:"Subscribers"}),a.jsx("div",{className:"v",children:e.subscribers||0})]}),a.jsxs("div",{className:"card",children:[a.jsx("div",{className:"k",children:"Collected this month"}),a.jsx("div",{className:"v money-in",children:Hs(e.monthGross||0)}),a.jsxs("div",{className:"sub",children:[e.monthPayments||0," payments"]})]}),a.jsxs("div",{className:"card",children:[a.jsx("div",{className:"k",children:"Expenses this month"}),a.jsx("div",{className:"v money-out",children:Hs(t)})]}),a.jsxs("div",{className:"card",children:[a.jsx("div",{className:"k",children:"Net this month"}),a.jsx("div",{className:`v ${o>=0?"money-in":"money-out"}`,children:Hs(o)})]})]}),a.jsxs("div",{className:"stat-grid",children:[l.length?a.jsxs("div",{children:[a.jsx("div",{className:"sgroup-h",style:{fontSize:13},children:"MRR by product"}),a.jsx("div",{className:"bl",children:l.map(([u,d])=>a.jsxs("div",{className:"bl-row",children:[a.jsx("span",{className:"bl-k",children:u}),a.jsx("span",{className:"bl-track",children:a.jsx("i",{style:{width:`${d/c*100}%`}})}),a.jsx("span",{className:"bl-n",children:Hs(d)})]},u))})]}):null,e.recent&&e.recent.length?a.jsxs("div",{children:[a.jsx("div",{className:"sgroup-h",style:{fontSize:13},children:"Latest payments"}),a.jsx("div",{className:"money-list",style:{marginTop:0},children:e.recent.slice(0,6).map((u,d)=>a.jsxs("div",{className:"money-row",children:[a.jsx("span",{className:"m-date",children:new Date(u.t).toISOString().slice(0,10)}),a.jsx("span",{className:"m-label",children:u.customer||u.desc}),a.jsxs("span",{className:"m-amt money-in",children:["+",Hs(u.amount)]})]},d))})]}):a.jsx("div",{className:"bl-empty",children:"No payments yet this month."})]}),a.jsxs("div",{className:"seo-bar",style:{marginTop:10},children:[a.jsx("button",{className:"mini-btn",style:{marginLeft:0},onClick:()=>r(!0),disabled:i,children:i?"Refreshing...":"Refresh from Stripe"}),e.fetchedAt?a.jsxs("span",{className:"seo-rev-at",children:["as of ",new Date(e.fetchedAt).toLocaleTimeString()]}):null]})]})},ab=()=>{const[t,e]=Y.useState(null),[n,i]=Y.useState("expense"),[s,r]=Y.useState("korvus"),[o,l]=Y.useState(""),[c,u]=Y.useState(""),[d,p]=Y.useState(()=>new Date().toISOString().slice(0,10)),[h,m]=Y.useState(""),[v,w]=Y.useState(!1),x=()=>nw().then(e);Y.useEffect(()=>{x()},[]);const f=async b=>{b.preventDefault(),m(""),w(!0);try{await iw({date:d,type:n,product:s,label:o,amount:Number(c)}),l(""),u(""),await x()}catch(T){m(T instanceof Error?T.message:"Could not save.")}finally{w(!1)}},g=async b=>{await sw(b),await x()},S=Y.useMemo(()=>(t==null?void 0:t.months[t.months.length-1])||{month:"",income:0,expense:0,net:0},[t]),y=Y.useMemo(()=>Math.max(1,...((t==null?void 0:t.months)||[]).map(b=>Math.abs(b.net))),[t]);return a.jsxs(a.Fragment,{children:[a.jsx(rb,{expenseThisMonth:S.expense}),a.jsx("div",{className:"sgroup-h",style:{fontSize:13,marginTop:20},children:"Manual ledger, expenses and anything outside Stripe"}),t&&t.months.filter(b=>b.income||b.expense).length>1?a.jsx("div",{className:"net-chart",title:"Monthly net, last 12 months",children:t.months.map(b=>a.jsxs("div",{className:"net-col",title:`${b.month}: net ${Hs(b.net)}`,children:[a.jsx("div",{className:"net-half top",children:b.net>0?a.jsx("i",{className:"pos",style:{height:`${b.net/y*100}%`}}):null}),a.jsx("div",{className:"net-half",children:b.net<0?a.jsx("i",{className:"neg",style:{height:`${-b.net/y*100}%`}}):null})]},b.month))}):null,a.jsxs("form",{className:"money-form",onSubmit:f,children:[a.jsx("input",{type:"date",className:"mf",value:d,onChange:b=>p(b.target.value)}),a.jsxs("select",{className:"mf",value:n,onChange:b=>i(b.target.value),children:[a.jsx("option",{value:"income",children:"Income"}),a.jsx("option",{value:"expense",children:"Expense"})]}),a.jsxs("select",{className:"mf",value:s,onChange:b=>r(b.target.value),children:[a.jsx("option",{value:"korvus",children:"Korvus"}),a.jsx("option",{value:"crown",children:"Crown"}),a.jsx("option",{value:"brand",children:"BlackCrown"})]}),a.jsx("input",{className:"mf grow",placeholder:"What was it (sub payment, AWS bill...)",value:o,onChange:b=>l(b.target.value)}),a.jsx("input",{className:"mf amt",placeholder:"0.00",inputMode:"decimal",value:c,onChange:b=>u(b.target.value)}),a.jsx("button",{className:"btn",disabled:v||!o||!Number(c),children:"Add"})]}),h?a.jsx("div",{className:"status err",children:h}):null,t&&t.entries.length?a.jsx("div",{className:"money-list",children:t.entries.slice(0,12).map(b=>a.jsxs("div",{className:"money-row",children:[a.jsx("span",{className:"m-date",children:b.date}),a.jsx("span",{className:"m-prod",children:b.product}),a.jsx("span",{className:"m-label",children:b.label}),a.jsxs("span",{className:`m-amt ${b.type==="income"?"money-in":"money-out"}`,children:[b.type==="income"?"+":"-",Hs(b.amount)]}),a.jsx("button",{className:"m-del",onClick:()=>g(b.id),title:"Delete entry",children:"x"})]},b.id))}):a.jsx("div",{className:"bl-empty",style:{marginTop:12},children:"No entries yet. Log subs as income and the AWS bill as an expense, the profitability line builds itself."})]})},ob=()=>{const[t,e]=Y.useState(null),[n,i]=Y.useState([]),[s,r]=Y.useState(null);return Y.useEffect(()=>{tw().then(e),Gp().then(i),Vp().then(o=>r((o==null?void 0:o.today)??{visits:0,clicks:0}))},[]),a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"page-head",children:[a.jsx("span",{className:"eyebrow",children:"Command"}),a.jsx("h1",{children:"The whole house, one glance."}),a.jsx("p",{children:"Traffic pulse, server vitals, services, certificates, money and your runbook."})]}),a.jsx(eb,{sites:n,today:s}),a.jsxs("div",{className:"stat-grid",style:{marginTop:18},children:[a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Server vitals"}),t?a.jsxs("div",{className:"meters",children:[t.vitals.disk?a.jsx(_d,{label:"Disk",pct:t.vitals.disk.usedPct,detail:`${t.vitals.disk.freeGb} GB free of ${t.vitals.disk.totalGb} GB`}):null,a.jsx(_d,{label:"Memory",pct:t.vitals.mem.usedPct,detail:`${t.vitals.mem.totalGb} GB total`}),a.jsx(_d,{label:"CPU",pct:t.vitals.cpuPct,detail:`load ${t.vitals.load1} on ${t.vitals.cores} core${t.vitals.cores===1?"":"s"} · up ${t.vitals.bootDays} days`})]}):a.jsx("div",{className:"bl-empty",children:"Loading..."})]}),a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Services and certificates"}),t?a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"svc-list",children:t.services.map(o=>a.jsxs("div",{className:"svc-row",children:[a.jsx("span",{className:`dot ${o.active?"ok":"down"}`}),a.jsx("span",{className:"svc-name",children:o.name}),a.jsx("span",{className:"svc-state",children:o.state})]},o.name))}),a.jsx("div",{className:"cert-list",children:t.certs.map(o=>a.jsxs("div",{className:"svc-row",children:[a.jsx("span",{className:`dot ${o.daysLeft===null?"unknown":o.daysLeft<14?"down":"ok"}`}),a.jsx("span",{className:"svc-name",children:o.host}),a.jsx("span",{className:"svc-state",children:o.daysLeft===null?"no cert read":`SSL ${o.daysLeft}d left`})]},o.host))})]}):a.jsx("div",{className:"bl-empty",children:"Loading..."})]})]}),a.jsxs("div",{className:"sgroup",style:{marginTop:18},children:[a.jsx("div",{className:"sgroup-h",children:"Money"}),a.jsx(ab,{})]}),a.jsxs("div",{className:"sgroup",style:{marginTop:18},children:[a.jsx("div",{className:"sgroup-h",children:"Scheduled jobs, the in-house automation engine"}),a.jsx(nb,{})]}),a.jsxs("div",{className:"sgroup",style:{marginTop:18},children:[a.jsx("div",{className:"sgroup-h",children:"Discord expression pack"}),a.jsx(ib,{})]}),a.jsxs("div",{className:"sgroup",style:{marginTop:18},children:[a.jsx("div",{className:"sgroup-h",children:"Runbook"}),a.jsx(sb,{})]})]})},lb=t=>Object.values(t||{}).reduce((e,n)=>e+n,0),cb={home:"Home",brand:"Home",korvus:"Korvus",intelligence:"Intelligence","eclipse-x":"Eclipse-X",collective:"Collective",lodestone:"LodeStone",proof:"Proof",support:"Support"},ub={direct:"Direct / typed in",google:"Google",bing:"Bing",duckduckgo:"DuckDuckGo",discord:"Discord",x:"X / Twitter",instagram:"Instagram",tiktok:"TikTok",youtube:"YouTube",reddit:"Reddit",facebook:"Facebook",linkedin:"LinkedIn",other:"Other sites"},db=({data:t})=>{const e=Math.max(1,...t.map(n=>n.visits));return a.jsx("div",{className:"spark spark-30",children:t.map(n=>a.jsx("div",{className:"spark-col",title:`${n.day}: ${n.visits} visits, ${n.clicks} clicks`,children:a.jsx("div",{className:"spark-bar",style:{height:`${Math.max(3,n.visits/e*100)}%`}})},n.day))})},yd=({items:t,labels:e,empty:n})=>{const i=Math.max(1,...t.map(([,s])=>s));return t.length?a.jsx("div",{className:"bl",children:t.map(([s,r])=>a.jsxs("div",{className:"bl-row",children:[a.jsx("span",{className:"bl-k",children:e&&e[s]||s}),a.jsx("span",{className:"bl-track",children:a.jsx("i",{style:{width:`${r/i*100}%`}})}),a.jsx("span",{className:"bl-n",children:r})]},s))}):a.jsx("div",{className:"bl-empty",children:n})},hb=({hr:t})=>{const e=Array.from({length:24},(s,r)=>{const o=String(r).padStart(2,"0");return(t==null?void 0:t[o])??(t==null?void 0:t[String(r)])??0}),n=Math.max(1,...e);return e.some(s=>s>0)?a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"hours",children:e.map((s,r)=>a.jsx("div",{className:"hour-cell",title:`${r}:00 ET, ${s} visits`,style:{opacity:s?.25+s/n*.75:.08}},r))}),a.jsxs("div",{className:"hours-lab",children:[a.jsx("span",{children:"12am"}),a.jsx("span",{children:"6am"}),a.jsx("span",{children:"12pm"}),a.jsx("span",{children:"6pm"}),a.jsx("span",{children:"11pm"})]})]}):a.jsx("div",{className:"bl-empty",children:"No visits logged yet."})},fb=()=>{const[t,e]=Y.useState([]),[n,i]=Y.useState(!1),s=(r=!1)=>{i(!0),Gp(r).then(o=>{e(o),i(!1)})};return Y.useEffect(()=>s(),[]),a.jsxs("div",{className:"sgroup",children:[a.jsxs("div",{className:"sgroup-h",children:["Product uptime",a.jsx("button",{className:"mini-btn",onClick:()=>s(!0),disabled:n,children:n?"Checking...":"Check now"})]}),t.length?a.jsx("div",{className:"up-grid",children:t.map(r=>a.jsxs("div",{className:"up-card",children:[a.jsx("span",{className:`dot ${r.up===null?"unknown":r.up?"ok":"down"}`}),a.jsxs("div",{children:[a.jsx("div",{className:"up-label",children:r.label}),a.jsxs("div",{className:"up-meta",children:[r.up===null?"not checked yet":r.up?`up · ${r.ms} ms`:`DOWN · last status ${r.status||"none"}`,r.pct24h!==null?` · ${r.pct24h}% last 24h`:""]})]})]},r.key))}):a.jsx("div",{className:"bl-empty",children:"No checks yet. The service pings every 5 minutes."})]})},pb=()=>{var v,w;const[t,e]=Y.useState(null),[n,i]=Y.useState(!1),[s,r]=Y.useState("w7");Y.useEffect(()=>{Vp().then(x=>{e(x),i(!0)})},[]);const o=t==null?void 0:t[s],l=Y.useMemo(()=>{var b,T,N,_;const x=lb(o==null?void 0:o.visit),f=((b=o==null?void 0:o.click)==null?void 0:b.korvus)??0,g=((T=o==null?void 0:o.click)==null?void 0:T.intelligence)??0,S=(((N=o==null?void 0:o.click)==null?void 0:N.collective)??0)+(((_=o==null?void 0:o.click)==null?void 0:_["eclipse-x"])??0);return{visits:x,korvus:f,intelligence:g,eclipse:S,ctr:C=>x?`${Math.round(C/x*1e3)/10}% of visits`:""}},[o]),c=Y.useMemo(()=>Object.entries((o==null?void 0:o.visit)??{}).sort((x,f)=>f[1]-x[1]).slice(0,10),[o]),u=Y.useMemo(()=>Object.entries((o==null?void 0:o.src)??{}).sort((x,f)=>f[1]-x[1]).slice(0,10),[o]),d=Y.useMemo(()=>Object.entries((o==null?void 0:o.dev)??{}).sort((x,f)=>f[1]-x[1]),[o]),p=(t==null?void 0:t.series30)??((v=t==null?void 0:t.series)==null?void 0:v.map(x=>({...x,clicks:0})))??[],h=!!(t&&(l.visits||l.korvus||l.intelligence||l.eclipse||p.some(x=>x.visits))),m=Y.useMemo(()=>{var S;const x=((S=t==null?void 0:t.today)==null?void 0:S.visits)??0,f=(t==null?void 0:t.prev7avg)??0;if(!f)return"";const g=Math.round((x-f)/f*100);return`${g>=0?"+":""}${g}% vs 7d avg`},[t]);return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"page-head",children:[a.jsx("span",{className:"eyebrow",children:"Statistics"}),a.jsx("h1",{children:"Traffic and clicks"}),a.jsx("p",{children:"Visits, sources, devices and click-throughs to each product. Counted first-party on your own server, no cookies."})]}),n?t?a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"range-row",children:[a.jsx("button",{className:`range-btn${s==="w7"?" active":""}`,onClick:()=>r("w7"),children:"Last 7 days"}),a.jsx("button",{className:`range-btn${s==="w30"?" active":""}`,onClick:()=>r("w30"),children:"Last 30 days"})]}),a.jsxs("div",{className:"cards",children:[a.jsxs("div",{className:"card",children:[a.jsx("div",{className:"k",children:"Site visits"}),a.jsx("div",{className:"v",children:l.visits})]}),a.jsxs("div",{className:"card",children:[a.jsx("div",{className:"k",children:"Today"}),a.jsx("div",{className:"v",children:((w=t.today)==null?void 0:w.visits)??0}),m?a.jsx("div",{className:"sub",children:m}):null]}),a.jsxs("div",{className:"card",children:[a.jsx("div",{className:"k",children:"Korvus clicks"}),a.jsx("div",{className:"v",children:l.korvus}),l.korvus?a.jsx("div",{className:"sub",children:l.ctr(l.korvus)}):null]}),a.jsxs("div",{className:"card",children:[a.jsx("div",{className:"k",children:"Intelligence clicks"}),a.jsx("div",{className:"v",children:l.intelligence}),l.intelligence?a.jsx("div",{className:"sub",children:l.ctr(l.intelligence)}):null]}),a.jsxs("div",{className:"card",children:[a.jsx("div",{className:"k",children:"Eclipse-X joins"}),a.jsx("div",{className:"v",children:l.eclipse}),l.eclipse?a.jsx("div",{className:"sub",children:l.ctr(l.eclipse)}):null]})]}),a.jsxs("div",{className:"sgroup",style:{marginTop:18},children:[a.jsx("div",{className:"sgroup-h",children:"Daily visits, last 30 days"}),a.jsx(db,{data:p})]}),a.jsxs("div",{className:"stat-grid",children:[a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Visits by page"}),a.jsx(yd,{items:c,labels:cb,empty:"No page visits yet."})]}),a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Traffic sources"}),a.jsx(yd,{items:u,labels:ub,empty:"No sources logged yet."})]}),a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Devices"}),a.jsx(yd,{items:d,labels:{mobile:"Phone",desktop:"Desktop"},empty:"No device data yet."})]}),a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Best hours (Eastern)"}),a.jsx(hb,{hr:o==null?void 0:o.hr})]})]}),a.jsx("div",{style:{marginTop:18},children:a.jsx(fb,{})}),h?null:a.jsxs("div",{className:"notice",style:{marginTop:18},children:[a.jsx("div",{className:"notice-h",children:"Waiting for the first hits"}),a.jsx("p",{children:"Numbers are at zero because the beacon has not recorded anything yet. Once the snippet is live on blackcrownvxj.com, visits and product clicks will start showing here within seconds. Open your site in a new tab to log the first visit."})]})]}):a.jsx("div",{className:"soon-panel",children:"Could not reach the service. Make sure it is running."}):a.jsx("div",{className:"soon-panel",children:"Loading your numbers..."})]})},uo=t=>t==null?"n/a":`$${t.toFixed(2)}`,Bg={corvid:["shares.corvid","corvid.model","corvid.workModel","corvid.cycleEveryMin","corvid.workGapMin","corvid.dailySteps"],herald:["shares.herald"],steward:["shares.steward"],bard:["shares.bard"]},os=({k:t,v:e,hint:n})=>a.jsxs("div",{className:"tn-stat",title:n,children:[a.jsx("span",{className:"tn-stat-v",children:e}),a.jsx("span",{className:"tn-stat-k",children:t})]}),mb=()=>{const[t,e]=Y.useState(null),[n,i]=Y.useState({}),[s,r]=Y.useState("idle"),[o,l]=Y.useState(null),[c,u]=Y.useState(null),[d,p]=Y.useState(null),[h,m]=Y.useState(null),v=Y.useCallback(()=>{jw().then(D=>e(D)),zw().then(D=>u(D)),Og().then(D=>p(D))},[]);Y.useEffect(()=>{v();const D=window.setInterval(v,2e4);return()=>window.clearInterval(D)},[v]);const w=D=>{var P;return D in n?n[D]:(P=t==null?void 0:t.values[D])==null?void 0:P.value},x=(D,P)=>i(j=>({...j,[D]:P})),f=Object.keys(n).length>0,g=async()=>{r("saving"),l(null);try{const D=await Bw(n);e(P=>P&&{...P,values:D.values,stats:D.stats}),i({}),r("saved"),window.setTimeout(()=>r("idle"),1600)}catch(D){r("error"),l(D instanceof Error?D.message:"Could not save.")}},S=async D=>{try{const P=await Ow(D);P&&e(j=>j&&{...j,stats:P})}catch(P){l(P instanceof Error?P.message:"Could not close the ticket.")}},y=async D=>{for(const P of Array.from(D||[])){const j=await Hw(P);j.ok?u(Q=>Q&&{...Q,tracks:j.tracks}):l(`${P.name}: ${j.error||"upload failed"}`)}},b=async D=>{const P=await Vw(D);P.tracks&&u(j=>j&&{...j,tracks:P.tracks})},T=async()=>{const D=await Gw();D.ok||l(D.error||"Could not start the brief."),u(P=>P&&{...P,running:!0}),window.setTimeout(v,4e3)},N=async()=>{m("Uploading...");try{const D=await P_(),P=[...D.emojis,...D.stickers].filter(j=>j.endsWith(": added")).length;m(`${P} added.`),Og().then(j=>p(j))}catch(D){m(D instanceof Error?D.message:"Upload failed.")}},_=D=>{var G;if(!t)return null;const P=t.schema[D];if(!P)return null;const j=w(D),W=((G=t.values[D])==null?void 0:G.overridden)||D in n?a.jsx("button",{className:"mini-btn",onClick:()=>x(D,null),title:"Back to the .env default",children:"default"}):null;return P.type==="bool"?a.jsx("div",{className:"tn-field",children:a.jsx(kr,{on:!!j,label:P.label,onChange:H=>x(D,H)})},D):P.type==="model"?a.jsxs("div",{className:"tn-field",children:[a.jsx("span",{className:"tn-label",children:P.label}),a.jsxs("span",{className:"tn-input",children:[a.jsx("select",{value:String(j??""),onChange:H=>x(D,H.target.value),children:t.models.map(H=>a.jsx("option",{value:H,children:H||"tier default"},H))}),W]})]},D):P.type==="time"?a.jsxs("div",{className:"tn-field",children:[a.jsx("span",{className:"tn-label",children:P.label}),a.jsxs("span",{className:"tn-input",children:[a.jsx("input",{type:"time",value:String(j??"05:30"),min:"03:00",max:"08:59",onChange:H=>x(D,H.target.value)}),W]})]},D):a.jsxs("div",{className:"tn-field",children:[a.jsx("span",{className:"tn-label",children:P.label}),a.jsxs("span",{className:"tn-input",children:[a.jsx("input",{type:"number",value:j==null?"":Number(j),min:P.min,max:P.max,step:P.step,onChange:H=>x(D,H.target.value===""?null:Number(H.target.value))}),a.jsx("span",{className:"tn-unit",children:P.unit}),W]})]},D)},C=Y.useMemo(()=>t?Object.entries(t.stats.desks):[],[t]);if(!t)return a.jsx("div",{className:"soon-panel",children:"Loading the tuner..."});const R=t.stats.budget,k=t.stats.tickets||[],B=(D,P)=>a.jsxs("div",{className:"tn-card",children:[a.jsxs("div",{className:"tn-card-h",children:[a.jsx("span",{className:"tn-name",children:P.name}),a.jsx("span",{className:`tn-pill ${P.enabled===!1?"off":""}`,children:P.enabled===!1?"paused":P.status||"on"})]}),a.jsxs("div",{className:"tn-stats",children:[a.jsx(os,{k:"today",v:uo(P.today.usd),hint:`${P.today.calls} calls, ${P.today.cachePct}% from cache`}),a.jsx(os,{k:"7 days",v:uo(P.week.usd),hint:`${P.week.calls} calls, ${P.week.cachePct}% from cache`}),a.jsx(os,{k:"cache",v:`${P.week.cachePct}%`,hint:"share of input read from cache this week; higher is cheaper"}),P.steps!==null?a.jsx(os,{k:"steps today",v:P.steps}):null,P.steps!==null?a.jsx(os,{k:"open tasks",v:P.openTasks}):null,P.steps!==null?a.jsx(os,{k:"done today",v:P.doneToday}):null,P.asks?a.jsx(os,{k:"asks 7d",v:`${P.asks.approved}/${P.asks.filed}`,hint:`${P.asks.approved} approved, ${P.asks.rejected} rejected, ${P.asks.pending} pending`}):null,P.asks?a.jsx(os,{k:"approved",v:P.asks.approvalPct===null?"n/a":`${P.asks.approvalPct}%`}):null,P.asks?a.jsx(os,{k:"$ per yes",v:uo(P.costPerApproved),hint:"7 day spend divided by approved asks"}):null]}),Bg[D]?a.jsx("div",{className:"tn-fields",children:Bg[D].map(_)}):null]},D);return a.jsxs("div",{className:"tuner",children:[a.jsxs("div",{className:"tn-top",children:[a.jsxs("div",{children:[a.jsx("div",{className:"sgroup-h",children:"Agent tuner"}),a.jsx("p",{className:"shint",children:"Every desk's cost against what it ships, and the dials that steer it. Saved values beat the .env and apply on the next tick, no restart."})]}),a.jsxs("div",{className:"tn-actions",children:[s==="error"&&o?a.jsx("span",{className:"gen-error",children:o}):null,a.jsx("button",{className:"btn",onClick:g,disabled:!f||s==="saving",children:s==="saving"?"Saving...":s==="saved"?"Saved":f?`Save ${Object.keys(n).length} change${Object.keys(n).length>1?"s":""}`:"No changes"}),f?a.jsx("button",{className:"mini",onClick:()=>i({}),children:"Discard"}):null]})]}),a.jsxs("div",{className:"tn-budget",children:[a.jsx("div",{className:"tn-meter",children:a.jsx("div",{className:"tn-meter-fill",style:{width:`${R.cap?Math.min(100,R.spent/R.cap*100):0}%`}})}),a.jsxs("span",{className:"mono",children:[uo(R.spent)," of ",uo(R.cap)," today · ",R.level==="ok"?"inside budget":R.level==="tight"?"tight, background work slowed":R.level==="out"?"spent, background work paused":"no cap",t.stats.gaps?` · ${t.stats.gaps} tool gap${t.stats.gaps>1?"s":""} open`:""]}),a.jsxs("div",{className:"tn-fields tn-inline",children:[_("budget.dailyUsd"),_("budget.nightThrottle"),_("budget.cacheKeeper")]})]}),a.jsx("div",{className:"tn-grid",children:C.map(([D,P])=>B(D,P))}),a.jsxs("div",{className:"settings tn-lower",children:[k.length?a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Owner tickets: what the desks found and cannot fix"}),k.map(D=>a.jsxs("div",{className:"srow tn-ticket",children:[a.jsxs("span",{className:"sk",children:[D.what,D.evidence?a.jsxs("em",{children:[" ",D.evidence]}):null,a.jsxs("small",{children:[" raised by ",D.desks.join(", "),D.count>1?`, seen ${D.count} times`:""]})]}),a.jsx("span",{className:"sv",children:a.jsx("button",{className:"btn",onClick:()=>S(D.id),children:"Fixed, close it"})})]},D.id))]}):null,a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Herald, Steward and Bard"}),["staff.model","staff.cycleEveryH","staff.workGapMin","staff.dailySteps"].map(_)]}),a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Crew rules"}),["crew.queueCap","crew.staleHours","crew.wakeGapMin"].map(_),_("videos.tiktokDrop")]}),a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Pre-market Brief"}),["brief.enabled","brief.time","brief.sound","brief.tiktokDrop","brief.fileX","brief.fileYouTube","brief.communityPost"].map(_),a.jsx("div",{className:"brief-actions",children:a.jsx("button",{className:"btn",onClick:T,disabled:!!(c!=null&&c.running),children:c!=null&&c.running?"Rendering...":"Make today's brief now"})}),a.jsxs("div",{className:"srow",children:[a.jsx("span",{className:"sk",children:"Music library"}),a.jsx("span",{className:"sv",children:((c==null?void 0:c.tracks)||[]).length?`${((c==null?void 0:c.tracks)||[]).length} tracks, one per day in rotation`:"empty, so the built-in score plays"})]}),((c==null?void 0:c.tracks)||[]).map(D=>a.jsxs("div",{className:"srow",children:[a.jsx("span",{className:"sk",children:D.credit||D.name}),a.jsxs("span",{className:"sv",children:[D.license&&D.source?a.jsxs("a",{href:D.source,target:"_blank",rel:"noreferrer",children:[D.license,", stocked by ",D.by]}):"your upload"," ",D.mb," MB"," ",a.jsx("button",{className:"btn",onClick:()=>b(D.name),children:"Remove"})]})]},D.name)),a.jsx("div",{className:"brief-actions",children:a.jsxs("label",{className:"btn",children:["Add tracks you have the rights to use",a.jsx("input",{type:"file",accept:"audio/*",multiple:!0,style:{display:"none"},onChange:D=>{y(D.target.files),D.target.value=""}})]})}),((c==null?void 0:c.runs)||[]).slice(0,4).map(D=>{var P;return a.jsxs("div",{className:"srow",children:[a.jsx("span",{className:"sk",children:new Date(D.at).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}),a.jsx("span",{className:`sv${D.ok?" good":" bad"}`,children:D.ok&&D.url?a.jsxs("a",{href:D.url,target:"_blank",rel:"noreferrer",children:[D.seconds,"s video",D.music?`, ${D.music}`:"",(P=D.asks)!=null&&P.length?`, asks #${D.asks.join(", #")}`:""]}):(D.error||"failed").slice(0,80)})]},D.at)})]}),a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Eclipse-X emojis and stickers"}),d&&!d.error?a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"srow",children:[a.jsx("span",{className:"sk",children:"Boost tier"}),a.jsxs("span",{className:"sv",children:[d.tier,d.boosts!==null?` (${d.boosts} boosts)`:""]})]}),a.jsxs("div",{className:"srow",children:[a.jsx("span",{className:"sk",children:"Static emojis"}),a.jsxs("span",{className:"sv",children:[d.staticUsed," of ",d.emojiLimit]})]}),a.jsxs("div",{className:"srow",children:[a.jsx("span",{className:"sk",children:"Animated emojis"}),a.jsxs("span",{className:"sv",children:[d.animatedUsed," of ",d.emojiLimit]})]}),a.jsxs("div",{className:"srow",children:[a.jsx("span",{className:"sk",children:"Stickers"}),a.jsxs("span",{className:"sv",children:[d.stickersUsed," of ",d.stickerLimit]})]}),a.jsxs("div",{className:"srow",children:[a.jsx("span",{className:"sk",children:"In the pack, not on the server yet"}),a.jsxs("span",{className:"sv",children:[d.waiting.emojis," emojis, ",d.waiting.stickers," stickers"]})]}),d.import&&(d.import.left||d.import.added||d.import.skipped||d.import.failed)?a.jsxs("div",{className:"srow",children:[a.jsx("span",{className:"sk",children:"emoji.gg import"}),a.jsxs("span",{className:"sv",children:[d.import.left?`${d.import.left} to go (${d.import.leftEmojis} emojis, ${d.import.leftStickers} stickers)`:"done",` · ${d.import.added} added`,d.import.skipped?` · ${d.import.skipped} skipped`:"",d.import.failed?` · ${d.import.failed} failed`:"",d.import.waitingUntil?` · Discord rate limit, next upload ${new Date(d.import.waitingUntil).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}`:""]})]}):null,a.jsxs("div",{className:"brief-actions",children:[a.jsx("button",{className:"btn",onClick:N,disabled:!d.waiting.emojis&&!d.waiting.stickers,children:"Stock the shelves"}),h?a.jsx("span",{className:"shint",children:h}):null]})]}):a.jsx("p",{className:"shint",children:(d==null?void 0:d.error)||"Reading the server's shelves..."})]})]})]})},hr=({k:t,ok:e,value:n})=>a.jsxs("div",{className:"srow",children:[a.jsx("span",{className:"sk",children:t}),a.jsx("span",{className:`sv${e===!1?" bad":e===!0?" good":""}`,children:n})]}),gb=()=>{const[t,e]=Y.useState(null),[n,i]=Y.useState(!1),[s,r]=Y.useState(""),[o,l]=Y.useState(!1),[c,u]=Y.useState("idle"),[d,p]=Y.useState(null);Y.useEffect(()=>{ZM().then(v=>{e(v),i(!0)}),QM().then(v=>{r(v),l(!0)})},[]);const h=async()=>{u("saving"),p(null);try{const v=await JM(s);r(v),u("saved"),window.setTimeout(()=>u("idle"),1600)}catch(v){u("error"),p(v instanceof Error?v.message:"Could not save.")}},m=async()=>{const v=await ew();r(v),u("saved"),window.setTimeout(()=>u("idle"),1600)};return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"page-head",children:[a.jsx("span",{className:"eyebrow",children:"Settings"}),a.jsx("h1",{children:"Control room"}),a.jsx("p",{children:"Tune every agent against what it costs and what it ships, run the Pre-market Brief, and check your setup. Keys live in the .env file on your server and are never shown here."})]}),a.jsx(mb,{}),a.jsxs("div",{className:"sgroup brief-group",children:[a.jsx("div",{className:"sgroup-h",children:"Marketing brief"}),a.jsx("p",{className:"shint",children:"This is the script your AI follows. It is your head of growth in writing: voice, audience, and ad strategy. Edit it, save, and every new ad reflects the change. The technical output rules are locked separately, so editing here can never break exports."}),o?a.jsxs(a.Fragment,{children:[a.jsx("textarea",{className:"brief-box",value:s,onChange:v=>r(v.target.value),spellCheck:!1}),a.jsxs("div",{className:"brief-actions",children:[a.jsx("button",{className:"btn",onClick:h,disabled:c==="saving",children:c==="saving"?"Saving...":c==="saved"?"Saved":"Save brief"}),a.jsx("button",{className:"mini",onClick:m,children:"Restore default"}),c==="error"&&d?a.jsx("span",{className:"gen-error",children:d}):null]})]}):a.jsx("div",{className:"soon-panel",children:"Loading brief..."})]}),n?t?a.jsxs("div",{className:"settings",children:[a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Rendering"}),a.jsx(hr,{k:"AWS region",value:t.region??"not set",ok:!!t.region}),a.jsx(hr,{k:"Lambda function",value:t.functionName??"not set",ok:!!t.functionName}),a.jsx(hr,{k:"Serve URL",value:t.serveUrlSet?"set":"not set",ok:t.serveUrlSet}),a.jsx(hr,{k:"AWS keys",value:t.awsKeysSet?"detected":"missing",ok:t.awsKeysSet}),a.jsx(hr,{k:"Frames per Lambda",value:t.framesPerLambda})]}),a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"AI generation"}),a.jsx(hr,{k:"Anthropic key",value:t.anthropicKeySet?"detected":"missing",ok:t.anthropicKeySet}),a.jsx(hr,{k:"Generated ads saved",value:t.generatedCount}),t.anthropicKeySet?null:a.jsx("p",{className:"shint",children:"Add ANTHROPIC_API_KEY to your .env (from console.anthropic.com), then restart the service to enable the generator."})]})]}):a.jsx("div",{className:"soon-panel",children:"Could not reach the service. Make sure it is running."}):a.jsx("div",{className:"soon-panel",children:"Checking your setup..."})]})},vb="modulepreload",xb=function(t){return"/"+t},zg={},_b=function(e,n,i){let s=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),l=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=Promise.allSettled(n.map(c=>{if(c=xb(c),c in zg)return;zg[c]=!0;const u=c.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${d}`))return;const p=document.createElement("link");if(p.rel=u?"stylesheet":vb,u||(p.as="script"),p.crossOrigin="",p.href=c,l&&p.setAttribute("nonce",l),document.head.appendChild(p),u)return new Promise((h,m)=>{p.addEventListener("load",h),p.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(o){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=o,window.dispatchEvent(l),!l.defaultPrevented)throw o}return s.then(o=>{for(const l of o||[])l.status==="rejected"&&r(l.reason);return e().catch(r)})},yb={corvid:"Corvid",regent:"Regent",bard:"Bard",herald:"Herald",steward:"Steward",staff:"Staff",minions:"Corvid minions",librarian:"Librarian",jobs:"Scheduled reports","bard-minions":"Bard minions","herald-minions":"Herald minions","steward-minions":"Steward minions"},Hg=t=>t>=1e6?(t/1e6).toFixed(1)+"M":t>=1e3?Math.round(t/1e3)+"k":String(t),Sb=t=>t.replace(/^claude-/,""),Mb=()=>{const[t,e]=Y.useState(null);if(Y.useEffect(()=>{const c=()=>Uw().then(e);c();const u=window.setInterval(c,6e4);return()=>window.clearInterval(u)},[]),!t)return null;const n=t.days[t.days.length-1],i=((n==null?void 0:n.agents)||[]).slice().sort((c,u)=>u.usd-c.usd),s=t.days.slice(-7),r=Math.max(.01,...s.map(c=>c.usd),t.budget.cap||0),o=t.budget.cap?Math.min(100,t.budget.spent/t.budget.cap*100):0,l=t.budget.level==="out"?"Budget reached. Background work is paused until midnight ET; your messages and approvals still run.":t.budget.level==="tight"?"Past 70 percent. Task steps are running at half pace.":t.budget.level==="off"?"No daily budget set.":"Inside budget.";return a.jsxs("div",{className:"card wallet",children:[a.jsxs("div",{className:"wallet-top",children:[a.jsxs("div",{children:[a.jsx("div",{className:"k",children:"Model spend today"}),a.jsxs("div",{className:"v",children:["$",t.budget.spent.toFixed(2),t.budget.cap?a.jsxs("span",{className:"wallet-cap",children:[" of $",t.budget.cap.toFixed(2)]}):null]})]}),a.jsx("div",{className:"wallet-week","aria-label":"Spend, last 7 days",children:s.map(c=>a.jsx("span",{title:`${c.day}: $${c.usd.toFixed(2)}`,children:a.jsx("i",{style:{height:`${Math.max(4,c.usd/r*100)}%`}})},c.day))})]}),t.budget.cap?a.jsx("div",{className:`bar wallet-bar ${t.budget.level}`,children:a.jsx("i",{style:{width:`${o}%`}})}):null,a.jsx("div",{className:"wallet-state",children:l}),i.length?a.jsxs("div",{className:"wallet-rows",children:[a.jsxs("div",{className:"wallet-row wallet-head",children:[a.jsx("span",{children:"Desk"}),a.jsx("span",{children:"Model"}),a.jsx("span",{children:"Calls"}),a.jsx("span",{children:"Input"}),a.jsx("span",{children:"From cache"}),a.jsx("span",{children:"Output"}),a.jsx("span",{children:"Cost"})]}),i.map(c=>a.jsxs("div",{className:"wallet-row",children:[a.jsx("span",{className:"wallet-who",children:yb[c.who]||c.who}),a.jsx("span",{className:"wallet-model",children:Sb(c.model)}),a.jsx("span",{children:c.calls}),a.jsx("span",{children:Hg(c.input)}),a.jsxs("span",{className:c.cacheHitPct>=50?"good":"",children:[c.cacheHitPct,"%"]}),a.jsx("span",{children:Hg(c.output)}),a.jsxs("span",{className:"wallet-usd",children:["$",c.usd.toFixed(2)]})]},c.who))]}):a.jsx("div",{className:"wallet-state",children:"No model calls yet today."})]})},wb=jr.lazy(()=>_b(()=>import("./City3D-Df4Q4FV1.js"),[]).then(t=>({default:t.City3D}))),bb=()=>{var J,ve,Ie,Qe;const[t,e]=Y.useState([]),[n,i]=Y.useState(null),[s,r]=Y.useState(null),[o,l]=Y.useState(null),[c,u]=Y.useState(null),[d,p]=Y.useState(null),[h,m]=Y.useState(null),[v,w]=Y.useState([]),[x,f]=Y.useState([]),[g,S]=Y.useState(null),y=()=>{Gp().then(e),C_().then(i),Vp().then(re=>{var fe;r((re==null?void 0:re.today)??{visits:0,clicks:0}),m({sources:(fe=re==null?void 0:re.w7)==null?void 0:fe.src})}),D_().then(l),Qh().then(u),kc().then(p),L_().then(w),Fg().then(f)};Y.useEffect(()=>{y();const re=window.setInterval(y,6e4),fe=window.setInterval(()=>Fg().then(f),12e3);return()=>{window.clearInterval(re),window.clearInterval(fe)}},[]),Y.useEffect(()=>{if(!g)return;const re=window.setInterval(y,8e3);return()=>window.clearInterval(re)},[g]);const b=re=>re.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}),T=re=>t.find(fe=>fe.key===re)??null,N=o?o.asks.length:null,_=(s==null?void 0:s.visits)??0,C=(s==null?void 0:s.clicks)??0,R=re=>{var fe;return(fe=d==null?void 0:d.pages.find(E=>E.file===re))==null?void 0:fe.score},k=h!=null&&h.sources?(J=Object.entries(h.sources).sort((re,fe)=>fe[1]-re[1])[0])==null?void 0:J[0]:void 0,B=re=>T(re),D=re=>!re||re.up===null?"not checked yet":re.up?`up, ${re.ms} ms, ${re.pct24h??"?"}% 24h`:"DOWN",P=re=>!re||re.up===null?"":re.up?`up · ${re.ms} ms`:"DOWN",j=re=>v.find(fe=>fe.key===re)||null,Q=re=>{const fe=j(re);return fe?[`${fe.status}, last cycle ${fe.lastCycleAt?Math.round((Date.now()-fe.lastCycleAt)/6e4)+"m ago":"never"}`,fe.focus||"",`${fe.tasks.filter(E=>E.status!=="done").length} open tasks · every ${fe.cycleEveryH}h`]:["hiring in progress, refresh in a minute"]},W={world:{title:"The World",lines:[`${_} visits today, ${C} product clicks`,`Top source this week: ${k||"none yet"}`]},site:{title:"blackcrownvxj.com",lines:[D(B("brand")),`Home SEO score: ${R("index.html")??"no audit"}`,`${(d==null?void 0:d.pages.filter(re=>!re.file.includes(".com")).length)??0} pages in the audit`]},korvus:{title:"Korvus",lines:[D(B("korvus")),`Homepage SEO score: ${R("korvus.industries")??"no audit yet"}`]},crown:{title:"Crown",lines:[D(B("intelligence")),`Homepage SEO score: ${R("blackcrown-intelligence.com")??"no audit yet"}`]},eclipse:{title:"Eclipse-X",lines:["Free community, top of the funnel","Joins count as collective clicks in Statistics"]},stripe:{title:"Stripe",lines:n!=null&&n.configured?[`MRR ${b(n.mrr||0)}, ${n.subscribers||0} subscribers`,`${b(n.monthGross||0)} collected this month`]:["Not linked, add STRIPE_SECRET_KEY in .env"]},corvid:{title:"Corvid, SEO agent",lines:[c?`${c.status}, last cycle ${c.lastCycleAt?Math.round((Date.now()-c.lastCycleAt)/6e4)+"m ago":"never"}`:"...",(c==null?void 0:c.currentFocus)||"",`${(c==null?void 0:c.tasks.filter(re=>re.status!=="done").length)??0} open tasks`]},herald:{title:"Herald, sales and advertising",lines:Q("herald")},steward:{title:"Steward, project manager",lines:Q("steward")},bard:{title:"Bard, video studio",lines:Q("bard")},regent:{title:"Regent, CEO agent",lines:[`${N??0} ask${N===1?"":"s"} waiting on you`,`${(o==null?void 0:o.executed.length)??0} executions on the ledger`,o!=null&&o.lastInitiativeAt?`agenda set ${Math.round((Date.now()-o.lastInitiativeAt)/36e5)}h ago`:"first agenda pending"]},you:{title:"You",lines:["The owner. Everything above answers to you.","Approvals happen in Discord or the CEO tab."]}},G={scout:"research",scribe:"copy",analyst:"numbers",pitch:"campaigns",copy:"ad copy",prospector:"audiences",planner:"project steps",crier:"community",auditor:"operations",director:"cinematography",quill:"hooks and titles",critic:"quality gate"},H=re=>{const fe=Math.round((Date.now()-re)/6e4);return fe<1?"now":fe<60?`${fe}m`:`${Math.round(fe/60)}h`},X=(()=>{if(g==="corvid"&&c)return{thought:c.lastThought||"",minions:c.minionReports||[],tasks:c.tasks.filter(re=>re.status!=="done").slice(0,4),logs:(c.log||[]).slice(0,5)};if((g==="herald"||g==="steward"||g==="bard")&&j(g)){const re=j(g);return{thought:re.thought||"",minions:re.minionReports||[],tasks:re.tasks.filter(fe=>fe.status!=="done").slice(0,4),logs:(re.log||[]).slice(0,5)}}return g==="regent"&&o?{thought:o.asks.length?`Holding ${o.asks.length} ask(s) for the owner's word.`:"Watching the filings.",minions:[],tasks:[],logs:(o.log||[]).slice(0,6)}:null})();return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"page-head",children:[a.jsx("span",{className:"eyebrow",children:"Dashboard"}),a.jsx("h1",{children:"The Grid."}),a.jsx("p",{children:"Your empire as a living city. Every light is real: traffic, money, and the agents at work."})]}),a.jsxs("div",{className:"city-wrap",children:[a.jsx(Y.Suspense,{fallback:a.jsx("div",{className:"city3d"}),children:a.jsx(wb,{onSelect:S,selected:g,data:{trafficPackets:_>20?3:_>0?2:1,clicksActive:C>0,goldActive:!!(n!=null&&n.configured&&(n.monthGross||0)>0),status:{site:((ve=B("brand"))==null?void 0:ve.up)??null,korvus:((Ie=B("korvus"))==null?void 0:Ie.up)??null,crown:((Qe=B("intelligence"))==null?void 0:Qe.up)??null},worldSub:`${_} in today`,stripeSub:n!=null&&n.configured?`${b(n.mrr||0)} MRR`:"not linked",regentSub:N?`${N} ask${N===1?"":"s"} waiting`:"standing by",heraldSub:j("herald")?j("herald").enabled?"on the desk":"paused":"",stewardSub:j("steward")?j("steward").enabled?"running the board":"paused":"",bardSub:j("bard")?j("bard").enabled?"rolling cameras":"paused":"",subs:{site:P(B("brand")),korvus:P(B("korvus")),crown:P(B("intelligence")),eclipse:"community",corvid:c?c.enabled?c.status||"on the desk":"paused":"",you:"the owner"},power:{corvid:c&&!c.enabled?.12:1,herald:j("herald")&&!j("herald").enabled?.12:1,steward:j("steward")&&!j("steward").enabled?.12:1,bard:j("bard")&&!j("bard").enabled?.12:1},wire:x.map(re=>({t:re.t,from:re.from,to:re.to}))}})}),a.jsxs("div",{className:"c3d-wire",children:[a.jsx("div",{className:"c3d-wire-head",children:"THE WIRE · desk to desk, live"}),x.slice(0,6).map((re,fe)=>a.jsxs("div",{className:"c3d-wire-row",children:[a.jsx("span",{className:`w-tag w-${re.from}`,children:re.from}),a.jsx("span",{className:"w-arrow",children:"to"}),a.jsx("span",{className:`w-tag w-${re.to}`,children:re.to}),a.jsx("span",{className:"w-text",children:re.text})]},`${re.t}-${fe}`)),x.length?null:a.jsx("div",{className:"c3d-wire-row w-quiet",children:"quiet, the desks are heads down"})]}),g&&W[g]?a.jsxs("div",{className:`c3d-panel${X?" deep":""}`,children:[a.jsxs("div",{className:"c3d-panel-head",children:[a.jsx("span",{children:W[g].title}),a.jsx("button",{className:"m-del",onClick:()=>S(null),children:"x"})]}),W[g].lines.filter(Boolean).map((re,fe)=>a.jsx("div",{className:"c3d-panel-line",children:re},fe)),X?a.jsxs(a.Fragment,{children:[X.thought?a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"c3d-sec",children:"Thinking, live"}),a.jsx("div",{className:"c3d-think",children:X.thought})]}):null,X.minions.length?a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"c3d-sec",children:"Minions on the floor"}),X.minions.map((re,fe)=>a.jsxs("div",{className:"c3d-min",children:[a.jsxs("span",{className:"c3d-min-name",children:[re.minion,a.jsx("em",{children:G[re.minion]?` · ${G[re.minion]}`:""})]}),a.jsx("span",{className:"c3d-min-task",children:re.task}),a.jsx("span",{className:"c3d-min-ago",children:H(re.t)})]},fe))]}):null,X.tasks.length?a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"c3d-sec",children:"On the desk"}),X.tasks.map((re,fe)=>a.jsxs("div",{className:"c3d-panel-line",children:[a.jsx("span",{className:`t-chip t-${re.status}`,style:{marginRight:6},children:re.status}),re.title]},fe))]}):null,X.logs.length?a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"c3d-sec",children:"Wire"}),X.logs.map((re,fe)=>a.jsxs("div",{className:"c3d-log",children:[a.jsx("span",{className:"log-t",children:new Date(re.t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}),a.jsx("span",{className:`log-k k-${re.kind}`,children:re.kind}),a.jsx("span",{children:re.text})]},fe))]}):null]}):null]}):null]}),a.jsxs("div",{className:"pulse",style:{marginTop:18},children:[a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Visits today"}),a.jsx("span",{className:"pulse-v",children:s?_:"..."})]}),a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Product clicks"}),a.jsx("span",{className:"pulse-v",children:s?C:"..."})]}),a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"MRR"}),a.jsx("span",{className:"pulse-v",children:n!=null&&n.configured?b(n.mrr||0):"..."})]}),a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Subscribers"}),a.jsx("span",{className:"pulse-v",children:n!=null&&n.configured?n.subscribers||0:"..."})]}),a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Asks waiting"}),a.jsx("span",{className:"pulse-v",children:N===null?"...":N})]})]}),a.jsx(Mb,{})]})},Eb=t=>{if(!t)return"never";const e=Math.round((Date.now()-t)/6e4);if(e<1)return"just now";if(e<60)return`${e}m ago`;const n=Math.round(e/60);return n<48?`${n}h ago`:`${Math.round(n/24)}d ago`},Tb=()=>{try{return localStorage.getItem("bc_live")!=="0"}catch{return!0}},Sd=({k:t,eyebrow:e,blurb:n})=>{const[i,s]=Y.useState(null),[r,o]=Y.useState(""),[l,c]=Y.useState(""),[u,d]=Y.useState(""),[p,h]=Y.useState(Tb),[m,v]=Y.useState(0),w=async()=>{const S=(await L_()).find(y=>y.key===t);S&&s(S),v(Date.now())};Y.useEffect(()=>{if(s(null),w(),!p)return;const g=window.setInterval(w,5e3);return()=>window.clearInterval(g)},[p,t]);const x=g=>{h(g);try{localStorage.setItem("bc_live",g?"1":"0")}catch{}},f=async(g,S)=>{c(""),o(g);try{await S(),await w()}catch(y){c(y instanceof Error?y.message:"Something failed.")}finally{o("")}};return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"page-head",children:[a.jsx("span",{className:"eyebrow",children:e}),a.jsxs("h1",{children:[(i==null?void 0:i.name)||"...",", ",i?i.title.toLowerCase():"reporting in","."]}),a.jsx("p",{children:n})]}),a.jsxs("div",{className:"pulse",children:[a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"State"}),a.jsxs("span",{className:"pulse-v",children:[a.jsx("span",{className:`dot ${i&&i.enabled?"ok":"unknown"}`}),i?i.status:"..."]})]}),a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Last cycle"}),a.jsx("span",{className:"pulse-v",style:{fontSize:16},children:Eb(i==null?void 0:i.lastCycleAt)})]}),a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Cadence"}),a.jsx("span",{className:"pulse-v",style:{fontSize:16},children:i?`every ${i.cycleEveryH}h`:"..."})]}),a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Discord"}),a.jsxs("span",{className:"pulse-v",style:{fontSize:16},children:[a.jsx("span",{className:`dot ${(i==null?void 0:i.channel)==="none"?"down":"ok"}`}),(i==null?void 0:i.channel)==="own"?"two-way":(i==null?void 0:i.channel)==="shared"?"send only":"not linked"]})]}),(i==null?void 0:i.community)!==void 0?a.jsxs("div",{className:"pulse-item",children:[a.jsx("span",{className:"pulse-k",children:"Eclipse-X"}),a.jsxs("span",{className:"pulse-v",style:{fontSize:16},children:[a.jsx("span",{className:`dot ${i.community?"ok":"unknown"}`}),i.community?"posting armed":"not wired"]})]}):null]}),a.jsxs("div",{className:"seo-bar",style:{marginTop:14,flexWrap:"wrap",alignItems:"center",gap:14},children:[a.jsx(kr,{on:(i==null?void 0:i.enabled)!==!1,disabled:!i||!!r,label:(i==null?void 0:i.enabled)===!1?"Auto-run off":"Auto-run 24/7",onChange:g=>f("auto",()=>Sw(t,g))}),a.jsx(kr,{on:p,label:p?"Live feed":"Live feed off",onChange:x}),a.jsx("button",{className:"btn",onClick:()=>f("cycle",()=>yw(t)),disabled:!!r,children:r==="cycle"?"Thinking...":"Run cycle now"}),a.jsx("button",{className:"mini-btn",style:{marginLeft:0},onClick:()=>f("refresh",w),disabled:!!r,children:r==="refresh"?"Refreshing...":"Refresh"}),a.jsxs("span",{className:"sync-stamp",children:[a.jsx("span",{className:`dot ${p?"ok":"unknown"}`}),m?`synced ${new Date(m).toLocaleTimeString()}`:"..."]})]}),l?a.jsx("div",{className:"status err",children:l}):null,a.jsxs("div",{className:"sgroup",style:{marginTop:18},children:[a.jsx("div",{className:"sgroup-h",children:"Thinking"}),a.jsx("div",{className:"agent-focus",children:(i==null?void 0:i.focus)||"..."}),i!=null&&i.thought?a.jsx("p",{className:"agent-thought",children:i.thought}):null]}),a.jsxs("div",{className:"stat-grid",style:{marginTop:18},children:[a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Task queue"}),((i==null?void 0:i.tasks)||[]).length?a.jsx("div",{className:"bl",children:((i==null?void 0:i.tasks)||[]).map(g=>a.jsxs("div",{className:"agent-task",children:[a.jsx("span",{className:`t-chip t-${g.status}`,children:g.status}),a.jsx("span",{children:g.title})]},g.id))}):a.jsx("div",{className:"bl-empty",children:"No tasks yet. Proposals it files land in the CEO tab and Discord."}),a.jsxs("form",{className:"gen-custom",onSubmit:async g=>{g.preventDefault(),u.trim()&&(await Mw(t,u.trim()),d(""),w())},children:[a.jsx("input",{placeholder:`Hand ${(i==null?void 0:i.name)||"the agent"} a task...`,value:u,onChange:g=>d(g.target.value)}),a.jsx("button",{className:"btn gen-go",type:"submit",disabled:!u.trim(),children:"Add"})]})]}),a.jsxs("div",{className:"sgroup",children:[a.jsx("div",{className:"sgroup-h",children:"Live log"}),a.jsxs("div",{className:"agent-log",children:[((i==null?void 0:i.log)||[]).map((g,S)=>a.jsxs("div",{className:"log-row",children:[a.jsx("span",{className:"log-t",children:new Date(g.t).toLocaleTimeString()}),a.jsx("span",{className:`log-k k-${g.kind}`,children:g.kind}),a.jsx("span",{className:"log-x",children:g.text})]},S)),((i==null?void 0:i.log)||[]).length?null:a.jsx("div",{className:"bl-empty",children:"Quiet so far."})]})]})]})]})},Mt=(t,e=2)=>t==null?"n/a":`${t<0?"-":t>0?"+":""}$${Math.abs(t).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e})}`,Bn=(t,e=!0,n=2)=>t==null?"n/a":`${e&&t>0?"+":""}${t.toFixed(n)}%`,hu=t=>t==null?"n/a":`${t>0?"+":""}${t.toFixed(2)}R`,jt=t=>t==null||t===0?"":t>0?"pos":"neg",Fn=t=>typeof t=="number"?t.toLocaleString("en-US"):"0",ui=t=>{if(t==null)return"n/a";const e=Math.round(t);return e<60?`${e}m`:`${Math.floor(e/60)}h ${String(e%60).padStart(2,"0")}m`},fs=(t,e=Date.now())=>t?Math.max(0,(e-new Date(t).getTime())/1e3):1/0,js=(t,e=Date.now())=>{const n=fs(t,e);return isFinite(n)?n<60?`${Math.round(n)}s ago`:n<3600?`${Math.round(n/60)}m ago`:n<86400?`${Math.round(n/3600)}h ago`:`${Math.round(n/86400)}d ago`:"never"},cn=(t,e=!0)=>{if(!t)return"";try{return new Date(t).toLocaleString("en-US",{timeZone:"America/New_York",...e?{month:"short",day:"numeric"}:{},hour:"numeric",minute:"2-digit",...e?{}:{second:"2-digit"}})}catch{return t}},Ab=t=>t&&t.trades?`${Math.round(t.wins/t.trades*100)}%`:"n/a",Nn=({label:t,value:e,sub:n,tone:i,title:s})=>a.jsxs("div",{className:"bk-tile",title:s,children:[a.jsx("span",{children:t}),a.jsx("b",{className:i||"",children:e}),n?a.jsx("em",{children:n}):null]}),k_=({value:t,onChange:e,options:n,small:i})=>a.jsx("div",{className:`bk-seg${i?" small":""}`,role:"tablist",children:n.map(s=>a.jsxs("button",{role:"tab","aria-selected":t===s.id,className:t===s.id?"on":"",onClick:()=>e(s.id),children:[s.label,s.note?a.jsx("i",{children:s.note}):null]},s.id))}),li=({children:t})=>a.jsx("div",{className:"bk-empty",children:t}),I_=({pts:t,height:e=170,empty:n})=>{if(t.length<2)return a.jsx(li,{children:n||"The curve draws itself after the first two closed trades."});const i=800,s=e,r=8,o=14,l=[0,...t.map(f=>f.v)],c=Math.min(...l),u=Math.max(...l),d=u-c||1,p=f=>r+f/(l.length-1)*(i-2*r),h=f=>s-o-(f-c)/d*(s-2*o),m=l.map((f,g)=>`${g?"L":"M"}${p(g).toFixed(1)},${h(f).toFixed(1)}`).join(" "),v=l[l.length-1],w=v>=0?"#35e08f":"#ff5c7a",x=`bkc${Math.round(s)}${v>=0?"p":"n"}`;return a.jsxs("div",{className:"bk-curve",children:[a.jsxs("svg",{viewBox:`0 0 ${i} ${s}`,preserveAspectRatio:"none",style:{height:e},children:[a.jsx("defs",{children:a.jsxs("linearGradient",{id:x,x1:"0",x2:"0",y1:"0",y2:"1",children:[a.jsx("stop",{offset:"0",stopColor:w,stopOpacity:"0.28"}),a.jsx("stop",{offset:"1",stopColor:w,stopOpacity:"0"})]})}),a.jsx("line",{x1:r,x2:i-r,y1:h(0),y2:h(0),className:"bk-curve-zero"}),a.jsx("path",{d:`${m} L${p(l.length-1)},${s-o} L${p(0)},${s-o} Z`,fill:`url(#${x})`}),a.jsx("path",{d:m,className:"bk-curve-line",style:{stroke:w}})]}),a.jsxs("div",{className:"bk-curve-axis",children:[a.jsxs("span",{children:["high ",Mt(u,0)]}),a.jsxs("span",{children:[t.length," trades, ",cn(t[0].t)," to ",cn(t[t.length-1].t)]}),a.jsxs("span",{children:["low ",Mt(c,0)]})]})]})},ef=({pts:t})=>{if(t.length<2)return a.jsx("div",{className:"bk-spark empty"});const e=200,n=44,i=3,s=[0,...t],r=Math.min(...s),l=Math.max(...s)-r||1,c=s.map((u,d)=>`${d?"L":"M"}${(i+d/(s.length-1)*(e-2*i)).toFixed(1)},${(n-i-(u-r)/l*(n-2*i)).toFixed(1)}`).join(" ");return a.jsx("svg",{className:"bk-spark",viewBox:`0 0 ${e} ${n}`,preserveAspectRatio:"none",children:a.jsx("path",{d:c,style:{stroke:s[s.length-1]>=0?"#35e08f":"#ff5c7a"}})})},U_=({side:t,entry:e,stop:n,target:i,price:s,digits:r=2})=>{const o=Math.min(n,i),l=Math.max(n,i),c=p=>`${Math.max(0,Math.min(100,(p-o)/(l-o||1)*100))}%`,u=t!=="short",d=s!=null&&(u?s>=e:s<=e);return a.jsxs("div",{className:`bk-track ${u?"long":"short"}`,children:[a.jsxs("div",{className:"bk-track-bar",children:[a.jsx("i",{className:"bk-track-risk",style:u?{left:0,width:c(e)}:{left:c(e),right:0}}),a.jsx("i",{className:"bk-track-entry",style:{left:c(e)}}),s!=null?a.jsx("i",{className:`bk-track-px ${d?"pos":"neg"}`,style:{left:c(s)}}):null]}),a.jsxs("div",{className:"bk-track-ends",children:[a.jsxs("span",{children:[u?"stop":"target"," ",o.toFixed(r)]}),a.jsxs("span",{children:["entry ",e.toFixed(r),s!=null?`, now ${s.toFixed(r)}`:""]}),a.jsxs("span",{children:[u?"target":"stop"," ",l.toFixed(r)]})]})]})},br=t=>t==null?"n/a":`${t>=0?"+":""}${t.toFixed(2)}R`,tf=t=>t==null?"n/a":t.toFixed(1),Nb=t=>t.status==="champion"?t.confirmed?"champion, confirmed":"champion":t.status==="retired"?"retired":t.open?`in a ${t.open.side}`:"running",Vg=({rows:t,minEval:e})=>{var s;const[n,i]=Y.useState(((s=t.find(r=>r.status==="champion"))==null?void 0:s.id)||null);return t.length?a.jsx("div",{className:"bk-table-wrap",children:a.jsxs("table",{className:"bk-table",children:[a.jsx("thead",{children:a.jsxs("tr",{children:[a.jsx("th",{children:"Strategy"}),a.jsx("th",{children:"Status"}),a.jsx("th",{children:"Idea"}),a.jsx("th",{className:"r",children:"Trades"}),a.jsx("th",{className:"r",children:"Winners"}),a.jsx("th",{className:"r",title:"Average result per trade, as a multiple of what each trade risked",children:"Avg R"}),a.jsx("th",{className:"r",title:"The average R against its own noise. 2 or better is the bar for the crown",children:"t-score"}),a.jsx("th",{className:"r",children:"Total"}),a.jsx("th",{className:"r",children:"Avg hold"})]})}),a.jsx("tbody",{children:t.map(r=>{const o=r.trades<e,l=n===r.id;return a.jsxs(jr.Fragment,{children:[a.jsxs("tr",{className:`${l?"open":""} ${r.status==="retired"?"legacy":""} ${r.status==="champion"?"champ":""}`,onClick:()=>i(l?null:r.id),children:[a.jsx("td",{className:"mono sym",children:r.id}),a.jsx("td",{children:a.jsx("span",{className:`pb-tag lab-${r.status}${r.open&&r.status==="active"?" live":""}`,children:Nb(r)})}),a.jsxs("td",{children:[r.family_label||r.family," ",a.jsxs("span",{className:"dim",children:["gen ",r.gen,r.parent?`, from ${r.parent}`:""]})]}),a.jsx("td",{className:"r mono",children:r.trades}),a.jsx("td",{className:"r mono",children:r.win_rate==null?"n/a":`${r.win_rate}%`}),a.jsx("td",{className:`r mono ${o?"dim":jt(r.exp_r??r.expectancy)}`,children:r.exp_r!=null?br(r.exp_r):Mt(r.expectancy)}),a.jsx("td",{className:`r mono ${o?"dim":jt(r.t_stat)}`,children:tf(r.t_stat)}),a.jsx("td",{className:`r mono ${jt(r.pnl)}`,children:Mt(r.pnl)}),a.jsx("td",{className:"r mono",children:ui(r.avg_hold_min)})]}),l?a.jsx("tr",{className:"bk-detail",children:a.jsxs("td",{colSpan:9,children:[a.jsxs("p",{children:[a.jsx("b",{children:"The rules."})," ",r.rules]}),a.jsxs("p",{children:[a.jsx("b",{children:"Why it exists."})," ",r.why," ",a.jsxs("span",{className:"bk-dim",children:["Created ",cn(r.created_utc)," ET."]})]}),r.backtest?a.jsxs("p",{className:"bk-dim",children:["Tape test: best of ",r.backtest.of??1," candidates on ",r.backtest.days," days of stored tape, ",r.backtest.trades," trades at ",br(r.backtest.exp_r)," a trade. That replay picked it, so it is not evidence; the live record above is."]}):null,r.retired_why?a.jsxs("p",{children:[a.jsx("b",{children:"Why it ended."})," ",r.retired_why," ",a.jsxs("span",{className:"bk-dim",children:[cn(r.retired_utc)," ET."]})]}):null,r.since_crowned?a.jsxs("p",{children:[a.jsx("b",{children:"Since it was crowned"})," (",cn(r.promoted_utc)," ET): ",r.since_crowned.trades," trades, ",r.since_crowned.exp_r!=null?br(r.since_crowned.exp_r):Mt(r.since_crowned.expectancy)," a trade, t-score ",tf(r.since_crowned.t_stat),", ",Mt(r.since_crowned.pnl)," total. This is the number that counts; the record above includes the trades that got it picked. ",r.confirmed?"CONFIRMED: these trades clear the bar on their own.":"Not confirmed yet: it needs a full sample after the crown with a t-score of 2 or better."]}):null,r.open?a.jsxs("p",{children:[a.jsx("b",{children:"Open now."})," ",r.open.side," ",r.open.qty??1," from ",r.open.entry_px.toFixed(2),", target ",r.open.target_px.toFixed(2),", stop ",r.open.stop_px.toFixed(2),". Trigger: ",r.open.note,"."]}):null,r.trades?a.jsxs("p",{className:"bk-dim",children:[Mt(r.expectancy)," a trade, average win ",Mt(r.avg_win),", average loss ",Mt(r.avg_loss),", profit factor ",r.profit_factor??"n/a",", worst run ",Mt(r.max_drawdown!=null?-r.max_drawdown:null),r.total_r!=null?`, ${br(r.total_r)} in total`:"","."]}):null,o&&r.status!=="retired"?a.jsxs("p",{className:"bk-dim",children:["Under ",e," closed trades, so its average means little yet."]}):null]})}):null]},r.id)})})]})}):a.jsx(li,{children:"No strategies yet. The lab seeds its first bench on the next pass with a real futures price."})},Cb=({rows:t,rules:e})=>{const[n,i]=Y.useState(null),[s,r]=Y.useState(!1);if(!t.length)return a.jsx(li,{children:"No trades in this market yet."});const o=t.length;return t=s?t:t.slice(0,15),a.jsxs("div",{className:"bk-table-wrap",children:[a.jsxs("table",{className:"bk-table",children:[a.jsx("thead",{children:a.jsxs("tr",{children:[a.jsx("th",{children:"Entry (ET)"}),a.jsx("th",{children:"Strategy"}),a.jsx("th",{children:"Idea"}),a.jsx("th",{children:"Side"}),a.jsx("th",{className:"r",title:"Micro contracts, sized so the stop risks about the same dollars on every trade",children:"Qty"}),a.jsx("th",{className:"r",children:"Entry"}),a.jsx("th",{className:"r",children:"Exit"}),a.jsx("th",{children:"Out on"}),a.jsx("th",{className:"r",children:"Held"}),a.jsx("th",{className:"r",title:"The furthest the trade ran in our favour and against us, in points",children:"Best / worst"}),a.jsx("th",{className:"r",children:"P&L"}),a.jsx("th",{className:"r",title:"P&L divided by what the trade risked",children:"R"})]})}),a.jsx("tbody",{children:t.map((l,c)=>{var p,h;const u=l.id??c,d=n===u;return a.jsxs(jr.Fragment,{children:[a.jsxs("tr",{className:`${d?"open":""}${l.era&&e&&l.era!==e?" legacy":""}`,onClick:()=>i(d?null:u),children:[a.jsx("td",{className:"mono dim",children:cn(l.entry_utc)}),a.jsx("td",{className:"mono sym",children:l.strat}),a.jsx("td",{children:l.family||""}),a.jsx("td",{children:a.jsx("span",{className:`pb-tag side-${l.side}`,children:l.side})}),a.jsx("td",{className:"r mono",children:l.qty??1}),a.jsx("td",{className:"r mono",children:l.entry_px.toFixed(2)}),a.jsx("td",{className:"r mono",children:l.exit_px!=null?l.exit_px.toFixed(2):""}),a.jsx("td",{children:l.status==="closed"?a.jsx("span",{className:`pb-tag ${String(l.reason||"").replace(/ /g,"-")}`,children:l.reason}):a.jsx("span",{className:"pb-tag open",children:"open"})}),a.jsx("td",{className:"r mono",children:ui(l.hold_min)}),a.jsx("td",{className:"r mono dim",children:l.mfe!=null?`+${l.mfe.toFixed(2)} / ${(l.mae??0).toFixed(2)}`:""}),a.jsx("td",{className:`r mono ${jt(l.pnl)}`,children:l.status==="closed"?Mt(l.pnl):""}),a.jsx("td",{className:`r mono ${jt(l.r)}`,children:l.status==="closed"&&l.r!=null?br(l.r):""})]}),d?a.jsx("tr",{className:"bk-detail",children:a.jsxs("td",{colSpan:12,children:[a.jsxs("p",{children:[a.jsx("b",{children:"Why it entered."})," ",l.note||"No note recorded."]}),a.jsxs("p",{className:"bk-dim",children:["Target ",(p=l.target_px)==null?void 0:p.toFixed(2),", stop ",(h=l.init_stop_px??l.stop_px)==null?void 0:h.toFixed(2),l.init_stop_px!=null&&l.stop_px!=null&&Math.abs(l.stop_px-l.init_stop_px)>1e-6?" (later moved to the entry price)":"",".",l.risk_usd!=null?` ${l.qty??1} contract${(l.qty??1)===1?"":"s"}, $${l.risk_usd.toFixed(0)} at risk.`:"",l.exit_utc?` Out ${cn(l.exit_utc)} ET.`:"",l.era&&l.era.startsWith("v1")?" A first-generation scalp, from before the swing ruling.":l.era&&l.era.startsWith("v2")?" A one-contract swing trade, from before the quant rules.":""]})]})}):null]},u)})})]}),o>15?a.jsx("button",{className:"lab-more",onClick:()=>r(!s),children:s?"Show the latest 15":`Show all ${o}`}):null]})},Rb=({m:t,d:e})=>{var h,m,v,w,x,f,g;const[n,i]=Y.useState(!1),s=e.rules||"",r=t.strategies.filter(S=>!S.era||S.era===s),o=r.filter(S=>S.status!=="retired"),l=r.filter(S=>S.status==="retired"),c=t.all,u=(e.trades||[]).filter(S=>S.sym===t.sym).slice(0,40),d=Object.entries(t.by_family||{}).sort((S,y)=>y[1].trades-S[1].trades),p=t.point_value||1;return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"bk-tiles",children:[a.jsx(Nn,{label:"Paper P&L",value:Mt(c.pnl),tone:jt(c.pnl),sub:"every strategy, after costs"}),a.jsx(Nn,{label:"Today",value:Mt(((h=t.today)==null?void 0:h.pnl)??0),tone:jt((m=t.today)==null?void 0:m.pnl),sub:`${((v=t.today)==null?void 0:v.trades)??0} trade${((w=t.today)==null?void 0:w.trades)===1?"":"s"} closed`}),a.jsx(Nn,{label:"Trades",value:c.trades,sub:c.win_rate!=null?`${c.win_rate}% winners`:"none closed yet"}),a.jsx(Nn,{label:"Per trade",value:c.exp_r!=null?br(c.exp_r):Mt(c.expectancy),tone:jt(c.exp_r??c.expectancy),sub:`${Mt(c.expectancy)} a trade, profit factor ${c.profit_factor??"n/a"}`}),a.jsx(Nn,{label:"Avg win / loss",value:Mt(c.avg_win),sub:Mt(c.avg_loss)}),a.jsx(Nn,{label:"Average hold",value:ui(c.avg_hold_min),sub:"swings, not scalps"}),a.jsx(Nn,{label:"Max drawdown",value:c.max_drawdown!=null?Mt(-c.max_drawdown):"n/a",sub:"worst run on the curve"}),a.jsx(Nn,{label:"Champion",value:t.champion||"none yet",sub:t.champion?t.champion_confirmed?"confirmed after the crown":"a lead, not yet confirmed":`${t.running} running, ${t.retired} retired`})]}),a.jsxs("div",{className:"bk-grid wide-left",children:[a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsxs("span",{children:["Equity curve · ",t.sym," · all strategies"]}),a.jsx("span",{className:"pb-dim",children:(x=e.style)!=null&&x.risk_usd?`each trade sized to risk about $${e.style.risk_usd}, after costs`:"after costs"})]}),a.jsx(I_,{pts:t.equity||[],empty:"No closed trades on the quant bench in this market yet."})]}),a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsx("span",{children:"Open positions"}),a.jsx("span",{className:"pb-dim",children:t.price!=null?`${t.sym} ${t.price.toFixed(2)}`:""})]}),(t.open||[]).length?a.jsx("div",{className:"bk-scroll",children:(t.open||[]).map(S=>a.jsxs("div",{className:"bk-pos",children:[a.jsxs("div",{className:"bk-pos-top",children:[a.jsx("span",{className:"bk-sym",children:S.strat}),a.jsxs("span",{className:`pb-tag side-${S.side}`,children:[S.side,S.qty?` ${S.qty}`:""]}),a.jsxs("span",{className:"bk-dim",children:["in ",cn(S.entry_utc)," · held ",ui(S.hold_min),S.risk_usd!=null?` · $${S.risk_usd.toFixed(0)} at risk`:""]}),a.jsx("b",{className:`bk-pos-pnl ${jt(S.unrealized)}`,children:Mt(S.unrealized)})]}),a.jsx(U_,{side:S.side,entry:S.entry_px,stop:S.stop_px,target:S.target_px,price:t.price}),a.jsx("div",{className:"bk-dim",children:S.note})]},S.strat))}):a.jsxs(li,{children:["Flat. No strategy has a trade on in ",t.sym," right now."]})]})]}),a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsxs("span",{children:["The bench · ",o.length," strategies trading ",t.sym]}),a.jsx("span",{className:"pb-dim",children:"click a row for its rules and why it exists"})]}),t.champion?null:a.jsxs("p",{className:"bk-note",children:["No champion yet. A strategy needs ",e.min_champion??20," closed trades, a positive average R, winners outweighing losers and a t-score of ",((f=e.style)==null?void 0:f.crown_t)??2," or better before it earns the crown."]}),t.luck_bar?a.jsxs("p",{className:"bk-note",children:["Luck check: the lab has tried ",t.created," strategies in ",t.sym,". If none had any edge, the luckiest would still be expected to show a t-score near ",t.luck_bar.toFixed(1),". That is why a champion only counts as proven once the trades it takes after the crown clear the bar on their own."]}):null,a.jsx(Vg,{rows:o,minEval:e.min_eval??10}),l.length?a.jsxs(a.Fragment,{children:[a.jsxs("button",{className:"lab-more",onClick:()=>i(!n),children:[n?"Hide":"Show"," the ",l.length," retired"]}),n?a.jsx(Vg,{rows:l,minEval:e.min_eval??10}):null]}):null,(g=t.previous)!=null&&g.strategies?a.jsxs("p",{className:"bk-note",children:["Earlier eras (",t.previous.era,"): ",t.previous.strategies," strategies took ",t.previous.trades," trades for ",Mt(t.previous.pnl),". They were retired on the record and are not counted above."]}):null]}),a.jsxs("div",{className:"bk-grid",children:[a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsx("span",{children:"Which ideas are working"}),a.jsx("span",{className:"pb-dim",children:"closed trades by family"})]}),d.length?a.jsx("div",{className:"bk-table-wrap",children:a.jsxs("table",{className:"bk-table compact",children:[a.jsx("thead",{children:a.jsxs("tr",{children:[a.jsx("th",{children:"Idea"}),a.jsx("th",{className:"r",children:"Trades"}),a.jsx("th",{className:"r",children:"Winners"}),a.jsx("th",{className:"r",children:"Avg R"}),a.jsx("th",{className:"r",children:"t-score"}),a.jsx("th",{className:"r",children:"Avg hold"}),a.jsx("th",{className:"r",children:"P&L"})]})}),a.jsx("tbody",{children:d.map(([S,y])=>a.jsxs("tr",{children:[a.jsx("td",{children:S}),a.jsx("td",{className:"r mono",children:y.trades}),a.jsx("td",{className:"r mono",children:y.win_rate!=null?`${y.win_rate}%`:"n/a"}),a.jsx("td",{className:`r mono ${jt(y.exp_r??y.expectancy)}`,children:y.exp_r!=null?br(y.exp_r):Mt(y.expectancy)}),a.jsx("td",{className:`r mono ${jt(y.t_stat)}`,children:tf(y.t_stat)}),a.jsx("td",{className:"r mono",children:ui(y.avg_hold_min)}),a.jsx("td",{className:`r mono ${jt(y.pnl)}`,children:Mt(y.pnl)})]},S))})]})}):a.jsx(li,{children:"Fills in as trades close."}),a.jsxs("p",{className:"bk-note",children:["Targets and stops are multiples of ",t.sym,"'s typical one hour move",t.hour_move?`, ${t.hour_move.toFixed(2)} points right now ($${(t.hour_move*p).toFixed(0)} a contract)`:"",", so they widen when the market is fast and tighten when it is quiet.",t.regime?` The tape is ${t.regime} right now (the last hour's volatility against the last eight hours').`:""]})]}),a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsx("span",{children:"What the lab learned"}),a.jsx("span",{className:"pb-dim",children:"created, retired, crowned"})]}),(()=>{const S=(e.log||[]).filter(y=>y.sym===t.sym&&y.kind!=="entry"&&y.kind!=="exit"&&y.kind!=="manage").slice(0,12);return S.length?a.jsx("div",{className:"bk-scroll tall",children:S.map((y,b)=>a.jsxs("div",{className:"lab-log",children:[a.jsx("span",{className:"pb-row-t",children:cn(y.t)}),a.jsx("span",{className:`pb-tag lab-k-${y.kind}`,children:y.kind}),a.jsx("span",{children:y.text})]},b))}):a.jsx(li,{children:"Nothing yet. The first review runs in the next 5 PM ET maintenance hour."})})()]})]}),a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsxs("span",{children:["Trade ledger · ",t.sym]}),a.jsx("span",{className:"pb-dim",children:"click a row for why it entered"})]}),a.jsx(Cb,{rows:u,rules:s})]})]})},F_=t=>{if(!t||!t.configured)return{ok:!1,text:"The live link to Korvus is not set, so the lab cannot be read from here."};const e=t.last_tick||{};return t.reachable?t.enabled?t.started?e.phase==="weekend"?{ok:!0,text:"Futures are closed for the weekend. The lab resumes Sunday at 6 PM ET."}:e.phase==="maintenance"?{ok:!0,text:"Daily maintenance hour. This is when the lab reviews its strategies."}:e.feed_ok===!1?{ok:!1,text:`Idle: the price feed is "${e.feed||"unknown"}", not the real CME feed. The lab only trades on real futures prices.`}:{ok:!0,text:"Running. Every strategy on the bench is trading on paper."}:{ok:!1,text:"The lab has not run its first pass yet."}:{ok:!1,text:"The lab is switched off (LAB_ENABLED=0 on the Korvus box)."}:{ok:!1,text:`Cannot reach the lab: ${t.error||"no answer"}.`}},Pb=({d:t})=>{var l,c,u;const[e,n]=Y.useState("MNQ"),i=F_(t),s=(t==null?void 0:t.markets)||[],r=s.find(d=>d.sym===e)||s[0],o=t==null?void 0:t.style;return a.jsxs("div",{className:"bk",children:[a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsxs("span",{children:["Futures lab · ",(o==null?void 0:o.label)||"the bot finds its own strategy"]}),a.jsx("span",{className:i.ok?"pb-pass":"pb-dim",children:(l=t==null?void 0:t.last_tick)!=null&&l.t?`last pass ${cn(t.last_tick.t)} ET`:"paper only"})]}),a.jsx("p",{className:"lab-lead",children:i.text}),a.jsxs("div",{className:"bk-chips",children:[o?a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"pb-tag bk-pb",children:"no scalping"}),o.risk_usd?a.jsxs("span",{className:"pb-tag bk-pb",children:["risks about $",o.risk_usd," a trade, 1 to ",o.max_contracts??5," contracts"]}):null,o.tape_test_days?a.jsx("span",{className:"pb-tag",children:"replayed on stored tape before a seat"}):null,o.crown_t?a.jsxs("span",{className:"pb-tag",children:["crown needs a t-score of ",o.crown_t,"+"]}):null,a.jsxs("span",{className:"pb-tag",children:["at most ",o.max_trades_day," trades a day per strategy"]}),a.jsxs("span",{className:"pb-tag",children:["shortest hold limit ",ui(o.min_hold_cap_min)]}),a.jsxs("span",{className:"pb-tag",children:["no new trade after ",o.last_entry_et," ET"]}),a.jsxs("span",{className:"pb-tag",children:["flat by ",o.flat_et," ET"]})]}):a.jsx("span",{className:"pb-tag retired",children:"the Korvus box is still on the first-generation rules"}),a.jsxs("span",{className:"pb-tag",children:["$",(((c=t==null?void 0:t.costs)==null?void 0:c.commission_rt)??1.4).toFixed(2)," commission + ",((u=t==null?void 0:t.costs)==null?void 0:u.slippage_ticks)??1," tick a side"]})]}),a.jsxs("p",{className:"bk-note",children:["For each market the lab runs ",(t==null?void 0:t.population)??12," different rule sets side by side",o!=null&&o.risk_usd?`, each trade sized so its stop risks about $${o.risk_usd}`:", one micro contract each",". Once a day it retires the losers, breeds new ones from the winners",o!=null&&o.tape_test_days?`, replays each newcomer and its rivals on up to ${o.tape_test_days} days of stored tape before giving one a seat,`:""," and writes down why. Results are scored in R (profit divided by what the trade risked) and by t-score (the average against its own noise). With this many running, the best one looks good partly by luck, so a champion is judged on what it does after it is crowned."]})]}),t!=null&&t.reachable&&t.started&&r?a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"bk-markets",children:s.map(d=>a.jsxs("button",{className:`bk-market${d.sym===r.sym?" on":""}`,onClick:()=>n(d.sym),"aria-pressed":d.sym===r.sym,children:[a.jsxs("div",{className:"bk-market-top",children:[a.jsx("b",{children:d.sym}),a.jsx("span",{children:d.name}),a.jsx("em",{children:d.price!=null?d.price.toFixed(2):"no price yet"})]}),a.jsxs("div",{className:"bk-market-row",children:[a.jsxs("div",{children:[a.jsx("strong",{className:jt(d.all.pnl),children:Mt(d.all.pnl)}),a.jsxs("span",{children:[d.all.trades," trades",d.all.win_rate!=null?`, ${d.all.win_rate}% winners`:""]})]}),a.jsx(ef,{pts:(d.equity||[]).map(p=>p.v)})]}),a.jsxs("div",{className:"bk-market-foot",children:[d.champion?`champion ${d.champion}`:"no champion yet"," · ",d.running," running · ",(d.open||[]).length," open"]})]},d.sym))}),a.jsx(Rb,{m:r,d:t},r.sym)]}):null]})},zu={scalp:"scalp",swing:"day swing"},Lb={confirming:"confirming",waiting:"waiting",skipped:"passed",traded:"traded"},Db=({w:t})=>{const e=t.move_pct!=null&&t.need_pct?Math.max(0,Math.min(1,t.move_pct/t.need_pct)):null;return a.jsxs("div",{className:`bk-watch ${t.state}`,children:[a.jsxs("div",{className:"bk-watch-top",children:[a.jsx("span",{className:"bk-sym",children:t.symbol}),a.jsx("span",{className:`pb-tag side-${t.side}`,children:t.side}),t.playbook?a.jsx("span",{className:"pb-tag bk-pb",children:zu[t.playbook]}):null,a.jsxs("span",{className:"bk-dim",children:[t.impact," ",t.confidence,"% · ",String(t.catalyst||"filing").replace(/_/g," "),t.age_min!=null?` · seen ${ui(t.age_min)} ago`:""]}),a.jsx("span",{className:`bk-state ${t.state}`,children:Lb[t.state]||t.state})]}),a.jsx("div",{className:"bk-watch-why",children:t.why||t.headline}),e!==null&&t.state!=="traded"?a.jsxs("div",{className:"bk-prog",title:"Move since the filing, against the move the playbook needs",children:[a.jsx("span",{className:"pb-bar",children:a.jsx("i",{style:{width:`${e*100}%`}})}),a.jsxs("em",{children:[Bn(t.move_pct)," of +",t.need_pct,"% needed",t.need_checks?` · ${t.checks??0}/${t.need_checks} checks`:""]})]}):null]})},kb=({t,p:e})=>a.jsxs("div",{className:"bk-pos",children:[a.jsxs("div",{className:"bk-pos-top",children:[a.jsx("span",{className:"bk-sym",children:t.symbol}),a.jsx("span",{className:`pb-tag side-${t.side||"long"}`,children:t.side||"long"}),t.playbook?a.jsx("span",{className:"pb-tag bk-pb",children:zu[t.playbook]}):null,a.jsxs("span",{className:"bk-dim",children:[t.qty," sh · in ",cn(t.entry_utc),t.risk_usd?` · risk $${t.risk_usd.toFixed(0)}`:""]}),a.jsx("b",{className:`bk-pos-pnl ${jt(e==null?void 0:e.pnl)}`,children:e?`${Mt(e.pnl)} (${Bn(e.run_pct)})`:"open"})]}),t.stop_px!=null&&t.target_px!=null?a.jsx(U_,{side:t.side||"long",entry:t.entry_px,stop:t.stop_px,target:t.target_px,price:e==null?void 0:e.price}):null,t.init_stop_px!=null&&t.stop_px!=null&&Math.abs(t.stop_px-t.init_stop_px)>1e-6?a.jsx("div",{className:"bk-dim",children:"Stop already moved to the entry price: this trade can no longer lose more than slippage."}):null]}),Ib=({rows:t,current:e})=>{const[n,i]=Y.useState(null),[s,r]=Y.useState(!1);if(!t.length)return a.jsx(li,{children:"No closed trades yet under these rules."});const o=t.length;return t=s?t:t.slice(0,15),a.jsxs("div",{className:"bk-table-wrap",children:[a.jsxs("table",{className:"bk-table",children:[a.jsx("thead",{children:a.jsxs("tr",{children:[a.jsx("th",{children:"Entry (ET)"}),a.jsx("th",{children:"Symbol"}),a.jsx("th",{children:"Playbook"}),a.jsx("th",{children:"Side"}),a.jsx("th",{className:"r",children:"Size"}),a.jsx("th",{className:"r",children:"Entry"}),a.jsx("th",{className:"r",children:"Exit"}),a.jsx("th",{children:"Out on"}),a.jsx("th",{className:"r",children:"Held"}),a.jsx("th",{className:"r",title:"The furthest the trade ran in our favour and against us while it was open",children:"Best / worst"}),a.jsx("th",{className:"r",title:"Result in units of the dollars risked",children:"R"}),a.jsx("th",{className:"r",children:"P&L"})]})}),a.jsx("tbody",{children:t.map(l=>{var d,p;const c=e&&l.strategy!==e,u=n===l.id;return a.jsxs(jr.Fragment,{children:[a.jsxs("tr",{className:`${u?"open":""}${c?" legacy":""}`,onClick:()=>i(u?null:l.id),children:[a.jsx("td",{className:"mono dim",children:cn(l.entry_utc)}),a.jsx("td",{className:"mono sym",children:l.symbol}),a.jsx("td",{children:l.playbook?a.jsx("span",{className:"pb-tag bk-pb",children:zu[l.playbook]}):a.jsxs("span",{className:"pb-tag retired",children:[String(l.strategy).split("-")[0]," rules"]})}),a.jsx("td",{children:a.jsx("span",{className:`pb-tag side-${l.side||"long"}`,children:l.side||"long"})}),a.jsx("td",{className:"r mono",children:l.qty}),a.jsx("td",{className:"r mono",children:l.entry_px.toFixed(2)}),a.jsx("td",{className:"r mono",children:l.exit_px!=null?l.exit_px.toFixed(2):""}),a.jsx("td",{children:a.jsx("span",{className:`pb-tag ${String(l.exit_reason||"").replace(/ /g,"-")}`,children:l.exit_reason})}),a.jsx("td",{className:"r mono",children:ui(l.hold_min??(l.exit_utc?(new Date(l.exit_utc).getTime()-new Date(l.entry_utc).getTime())/6e4:null))}),a.jsx("td",{className:"r mono dim",children:l.mfe_pct!=null?`${Bn(l.mfe_pct)} / ${Bn(l.mae_pct)}`:""}),a.jsx("td",{className:`r mono ${jt(l.r_mult)}`,children:l.r_mult!=null?hu(l.r_mult):""}),a.jsxs("td",{className:`r mono ${jt(l.pnl)}`,children:[Mt(l.pnl)," ",a.jsx("span",{className:"dim",children:Bn(l.pnl_pct)})]})]}),u?a.jsx("tr",{className:"bk-detail",children:a.jsxs("td",{colSpan:12,children:[l.filing?a.jsxs(a.Fragment,{children:[a.jsxs("p",{children:[a.jsx("b",{children:"The filing."})," ",a.jsx("a",{href:l.filing.url,target:"_blank",rel:"noopener noreferrer",children:l.filing.headline})," ",a.jsxs("span",{className:"bk-dim",children:["seen ",cn(l.filing.seen_utc)," ET · scored ",l.filing.impact," ",l.filing.direction," at ",l.filing.confidence,"% · ",String(l.filing.catalyst).replace(/_/g," "),l.filing.ref_price?` · reference price ${l.filing.ref_price.toFixed(2)}`:""]})]}),a.jsxs("p",{children:[a.jsx("b",{children:"What it said."})," ",l.filing.summary]}),l.filing.read?a.jsxs("p",{children:[a.jsx("b",{children:"The read."})," ",l.filing.read]}):null]}):a.jsx("p",{className:"bk-dim",children:"The filing behind this trade is older than the export window."}),l.note?a.jsxs("p",{children:[a.jsx("b",{children:"Why it entered."})," ",l.note]}):null,a.jsxs("p",{className:"bk-dim",children:["Planned stop ",l.init_stop_px!=null?l.init_stop_px.toFixed(2):(d=l.stop_px)==null?void 0:d.toFixed(2),", target ",(p=l.target_px)==null?void 0:p.toFixed(2),l.risk_usd?`, $${l.risk_usd.toFixed(0)} at risk`:"",l.phase?`, entered in the ${l.phase} session`:"",". Out ",cn(l.exit_utc)," ET.",c?` Taken under the retired ${l.strategy} rules, so it is not on the scoreboard above.`:""]})]})}):null]},l.id)})})]}),o>15?a.jsx("button",{className:"lab-more",onClick:()=>r(!s),children:s?"Show the latest 15":`Show all ${o}`}):null]})},Gg=[{id:"playbook",label:"Playbook"},{id:"phase",label:"Session"},{id:"side",label:"Side"},{id:"catalyst",label:"Catalyst"}],Ub=({data:t,live:e})=>{var w,x,f,g,S,y,b,T,N,_,C;const[n,i]=Y.useState("playbook"),s=(w=t.board)==null?void 0:w.scoreboard,r=(x=t.board)==null?void 0:x.rules,o=((f=t.board)==null?void 0:f.min_sample)??30,l=((g=e==null?void 0:e.stages)==null?void 0:g.bot)||{},c=Array.isArray(l.watch)?l.watch:[],u=Array.isArray(l.positions)?l.positions:[],d=Y.useMemo(()=>new Map(u.map(R=>[R.id,R])),[u]),p={confirming:0,waiting:1,traded:2,skipped:3},h=c.slice().sort((R,k)=>(p[R.state]??9)-(p[k.state]??9)),m=Object.entries((n==="playbook"?s==null?void 0:s.by_playbook:n==="phase"?s==null?void 0:s.by_phase:n==="side"?s==null?void 0:s.by_side:s==null?void 0:s.by_catalyst)||{}).map(([R,k])=>[R,k]).sort((R,k)=>k[1].trades-R[1].trades),v=(s==null?void 0:s.avg_win_pct)!=null&&(s==null?void 0:s.avg_loss_pct)!=null&&s.avg_win_pct+Math.abs(s.avg_loss_pct)>0?Math.abs(s.avg_loss_pct)/(s.avg_win_pct+Math.abs(s.avg_loss_pct))*100:null;return a.jsxs("div",{className:"bk",children:[(S=t.retired)!=null&&S.length?a.jsxs("div",{className:"pb-retired",children:[a.jsx("b",{children:"A fresh scoreboard."})," ",t.retired.map((R,k)=>a.jsxs("span",{children:[k?"; ":"","the retired ",a.jsx("i",{children:R.strategy})," rules closed ",R.trades," trade",R.trades===1?"":"s"," (",R.wins,"W, ",R.losses,"L, ",a.jsx("span",{className:jt(R.pnl),children:Mt(R.pnl)}),")"]},R.strategy)),". Those trades stay in the ledger below, marked with their rule version, and are not mixed into the numbers for ",a.jsx("i",{children:s==null?void 0:s.strategy}),"."]}):null,a.jsxs("div",{className:"bk-tiles",children:[a.jsx(Nn,{label:"Paper P&L",value:Mt((s==null?void 0:s.paper_pnl)??0),tone:jt(s==null?void 0:s.paper_pnl),sub:`${(s==null?void 0:s.closed_trades)??0} closed, ${(s==null?void 0:s.open_trades)??0} open`}),a.jsx(Nn,{label:"Win rate",value:(s==null?void 0:s.win_rate_pct)!=null?`${s.win_rate_pct}%`:"n/a",sub:s?`${s.wins}W, ${s.losses}L${v!=null?` · needs ${v.toFixed(0)}%`:""}`:"",title:"Break-even win rate is what the average win and loss sizes require"}),a.jsx(Nn,{label:"Per trade",value:(s==null?void 0:s.expectancy_r)!=null?hu(s.expectancy_r):Bn(s==null?void 0:s.expectancy_pct),tone:jt((s==null?void 0:s.expectancy_r)??(s==null?void 0:s.expectancy_pct)),sub:(s==null?void 0:s.expectancy_r)!=null?`${Bn(s==null?void 0:s.expectancy_pct)} · risking $${Fn((s==null?void 0:s.risk_per_trade)??(r==null?void 0:r.risk_usd)??100)}`:"average result",title:"R is the result in units of the dollars risked"}),a.jsx(Nn,{label:"Profit factor",value:(s==null?void 0:s.profit_factor)??"n/a",sub:"gross wins over gross losses"}),a.jsx(Nn,{label:"Avg win / loss",value:Bn(s==null?void 0:s.avg_win_pct),sub:Bn(s==null?void 0:s.avg_loss_pct)}),a.jsx(Nn,{label:"Average hold",value:ui(s==null?void 0:s.avg_hold_min),sub:(s==null?void 0:s.avg_mfe_pct)!=null?`ran ${Bn(s.avg_mfe_pct)} for, ${Bn(s.avg_mae_pct)} against`:"time in a trade"}),a.jsx(Nn,{label:"Max drawdown",value:(s==null?void 0:s.max_drawdown_usd)!=null?Mt(-s.max_drawdown_usd):"n/a",sub:(s==null?void 0:s.max_drawdown_pct)!=null?`${s.max_drawdown_pct}% of capital at work`:""}),a.jsx(Nn,{label:"Stop slippage",value:(s==null?void 0:s.stop_slip_pct)!=null?Bn(s.stop_slip_pct,!1):"n/a",sub:"how far past the stop it filled",title:"Quotes are checked once a minute, so a stop can fill past its level"})]}),s&&!s.sample_ok?a.jsxs("div",{className:"pb-sample",children:[a.jsxs("b",{children:[s.closed_trades," of ",o]})," closed trades before the win rate means anything.",a.jsx("span",{className:"pb-bar",children:a.jsx("i",{style:{width:`${Math.min(100,s.closed_trades/o*100)}%`}})})]}):null,a.jsxs("div",{className:"bk-grid wide-left",children:[a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsxs("span",{children:["Equity curve · ",s==null?void 0:s.strategy]}),a.jsxs("span",{className:"pb-dim",children:["data as of ",cn((y=t.board)==null?void 0:y.data_asof_utc)||"n/a"," ET"]})]}),a.jsx(I_,{pts:t.equity||[],empty:"No closed trades under these rules yet. The curve starts with the first two."})]}),a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsx("span",{children:"On the radar"}),a.jsx("span",{className:"pb-dim",children:h.length?`${h.length} filing${h.length===1?"":"s"} in play`:"live"})]}),h.length?a.jsx("div",{className:"bk-scroll",children:h.map(R=>a.jsx(Db,{w:R},R.accession+(R.playbook||"")))}):a.jsx(li,{children:e!=null&&e.running?"No tradable filing in the last 18 hours. The bot waits for the crawler to score one.":"The radar shows what the bot is weighing once the live link to Korvus is up."})]})]}),a.jsxs("div",{className:"bk-grid",children:[a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsx("span",{children:"Open positions"}),a.jsxs("span",{className:"pb-dim",children:["max ",(r==null?void 0:r.max_open)??5]})]}),(b=t.open)!=null&&b.length?t.open.map(R=>a.jsx(kb,{t:R,p:d.get(R.id)},R.id)):a.jsx(li,{children:"Flat. No open paper positions."})]}),a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsx("span",{children:"Where the results come from"}),a.jsx(k_,{small:!0,value:n,onChange:i,options:Gg})]}),m.length?a.jsx("div",{className:"bk-table-wrap",children:a.jsxs("table",{className:"bk-table compact",children:[a.jsx("thead",{children:a.jsxs("tr",{children:[a.jsx("th",{children:(T=Gg.find(R=>R.id===n))==null?void 0:T.label}),a.jsx("th",{className:"r",children:"Trades"}),a.jsx("th",{className:"r",children:"Winners"}),a.jsx("th",{className:"r",children:"Avg result"}),a.jsx("th",{className:"r",children:"Avg hold"}),a.jsx("th",{className:"r",children:"P&L"})]})}),a.jsx("tbody",{children:m.map(([R,k])=>a.jsxs("tr",{children:[a.jsx("td",{children:zu[R]||R.replace(/_/g," ")}),a.jsx("td",{className:"r mono",children:k.trades}),a.jsx("td",{className:"r mono",children:Ab(k)}),a.jsx("td",{className:`r mono ${jt(k.avg_r)}`,children:k.avg_r!=null?hu(k.avg_r):""}),a.jsx("td",{className:"r mono",children:k.avg_hold_min!=null?ui(k.avg_hold_min):""}),a.jsx("td",{className:`r mono ${jt(k.pnl)}`,children:k.pnl!=null?Mt(k.pnl):""})]},R))})]})}):a.jsx(li,{children:"Fills in as trades close."}),s!=null&&s.exits&&Object.keys(s.exits).length?a.jsx("div",{className:"bk-chips",children:Object.entries(s.exits).map(([R,k])=>a.jsxs("span",{className:`pb-tag ${R.replace(/ /g,"-")}`,children:[R," ",k]},R))}):null]})]}),a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsx("span",{children:"Trade ledger"}),a.jsx("span",{className:"pb-dim",children:"click a row for the filing and the reasoning"})]}),a.jsx(Ib,{rows:t.recent||[],current:s==null?void 0:s.strategy})]}),a.jsxs("div",{className:"bk-grid",children:[a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsxs("span",{children:["The rules · ",r==null?void 0:r.strategy]}),a.jsx("span",{className:"pb-dim",children:"paper only"})]}),(N=r==null?void 0:r.lines)!=null&&N.length?a.jsx("dl",{className:"bk-rules",children:r.lines.map(R=>a.jsxs(jr.Fragment,{children:[a.jsx("dt",{children:R.k}),a.jsx("dd",{children:R.v})]},R.k))}):a.jsx("p",{className:"bk-note",children:r?`Runs ${r.window||"in the regular session"}, $${Fn(r.notional)} a position, at most ${r.max_open} open. The full rule list appears here once the Korvus box is on the new rules.`:"Rules load with the first vault sync."})]}),a.jsxs("section",{className:"pb-panel",children:[a.jsx("div",{className:"pb-panel-h",children:a.jsx("span",{children:"Why the rules are what they are"})}),(C=(_=t.board)==null?void 0:_.changes)!=null&&C.length?t.board.changes.map(R=>a.jsxs("div",{className:"bk-change",children:[a.jsxs("div",{className:"bk-change-h",children:[a.jsx("span",{className:"mono",children:R.date}),a.jsx("b",{children:R.title})]}),a.jsxs("div",{className:"bk-change-cols",children:[a.jsxs("div",{children:[a.jsx("em",{children:"What the log showed"}),a.jsx("ul",{children:R.found.map(k=>a.jsx("li",{children:k},k))})]}),a.jsxs("div",{children:[a.jsx("em",{children:"What changed"}),a.jsx("ul",{children:R.changed.map(k=>a.jsx("li",{children:k},k))})]})]})]},R.version)):a.jsx(li,{children:"Rule changes are written down here, with the evidence behind each one."})]})]})]})},Fb=({nodes:t,hits:e,now:n,live:i})=>a.jsx("div",{className:`pb-pipe${i?"":" offline"}`,children:t.map((s,r)=>{const o=n-(e[s.stage]||0)<7e3;return a.jsxs(jr.Fragment,{children:[a.jsxs("div",{className:`pb-node ${s.health}${o?" hot":""}`,children:[a.jsxs("div",{className:"pb-node-top",children:[a.jsx("span",{className:`pb-dot ${s.health}`}),a.jsxs("span",{className:"pb-node-step",children:["0",r+1]}),s.ring!==void 0?a.jsx("span",{className:"pb-ring",style:{"--p":`${Math.round(s.ring*360)}deg`},title:"time to next EDGAR poll"}):null]}),a.jsx("div",{className:"pb-node-title",children:s.title}),a.jsx("div",{className:"pb-node-metric",children:s.metric}),a.jsx("div",{className:"pb-node-detail",children:s.detail})]}),r<t.length-1?a.jsxs("div",{className:`pb-link${i?" flowing":""}${o?" fast":""}`,children:[a.jsx("i",{}),a.jsx("i",{}),a.jsx("i",{})]}):null]},s.key)})}),Ob={universe:"SCREEN",edgar:"EDGAR",scoring:"READ",crown:"CROWN",quotes:"QUOTE",bot:"BOT",vault:"VAULT",system:"SYS",filings:"EDGAR",paperbot:"BOT"},jb={premarket:"pre-market",afterhours:"after-hours",overnight:"overnight session",regular:"regular session"},Bb=({c:t,now:e})=>{var c,u,d;const n=t==null?void 0:t.counts,i=(t==null?void 0:t.status)||{},s=!!(t!=null&&t.running),r=(p,h)=>{const m=i[p];return m!=null&&m.at?m.error?"bad":(e-new Date(m.at).getTime())/6e4>h?"warn":"ok":"idle"},o=n?Object.entries(n.briefs_by||{}).filter(([p])=>p!=="rules").reduce((p,[,h])=>p+h,0):0,l=[{key:"feed",label:"Live filing feed",stale:12,note:n?`${n.filings_24h} filing(s) caught in 24h`:""},{key:"prices",label:"Daily prices",stale:60*30,note:t!=null&&t.price_asof?`closes through ${t.price_asof}`:""},{key:"filings",label:"SEC financials",stale:60*8,note:n?`${n.with_financials} of ${n.stocks} companies read`:""},{key:"analysts",label:"Analyst consensus",stale:60*24*8,note:n?`${n.with_analysts} of ${n.stocks} covered`:""},{key:"score",label:"Compass scores",stale:30,note:n?`${n.scored} of ${n.stocks} scored`:""},{key:"agent",label:"Analyst agent",stale:60*26,note:n?`${n.briefs} briefs: ${o} by AI, ${n.briefs-o} by rules`:""},{key:"live",label:"Live prices",stale:10,note:t!=null&&t.live_prices?"on: refreshed every minute in market hours":"off (COMPASS_LIVE=0)"}];return a.jsxs("section",{className:"pb-panel",style:{marginTop:18},children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsx("span",{children:"Second crawler: Korvus Compass"}),a.jsxs("span",{className:`pb-live ${s?"on":t!=null&&t.configured?"off":"unset"}`,children:[a.jsx("i",{}),s?`LIVE · heartbeat ${Math.round((t==null?void 0:t.heartbeat_age_s)||0)}s ago`:t!=null&&t.configured?t!=null&&t.error?`OFFLINE · ${t.error}`:"OFFLINE":"LIVE LINK NOT SET"]})]}),a.jsxs("p",{className:"pb-cmp-lede",children:["Follows every S&P 500 and Nasdaq-100 company",n!=null&&n.international?`, plus ${n.international} foreign companies from ${Math.max(0,(n.countries||1)-1)} other countries,`:""," for the long-term board on Korvus: prices, SEC financials, analyst consensus and a 0 to 100 score. Its analyst agent writes the brief on every stock page. It shares the SEC request budget (",(t==null?void 0:t.sec_rps)??4,"/s here) and the vault with the Intel crawler above."]}),a.jsxs("div",{className:"pb-stats",children:[a.jsxs("div",{children:[a.jsx("span",{children:"Stocks"}),a.jsx("b",{children:(n==null?void 0:n.stocks)??"n/a"}),a.jsx("em",{children:n?`+ ${n.funds} index funds`:""})]}),a.jsxs("div",{children:[a.jsx("span",{children:"Scored"}),a.jsx("b",{children:(n==null?void 0:n.scored)??"n/a"}),a.jsx("em",{children:n?`${n.top_rated} top rated`:""})]}),a.jsxs("div",{children:[a.jsx("span",{children:"Bullish reads"}),a.jsx("b",{className:"pos",children:(n==null?void 0:n.bullish)??"n/a"}),a.jsx("em",{children:"strong score, trend holding"})]}),a.jsxs("div",{children:[a.jsx("span",{children:"Bearish reads"}),a.jsx("b",{className:"neg",children:(n==null?void 0:n.bearish)??"n/a"}),a.jsx("em",{children:"weak score or downtrend"})]}),a.jsxs("div",{children:[a.jsx("span",{children:"Pages written"}),a.jsx("b",{children:(n==null?void 0:n.briefs)??"n/a"}),a.jsx("em",{children:n?`${o} by the AI analyst`:""})]}),a.jsxs("div",{children:[a.jsx("span",{children:"Updates, 24h"}),a.jsx("b",{children:(n==null?void 0:n.updates_24h)??"n/a"}),a.jsx("em",{children:"filings, trend turns, tier moves"})]})]}),a.jsxs("div",{className:"pb-grid-2",children:[a.jsxs("div",{children:[a.jsx("div",{className:"pb-panel-h",children:a.jsx("span",{children:"Crawler jobs"})}),a.jsx("div",{className:"pb-checks",children:l.map(p=>{var h,m;return a.jsxs("div",{className:"pb-check",children:[a.jsx("i",{className:`pb-dot ${p.key==="live"&&!(t!=null&&t.live_prices)?"idle":r(p.key,p.stale)}`}),a.jsx("span",{className:"pb-check-l",children:p.label}),a.jsx("span",{className:"pb-check-n",children:(h=i[p.key])!=null&&h.error?String(i[p.key].error):p.key==="live"&&!(t!=null&&t.live_prices)?p.note:[(m=i[p.key])!=null&&m.at?js(i[p.key].at,e):"not run yet",p.note].filter(Boolean).join(" · ")})]},p.key)})})]}),a.jsxs("div",{children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsx("span",{children:"Latest Compass updates"}),a.jsx("span",{className:"pb-dim",children:(c=t==null?void 0:t.events)!=null&&c.length?`${t.events.length} latest`:""})]}),(u=t==null?void 0:t.events)!=null&&u.length?a.jsx("div",{className:"pb-feed",children:t.events.map((p,h)=>a.jsxs("div",{className:`pb-ev ${p.tone==="bear"?"error":""}`,children:[a.jsx("span",{className:"pb-ev-t",children:cn(p.ts_utc,!1)}),a.jsx("span",{className:`pb-ev-s s-${p.kind==="filing"?"edgar":p.kind==="tier"?"scoring":"bot"}`,children:p.kind.toUpperCase().slice(0,7)}),a.jsx("span",{className:"pb-ev-m",title:p.detail||"",children:p.title})]},p.ts_utc+p.symbol+h))}):a.jsx("div",{className:"pb-dim",style:{padding:"10px 0"},children:s?"Nothing has changed yet. New filings, trend turns and tier moves land here.":"Waiting for the Compass crawler."}),(d=t==null?void 0:t.top)!=null&&d.length?a.jsxs(a.Fragment,{children:[a.jsx("div",{className:"pb-panel-h",style:{marginTop:14},children:a.jsx("span",{children:"Top of the board"})}),t.top.slice(0,5).map(p=>a.jsxs("div",{className:"pb-row",children:[a.jsx("span",{className:"pb-row-t",children:p.tier}),a.jsx("span",{className:"pb-sym",children:p.symbol}),a.jsxs("span",{className:"pb-row-m",children:[p.name," ",a.jsxs("span",{className:"pb-dim",children:["· ",p.trend]})]}),a.jsx("span",{className:"pb-row-v",children:Math.round(p.score)})]},p.symbol))]}):null]})]})]})},zb=()=>{var G,H,X,J,ve,Ie,Qe,re,fe;const[t,e]=Y.useState(null),[n,i]=Y.useState(null),[s,r]=Y.useState(null),[o,l]=Y.useState(null),[c,u]=Y.useState(!1),[d,p]=Y.useState(Date.now()),[h,m]=Y.useState(()=>{try{return window.localStorage.getItem("pb.view")||"overview"}catch{return"overview"}}),v=E=>{m(E);try{window.localStorage.setItem("pb.view",E)}catch{}},w=Y.useRef({}),x=Y.useRef(new Set);Y.useEffect(()=>{const E=()=>Dw().then(De=>{e(De),u(!0)}),F=()=>Iw().then(De=>{i(De);const Pe=x.current.size===0;for(const ut of(De==null?void 0:De.events)||[]){const st=ut.t+ut.msg;x.current.has(st)||(x.current.add(st),Pe||(w.current[ut.stage==="quotes"?"bot":ut.stage]=Date.now()))}}),ee=()=>Fw().then(l),ue=()=>kw().then(r);E(),F(),ee(),ue();const ce=setInterval(E,6e4),qe=setInterval(F,5e3),Ge=setInterval(()=>p(Date.now()),1e3),Le=setInterval(ee,3e4),Ae=setInterval(ue,15e3);return()=>{clearInterval(ce),clearInterval(qe),clearInterval(Ge),clearInterval(Le),clearInterval(Ae)}},[]);const f=(n==null?void 0:n.stages)||{},g=(G=t==null?void 0:t.board)==null?void 0:G.scoreboard,S=(H=t==null?void 0:t.board)==null?void 0:H.rules;(X=t==null?void 0:t.board)==null||X.min_sample;const y=!!(n!=null&&n.configured&&(n!=null&&n.reachable)&&(n!=null&&n.running)),b=Y.useMemo(()=>{var Pe,ut,st,Ut,bt;const E=f.universe||{},F=f.edgar||{},ee=f.scoring||{},ue=f.bot||{},ce=f.vault||{},qe=fs(E.last_ok_utc,d),Ge=fs(F.last_poll_utc,d),Le=Number(F.interval_s)||20;let Ae;if(F.next_poll_utc){const gt=(new Date(F.next_poll_utc).getTime()-d)/1e3;Ae=Math.min(1,Math.max(0,1-gt/Le))}const De=gt=>gt.last_error_utc&&fs(gt.last_error_utc,d)<3600&&(!gt.last_ok_utc||new Date(gt.last_error_utc)>new Date(gt.last_ok_utc));return[{key:"universe",stage:"universe",title:"Screener",metric:`${Fn(E.count??((Pe=t==null?void 0:t.board)==null?void 0:Pe.universe_count))} stocks`,detail:`$${((ut=E.band)==null?void 0:ut[0])??((st=S==null?void 0:S.price_band)==null?void 0:st[0])??80}-$${((Ut=E.band)==null?void 0:Ut[1])??((bt=S==null?void 0:S.price_band)==null?void 0:bt[1])??120} · ${js(E.last_ok_utc,d)}`,health:n!=null&&n.running?qe<26*3600?"ok":qe<50*3600?"warn":"bad":"idle"},{key:"edgar",stage:"edgar",title:"EDGAR watch",metric:`${Fn(F.scanned_today)} scanned`,detail:F.open?`every ${Le}s · polled ${js(F.last_poll_utc,d)}`:`EDGAR closed · polled ${js(F.last_poll_utc,d)}`,health:n!=null&&n.running?Ge<Le*3+10?F.feeds_ok<F.feeds?"warn":"ok":"bad":"idle",ring:n!=null&&n.running?Ae:void 0},{key:"scoring",stage:"scoring",title:ee.mode==="crown"?"Crown read":ee.mode==="shadow"?"Haiku + Crown":"Haiku read",metric:`${Fn(ee.scored_today)} scored today`,detail:ee.last_symbol?`${ee.last_symbol}: ${ee.last_result}`:"waiting for a filing",health:n!=null&&n.running?De(ee)?"bad":ee.last_ok_utc?"ok":"idle":"idle"},{key:"bot",stage:"bot",title:"Paper bot",metric:`${Fn(ue.open_positions??(g==null?void 0:g.open_trades))} open`,detail:(ue.session_open?ue.in_window?`hunting · ${Fn(ue.candidates)} candidate(s)`:"managing exits only":ue.phase==="maintenance"?"maintenance hour (5 to 6 PM ET), resting":ue.phase==="weekend"?"weekend, resting until Sunday 6 PM ET":"market closed, resting")+(ue.session_open&&ue.phase&&ue.phase!=="regular"?` · ${jb[ue.phase]||ue.phase}`:"")+` · ${Fn(ue.entries_today)} in today`,health:n!=null&&n.running&&ue.session_open?fs(ue.last_tick_utc,d)<180?"ok":"bad":"idle"},{key:"vault",stage:"vault",title:"Obsidian vault",metric:`${Fn(ce.pushes_today)} push(es) today`,detail:`synced ${js(ce.last_sync_utc,d)}`,health:n!=null&&n.running?De(ce)?"bad":fs(ce.last_sync_utc,d)<25*60?"ok":fs(ce.last_sync_utc,d)<3600?"warn":"bad":"idle"}]},[f,d,n,t,g,S]),T=Y.useMemo(()=>{const E=f.edgar||{},F=f.quotes||{},ee=f.crown||{},ue=f.scoring||{},ce=[];if(!n||!n.configured)ce.push({label:"Live link to Korvus",h:"warn",note:"add KORVUS_INTEL_KEY to this admin's .env"});else if(!n.reachable)ce.push({label:"Live link to Korvus",h:"bad",note:n.error||"unreachable"});else{if(ce.push({label:"Crawler process",h:n.running?"ok":"bad",note:n.running?`heartbeat ${Math.round(n.heartbeat_age_s||0)}s ago · up since ${cn(n.started_utc)}`:`no heartbeat for ${Math.round(n.heartbeat_age_s||0)}s`}),ce.push({label:"EDGAR feeds answering",h:E.feeds?E.feeds_ok===E.feeds?"ok":"warn":"idle",note:E.feeds?`${E.feeds_ok}/${E.feeds} feeds · last poll ${E.last_duration_ms??"?"}ms`:"no poll yet"}),ce.push({label:"Filings matched today",h:"idle",note:`${Fn(E.new_today)} new from the universe · ${Fn(E.polls_today)} polls`}),ue.mode&&ue.mode!=="haiku"){const qe=ee.last_error_utc&&fs(ee.last_error_utc,d)<3600&&(!ee.last_ok_utc||new Date(ee.last_error_utc)>new Date(ee.last_ok_utc));ce.push({label:`Crown link (${ue.mode})`,h:ue.crown_configured?qe?"bad":ee.last_ok_utc?"ok":"idle":"bad",note:ue.crown_configured?qe?String(ee.last_error):ee.last_ok_utc?`${ue.crown_model||ee.model||"model"} · ${Fn(ee.reads_today)} reads today · last ${Math.round((ee.last_ms||0)/1e3)}s ${js(ee.last_ok_utc,d)}`:"linked, waiting for a filing":"set OPENROUTER_API_KEY and CROWN_MODEL on the Korvus box"}),ue.mode==="shadow"&&ce.push({label:"Crown vs Haiku",h:"idle",note:ee.compared_today?`agreed on ${ee.agree_today} of ${ee.compared_today} today (impact + direction)`:"no side-by-side reads yet today"})}ce.push({label:"Price quotes",h:F.last_error_utc&&fs(F.last_error_utc,d)<3600?"warn":F.last_ok_utc?"ok":"idle",note:F.last_ok_utc?`${Fn(F.calls_today)} today · last ${F.last_symbol} ${js(F.last_ok_utc,d)}`:"none needed yet"})}return ce.push({label:"Vault copy on this box",h:t!=null&&t.configured?"ok":"warn",note:t!=null&&t.configured?`intel/ present · files changed ${js(t.dataMtime,d)}`:"intel/ not pulled yet"}),ce},[f,n,t,d]),N=Y.useMemo(()=>{const E=g,F=(E==null?void 0:E.closed_trades)??0,ee=(E==null?void 0:E.avg_win_pct)??0,ue=Math.abs((E==null?void 0:E.avg_loss_pct)??0),ce=ee+ue>0?ue/(ee+ue)*100:null,qe=F>=30,Ge=(Le,Ae,De,Pe,ut,st=!1)=>({label:Le,val:Ae,ok:st?De&&qe:De,prog:Math.max(0,Math.min(1,st&&!qe?Math.min(Pe,F/30):Pe)),note:st&&!qe?`${ut} (counts from 30 trades)`:ut});return[Ge("Closed trades",`${F} / 100`,F>=100,F/100,"enough trades that luck washes out"),Ge("Trading days",`${(E==null?void 0:E.trading_days)??0} / 40`,((E==null?void 0:E.trading_days)??0)>=40,((E==null?void 0:E.trading_days)??0)/40,"about two months of different market moods"),Ge("Expectancy per trade",Bn(E==null?void 0:E.expectancy_pct),((E==null?void 0:E.expectancy_pct)??-1)>=.1,(((E==null?void 0:E.expectancy_pct)??0)+.1)/.2,"at least +0.10% after modeled slippage",!0),Ge("Recent form (last 30)",Bn(E==null?void 0:E.last30_expectancy_pct),((E==null?void 0:E.last30_expectancy_pct)??-1)>0&&F>=30,F>=30?1:F/30,"still working lately, not just early luck",!0),Ge("Profit factor",E!=null&&E.profit_factor?String(E.profit_factor):"n/a",((E==null?void 0:E.profit_factor)??0)>=1.3,((E==null?void 0:E.profit_factor)??0)/1.3,"gross wins at least 1.3x gross losses",!0),Ge("Max drawdown",(E==null?void 0:E.max_drawdown_pct)!==void 0&&(E==null?void 0:E.max_drawdown_pct)!==null?`${E.max_drawdown_pct}%`:"n/a",F>0&&((E==null?void 0:E.max_drawdown_pct)??100)<=5,F>0?1-((E==null?void 0:E.max_drawdown_pct)??0)/10:0,`no worse than 5% of $${Fn((E==null?void 0:E.capital_at_work)??5e4)} at work`,!0),Ge("Win rate vs break-even",(E==null?void 0:E.win_rate_pct)!==null&&(E==null?void 0:E.win_rate_pct)!==void 0&&ce!==null?`${E.win_rate_pct}% vs ${ce.toFixed(0)}%`:"n/a",ce!==null&&((E==null?void 0:E.win_rate_pct)??0)>ce+5,ce!==null?((E==null?void 0:E.win_rate_pct)??0)/(ce+5):0,"comfortably above what the win/loss sizes need",!0)]},[g]),_=N.filter(E=>E.ok).length,C=_===N.length,R=((n==null?void 0:n.events)||[]).slice().reverse().slice(0,40),k=f.bot||{},B=Array.isArray(k.watch)?k.watch.filter(E=>E.state==="confirming"||E.state==="waiting").length:0,D=(o==null?void 0:o.markets)||[],P=Y.useMemo(()=>{const E=D.reduce((Le,Ae)=>{var De;return Le+(((De=Ae.all)==null?void 0:De.trades)||0)},0),F=D.reduce((Le,Ae)=>{var De;return Le+(((De=Ae.all)==null?void 0:De.wins)||0)},0),ee=D.reduce((Le,Ae)=>{var De;return Le+(((De=Ae.all)==null?void 0:De.pnl)||0)},0),ue=D.filter(Le=>{var Ae;return((Ae=Le.all)==null?void 0:Ae.avg_hold_min)!=null&&Le.all.trades}),ce=ue.length?ue.reduce((Le,Ae)=>Le+Ae.all.avg_hold_min*Ae.all.trades,0)/ue.reduce((Le,Ae)=>Le+Ae.all.trades,0):null,qe=D.flatMap(Le=>(Le.equity||[]).map((Ae,De,Pe)=>({t:Ae.t,d:Ae.v-(De?Pe[De-1].v:0)}))).sort((Le,Ae)=>Le.t.localeCompare(Ae.t));let Ge=0;return{trades:E,wins:F,pnl:ee,hold:ce,open:D.reduce((Le,Ae)=>Le+(Ae.open||[]).length,0),curve:qe.map(Le=>Ge+=Le.d)}},[D]),j=F_(o),Q=y?k.session_open?k.in_window?"in an entry window":"managing exits only":"market closed":"crawler offline",W=[{id:"overview",label:"Overview"},{id:"stocks",label:"Company stock",note:g?`${g.closed_trades} trades`:void 0},{id:"futures",label:"Index futures",note:D.length?`${P.trades} trades`:void 0},{id:"crawler",label:"Crawler",note:y?"live":"offline"}];return a.jsxs("div",{className:"pb",children:[a.jsxs("div",{className:"page-head pb-head",children:[a.jsxs("div",{children:[a.jsx("span",{className:"eyebrow",children:"Paper Bot"}),a.jsx("h1",{children:"Korvus Intel"}),a.jsx("p",{children:"Two paper books, one standard. Company stock is traded on the filings the crawler reads: a scalp when the filing is minutes old, a swing inside the day otherwise. Index futures are swing trades inside the day, never scalps. No broker, no real money, until it earns it."})]}),a.jsxs("div",{className:"pb-head-right",children:[a.jsxs("span",{className:`pb-live ${y?"on":n!=null&&n.configured?"off":"unset"}`,children:[a.jsx("i",{}),y?"CRAWLER LIVE":n!=null&&n.configured?"CRAWLER OFFLINE":"LIVE LINK NOT SET"]}),a.jsxs("span",{className:`pb-live ${s!=null&&s.running?"on":s!=null&&s.configured?"off":"unset"}`,children:[a.jsx("i",{}),s!=null&&s.running?"COMPASS LIVE":s!=null&&s.configured?"COMPASS OFFLINE":"COMPASS NOT SET"]}),a.jsx("span",{className:"pb-paper",children:"PAPER ONLY"})]})]}),c?a.jsxs(a.Fragment,{children:[a.jsx(k_,{value:h,onChange:v,options:W}),h==="overview"?a.jsxs("div",{className:"bk",children:[a.jsxs("div",{className:"bk-books",children:[a.jsxs("button",{className:"bk-book",onClick:()=>v("stocks"),children:[a.jsxs("div",{className:"bk-book-top",children:[a.jsx("span",{className:"bk-book-k",children:"Company stock"}),a.jsx("span",{className:"pb-tag bk-pb",children:(g==null?void 0:g.strategy)||(S==null?void 0:S.strategy)||"no rules yet"})]}),a.jsx("h3",{children:"Catalyst bot"}),a.jsx("p",{children:"Scalps a filing the crawler just read. Swings the rest inside the day. Flat by the close."}),a.jsxs("div",{className:"bk-book-main",children:[a.jsxs("div",{children:[a.jsx("strong",{className:jt(g==null?void 0:g.paper_pnl),children:Mt((g==null?void 0:g.paper_pnl)??0)}),a.jsx("span",{children:"paper P&L under these rules"})]}),a.jsx(ef,{pts:((t==null?void 0:t.equity)||[]).map(E=>E.v)})]}),a.jsxs("div",{className:"bk-book-stats",children:[a.jsxs("div",{children:[a.jsx("b",{children:(g==null?void 0:g.closed_trades)??0}),a.jsx("span",{children:"closed trades"})]}),a.jsxs("div",{children:[a.jsx("b",{children:(g==null?void 0:g.win_rate_pct)!=null?`${g.win_rate_pct}%`:"n/a"}),a.jsx("span",{children:"winners"})]}),a.jsxs("div",{children:[a.jsx("b",{className:jt((g==null?void 0:g.expectancy_r)??(g==null?void 0:g.expectancy_pct)),children:(g==null?void 0:g.expectancy_r)!=null?hu(g.expectancy_r):Bn(g==null?void 0:g.expectancy_pct)}),a.jsx("span",{children:"per trade"})]}),a.jsxs("div",{children:[a.jsx("b",{children:ui(g==null?void 0:g.avg_hold_min)}),a.jsx("span",{children:"average hold"})]})]}),a.jsxs("div",{className:"bk-book-foot",children:[a.jsx("i",{className:`pb-dot ${y?"ok":"bad"}`}),Q," · ",Fn(k.open_positions??(g==null?void 0:g.open_trades)??0)," open · ",B," on the radar",(J=t==null?void 0:t.retired)!=null&&J.length?` · ${t.retired.reduce((E,F)=>E+F.trades,0)} earlier trades under retired rules`:""]})]}),a.jsxs("button",{className:"bk-book",onClick:()=>v("futures"),children:[a.jsxs("div",{className:"bk-book-top",children:[a.jsx("span",{className:"bk-book-k",children:"Index futures"}),a.jsx("span",{className:"pb-tag bk-pb",children:(o==null?void 0:o.rules)||"first-generation rules"})]}),a.jsx("h3",{children:"Strategy lab"}),a.jsx("p",{children:"MNQ and MES, run as a quant desk would. Rule sets are replayed on stored tape before they trade, every trade is sized by risk, and each one is kept or retired on its statistics. Intraday swings only."}),a.jsxs("div",{className:"bk-book-main",children:[a.jsxs("div",{children:[a.jsx("strong",{className:jt(P.pnl),children:Mt(P.pnl)}),a.jsx("span",{children:"paper P&L, every strategy, after costs"})]}),a.jsx(ef,{pts:P.curve})]}),a.jsxs("div",{className:"bk-book-stats",children:[a.jsxs("div",{children:[a.jsx("b",{children:P.trades}),a.jsx("span",{children:"closed trades"})]}),a.jsxs("div",{children:[a.jsx("b",{children:P.trades?`${Math.round(P.wins/P.trades*100)}%`:"n/a"}),a.jsx("span",{children:"winners"})]}),a.jsxs("div",{children:[a.jsx("b",{className:jt(P.pnl),children:P.trades?Mt(P.pnl/P.trades):"n/a"}),a.jsx("span",{children:"per trade"})]}),a.jsxs("div",{children:[a.jsx("b",{children:ui(P.hold)}),a.jsx("span",{children:"average hold"})]})]}),a.jsxs("div",{className:"bk-book-foot",children:[a.jsx("i",{className:`pb-dot ${j.ok?"ok":"warn"}`}),D.length?D.map(E=>`${E.sym} ${E.champion?`champion ${E.champion}`:"no champion yet"}`).join(" · ")+` · ${P.open} open`:j.text]})]})]}),a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsx("span",{children:"How each book trades"}),a.jsx("span",{className:"pb-dim",children:"the house style"})]}),a.jsxs("div",{className:"bk-style",children:[a.jsxs("div",{children:[a.jsx("em",{children:"Company stock · scalp"}),a.jsx("p",{children:((Ie=(ve=S==null?void 0:S.lines)==null?void 0:ve.find(E=>/scalp/i.test(E.k)))==null?void 0:Ie.v)||"Allowed only on company stock, on a high-impact filing the crawler read minutes ago. In and out inside 45 minutes."})]}),a.jsxs("div",{children:[a.jsx("em",{children:"Company stock · day swing"}),a.jsx("p",{children:((re=(Qe=S==null?void 0:S.lines)==null?void 0:Qe.find(E=>/swing/i.test(E.k)))==null?void 0:re.v)||"The main book. Enters after the opening range has formed, sizes the stop to the stock's own range, and is flat before the close."})]}),a.jsxs("div",{children:[a.jsx("em",{children:"Index futures · swing only"}),a.jsx("p",{children:o!=null&&o.style?`No scalping. Targets and stops are measured in ${o.style.unit}, holds run from ${ui(o.style.min_hold_cap_min)} up to six hours, each strategy takes at most ${o.style.max_trades_day} trades a day, nothing new after ${o.style.last_entry_et} ET and always flat by ${o.style.flat_et} ET.`:"No scalping. Every strategy is built to hold for an hour or more and is always flat before the 5 PM ET maintenance hour."})]})]})]}),a.jsxs("section",{className:"pb-panel pb-path",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsx("span",{children:"Path to real money · company stock book"}),a.jsxs("span",{className:C?"pb-pass":"pb-dim",children:[_,"/",N.length," gates passed"]})]}),a.jsx("div",{className:"pb-steps",children:[["Paper","Simulated fills on live data. Rules frozen while the sample builds.",!0],["Broker paper","Same rules routed to a broker's paper account for about 4 weeks, to compare real order handling against our fills.",!1],["Live pilot","Real money, tiny size: one small position at a time, a hard daily loss stop, a kill switch, and your approval on each order.",!1],["Scale","Size goes up in steps only while live results keep matching paper.",!1]].map(([E,F,ee],ue)=>a.jsxs("div",{className:`pb-step${ee?" cur":""}`,children:[a.jsx("span",{className:"pb-step-n",children:ue+1}),a.jsxs("div",{children:[a.jsx("b",{children:E}),ee?a.jsx("em",{children:"you are here"}):null,a.jsx("p",{children:F})]})]},String(E)))}),a.jsx("div",{className:"pb-gates",children:N.map(E=>a.jsxs("div",{className:`pb-gate${E.ok?" ok":""}`,children:[a.jsxs("div",{className:"pb-gate-top",children:[a.jsxs("span",{children:[E.ok?"✓":"○"," ",E.label]}),a.jsx("b",{children:E.val})]}),a.jsx("span",{className:"pb-bar",children:a.jsx("i",{style:{width:`${E.prog*100}%`}})}),a.jsx("em",{children:E.note})]},E.label))}),a.jsx("p",{className:"pb-fine",children:"Stage 2 unlocks when every gate passes on the same rule version. Changing a rule starts a fresh scoreboard. The futures lab earns its own path the same way: a champion has to hold up after it is crowned. Passing the gates is evidence, not a guarantee. Markets change, and paper fills are kinder than real ones. Paper results are simulated and are not a promise of returns."})]})]}):null,h==="stocks"?t!=null&&t.configured?a.jsx(Ub,{data:t,live:n}):a.jsxs("div",{className:"notice",style:{marginTop:18},children:[a.jsx("div",{className:"notice-h",children:"Waiting for intel/ to arrive on this box"}),a.jsxs("p",{children:["Looking in ",a.jsx("code",{children:t==null?void 0:t.dir}),". It appears after the next brain sync. If the brain lives elsewhere, set INTEL_DIR in .env."]})]}):null,h==="futures"?a.jsx(Pb,{d:o}):null,h==="crawler"?a.jsxs("div",{className:"bk",children:[a.jsxs("section",{className:"pb-panel pb-hero",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsx("span",{children:"The crawler, live"}),a.jsx("span",{className:"pb-dim",children:y?`heartbeat ${Math.round((n==null?void 0:n.heartbeat_age_s)||0)}s ago`:"status updates every 5s"})]}),a.jsx(Fb,{nodes:b,hits:w.current,now:d,live:y})]}),a.jsxs("div",{className:"bk-grid",children:[a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsx("span",{children:"Activity"}),a.jsx("span",{className:"pb-dim",children:R.length?`${R.length} latest`:""})]}),R.length?a.jsx("div",{className:"pb-feed",children:R.map(E=>a.jsxs("div",{className:`pb-ev ${E.level}`,children:[a.jsx("span",{className:"pb-ev-t",children:cn(E.t,!1)}),a.jsx("span",{className:`pb-ev-s s-${E.stage}`,children:Ob[E.stage]||E.stage.toUpperCase()}),a.jsx("span",{className:"pb-ev-m",title:E.msg,children:E.msg})]},E.t+E.msg))}):a.jsx(li,{children:n!=null&&n.configured?"No activity reported yet.":"Connect the live link to watch the crawler work in real time."})]}),a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsx("span",{children:"Health checks"}),a.jsxs("span",{className:"pb-dim",children:[[...b.map(E=>E.health),...T.map(E=>E.h)].filter(E=>E==="ok").length,"/",[...b.map(E=>E.health),...T.map(E=>E.h)].filter(E=>E!=="idle").length," passing"]})]}),a.jsxs("div",{className:"pb-checks",children:[b.map(E=>a.jsxs("div",{className:"pb-check",children:[a.jsx("span",{className:`pb-dot ${E.health}`}),a.jsx("span",{className:"pb-check-l",children:E.title}),a.jsx("span",{className:"pb-check-n",children:E.detail})]},"n"+E.key)),T.map(E=>a.jsxs("div",{className:"pb-check",children:[a.jsx("span",{className:`pb-dot ${E.h}`}),a.jsx("span",{className:"pb-check-l",children:E.label}),a.jsx("span",{className:"pb-check-n",children:E.note})]},E.label))]})]})]}),a.jsxs("section",{className:"pb-panel",children:[a.jsxs("div",{className:"pb-panel-h",children:[a.jsx("span",{children:"Latest scored filings"}),a.jsxs("span",{className:"pb-dim",children:[(t==null?void 0:t.filingsToday)??0," seen today"]})]}),(fe=t==null?void 0:t.filings)!=null&&fe.length?t.filings.map(E=>a.jsxs("div",{className:"bk-filing",children:[a.jsxs("div",{className:"bk-filing-top",children:[a.jsx("span",{className:"pb-row-t",children:cn(E.seen_utc)}),a.jsx("span",{className:"bk-sym",children:E.symbol}),a.jsx("span",{className:`pb-tag imp-${E.impact}`,children:E.impact}),a.jsxs("span",{className:`pb-tag dir-${E.direction}`,children:[E.direction," ",E.confidence,"%"]}),a.jsx("span",{className:"pb-tag",children:String(E.catalyst||"other").replace(/_/g," ")}),a.jsx("a",{href:E.url,target:"_blank",rel:"noopener noreferrer",children:E.headline})]}),a.jsx("p",{children:E.summary})]},E.url+E.seen_utc)):a.jsx(li,{children:"No scored filings yet."})]}),a.jsx(Bb,{c:s,now:d})]}):null]}):a.jsx("div",{className:"soon-panel",children:"Loading the scoreboard..."})]})};/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Wp="186",ka={ROTATE:0,DOLLY:1,PAN:2},Ta={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Hb=0,Wg=1,Vb=2,Ic=1,Gb=2,No=3,Ir=0,Qn=1,Cn=2,ns=0,jo=1,en=2,$g=3,Xg=4,Wb=5,fa=100,$b=101,Xb=102,Yb=103,qb=104,Kb=200,Zb=201,Qb=202,Jb=203,O_=204,j_=205,eE=206,tE=207,nE=208,iE=209,sE=210,rE=211,aE=212,oE=213,lE=214,nf=0,sf=1,rf=2,rl=3,af=4,of=5,lf=6,cf=7,B_=0,cE=1,uE=2,is=0,$p=1,Xp=2,Yp=3,Hu=4,qp=5,Kp=6,Zp=7,z_=300,Ur=301,Ga=302,Md=303,wd=304,Vu=306,fu=1e3,Qi=1001,uf=1002,_n=1003,dE=1004,zl=1005,yn=1006,bd=1007,Er=1008,Si=1009,H_=1010,V_=1011,al=1012,Qp=1013,ss=1014,Oi=1015,Hn=1016,Jp=1017,em=1018,ol=1020,G_=35902,W_=35899,$_=1021,X_=1022,bi=1023,Ns=1026,Tr=1027,tm=1028,nm=1029,Fr=1030,im=1031,sm=1033,Uc=33776,Fc=33777,Oc=33778,jc=33779,df=35840,hf=35841,ff=35842,pf=35843,mf=36196,gf=37492,vf=37496,xf=37488,_f=37489,pu=37490,yf=37491,Sf=37808,Mf=37809,wf=37810,bf=37811,Ef=37812,Tf=37813,Af=37814,Nf=37815,Cf=37816,Rf=37817,Pf=37818,Lf=37819,Df=37820,kf=37821,If=36492,Uf=36494,Ff=36495,Of=36283,jf=36284,mu=36285,Bf=36286,hE=3200,Yg=0,fE=1,$s="",$n="srgb",gu="srgb-linear",vu="linear",Tt="srgb",Ed=7680,pE=519,mE=512,gE=513,vE=514,rm=515,xE=516,_E=517,am=518,yE=519,Y_=35044,qg="300 es",Ji=2e3,xu=2001;function SE(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function _u(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function ME(){const t=_u("canvas");return t.style.display="block",t}const Kg={};function yu(...t){const e="THREE."+t.shift();console.log(e,...t)}function q_(t){const e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){const n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function Ke(...t){t=q_(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function mt(...t){t=q_(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function Ia(...t){const e=t.join(" ");e in Kg||(Kg[e]=!0,Ke(...t))}function wE(t,e,n){return new Promise(function(i,s){function r(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:s();break;case t.TIMEOUT_EXPIRED:setTimeout(r,n);break;default:i()}}setTimeout(r,n)})}const bE={[nf]:sf,[rf]:lf,[af]:cf,[rl]:of,[sf]:nf,[lf]:rf,[cf]:af,[of]:rl};class cr{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(n);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const n=this._listeners;if(n===void 0)return;const i=n[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Zg=1234567;const Bo=Math.PI/180,ll=180/Math.PI;function Ms(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Tn[t&255]+Tn[t>>8&255]+Tn[t>>16&255]+Tn[t>>24&255]+"-"+Tn[e&255]+Tn[e>>8&255]+"-"+Tn[e>>16&15|64]+Tn[e>>24&255]+"-"+Tn[n&63|128]+Tn[n>>8&255]+"-"+Tn[n>>16&255]+Tn[n>>24&255]+Tn[i&255]+Tn[i>>8&255]+Tn[i>>16&255]+Tn[i>>24&255]).toLowerCase()}function lt(t,e,n){return Math.max(e,Math.min(n,t))}function om(t,e){return(t%e+e)%e}function EE(t,e,n,i,s){return i+(t-e)*(s-i)/(n-e)}function TE(t,e,n){return t!==e?(n-t)/(e-t):0}function zo(t,e,n){return(1-n)*t+n*e}function AE(t,e,n,i){return zo(t,e,1-Math.exp(-n*i))}function NE(t,e=1){return e-Math.abs(om(t,e*2)-e)}function CE(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function RE(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function PE(t,e){return t+Math.floor(Math.random()*(e-t+1))}function LE(t,e){return t+Math.random()*(e-t)}function DE(t){return t*(.5-Math.random())}function kE(t){t!==void 0&&(Zg=t);let e=Zg+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function IE(t){return t*Bo}function UE(t){return t*ll}function FE(t){return t>0&&Number.isInteger(t)&&2**Math.round(Math.log2(t))===t}function OE(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function jE(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function BE(t,e,n,i,s){const r=Math.cos,o=Math.sin,l=r(n/2),c=o(n/2),u=r((e+i)/2),d=o((e+i)/2),p=r((e-i)/2),h=o((e-i)/2),m=r((i-e)/2),v=o((i-e)/2);switch(s){case"XYX":t.set(l*d,c*p,c*h,l*u);break;case"YZY":t.set(c*h,l*d,c*p,l*u);break;case"ZXZ":t.set(c*p,c*h,l*d,l*u);break;case"XZX":t.set(l*d,c*v,c*m,l*u);break;case"YXY":t.set(c*m,l*d,c*v,l*u);break;case"ZYZ":t.set(c*v,c*m,l*d,l*u);break;default:Ke("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Fi(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:case Uint8ClampedArray:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ct(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const zf={DEG2RAD:Bo,RAD2DEG:ll,generateUUID:Ms,clamp:lt,euclideanModulo:om,mapLinear:EE,inverseLerp:TE,lerp:zo,damp:AE,pingpong:NE,smoothstep:CE,smootherstep:RE,randInt:PE,randFloat:LE,randFloatSpread:DE,seededRandom:kE,degToRad:IE,radToDeg:UE,isPowerOfTwo:FE,ceilPowerOfTwo:OE,floorPowerOfTwo:jE,setQuaternionFromProperEuler:BE,normalize:Ct,denormalize:Fi},xm=class xm{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6],this.y=s[1]*n+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=lt(this.x,e.x,n.x),this.y=lt(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=lt(this.x,e,n),this.y=lt(this.y,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(lt(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(lt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),s=Math.sin(n),r=this.x-e.x,o=this.y-e.y;return this.x=r*i-o*s+e.x,this.y=r*s+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};xm.prototype.isVector2=!0;let Ue=xm;class rr{constructor(e=0,n=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=s}static slerpFlat(e,n,i,s,r,o,l){let c=i[s+0],u=i[s+1],d=i[s+2],p=i[s+3],h=r[o+0],m=r[o+1],v=r[o+2],w=r[o+3];if(p!==w||c!==h||u!==m||d!==v){let x=c*h+u*m+d*v+p*w;x<0&&(h=-h,m=-m,v=-v,w=-w,x=-x);let f=1-l;if(x<.9995){const g=Math.acos(x),S=Math.sin(g);f=Math.sin(f*g)/S,l=Math.sin(l*g)/S,c=c*f+h*l,u=u*f+m*l,d=d*f+v*l,p=p*f+w*l}else{c=c*f+h*l,u=u*f+m*l,d=d*f+v*l,p=p*f+w*l;const g=1/Math.sqrt(c*c+u*u+d*d+p*p);c*=g,u*=g,d*=g,p*=g}}e[n]=c,e[n+1]=u,e[n+2]=d,e[n+3]=p}static multiplyQuaternionsFlat(e,n,i,s,r,o){const l=i[s],c=i[s+1],u=i[s+2],d=i[s+3],p=r[o],h=r[o+1],m=r[o+2],v=r[o+3];return e[n]=l*v+d*p+c*m-u*h,e[n+1]=c*v+d*h+u*p-l*m,e[n+2]=u*v+d*m+l*h-c*p,e[n+3]=d*v-l*p-c*h-u*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,s){return this._x=e,this._y=n,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,s=e._y,r=e._z,o=e._order,l=Math.cos,c=Math.sin,u=l(i/2),d=l(s/2),p=l(r/2),h=c(i/2),m=c(s/2),v=c(r/2);switch(o){case"XYZ":this._x=h*d*p+u*m*v,this._y=u*m*p-h*d*v,this._z=u*d*v+h*m*p,this._w=u*d*p-h*m*v;break;case"YXZ":this._x=h*d*p+u*m*v,this._y=u*m*p-h*d*v,this._z=u*d*v-h*m*p,this._w=u*d*p+h*m*v;break;case"ZXY":this._x=h*d*p-u*m*v,this._y=u*m*p+h*d*v,this._z=u*d*v+h*m*p,this._w=u*d*p-h*m*v;break;case"ZYX":this._x=h*d*p-u*m*v,this._y=u*m*p+h*d*v,this._z=u*d*v-h*m*p,this._w=u*d*p+h*m*v;break;case"YZX":this._x=h*d*p+u*m*v,this._y=u*m*p+h*d*v,this._z=u*d*v-h*m*p,this._w=u*d*p-h*m*v;break;case"XZY":this._x=h*d*p-u*m*v,this._y=u*m*p-h*d*v,this._z=u*d*v+h*m*p,this._w=u*d*p+h*m*v;break;default:Ke("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],s=n[4],r=n[8],o=n[1],l=n[5],c=n[9],u=n[2],d=n[6],p=n[10],h=i+l+p;if(h>0){const m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(d-c)*m,this._y=(r-u)*m,this._z=(o-s)*m}else if(i>l&&i>p){const m=2*Math.sqrt(1+i-l-p);this._w=(d-c)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+u)/m}else if(l>p){const m=2*Math.sqrt(1+l-i-p);this._w=(r-u)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(c+d)/m}else{const m=2*Math.sqrt(1+p-i-l);this._w=(o-s)/m,this._x=(r+u)/m,this._y=(c+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(lt(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,n/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,s=e._y,r=e._z,o=e._w,l=n._x,c=n._y,u=n._z,d=n._w;return this._x=i*d+o*l+s*u-r*c,this._y=s*d+o*c+r*l-i*u,this._z=r*d+o*u+i*c-s*l,this._w=o*d-i*l-s*c-r*u,this._onChangeCallback(),this}slerp(e,n){let i=e._x,s=e._y,r=e._z,o=e._w,l=this.dot(e);l<0&&(i=-i,s=-s,r=-r,o=-o,l=-l);let c=1-n;if(l<.9995){const u=Math.acos(l),d=Math.sin(u);c=Math.sin(c*u)/d,n=Math.sin(n*u)/d,this._x=this._x*c+i*n,this._y=this._y*c+s*n,this._z=this._z*c+r*n,this._w=this._w*c+o*n,this._onChangeCallback()}else this._x=this._x*c+i*n,this._y=this._y*c+s*n,this._z=this._z*c+r*n,this._w=this._w*c+o*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(n),r*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const _m=class _m{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Qg.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Qg.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6]*s,this.y=r[1]*n+r[4]*i+r[7]*s,this.z=r[2]*n+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,s=this.z,r=e.elements,o=1/(r[3]*n+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*n+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*n+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*n+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,s=this.z,r=e.x,o=e.y,l=e.z,c=e.w,u=2*(o*s-l*i),d=2*(l*n-r*s),p=2*(r*i-o*n);return this.x=n+c*u+o*p-l*d,this.y=i+c*d+l*u-r*p,this.z=s+c*p+r*d-o*u,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*n+r[4]*i+r[8]*s,this.y=r[1]*n+r[5]*i+r[9]*s,this.z=r[2]*n+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=lt(this.x,e.x,n.x),this.y=lt(this.y,e.y,n.y),this.z=lt(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=lt(this.x,e,n),this.y=lt(this.y,e,n),this.z=lt(this.z,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(lt(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,s=e.y,r=e.z,o=n.x,l=n.y,c=n.z;return this.x=s*c-r*l,this.y=r*o-i*c,this.z=i*l-s*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Td.copy(this).projectOnVector(e),this.sub(Td)}reflect(e){return this.sub(Td.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(lt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return n*n+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const s=Math.sin(n)*e;return this.x=s*Math.sin(i),this.y=Math.cos(n)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=s,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};_m.prototype.isVector3=!0;let I=_m;const Td=new I,Qg=new rr,ym=class ym{constructor(e,n,i,s,r,o,l,c,u){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,s,r,o,l,c,u)}set(e,n,i,s,r,o,l,c,u){const d=this.elements;return d[0]=e,d[1]=s,d[2]=l,d[3]=n,d[4]=r,d[5]=c,d[6]=i,d[7]=o,d[8]=u,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,s=n.elements,r=this.elements,o=i[0],l=i[3],c=i[6],u=i[1],d=i[4],p=i[7],h=i[2],m=i[5],v=i[8],w=s[0],x=s[3],f=s[6],g=s[1],S=s[4],y=s[7],b=s[2],T=s[5],N=s[8];return r[0]=o*w+l*g+c*b,r[3]=o*x+l*S+c*T,r[6]=o*f+l*y+c*N,r[1]=u*w+d*g+p*b,r[4]=u*x+d*S+p*T,r[7]=u*f+d*y+p*N,r[2]=h*w+m*g+v*b,r[5]=h*x+m*S+v*T,r[8]=h*f+m*y+v*N,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],o=e[4],l=e[5],c=e[6],u=e[7],d=e[8];return n*o*d-n*l*u-i*r*d+i*l*c+s*r*u-s*o*c}invert(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],o=e[4],l=e[5],c=e[6],u=e[7],d=e[8],p=d*o-l*u,h=l*c-d*r,m=u*r-o*c,v=n*p+i*h+s*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const w=1/v;return e[0]=p*w,e[1]=(s*u-d*i)*w,e[2]=(l*i-s*o)*w,e[3]=h*w,e[4]=(d*n-s*c)*w,e[5]=(s*r-l*n)*w,e[6]=m*w,e[7]=(i*c-u*n)*w,e[8]=(o*n-i*r)*w,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,s,r,o,l){const c=Math.cos(r),u=Math.sin(r);return this.set(i*c,i*u,-i*(c*o+u*l)+o+e,-s*u,s*c,-s*(-u*o+c*l)+l+n,0,0,1),this}scale(e,n){return Ia("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ad.makeScale(e,n)),this}rotate(e){return Ia("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ad.makeRotation(-e)),this}translate(e,n){return Ia("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ad.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let s=0;s<9;s++)if(n[s]!==i[s])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};ym.prototype.isMatrix3=!0;let tt=ym;const Ad=new tt,Jg=new tt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ev=new tt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function zE(){const t={enabled:!0,workingColorSpace:gu,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Tt&&(s.r=ws(s.r),s.g=ws(s.g),s.b=ws(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Tt&&(s.r=Ua(s.r),s.g=Ua(s.g),s.b=Ua(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===$s?vu:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ia("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ia("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[gu]:{primaries:e,whitePoint:i,transfer:vu,toXYZ:Jg,fromXYZ:ev,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:$n},outputColorSpaceConfig:{drawingBufferColorSpace:$n}},[$n]:{primaries:e,whitePoint:i,transfer:Tt,toXYZ:Jg,fromXYZ:ev,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:$n}}}),t}const ht=zE();function ws(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Ua(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let qr;class HE{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{qr===void 0&&(qr=_u("canvas")),qr.width=e.width,qr.height=e.height;const s=qr.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=qr}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=_u("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=ws(r[o]/255)*255;return i.putImageData(s,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(ws(n[i]/255)*255):n[i]=ws(n[i]);return{data:n,width:e.width,height:e.height}}else return Ke("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let VE=0;class lm{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:VE++}),this.uuid=Ms(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,l=s.length;o<l;o++)s[o].isDataTexture?r.push(Nd(s[o].image)):r.push(Nd(s[o]))}else r=Nd(s);i.url=r}return n||(e.images[this.uuid]=i),i}}function Nd(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?HE.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(Ke("Texture: Unable to serialize Texture."),{})}let GE=0;const Cd=new I;class Pn extends cr{constructor(e=Pn.DEFAULT_IMAGE,n=Pn.DEFAULT_MAPPING,i=Qi,s=Qi,r=yn,o=Er,l=bi,c=Si,u=Pn.DEFAULT_ANISOTROPY,d=$s){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:GE++}),this.uuid=Ms(),this.name="",this.source=new lm(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=u,this.format=l,this.internalFormat=null,this.type=c,this.offset=new Ue(0,0),this.repeat=new Ue(1,1),this.center=new Ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new tt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Cd).x}get height(){return this.source.getSize(Cd).y}get depth(){return this.source.getSize(Cd).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const n in e){const i=e[n];if(i===void 0){Ke(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const s=this[n];if(s===void 0){Ke(`Texture.setValues(): property '${n}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==z_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case fu:e.x=e.x-Math.floor(e.x);break;case Qi:e.x=e.x<0?0:1;break;case uf:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case fu:e.y=e.y-Math.floor(e.y);break;case Qi:e.y=e.y<0?0:1;break;case uf:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Pn.DEFAULT_IMAGE=null;Pn.DEFAULT_MAPPING=z_;Pn.DEFAULT_ANISOTROPY=1;const Sm=class Sm{constructor(e=0,n=0,i=0,s=1){this.x=e,this.y=n,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,s){return this.x=e,this.y=n,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*n+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*n+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*n+o[7]*i+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,s,r;const c=e.elements,u=c[0],d=c[4],p=c[8],h=c[1],m=c[5],v=c[9],w=c[2],x=c[6],f=c[10];if(Math.abs(d-h)<.01&&Math.abs(p-w)<.01&&Math.abs(v-x)<.01){if(Math.abs(d+h)<.1&&Math.abs(p+w)<.1&&Math.abs(v+x)<.1&&Math.abs(u+m+f-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const S=(u+1)/2,y=(m+1)/2,b=(f+1)/2,T=(d+h)/4,N=(p+w)/4,_=(v+x)/4;return S>y&&S>b?S<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(S),s=T/i,r=N/i):y>b?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=T/s,r=_/s):b<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),i=N/r,s=_/r),this.set(i,s,r,n),this}let g=Math.sqrt((x-v)*(x-v)+(p-w)*(p-w)+(h-d)*(h-d));return Math.abs(g)<.001&&(g=1),this.x=(x-v)/g,this.y=(p-w)/g,this.z=(h-d)/g,this.w=Math.acos((u+m+f-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=lt(this.x,e.x,n.x),this.y=lt(this.y,e.y,n.y),this.z=lt(this.z,e.z,n.z),this.w=lt(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=lt(this.x,e,n),this.y=lt(this.y,e,n),this.z=lt(this.z,e,n),this.w=lt(this.w,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(lt(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Sm.prototype.isVector4=!0;let Yt=Sm;class WE extends cr{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:yn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new Yt(0,0,e,n),this.scissorTest=!1,this.viewport=new Yt(0,0,e,n),this.textures=[];const s={width:e,height:n,depth:i.depth},r=new Pn(s),o=i.count;for(let l=0;l<o;l++)this.textures[l]=r.clone(),this.textures[l].isRenderTargetTexture=!0,this.textures[l].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const n={minFilter:yn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=n,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const s=Object.assign({},e.textures[n].image);this.textures[n].source=new lm(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const n=e.depthTexture.clone();n.renderTarget=null,this.depthTexture=n}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ln extends WE{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class K_ extends Pn{constructor(e=null,n=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:s},this.magFilter=_n,this.minFilter=_n,this.wrapR=Qi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class $E extends Pn{constructor(e=null,n=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:s},this.magFilter=_n,this.minFilter=_n,this.wrapR=Qi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const bu=class bu{constructor(e,n,i,s,r,o,l,c,u,d,p,h,m,v,w,x){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,s,r,o,l,c,u,d,p,h,m,v,w,x)}set(e,n,i,s,r,o,l,c,u,d,p,h,m,v,w,x){const f=this.elements;return f[0]=e,f[4]=n,f[8]=i,f[12]=s,f[1]=r,f[5]=o,f[9]=l,f[13]=c,f[2]=u,f[6]=d,f[10]=p,f[14]=h,f[3]=m,f[7]=v,f[11]=w,f[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new bu().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinantAffine()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const n=this.elements,i=e.elements,s=1/Kr.setFromMatrixColumn(e,0).length(),r=1/Kr.setFromMatrixColumn(e,1).length(),o=1/Kr.setFromMatrixColumn(e,2).length();return n[0]=i[0]*s,n[1]=i[1]*s,n[2]=i[2]*s,n[3]=0,n[4]=i[4]*r,n[5]=i[5]*r,n[6]=i[6]*r,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,s=e.y,r=e.z,o=Math.cos(i),l=Math.sin(i),c=Math.cos(s),u=Math.sin(s),d=Math.cos(r),p=Math.sin(r);if(e.order==="XYZ"){const h=o*d,m=o*p,v=l*d,w=l*p;n[0]=c*d,n[4]=-c*p,n[8]=u,n[1]=m+v*u,n[5]=h-w*u,n[9]=-l*c,n[2]=w-h*u,n[6]=v+m*u,n[10]=o*c}else if(e.order==="YXZ"){const h=c*d,m=c*p,v=u*d,w=u*p;n[0]=h+w*l,n[4]=v*l-m,n[8]=o*u,n[1]=o*p,n[5]=o*d,n[9]=-l,n[2]=m*l-v,n[6]=w+h*l,n[10]=o*c}else if(e.order==="ZXY"){const h=c*d,m=c*p,v=u*d,w=u*p;n[0]=h-w*l,n[4]=-o*p,n[8]=v+m*l,n[1]=m+v*l,n[5]=o*d,n[9]=w-h*l,n[2]=-o*u,n[6]=l,n[10]=o*c}else if(e.order==="ZYX"){const h=o*d,m=o*p,v=l*d,w=l*p;n[0]=c*d,n[4]=v*u-m,n[8]=h*u+w,n[1]=c*p,n[5]=w*u+h,n[9]=m*u-v,n[2]=-u,n[6]=l*c,n[10]=o*c}else if(e.order==="YZX"){const h=o*c,m=o*u,v=l*c,w=l*u;n[0]=c*d,n[4]=w-h*p,n[8]=v*p+m,n[1]=p,n[5]=o*d,n[9]=-l*d,n[2]=-u*d,n[6]=m*p+v,n[10]=h-w*p}else if(e.order==="XZY"){const h=o*c,m=o*u,v=l*c,w=l*u;n[0]=c*d,n[4]=-p,n[8]=u*d,n[1]=h*p+w,n[5]=o*d,n[9]=m*p-v,n[2]=v*p-m,n[6]=l*d,n[10]=w*p+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(XE,e,YE)}lookAt(e,n,i){const s=this.elements;return ti.subVectors(e,n),ti.lengthSq()===0&&(ti.z=1),ti.normalize(),ks.crossVectors(i,ti),ks.lengthSq()===0&&(Math.abs(i.z)===1?ti.x+=1e-4:ti.z+=1e-4,ti.normalize(),ks.crossVectors(i,ti)),ks.normalize(),Hl.crossVectors(ti,ks),s[0]=ks.x,s[4]=Hl.x,s[8]=ti.x,s[1]=ks.y,s[5]=Hl.y,s[9]=ti.y,s[2]=ks.z,s[6]=Hl.z,s[10]=ti.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,s=n.elements,r=this.elements,o=i[0],l=i[4],c=i[8],u=i[12],d=i[1],p=i[5],h=i[9],m=i[13],v=i[2],w=i[6],x=i[10],f=i[14],g=i[3],S=i[7],y=i[11],b=i[15],T=s[0],N=s[4],_=s[8],C=s[12],R=s[1],k=s[5],B=s[9],D=s[13],P=s[2],j=s[6],Q=s[10],W=s[14],G=s[3],H=s[7],X=s[11],J=s[15];return r[0]=o*T+l*R+c*P+u*G,r[4]=o*N+l*k+c*j+u*H,r[8]=o*_+l*B+c*Q+u*X,r[12]=o*C+l*D+c*W+u*J,r[1]=d*T+p*R+h*P+m*G,r[5]=d*N+p*k+h*j+m*H,r[9]=d*_+p*B+h*Q+m*X,r[13]=d*C+p*D+h*W+m*J,r[2]=v*T+w*R+x*P+f*G,r[6]=v*N+w*k+x*j+f*H,r[10]=v*_+w*B+x*Q+f*X,r[14]=v*C+w*D+x*W+f*J,r[3]=g*T+S*R+y*P+b*G,r[7]=g*N+S*k+y*j+b*H,r[11]=g*_+S*B+y*Q+b*X,r[15]=g*C+S*D+y*W+b*J,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],s=e[8],r=e[12],o=e[1],l=e[5],c=e[9],u=e[13],d=e[2],p=e[6],h=e[10],m=e[14],v=e[3],w=e[7],x=e[11],f=e[15],g=c*m-u*h,S=l*m-u*p,y=l*h-c*p,b=o*m-u*d,T=o*h-c*d,N=o*p-l*d;return n*(w*g-x*S+f*y)-i*(v*g-x*b+f*T)+s*(v*S-w*b+f*N)-r*(v*y-w*T+x*N)}determinantAffine(){const e=this.elements,n=e[0],i=e[4],s=e[8],r=e[1],o=e[5],l=e[9],c=e[2],u=e[6],d=e[10];return n*(o*d-l*u)-i*(r*d-l*c)+s*(r*u-o*c)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=n,s[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],s=e[2],r=e[3],o=e[4],l=e[5],c=e[6],u=e[7],d=e[8],p=e[9],h=e[10],m=e[11],v=e[12],w=e[13],x=e[14],f=e[15],g=n*l-i*o,S=n*c-s*o,y=n*u-r*o,b=i*c-s*l,T=i*u-r*l,N=s*u-r*c,_=d*w-p*v,C=d*x-h*v,R=d*f-m*v,k=p*x-h*w,B=p*f-m*w,D=h*f-m*x,P=g*D-S*B+y*k+b*R-T*C+N*_;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const j=1/P;return e[0]=(l*D-c*B+u*k)*j,e[1]=(s*B-i*D-r*k)*j,e[2]=(w*N-x*T+f*b)*j,e[3]=(h*T-p*N-m*b)*j,e[4]=(c*R-o*D-u*C)*j,e[5]=(n*D-s*R+r*C)*j,e[6]=(x*y-v*N-f*S)*j,e[7]=(d*N-h*y+m*S)*j,e[8]=(o*B-l*R+u*_)*j,e[9]=(i*R-n*B-r*_)*j,e[10]=(v*T-w*y+f*g)*j,e[11]=(p*y-d*T-m*g)*j,e[12]=(l*C-o*k-c*_)*j,e[13]=(n*k-i*C+s*_)*j,e[14]=(w*S-v*b-x*g)*j,e[15]=(d*b-p*S+h*g)*j,this}scale(e){const n=this.elements,i=e.x,s=e.y,r=e.z;return n[0]*=i,n[4]*=s,n[8]*=r,n[1]*=i,n[5]*=s,n[9]*=r,n[2]*=i,n[6]*=s,n[10]*=r,n[3]*=i,n[7]*=s,n[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,s))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),s=Math.sin(n),r=1-i,o=e.x,l=e.y,c=e.z,u=r*o,d=r*l;return this.set(u*o+i,u*l-s*c,u*c+s*l,0,u*l+s*c,d*l+i,d*c-s*o,0,u*c-s*l,d*c+s*o,r*c*c+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,s,r,o){return this.set(1,i,r,0,e,1,o,0,n,s,1,0,0,0,0,1),this}compose(e,n,i){const s=this.elements,r=n._x,o=n._y,l=n._z,c=n._w,u=r+r,d=o+o,p=l+l,h=r*u,m=r*d,v=r*p,w=o*d,x=o*p,f=l*p,g=c*u,S=c*d,y=c*p,b=i.x,T=i.y,N=i.z;return s[0]=(1-(w+f))*b,s[1]=(m+y)*b,s[2]=(v-S)*b,s[3]=0,s[4]=(m-y)*T,s[5]=(1-(h+f))*T,s[6]=(x+g)*T,s[7]=0,s[8]=(v+S)*N,s[9]=(x-g)*N,s[10]=(1-(h+w))*N,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,n,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),n.identity(),this;let o=Kr.set(s[0],s[1],s[2]).length();const l=Kr.set(s[4],s[5],s[6]).length(),c=Kr.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Pi.copy(this);const u=1/o,d=1/l,p=1/c;return Pi.elements[0]*=u,Pi.elements[1]*=u,Pi.elements[2]*=u,Pi.elements[4]*=d,Pi.elements[5]*=d,Pi.elements[6]*=d,Pi.elements[8]*=p,Pi.elements[9]*=p,Pi.elements[10]*=p,n.setFromRotationMatrix(Pi),i.x=o,i.y=l,i.z=c,this}makePerspective(e,n,i,s,r,o,l=Ji,c=!1){const u=this.elements,d=2*r/(n-e),p=2*r/(i-s),h=(n+e)/(n-e),m=(i+s)/(i-s);let v,w;if(c)v=r/(o-r),w=o*r/(o-r);else if(l===Ji)v=-(o+r)/(o-r),w=-2*o*r/(o-r);else if(l===xu)v=-o/(o-r),w=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+l);return u[0]=d,u[4]=0,u[8]=h,u[12]=0,u[1]=0,u[5]=p,u[9]=m,u[13]=0,u[2]=0,u[6]=0,u[10]=v,u[14]=w,u[3]=0,u[7]=0,u[11]=-1,u[15]=0,this}makeOrthographic(e,n,i,s,r,o,l=Ji,c=!1){const u=this.elements,d=2/(n-e),p=2/(i-s),h=-(n+e)/(n-e),m=-(i+s)/(i-s);let v,w;if(c)v=1/(o-r),w=o/(o-r);else if(l===Ji)v=-2/(o-r),w=-(o+r)/(o-r);else if(l===xu)v=-1/(o-r),w=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+l);return u[0]=d,u[4]=0,u[8]=0,u[12]=h,u[1]=0,u[5]=p,u[9]=0,u[13]=m,u[2]=0,u[6]=0,u[10]=v,u[14]=w,u[3]=0,u[7]=0,u[11]=0,u[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let s=0;s<16;s++)if(n[s]!==i[s])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};bu.prototype.isMatrix4=!0;let At=bu;const Kr=new I,Pi=new At,XE=new I(0,0,0),YE=new I(1,1,1),ks=new I,Hl=new I,ti=new I,tv=new At,nv=new rr;class Or{constructor(e=0,n=0,i=0,s=Or.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,s=this._order){return this._x=e,this._y=n,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const s=e.elements,r=s[0],o=s[4],l=s[8],c=s[1],u=s[5],d=s[9],p=s[2],h=s[6],m=s[10];switch(n){case"XYZ":this._y=Math.asin(lt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,u),this._z=0);break;case"YXZ":this._x=Math.asin(-lt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(l,m),this._z=Math.atan2(c,u)):(this._y=Math.atan2(-p,r),this._z=0);break;case"ZXY":this._x=Math.asin(lt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-p,m),this._z=Math.atan2(-o,u)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-lt(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,u));break;case"YZX":this._z=Math.asin(lt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,u),this._y=Math.atan2(-p,r)):(this._x=0,this._y=Math.atan2(l,m));break;case"XZY":this._z=Math.asin(-lt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,u),this._y=Math.atan2(l,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:Ke("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return tv.makeRotationFromQuaternion(e),this.setFromRotationMatrix(tv,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return nv.setFromEuler(this),this.setFromQuaternion(nv,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Or.DEFAULT_ORDER="XYZ";class cm{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let qE=0;const iv=new I,Zr=new rr,ls=new At,Vl=new I,ho=new I,KE=new I,ZE=new rr,sv=new I(1,0,0),rv=new I(0,1,0),av=new I(0,0,1),ov={type:"added"},QE={type:"removed"},Qr={type:"childadded",child:null},Rd={type:"childremoved",child:null};class Dn extends cr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qE++}),this.uuid=Ms(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Dn.DEFAULT_UP.clone();const e=new I,n=new Or,i=new rr,s=new I(1,1,1);function r(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new At},normalMatrix:{value:new tt}}),this.matrix=new At,this.matrixWorld=new At,this.matrixAutoUpdate=Dn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Dn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new cm,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Zr.setFromAxisAngle(e,n),this.quaternion.multiply(Zr),this}rotateOnWorldAxis(e,n){return Zr.setFromAxisAngle(e,n),this.quaternion.premultiply(Zr),this}rotateX(e){return this.rotateOnAxis(sv,e)}rotateY(e){return this.rotateOnAxis(rv,e)}rotateZ(e){return this.rotateOnAxis(av,e)}translateOnAxis(e,n){return iv.copy(e).applyQuaternion(this.quaternion),this.position.add(iv.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(sv,e)}translateY(e){return this.translateOnAxis(rv,e)}translateZ(e){return this.translateOnAxis(av,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ls.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Vl.copy(e):Vl.set(e,n,i);const s=this.parent;this.updateWorldMatrix(!0,!1),ho.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ls.lookAt(ho,Vl,this.up):ls.lookAt(Vl,ho,this.up),this.quaternion.setFromRotationMatrix(ls),s&&(ls.extractRotation(s.matrixWorld),Zr.setFromRotationMatrix(ls),this.quaternion.premultiply(Zr.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(mt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ov),Qr.child=e,this.dispatchEvent(Qr),Qr.child=null):mt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(QE),Rd.child=e,this.dispatchEvent(Rd),Rd.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ls.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ls.multiply(e.parent.matrixWorld)),e.applyMatrix4(ls),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ov),Qr.child=e,this.dispatchEvent(Qr),Qr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,s=this.children.length;i<s;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ho,e,KE),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ho,ZE,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const n=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=n-r[0]*n-r[4]*i-r[8]*s,r[13]+=i-r[1]*n-r[5]*i-r[9]*s,r[14]+=s-r[2]*n-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,s=n.length;i<s;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){const r=this.children;for(let o=0,l=r.length;o<l;o++)r[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(l=>({...l,boundingBox:l.boundingBox?l.boundingBox.toJSON():void 0,boundingSphere:l.boundingSphere?l.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(l=>({...l})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(l,c){return l[c.uuid]===void 0&&(l[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const l=this.geometry.parameters;if(l!==void 0&&l.shapes!==void 0){const c=l.shapes;if(Array.isArray(c))for(let u=0,d=c.length;u<d;u++){const p=c[u];r(e.shapes,p)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const l=[];for(let c=0,u=this.material.length;c<u;c++)l.push(r(e.materials,this.material[c]));s.material=l}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let l=0;l<this.children.length;l++)s.children.push(this.children[l].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let l=0;l<this.animations.length;l++){const c=this.animations[l];s.animations.push(r(e.animations,c))}}if(n){const l=o(e.geometries),c=o(e.materials),u=o(e.textures),d=o(e.images),p=o(e.shapes),h=o(e.skeletons),m=o(e.animations),v=o(e.nodes);l.length>0&&(i.geometries=l),c.length>0&&(i.materials=c),u.length>0&&(i.textures=u),d.length>0&&(i.images=d),p.length>0&&(i.shapes=p),h.length>0&&(i.skeletons=h),m.length>0&&(i.animations=m),v.length>0&&(i.nodes=v)}return i.object=s,i;function o(l){const c=[];for(const u in l){const d=l[u];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Dn.DEFAULT_UP=new I(0,1,0);Dn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Dn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class qi extends Dn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const JE={type:"move"};class Pd{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new qi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new qi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new qi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let s=null,r=null,o=null;const l=this._targetRay,c=this._grip,u=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(u&&e.hand){o=!0;for(const w of e.hand.values()){const x=n.getJointPose(w,i),f=this._getHandJoint(u,w);x!==null&&(f.matrix.fromArray(x.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=x.radius),f.visible=x!==null}const d=u.joints["index-finger-tip"],p=u.joints["thumb-tip"],h=d.position.distanceTo(p.position),m=.02,v=.005;u.inputState.pinching&&h>m+v?(u.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!u.inputState.pinching&&h<=m-v&&(u.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=n.getPose(e.gripSpace,i),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));l!==null&&(s=n.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,this.dispatchEvent(JE)))}return l!==null&&(l.visible=s!==null),c!==null&&(c.visible=r!==null),u!==null&&(u.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new qi;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const Z_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Is={h:0,s:0,l:0},Gl={h:0,s:0,l:0};function Ld(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class it{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=$n){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ht.colorSpaceToWorking(this,n),this}setRGB(e,n,i,s=ht.workingColorSpace){return this.r=e,this.g=n,this.b=i,ht.colorSpaceToWorking(this,s),this}setHSL(e,n,i,s=ht.workingColorSpace){if(e=om(e,1),n=lt(n,0,1),i=lt(i,0,1),n===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+n):i+n-i*n,o=2*i-r;this.r=Ld(o,r,e+1/3),this.g=Ld(o,r,e),this.b=Ld(o,r,e-1/3)}return ht.colorSpaceToWorking(this,s),this}setStyle(e,n=$n){function i(r){r!==void 0&&parseFloat(r)<1&&Ke("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],l=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,n);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,n);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,n);break;default:Ke("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(r,16),n);Ke("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=$n){const i=Z_[e.toLowerCase()];return i!==void 0?this.setHex(i,n):Ke("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ws(e.r),this.g=ws(e.g),this.b=ws(e.b),this}copyLinearToSRGB(e){return this.r=Ua(e.r),this.g=Ua(e.g),this.b=Ua(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=$n){return ht.workingToColorSpace(An.copy(this),e),Math.round(lt(An.r*255,0,255))*65536+Math.round(lt(An.g*255,0,255))*256+Math.round(lt(An.b*255,0,255))}getHexString(e=$n){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=ht.workingColorSpace){ht.workingToColorSpace(An.copy(this),n);const i=An.r,s=An.g,r=An.b,o=Math.max(i,s,r),l=Math.min(i,s,r);let c,u;const d=(l+o)/2;if(l===o)c=0,u=0;else{const p=o-l;switch(u=d<=.5?p/(o+l):p/(2-o-l),o){case i:c=(s-r)/p+(s<r?6:0);break;case s:c=(r-i)/p+2;break;case r:c=(i-s)/p+4;break}c/=6}return e.h=c,e.s=u,e.l=d,e}getRGB(e,n=ht.workingColorSpace){return ht.workingToColorSpace(An.copy(this),n),e.r=An.r,e.g=An.g,e.b=An.b,e}getStyle(e=$n){ht.workingToColorSpace(An.copy(this),e);const n=An.r,i=An.g,s=An.b;return e!==$n?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,n,i){return this.getHSL(Is),this.setHSL(Is.h+e,Is.s+n,Is.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Is),e.getHSL(Gl);const i=zo(Is.h,Gl.h,n),s=zo(Is.s,Gl.s,n),r=zo(Is.l,Gl.l,n);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*n+r[3]*i+r[6]*s,this.g=r[1]*n+r[4]*i+r[7]*s,this.b=r[2]*n+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const An=new it;it.NAMES=Z_;class e1 extends Dn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Or,this.environmentIntensity=1,this.environmentRotation=new Or,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),n.object.backgroundBlurriness=this.backgroundBlurriness,n.object.backgroundIntensity=this.backgroundIntensity,n.object.backgroundRotation=this.backgroundRotation.toArray(),n.object.environmentIntensity=this.environmentIntensity,n.object.environmentRotation=this.environmentRotation.toArray(),n}}const Li=new I,cs=new I,Dd=new I,us=new I,Jr=new I,ea=new I,lv=new I,kd=new I,Id=new I,Ud=new I,Fd=new Yt,Od=new Yt,jd=new Yt;class Mi{constructor(e=new I,n=new I,i=new I){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,s){s.subVectors(i,n),Li.subVectors(e,n),s.cross(Li);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,n,i,s,r){Li.subVectors(s,n),cs.subVectors(i,n),Dd.subVectors(e,n);const o=Li.dot(Li),l=Li.dot(cs),c=Li.dot(Dd),u=cs.dot(cs),d=cs.dot(Dd),p=o*u-l*l;if(p===0)return r.set(0,0,0),null;const h=1/p,m=(u*c-l*d)*h,v=(o*d-l*c)*h;return r.set(1-m-v,v,m)}static containsPoint(e,n,i,s){return this.getBarycoord(e,n,i,s,us)===null?!1:us.x>=0&&us.y>=0&&us.x+us.y<=1}static getInterpolation(e,n,i,s,r,o,l,c){return this.getBarycoord(e,n,i,s,us)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,us.x),c.addScaledVector(o,us.y),c.addScaledVector(l,us.z),c)}static getInterpolatedAttribute(e,n,i,s,r,o){return Fd.setScalar(0),Od.setScalar(0),jd.setScalar(0),Fd.fromBufferAttribute(e,n),Od.fromBufferAttribute(e,i),jd.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Fd,r.x),o.addScaledVector(Od,r.y),o.addScaledVector(jd,r.z),o}static isFrontFacing(e,n,i,s){return Li.subVectors(i,n),cs.subVectors(e,n),Li.cross(cs).dot(s)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,s){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,n,i,s){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Li.subVectors(this.c,this.b),cs.subVectors(this.a,this.b),Li.cross(cs).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Mi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Mi.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,s,r){return Mi.getInterpolation(e,this.a,this.b,this.c,n,i,s,r)}containsPoint(e){return Mi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Mi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,s=this.b,r=this.c;let o,l;Jr.subVectors(s,i),ea.subVectors(r,i),kd.subVectors(e,i);const c=Jr.dot(kd),u=ea.dot(kd);if(c<=0&&u<=0)return n.copy(i);Id.subVectors(e,s);const d=Jr.dot(Id),p=ea.dot(Id);if(d>=0&&p<=d)return n.copy(s);const h=c*p-d*u;if(h<=0&&c>=0&&d<=0)return o=c/(c-d),n.copy(i).addScaledVector(Jr,o);Ud.subVectors(e,r);const m=Jr.dot(Ud),v=ea.dot(Ud);if(v>=0&&m<=v)return n.copy(r);const w=m*u-c*v;if(w<=0&&u>=0&&v<=0)return l=u/(u-v),n.copy(i).addScaledVector(ea,l);const x=d*v-m*p;if(x<=0&&p-d>=0&&m-v>=0)return lv.subVectors(r,s),l=(p-d)/(p-d+(m-v)),n.copy(s).addScaledVector(lv,l);const f=1/(x+w+h);return o=w*f,l=h*f,n.copy(i).addScaledVector(Jr,o).addScaledVector(ea,l)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Hr{constructor(e=new I(1/0,1/0,1/0),n=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Di.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Di.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=Di.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(n===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,l=r.count;o<l;o++)e.isMesh===!0?e.getVertexPosition(o,Di):Di.fromBufferAttribute(r,o),Di.applyMatrix4(e.matrixWorld),this.expandByPoint(Di);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Wl.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Wl.copy(i.boundingBox)),Wl.applyMatrix4(e.matrixWorld),this.union(Wl)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Di),Di.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(fo),$l.subVectors(this.max,fo),ta.subVectors(e.a,fo),na.subVectors(e.b,fo),ia.subVectors(e.c,fo),Us.subVectors(na,ta),Fs.subVectors(ia,na),fr.subVectors(ta,ia);let n=[0,-Us.z,Us.y,0,-Fs.z,Fs.y,0,-fr.z,fr.y,Us.z,0,-Us.x,Fs.z,0,-Fs.x,fr.z,0,-fr.x,-Us.y,Us.x,0,-Fs.y,Fs.x,0,-fr.y,fr.x,0];return!Bd(n,ta,na,ia,$l)||(n=[1,0,0,0,1,0,0,0,1],!Bd(n,ta,na,ia,$l))?!1:(Xl.crossVectors(Us,Fs),n=[Xl.x,Xl.y,Xl.z],Bd(n,ta,na,ia,$l))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Di).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Di).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ds[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ds[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ds[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ds[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ds[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ds[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ds[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ds[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ds),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const ds=[new I,new I,new I,new I,new I,new I,new I,new I],Di=new I,Wl=new Hr,ta=new I,na=new I,ia=new I,Us=new I,Fs=new I,fr=new I,fo=new I,$l=new I,Xl=new I,pr=new I;function Bd(t,e,n,i,s){for(let r=0,o=t.length-3;r<=o;r+=3){pr.fromArray(t,r);const l=s.x*Math.abs(pr.x)+s.y*Math.abs(pr.y)+s.z*Math.abs(pr.z),c=e.dot(pr),u=n.dot(pr),d=i.dot(pr);if(Math.max(-Math.max(c,u,d),Math.min(c,u,d))>l)return!1}return!0}const Jt=new I,Yl=new Ue;let t1=0;class Ot extends cr{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:t1++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=Y_,this.updateRanges=[],this.gpuType=Oi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=n.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Yl.fromBufferAttribute(this,n),Yl.applyMatrix3(e),this.setXY(n,Yl.x,Yl.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Jt.fromBufferAttribute(this,n),Jt.applyMatrix3(e),this.setXYZ(n,Jt.x,Jt.y,Jt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Jt.fromBufferAttribute(this,n),Jt.applyMatrix4(e),this.setXYZ(n,Jt.x,Jt.y,Jt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Jt.fromBufferAttribute(this,n),Jt.applyNormalMatrix(e),this.setXYZ(n,Jt.x,Jt.y,Jt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Jt.fromBufferAttribute(this,n),Jt.transformDirection(e),this.setXYZ(n,Jt.x,Jt.y,Jt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=Fi(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=Ct(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Fi(n,this.array)),n}setX(e,n){return this.normalized&&(n=Ct(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Fi(n,this.array)),n}setY(e,n){return this.normalized&&(n=Ct(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Fi(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Ct(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Fi(n,this.array)),n}setW(e,n){return this.normalized&&(n=Ct(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=Ct(n,this.array),i=Ct(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,s){return e*=this.itemSize,this.normalized&&(n=Ct(n,this.array),i=Ct(i,this.array),s=Ct(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,n,i,s,r){return e*=this.itemSize,this.normalized&&(n=Ct(n,this.array),i=Ct(i,this.array),s=Ct(s,this.array),r=Ct(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class Q_ extends Ot{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class J_ extends Ot{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class ft extends Ot{constructor(e,n,i){super(new Float32Array(e),n,i)}}const n1=new Hr,po=new I,zd=new I;class Vr{constructor(e=new I,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):n1.setFromPoints(e).getCenter(i);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;po.subVectors(e,this.center);const n=po.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),s=(i-this.radius)*.5;this.center.addScaledVector(po,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(zd.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(po.copy(e.center).add(zd)),this.expandByPoint(po.copy(e.center).sub(zd))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let i1=0;const vi=new At,Hd=new Dn,sa=new I,ni=new Hr,mo=new Hr,mn=new I;class Dt extends cr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:i1++}),this.uuid=Ms(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(SE(e)?J_:Q_)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new tt().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return vi.makeRotationFromQuaternion(e),this.applyMatrix4(vi),this}rotateX(e){return vi.makeRotationX(e),this.applyMatrix4(vi),this}rotateY(e){return vi.makeRotationY(e),this.applyMatrix4(vi),this}rotateZ(e){return vi.makeRotationZ(e),this.applyMatrix4(vi),this}translate(e,n,i){return vi.makeTranslation(e,n,i),this.applyMatrix4(vi),this}scale(e,n,i){return vi.makeScale(e,n,i),this.applyMatrix4(vi),this}lookAt(e){return Hd.lookAt(e),Hd.updateMatrix(),this.applyMatrix4(Hd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(sa).negate(),this.translate(sa.x,sa.y,sa.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ft(i,3))}else{const i=Math.min(e.length,n.count);for(let s=0;s<i;s++){const r=e[s];n.setXYZ(s,r.x,r.y,r.z||0)}e.length>n.count&&Ke("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Hr);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){mt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,s=n.length;i<s;i++){const r=n[i];ni.setFromBufferAttribute(r),this.morphTargetsRelative?(mn.addVectors(this.boundingBox.min,ni.min),this.boundingBox.expandByPoint(mn),mn.addVectors(this.boundingBox.max,ni.max),this.boundingBox.expandByPoint(mn)):(this.boundingBox.expandByPoint(ni.min),this.boundingBox.expandByPoint(ni.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&mt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Vr);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){mt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const i=this.boundingSphere.center;if(ni.setFromBufferAttribute(e),n)for(let r=0,o=n.length;r<o;r++){const l=n[r];mo.setFromBufferAttribute(l),this.morphTargetsRelative?(mn.addVectors(ni.min,mo.min),ni.expandByPoint(mn),mn.addVectors(ni.max,mo.max),ni.expandByPoint(mn)):(ni.expandByPoint(mo.min),ni.expandByPoint(mo.max))}ni.getCenter(i);let s=0;for(let r=0,o=e.count;r<o;r++)mn.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(mn));if(n)for(let r=0,o=n.length;r<o;r++){const l=n[r],c=this.morphTargetsRelative;for(let u=0,d=l.count;u<d;u++)mn.fromBufferAttribute(l,u),c&&(sa.fromBufferAttribute(e,u),mn.add(sa)),s=Math.max(s,i.distanceToSquared(mn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&mt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){mt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,s=n.normal,r=n.uv;let o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new Ot(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));const l=[],c=[];for(let _=0;_<i.count;_++)l[_]=new I,c[_]=new I;const u=new I,d=new I,p=new I,h=new Ue,m=new Ue,v=new Ue,w=new I,x=new I;function f(_,C,R){u.fromBufferAttribute(i,_),d.fromBufferAttribute(i,C),p.fromBufferAttribute(i,R),h.fromBufferAttribute(r,_),m.fromBufferAttribute(r,C),v.fromBufferAttribute(r,R),d.sub(u),p.sub(u),m.sub(h),v.sub(h);const k=1/(m.x*v.y-v.x*m.y);isFinite(k)&&(w.copy(d).multiplyScalar(v.y).addScaledVector(p,-m.y).multiplyScalar(k),x.copy(p).multiplyScalar(m.x).addScaledVector(d,-v.x).multiplyScalar(k),l[_].add(w),l[C].add(w),l[R].add(w),c[_].add(x),c[C].add(x),c[R].add(x))}let g=this.groups;g.length===0&&(g=[{start:0,count:e.count}]);for(let _=0,C=g.length;_<C;++_){const R=g[_],k=R.start,B=R.count;for(let D=k,P=k+B;D<P;D+=3)f(e.getX(D+0),e.getX(D+1),e.getX(D+2))}const S=new I,y=new I,b=new I,T=new I;function N(_){b.fromBufferAttribute(s,_),T.copy(b);const C=l[_];S.copy(C),S.sub(b.multiplyScalar(b.dot(C))).normalize(),y.crossVectors(T,C);const k=y.dot(c[_])<0?-1:1;o.setXYZW(_,S.x,S.y,S.z,k)}for(let _=0,C=g.length;_<C;++_){const R=g[_],k=R.start,B=R.count;for(let D=k,P=k+B;D<P;D+=3)N(e.getX(D+0)),N(e.getX(D+1)),N(e.getX(D+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new Ot(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,m=i.count;h<m;h++)i.setXYZ(h,0,0,0);const s=new I,r=new I,o=new I,l=new I,c=new I,u=new I,d=new I,p=new I;if(e)for(let h=0,m=e.count;h<m;h+=3){const v=e.getX(h+0),w=e.getX(h+1),x=e.getX(h+2);s.fromBufferAttribute(n,v),r.fromBufferAttribute(n,w),o.fromBufferAttribute(n,x),d.subVectors(o,r),p.subVectors(s,r),d.cross(p),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,w),u.fromBufferAttribute(i,x),l.add(d),c.add(d),u.add(d),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(w,c.x,c.y,c.z),i.setXYZ(x,u.x,u.y,u.z)}else for(let h=0,m=n.count;h<m;h+=3)s.fromBufferAttribute(n,h+0),r.fromBufferAttribute(n,h+1),o.fromBufferAttribute(n,h+2),d.subVectors(o,r),p.subVectors(s,r),d.cross(p),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)mn.fromBufferAttribute(e,n),mn.normalize(),e.setXYZ(n,mn.x,mn.y,mn.z)}toNonIndexed(){function e(l,c){const u=l.array,d=l.itemSize,p=l.normalized,h=new u.constructor(c.length*d);let m=0,v=0;for(let w=0,x=c.length;w<x;w++){l.isInterleavedBufferAttribute?m=c[w]*l.data.stride+l.offset:m=c[w]*d;for(let f=0;f<d;f++)h[v++]=u[m++]}return new Ot(h,d,p)}if(this.index===null)return Ke("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Dt,i=this.index.array,s=this.attributes;for(const l in s){const c=s[l],u=e(c,i);n.setAttribute(l,u)}const r=this.morphAttributes;for(const l in r){const c=[],u=r[l];for(let d=0,p=u.length;d<p;d++){const h=u[d],m=e(h,i);c.push(m)}n.morphAttributes[l]=c}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let l=0,c=o.length;l<c;l++){const u=o[l];n.addGroup(u.start,u.count,u.materialIndex)}return n}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const u in c)c[u]!==void 0&&(e[u]=c[u]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const c in i){const u=i[c];e.data.attributes[c]=u.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const u=this.morphAttributes[c],d=[];for(let p=0,h=u.length;p<h;p++){const m=u[p];d.push(m.toJSON(e.data))}d.length>0&&(s[c]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const l=this.boundingSphere;return l!==null&&(e.data.boundingSphere=l.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const u in s){const d=s[u];this.setAttribute(u,d.clone(n))}const r=e.morphAttributes;for(const u in r){const d=[],p=r[u];for(let h=0,m=p.length;h<m;h++)d.push(p[h].clone(n));this.morphAttributes[u]=d}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let u=0,d=o.length;u<d;u++){const p=o[u];this.addGroup(p.start,p.count,p.materialIndex)}const l=e.boundingBox;l!==null&&(this.boundingBox=l.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class s1{constructor(e,n){this.isInterleavedBuffer=!0,this.array=e,this.stride=n,this.count=e!==void 0?e.length/n:0,this.usage=Y_,this.updateRanges=[],this.version=0,this.uuid=Ms()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,n,i){e*=this.stride,i*=n.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=n.array[i+s];return this}set(e,n=0){return this.array.set(e,n),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ms()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const n=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ms()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const n={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}}const Un=new I;class Su{constructor(e,n,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=n,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let n=0,i=this.data.count;n<i;n++)Un.fromBufferAttribute(this,n),Un.applyMatrix4(e),this.setXYZ(n,Un.x,Un.y,Un.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Un.fromBufferAttribute(this,n),Un.applyNormalMatrix(e),this.setXYZ(n,Un.x,Un.y,Un.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Un.fromBufferAttribute(this,n),Un.transformDirection(e),this.setXYZ(n,Un.x,Un.y,Un.z);return this}getComponent(e,n){let i=this.array[e*this.data.stride+this.offset+n];return this.normalized&&(i=Fi(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=Ct(i,this.array)),this.data.array[e*this.data.stride+this.offset+n]=i,this}setX(e,n){return this.normalized&&(n=Ct(n,this.array)),this.data.array[e*this.data.stride+this.offset]=n,this}setY(e,n){return this.normalized&&(n=Ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+1]=n,this}setZ(e,n){return this.normalized&&(n=Ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+2]=n,this}setW(e,n){return this.normalized&&(n=Ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+3]=n,this}getX(e){let n=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(n=Fi(n,this.array)),n}getY(e){let n=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(n=Fi(n,this.array)),n}getZ(e){let n=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(n=Fi(n,this.array)),n}getW(e){let n=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(n=Fi(n,this.array)),n}setXY(e,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(n=Ct(n,this.array),i=Ct(i,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this}setXYZ(e,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(n=Ct(n,this.array),i=Ct(i,this.array),s=Ct(s,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,n,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(n=Ct(n,this.array),i=Ct(i,this.array),s=Ct(s,this.array),r=Ct(r,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){yu("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)n.push(this.data.array[s+r])}return new Ot(new this.array.constructor(n),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Su(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){yu("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)n.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:n,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Vd=new I,r1=new I,a1=new tt;class vs{constructor(e=new I(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,s){return this.normal.set(e,n,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const s=Vd.subVectors(i,n).cross(r1.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){const s=e.delta(Vd),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:n.copy(e.start).addScaledVector(s,o)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||a1.getNormalMatrix(e),s=this.coplanarPoint(Vd).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let o1=0;class Gr extends cr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:o1++}),this.uuid=Ms(),this.name="",this.type="Material",this.blending=jo,this.side=Ir,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=O_,this.blendDst=j_,this.blendEquation=fa,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new it(0,0,0),this.blendAlpha=0,this.depthFunc=rl,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=pE,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ed,this.stencilZFail=Ed,this.stencilZPass=Ed,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){Ke(`Material: parameter '${n}' has value of undefined.`);continue}const s=this[n];if(s===void 0){Ke(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const o=[];for(const l in r){const c=r[l];delete c.metadata,o.push(c)}return o}if(n){const r=s(e.textures),o=s(e.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}fromJSON(e,n){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new it().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new vs().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=n[e.map]||null),e.matcap!==void 0&&(this.matcap=n[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=n[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=n[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=n[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new Ue().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=n[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=n[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=n[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=n[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=n[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=n[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=n[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=n[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=n[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=n[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=n[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ue().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=n[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=n[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=n[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=n[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=n[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const s=n.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=n[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Hf extends Gr{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new it(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let ra;const go=new I,aa=new I,oa=new I,la=new Ue,vo=new Ue,ey=new At,ql=new I,xo=new I,Kl=new I,cv=new Ue,Gd=new Ue,uv=new Ue;class dv extends Dn{constructor(e=new Hf){if(super(),this.isSprite=!0,this.type="Sprite",ra===void 0){ra=new Dt;const n=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new s1(n,5);ra.setIndex([0,1,2,0,2,3]),ra.setAttribute("position",new Su(i,3,0,!1)),ra.setAttribute("uv",new Su(i,2,3,!1))}this.geometry=ra,this.material=e,this.center=new Ue(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,n){e.camera===null&&mt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),aa.setFromMatrixScale(this.matrixWorld),ey.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),oa.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&aa.multiplyScalar(-oa.z);const i=this.material.rotation;let s,r;i!==0&&(r=Math.cos(i),s=Math.sin(i));const o=this.center;Zl(ql.set(-.5,-.5,0),oa,o,aa,s,r),Zl(xo.set(.5,-.5,0),oa,o,aa,s,r),Zl(Kl.set(.5,.5,0),oa,o,aa,s,r),cv.set(0,0),Gd.set(1,0),uv.set(1,1);let l=e.ray.intersectTriangle(ql,xo,Kl,!1,go);if(l===null&&(Zl(xo.set(-.5,.5,0),oa,o,aa,s,r),Gd.set(0,1),l=e.ray.intersectTriangle(ql,Kl,xo,!1,go),l===null))return;const c=e.ray.origin.distanceTo(go);c<e.near||c>e.far||n.push({distance:c,point:go.clone(),uv:Mi.getInterpolation(go,ql,xo,Kl,cv,Gd,uv,new Ue),face:null,object:this})}copy(e,n){return super.copy(e,n),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Zl(t,e,n,i,s,r){la.subVectors(t,n).addScalar(.5).multiply(i),s!==void 0?(vo.x=r*la.x-s*la.y,vo.y=s*la.x+r*la.y):vo.copy(la),t.copy(e),t.x+=vo.x,t.y+=vo.y,t.applyMatrix4(ey)}const hs=new I,Wd=new I,Ql=new I,Jl=new I;class gl{constructor(e=new I,n=new I(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hs)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=hs.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(hs.copy(this.origin).addScaledVector(this.direction,n),hs.distanceToSquared(e))}distanceSqToSegment(e,n,i,s){Wd.copy(e).add(n).multiplyScalar(.5),Ql.copy(n).sub(e).normalize(),Jl.copy(this.origin).sub(Wd);const r=e.distanceTo(n)*.5,o=-this.direction.dot(Ql),l=Jl.dot(this.direction),c=-Jl.dot(Ql),u=Jl.lengthSq(),d=Math.abs(1-o*o);let p,h,m,v;if(d>0)if(p=o*c-l,h=o*l-c,v=r*d,p>=0)if(h>=-v)if(h<=v){const w=1/d;p*=w,h*=w,m=p*(p+o*h+2*l)+h*(o*p+h+2*c)+u}else h=r,p=Math.max(0,-(o*h+l)),m=-p*p+h*(h+2*c)+u;else h=-r,p=Math.max(0,-(o*h+l)),m=-p*p+h*(h+2*c)+u;else h<=-v?(p=Math.max(0,-(-o*r+l)),h=p>0?-r:Math.min(Math.max(-r,-c),r),m=-p*p+h*(h+2*c)+u):h<=v?(p=0,h=Math.min(Math.max(-r,-c),r),m=h*(h+2*c)+u):(p=Math.max(0,-(o*r+l)),h=p>0?r:Math.min(Math.max(-r,-c),r),m=-p*p+h*(h+2*c)+u);else h=o>0?-r:r,p=Math.max(0,-(o*h+l)),m=-p*p+h*(h+2*c)+u;return i&&i.copy(this.origin).addScaledVector(this.direction,p),s&&s.copy(Wd).addScaledVector(Ql,h),m}intersectSphere(e,n){if(e.radius<0)return null;hs.subVectors(e.center,this.origin);const i=hs.dot(this.direction),s=hs.dot(hs)-i*i,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),l=i-o,c=i+o;return c<0?null:l<0?this.at(c,n):this.at(l,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,s,r,o,l,c;const u=1/this.direction.x,d=1/this.direction.y,p=1/this.direction.z,h=this.origin;return u>=0?(i=(e.min.x-h.x)*u,s=(e.max.x-h.x)*u):(i=(e.max.x-h.x)*u,s=(e.min.x-h.x)*u),d>=0?(r=(e.min.y-h.y)*d,o=(e.max.y-h.y)*d):(r=(e.max.y-h.y)*d,o=(e.min.y-h.y)*d),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),p>=0?(l=(e.min.z-h.z)*p,c=(e.max.z-h.z)*p):(l=(e.max.z-h.z)*p,c=(e.min.z-h.z)*p),i>c||l>s)||((l>i||i!==i)&&(i=l),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,n)}intersectsBox(e){return this.intersectBox(e,hs)!==null}intersectTriangle(e,n,i,s,r){const o=this.origin,l=this.direction,c=l.x,u=l.y,d=l.z,p=e.x-o.x,h=e.y-o.y,m=e.z-o.z,v=n.x-o.x,w=n.y-o.y,x=n.z-o.z,f=i.x-o.x,g=i.y-o.y,S=i.z-o.z,y=Math.abs(c),b=Math.abs(u),T=Math.abs(d);let N,_,C,R,k,B,D,P,j,Q,W,G;if(y>=b&&y>=T?(C=c,B=p,j=v,G=f,c>=0?(N=u,_=d,R=h,k=m,D=w,P=x,Q=g,W=S):(N=d,_=u,R=m,k=h,D=x,P=w,Q=S,W=g)):b>=T?(C=u,B=h,j=w,G=g,u>=0?(N=d,_=c,R=m,k=p,D=x,P=v,Q=S,W=f):(N=c,_=d,R=p,k=m,D=v,P=x,Q=f,W=S)):(C=d,B=m,j=x,G=S,d>=0?(N=c,_=u,R=p,k=h,D=v,P=w,Q=f,W=g):(N=u,_=c,R=h,k=p,D=w,P=v,Q=g,W=f)),C===0)return null;const H=N/C,X=_/C,J=1/C,ve=R-H*B,Ie=k-X*B,Qe=D-H*j,re=P-X*j,fe=Q-H*G,E=W-X*G,F=fe*re-E*Qe,ee=ve*E-Ie*fe,ue=Qe*Ie-re*ve;if(s){if(F<0||ee<0||ue<0)return null}else if((F<0||ee<0||ue<0)&&(F>0||ee>0||ue>0))return null;const ce=F+ee+ue;if(ce===0)return null;const qe=J*(F*B+ee*j+ue*G);return(ce>0?qe<0:qe>0)?null:this.at(qe/ce,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class xs extends Gr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new it(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Or,this.combine=B_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const hv=new At,mr=new gl,ec=new Vr,fv=new I,tc=new I,nc=new I,ic=new I,$d=new I,sc=new I,pv=new I,rc=new I;class qt extends Dn{constructor(e=new Dt,n=new xs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const l=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=r}}}}getVertexPosition(e,n){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(s,e);const l=this.morphTargetInfluences;if(r&&l){sc.set(0,0,0);for(let c=0,u=r.length;c<u;c++){const d=l[c],p=r[c];d!==0&&($d.fromBufferAttribute(p,e),o?sc.addScaledVector($d,d):sc.addScaledVector($d.sub(n),d))}n.add(sc)}return n}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ec.copy(i.boundingSphere),ec.applyMatrix4(r),mr.copy(e.ray).recast(e.near),!(ec.containsPoint(mr.origin)===!1&&(mr.intersectSphere(ec,fv)===null||mr.origin.distanceToSquared(fv)>(e.far-e.near)**2))&&(hv.copy(r).invert(),mr.copy(e.ray).applyMatrix4(hv),!(i.boundingBox!==null&&mr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,mr)))}_computeIntersections(e,n,i){let s;const r=this.geometry,o=this.material,l=r.index,c=r.attributes.position,u=r.attributes.uv,d=r.attributes.uv1,p=r.attributes.normal,h=r.groups,m=r.drawRange;if(l!==null)if(Array.isArray(o))for(let v=0,w=h.length;v<w;v++){const x=h[v],f=o[x.materialIndex],g=Math.max(x.start,m.start),S=Math.min(l.count,Math.min(x.start+x.count,m.start+m.count));for(let y=g,b=S;y<b;y+=3){const T=l.getX(y),N=l.getX(y+1),_=l.getX(y+2);s=ac(this,f,e,i,u,d,p,T,N,_),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=x.materialIndex,n.push(s))}}else{const v=Math.max(0,m.start),w=Math.min(l.count,m.start+m.count);for(let x=v,f=w;x<f;x+=3){const g=l.getX(x),S=l.getX(x+1),y=l.getX(x+2);s=ac(this,o,e,i,u,d,p,g,S,y),s&&(s.faceIndex=Math.floor(x/3),n.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let v=0,w=h.length;v<w;v++){const x=h[v],f=o[x.materialIndex],g=Math.max(x.start,m.start),S=Math.min(c.count,Math.min(x.start+x.count,m.start+m.count));for(let y=g,b=S;y<b;y+=3){const T=y,N=y+1,_=y+2;s=ac(this,f,e,i,u,d,p,T,N,_),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=x.materialIndex,n.push(s))}}else{const v=Math.max(0,m.start),w=Math.min(c.count,m.start+m.count);for(let x=v,f=w;x<f;x+=3){const g=x,S=x+1,y=x+2;s=ac(this,o,e,i,u,d,p,g,S,y),s&&(s.faceIndex=Math.floor(x/3),n.push(s))}}}}function l1(t,e,n,i,s,r,o,l){let c;if(e.side===Qn?c=i.intersectTriangle(o,r,s,!0,l):c=i.intersectTriangle(s,r,o,e.side===Ir,l),c===null)return null;rc.copy(l),rc.applyMatrix4(t.matrixWorld);const u=n.ray.origin.distanceTo(rc);return u<n.near||u>n.far?null:{distance:u,point:rc.clone(),object:t}}function ac(t,e,n,i,s,r,o,l,c,u){t.getVertexPosition(l,tc),t.getVertexPosition(c,nc),t.getVertexPosition(u,ic);const d=l1(t,e,n,i,tc,nc,ic,pv);if(d){const p=new I;Mi.getBarycoord(pv,tc,nc,ic,p),s&&(d.uv=Mi.getInterpolatedAttribute(s,l,c,u,p,new Ue)),r&&(d.uv1=Mi.getInterpolatedAttribute(r,l,c,u,p,new Ue)),o&&(d.normal=Mi.getInterpolatedAttribute(o,l,c,u,p,new I),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:l,b:c,c:u,normal:new I,materialIndex:0};Mi.getNormal(tc,nc,ic,h.normal),d.face=h,d.barycoord=p}return d}class um extends Pn{constructor(e=null,n=1,i=1,s,r,o,l,c,u=_n,d=_n,p,h){super(null,o,l,c,u,d,s,r,p,h),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class mv extends Ot{constructor(e,n,i,s=1){super(e,n,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ca=new At,gv=new At,oc=[],vv=new Hr,c1=new At,_o=new qt,yo=new Vr;class r2 extends qt{constructor(e,n,i){super(e,n),this.isInstancedMesh=!0,this.instanceMatrix=new mv(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,c1)}computeBoundingBox(){const e=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new Hr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,ca),vv.copy(e.boundingBox).applyMatrix4(ca),this.boundingBox.union(vv)}computeBoundingSphere(){const e=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new Vr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,ca),yo.copy(e.boundingSphere).applyMatrix4(ca),this.boundingSphere.union(yo)}copy(e,n){return super.copy(e,n),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,n){return this.instanceColor===null?n.setRGB(1,1,1):n.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,n){return n.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,n){const i=n.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=e*r+1;for(let l=0;l<i.length;l++)i[l]=s[o+l]}raycast(e,n){const i=this.matrixWorld,s=this.count;if(_o.geometry=this.geometry,_o.material=this.material,_o.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),yo.copy(this.boundingSphere),yo.applyMatrix4(i),e.ray.intersectsSphere(yo)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ca),gv.multiplyMatrices(i,ca),_o.matrixWorld=gv,_o.raycast(e,oc);for(let o=0,l=oc.length;o<l;o++){const c=oc[o];c.instanceId=r,c.object=this,n.push(c)}oc.length=0}}setColorAt(e,n){return this.instanceColor===null&&(this.instanceColor=new mv(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),n.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,n){return n.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,n){const i=n.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new um(new Float32Array(s*this.count),s,this.count,tm,Oi));const r=this.morphTexture.source.data.data;let o=0;for(let u=0;u<i.length;u++)o+=i[u];const l=this.geometry.morphTargetsRelative?1:1-o,c=s*e;return r[c]=l,r.set(i,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const gr=new Vr,u1=new Ue(.5,.5),lc=new I;class ty{constructor(e=new vs,n=new vs,i=new vs,s=new vs,r=new vs,o=new vs){this.planes=[e,n,i,s,r,o]}set(e,n,i,s,r,o){const l=this.planes;return l[0].copy(e),l[1].copy(n),l[2].copy(i),l[3].copy(s),l[4].copy(r),l[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Ji,i=!1){const s=this.planes,r=e.elements,o=r[0],l=r[1],c=r[2],u=r[3],d=r[4],p=r[5],h=r[6],m=r[7],v=r[8],w=r[9],x=r[10],f=r[11],g=r[12],S=r[13],y=r[14],b=r[15];if(s[0].setComponents(u-o,m-d,f-v,b-g).normalize(),s[1].setComponents(u+o,m+d,f+v,b+g).normalize(),s[2].setComponents(u+l,m+p,f+w,b+S).normalize(),s[3].setComponents(u-l,m-p,f-w,b-S).normalize(),i)s[4].setComponents(c,h,x,y).normalize(),s[5].setComponents(u-c,m-h,f-x,b-y).normalize();else if(s[4].setComponents(u-c,m-h,f-x,b-y).normalize(),n===Ji)s[5].setComponents(u+c,m+h,f+x,b+y).normalize();else if(n===xu)s[5].setComponents(c,h,x,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),gr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),gr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(gr)}intersectsSprite(e){gr.center.set(0,0,0);const n=u1.distanceTo(e.center);return gr.radius=.7071067811865476+n,gr.applyMatrix4(e.matrixWorld),this.intersectsSphere(gr)}intersectsSphere(e){const n=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(n[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const s=n[i];if(lc.x=s.normal.x>0?e.max.x:e.min.x,lc.y=s.normal.y>0?e.max.y:e.min.y,lc.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(lc)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class yr extends Gr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new it(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Mu=new I,wu=new I,xv=new At,So=new gl,cc=new Vr,Xd=new I,_v=new I;class Vf extends Dn{constructor(e=new Dt,n=new yr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let s=1,r=n.count;s<r;s++)Mu.fromBufferAttribute(n,s-1),wu.fromBufferAttribute(n,s),i[s]=i[s-1],i[s]+=Mu.distanceTo(wu);e.setAttribute("lineDistance",new ft(i,1))}else Ke("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),cc.copy(i.boundingSphere),cc.applyMatrix4(s),cc.radius+=r,e.ray.intersectsSphere(cc)===!1)return;xv.copy(s).invert(),So.copy(e.ray).applyMatrix4(xv);const l=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=l*l,u=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const m=Math.max(0,o.start),v=Math.min(d.count,o.start+o.count);for(let w=m,x=v-1;w<x;w+=u){const f=d.getX(w),g=d.getX(w+1),S=uc(this,e,So,c,f,g,w);S&&n.push(S)}if(this.isLineLoop){const w=d.getX(v-1),x=d.getX(m),f=uc(this,e,So,c,w,x,v-1);f&&n.push(f)}}else{const m=Math.max(0,o.start),v=Math.min(h.count,o.start+o.count);for(let w=m,x=v-1;w<x;w+=u){const f=uc(this,e,So,c,w,w+1,w);f&&n.push(f)}if(this.isLineLoop){const w=uc(this,e,So,c,v-1,m,v-1);w&&n.push(w)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const l=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=r}}}}}function uc(t,e,n,i,s,r,o){const l=t.geometry.attributes.position;if(Mu.fromBufferAttribute(l,s),wu.fromBufferAttribute(l,r),n.distanceSqToSegment(Mu,wu,Xd,_v)>i)return;Xd.applyMatrix4(t.matrixWorld);const u=e.ray.origin.distanceTo(Xd);if(!(u<e.near||u>e.far))return{distance:u,point:_v.clone().applyMatrix4(t.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:t}}const yv=new I,Sv=new I;class dc extends Vf{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let s=0,r=n.count;s<r;s+=2)yv.fromBufferAttribute(n,s),Sv.fromBufferAttribute(n,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+yv.distanceTo(Sv);e.setAttribute("lineDistance",new ft(i,1))}else Ke("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class d1 extends Gr{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new it(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Mv=new At,Gf=new gl,hc=new Vr,fc=new I;class pc extends Dn{constructor(e=new Dt,n=new d1){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),hc.copy(i.boundingSphere),hc.applyMatrix4(s),hc.radius+=r,e.ray.intersectsSphere(hc)===!1)return;Mv.copy(s).invert(),Gf.copy(e.ray).applyMatrix4(Mv);const l=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=l*l,u=i.index,p=i.attributes.position;if(u!==null){const h=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let v=h,w=m;v<w;v++){const x=u.getX(v);fc.fromBufferAttribute(p,x),wv(fc,x,c,s,e,n,this)}}else{const h=Math.max(0,o.start),m=Math.min(p.count,o.start+o.count);for(let v=h,w=m;v<w;v++)fc.fromBufferAttribute(p,v),wv(fc,v,c,s,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const s=n[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const l=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=r}}}}}function wv(t,e,n,i,s,r,o){const l=Gf.distanceSqToPoint(t);if(l<n){const c=new I;Gf.closestPointToPoint(t,c),c.applyMatrix4(i);const u=s.ray.origin.distanceTo(c);if(u<s.near||u>s.far)return;r.push({distance:u,distanceToRay:Math.sqrt(l),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class ny extends Pn{constructor(e=[],n=Ur,i,s,r,o,l,c,u,d){super(e,n,i,s,r,o,l,c,u,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class iy extends Pn{constructor(e,n,i,s,r,o,l,c,u){super(e,n,i,s,r,o,l,c,u),this.isCanvasTexture=!0,this.needsUpdate=!0}}class cl extends Pn{constructor(e,n,i=ss,s,r,o,l=_n,c=_n,u,d=Ns,p=1){if(d!==Ns&&d!==Tr)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:n,depth:p};super(h,s,r,o,l,c,d,i,u),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new lm(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return n.compareFunction=this.compareFunction,n}}class h1 extends cl{constructor(e,n=ss,i=Ur,s,r,o=_n,l=_n,c,u=Ns){const d={width:e,height:e,depth:1},p=[d,d,d,d,d,d];super(e,e,n,i,s,r,o,l,c,u),this.image=p,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class sy extends Pn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class vl extends Dt{constructor(e=1,n=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};const l=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],u=[],d=[],p=[];let h=0,m=0;v("z","y","x",-1,-1,i,n,e,o,r,0),v("z","y","x",1,-1,i,n,-e,o,r,1),v("x","z","y",1,1,e,i,n,s,o,2),v("x","z","y",1,-1,e,i,-n,s,o,3),v("x","y","z",1,-1,e,n,i,s,r,4),v("x","y","z",-1,-1,e,n,-i,s,r,5),this.setIndex(c),this.setAttribute("position",new ft(u,3)),this.setAttribute("normal",new ft(d,3)),this.setAttribute("uv",new ft(p,2));function v(w,x,f,g,S,y,b,T,N,_,C){const R=y/N,k=b/_,B=y/2,D=b/2,P=T/2,j=N+1,Q=_+1;let W=0,G=0;const H=new I;for(let X=0;X<Q;X++){const J=X*k-D;for(let ve=0;ve<j;ve++){const Ie=ve*R-B;H[w]=Ie*g,H[x]=J*S,H[f]=P,u.push(H.x,H.y,H.z),H[w]=0,H[x]=0,H[f]=T>0?1:-1,d.push(H.x,H.y,H.z),p.push(ve/N),p.push(1-X/_),W+=1}}for(let X=0;X<_;X++)for(let J=0;J<N;J++){const ve=h+J+j*X,Ie=h+J+j*(X+1),Qe=h+(J+1)+j*(X+1),re=h+(J+1)+j*X;c.push(ve,Ie,re),c.push(Ie,Qe,re),G+=6}l.addGroup(m,G,C),m+=G,h+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vl(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class dm extends Dt{constructor(e=1,n=1,i=1,s=32,r=1,o=!1,l=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:l,thetaLength:c};const u=this;s=Math.floor(s),r=Math.floor(r);const d=[],p=[],h=[],m=[];let v=0;const w=[],x=i/2;let f=0;g(),o===!1&&(e>0&&S(!0),n>0&&S(!1)),this.setIndex(d),this.setAttribute("position",new ft(p,3)),this.setAttribute("normal",new ft(h,3)),this.setAttribute("uv",new ft(m,2));function g(){const y=new I,b=new I;let T=0;const N=(n-e)/i;for(let _=0;_<=r;_++){const C=[],R=_/r,k=R*(n-e)+e;for(let B=0;B<=s;B++){const D=B/s,P=D*c+l,j=Math.sin(P),Q=Math.cos(P);b.x=k*j,b.y=-R*i+x,b.z=k*Q,p.push(b.x,b.y,b.z),y.set(j,N,Q).normalize(),h.push(y.x,y.y,y.z),m.push(D,1-R),C.push(v++)}w.push(C)}for(let _=0;_<s;_++)for(let C=0;C<r;C++){const R=w[C][_],k=w[C+1][_],B=w[C+1][_+1],D=w[C][_+1];(e>0||C!==0)&&(d.push(R,k,D),T+=3),(n>0||C!==r-1)&&(d.push(k,B,D),T+=3)}u.addGroup(f,T,0),f+=T}function S(y){const b=v,T=new Ue,N=new I;let _=0;const C=y===!0?e:n,R=y===!0?1:-1;for(let B=1;B<=s;B++)p.push(0,x*R,0),h.push(0,R,0),m.push(.5,.5),v++;const k=v;for(let B=0;B<=s;B++){const P=B/s*c+l,j=Math.cos(P),Q=Math.sin(P);N.x=C*Q,N.y=x*R,N.z=C*j,p.push(N.x,N.y,N.z),h.push(0,R,0),T.x=j*.5+.5,T.y=Q*.5*R+.5,m.push(T.x,T.y),v++}for(let B=0;B<s;B++){const D=b+B,P=k+B;y===!0?d.push(P,P+1,D):d.push(P+1,P,D),_+=3}u.addGroup(f,_,y===!0?1:2),f+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new dm(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class hm extends Dt{constructor(e=[],n=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:n,radius:i,detail:s};const r=[],o=[];l(s),u(i),d(),this.setAttribute("position",new ft(r,3)),this.setAttribute("normal",new ft(r.slice(),3)),this.setAttribute("uv",new ft(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function l(g){const S=new I,y=new I,b=new I;for(let T=0;T<n.length;T+=3)m(n[T+0],S),m(n[T+1],y),m(n[T+2],b),c(S,y,b,g)}function c(g,S,y,b){const T=b+1,N=[];for(let _=0;_<=T;_++){N[_]=[];const C=g.clone().lerp(y,_/T),R=S.clone().lerp(y,_/T),k=T-_;for(let B=0;B<=k;B++)B===0&&_===T?N[_][B]=C:N[_][B]=C.clone().lerp(R,B/k)}for(let _=0;_<T;_++)for(let C=0;C<2*(T-_)-1;C++){const R=Math.floor(C/2);C%2===0?(h(N[_][R+1]),h(N[_+1][R]),h(N[_][R])):(h(N[_][R+1]),h(N[_+1][R+1]),h(N[_+1][R]))}}function u(g){const S=new I;for(let y=0;y<r.length;y+=3)S.x=r[y+0],S.y=r[y+1],S.z=r[y+2],S.normalize().multiplyScalar(g),r[y+0]=S.x,r[y+1]=S.y,r[y+2]=S.z}function d(){const g=new I;for(let S=0;S<r.length;S+=3){g.x=r[S+0],g.y=r[S+1],g.z=r[S+2];const y=x(g)/2/Math.PI+.5,b=f(g)/Math.PI+.5;o.push(y,1-b)}v(),p()}function p(){for(let g=0;g<o.length;g+=6){const S=o[g+0],y=o[g+2],b=o[g+4],T=Math.max(S,y,b),N=Math.min(S,y,b);T>.9&&N<.1&&(S<.2&&(o[g+0]+=1),y<.2&&(o[g+2]+=1),b<.2&&(o[g+4]+=1))}}function h(g){r.push(g.x,g.y,g.z)}function m(g,S){const y=g*3;S.x=e[y+0],S.y=e[y+1],S.z=e[y+2]}function v(){const g=new I,S=new I,y=new I,b=new I,T=new Ue,N=new Ue,_=new Ue;for(let C=0,R=0;C<r.length;C+=9,R+=6){g.set(r[C+0],r[C+1],r[C+2]),S.set(r[C+3],r[C+4],r[C+5]),y.set(r[C+6],r[C+7],r[C+8]),T.set(o[R+0],o[R+1]),N.set(o[R+2],o[R+3]),_.set(o[R+4],o[R+5]),b.copy(g).add(S).add(y).divideScalar(3);const k=x(b);w(T,R+0,g,k),w(N,R+2,S,k),w(_,R+4,y,k)}}function w(g,S,y,b){b<0&&g.x===1&&(o[S]=g.x-1),y.x===0&&y.z===0&&(o[S]=b/2/Math.PI+.5)}function x(g){return Math.atan2(g.z,-g.x)}function f(g){return Math.atan2(-g.y,Math.sqrt(g.x*g.x+g.z*g.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hm(e.vertices,e.indices,e.radius,e.detail)}}class ry{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ke("Curve: .getPoint() not implemented.")}getPointAt(e,n){const i=this.getUtoTmapping(e);return this.getPoint(i,n)}getPoints(e=5){const n=[];for(let i=0;i<=e;i++)n.push(this.getPoint(i/e));return n}getSpacedPoints(e=5){const n=[];for(let i=0;i<=e;i++)n.push(this.getPointAt(i/e));return n}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const n=[];let i,s=this.getPoint(0),r=0;n.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),r+=i.distanceTo(s),n.push(r),s=i;return this.cacheArcLengths=n,n}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,n=null){const i=this.getLengths();let s=0;const r=i.length;let o;n?o=n:o=e*i[r-1];let l=0,c=r-1,u;for(;l<=c;)if(s=Math.floor(l+(c-l)/2),u=i[s]-o,u<0)l=s+1;else if(u>0)c=s-1;else{c=s;break}if(s=c,i[s]===o)return s/(r-1);const d=i[s],h=i[s+1]-d,m=(o-d)/h;return(s+m)/(r-1)}getTangent(e,n){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),l=this.getPoint(r),c=n||(o.isVector2?new Ue:new I);return c.copy(l).sub(o).normalize(),c}getTangentAt(e,n){const i=this.getUtoTmapping(e);return this.getTangent(i,n)}computeFrenetFrames(e,n=!1){const i=new I,s=[],r=[],o=[],l=new I,c=new At;for(let m=0;m<=e;m++){const v=m/e;s[m]=this.getTangentAt(v,new I)}r[0]=new I,o[0]=new I;let u=Number.MAX_VALUE;const d=Math.abs(s[0].x),p=Math.abs(s[0].y),h=Math.abs(s[0].z);d<=u&&(u=d,i.set(1,0,0)),p<=u&&(u=p,i.set(0,1,0)),h<=u&&i.set(0,0,1),l.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],l),o[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),o[m]=o[m-1].clone(),l.crossVectors(s[m-1],s[m]),l.length()>Number.EPSILON){l.normalize();const v=Math.acos(lt(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(c.makeRotationAxis(l,v))}o[m].crossVectors(s[m],r[m])}if(n===!0){let m=Math.acos(lt(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(l.crossVectors(r[0],r[e]))>0&&(m=-m);for(let v=1;v<=e;v++)r[v].applyMatrix4(c.makeRotationAxis(s[v],m*v)),o[v].crossVectors(s[v],r[v])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}function fm(){let t=0,e=0,n=0,i=0;function s(r,o,l,c){t=r,e=l,n=-3*r+3*o-2*l-c,i=2*r-2*o+l+c}return{initCatmullRom:function(r,o,l,c,u){s(o,l,u*(l-r),u*(c-o))},initNonuniformCatmullRom:function(r,o,l,c,u,d,p){let h=(o-r)/u-(l-r)/(u+d)+(l-o)/d,m=(l-o)/d-(c-o)/(d+p)+(c-l)/p;h*=d,m*=d,s(o,l,h,m)},calc:function(r){const o=r*r,l=o*r;return t+e*r+n*o+i*l}}}const bv=new I,Ev=new I,Yd=new fm,qd=new fm,Kd=new fm;class a2 extends ry{constructor(e=[],n=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=n,this.curveType=i,this.tension=s}getPoint(e,n=new I){const i=n,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e;let l=Math.floor(o),c=o-l;this.closed?l+=l>0?0:(Math.floor(Math.abs(l)/r)+1)*r:c===0&&l===r-1&&(l=r-2,c=1);let u,d;this.closed||l>0?u=s[(l-1)%r]:(Ev.subVectors(s[0],s[1]).add(s[0]),u=Ev);const p=s[l%r],h=s[(l+1)%r];if(this.closed||l+2<r?d=s[(l+2)%r]:(bv.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=bv),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let v=Math.pow(u.distanceToSquared(p),m),w=Math.pow(p.distanceToSquared(h),m),x=Math.pow(h.distanceToSquared(d),m);w<1e-4&&(w=1),v<1e-4&&(v=w),x<1e-4&&(x=w),Yd.initNonuniformCatmullRom(u.x,p.x,h.x,d.x,v,w,x),qd.initNonuniformCatmullRom(u.y,p.y,h.y,d.y,v,w,x),Kd.initNonuniformCatmullRom(u.z,p.z,h.z,d.z,v,w,x)}else this.curveType==="catmullrom"&&(Yd.initCatmullRom(u.x,p.x,h.x,d.x,this.tension),qd.initCatmullRom(u.y,p.y,h.y,d.y,this.tension),Kd.initCatmullRom(u.z,p.z,h.z,d.z,this.tension));return i.set(Yd.calc(c),qd.calc(c),Kd.calc(c)),i}copy(e){super.copy(e),this.points=[];for(let n=0,i=e.points.length;n<i;n++){const s=e.points[n];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let n=0,i=this.points.length;n<i;n++){const s=this.points[n];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let n=0,i=e.points.length;n<i;n++){const s=e.points[n];this.points.push(new I().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function f1(t,e){const n=1-t;return n*n*e}function p1(t,e){return 2*(1-t)*t*e}function m1(t,e){return t*t*e}function Zd(t,e,n,i){return f1(t,e)+p1(t,n)+m1(t,i)}class o2 extends ry{constructor(e=new I,n=new I,i=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=n,this.v2=i}getPoint(e,n=new I){const i=n,s=this.v0,r=this.v1,o=this.v2;return i.set(Zd(e,s.x,r.x,o.x),Zd(e,s.y,r.y,o.y),Zd(e,s.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ay extends hm{constructor(e=1,n=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,n),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new ay(e.radius,e.detail)}}class xl extends Dt{constructor(e=1,n=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:s};const r=e/2,o=n/2,l=Math.floor(i),c=Math.floor(s),u=l+1,d=c+1,p=e/l,h=n/c,m=[],v=[],w=[],x=[];for(let f=0;f<d;f++){const g=f*h-o;for(let S=0;S<u;S++){const y=S*p-r;v.push(y,-g,0),w.push(0,0,1),x.push(S/l),x.push(1-f/c)}}for(let f=0;f<c;f++)for(let g=0;g<l;g++){const S=g+u*f,y=g+u*(f+1),b=g+1+u*(f+1),T=g+1+u*f;m.push(S,y,T),m.push(y,b,T)}this.setIndex(m),this.setAttribute("position",new ft(v,3)),this.setAttribute("normal",new ft(w,3)),this.setAttribute("uv",new ft(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xl(e.width,e.height,e.widthSegments,e.heightSegments)}}class Vs extends Dt{constructor(e=.5,n=1,i=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:n,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:o},i=Math.max(3,i),s=Math.max(1,s);const l=[],c=[],u=[],d=[];let p=e;const h=(n-e)/s,m=new I,v=new Ue;for(let w=0;w<=s;w++){for(let x=0;x<=i;x++){const f=r+x/i*o;m.x=p*Math.cos(f),m.y=p*Math.sin(f),c.push(m.x,m.y,m.z),u.push(0,0,1),v.x=(m.x/n+1)/2,v.y=(m.y/n+1)/2,d.push(v.x,v.y)}p+=h}for(let w=0;w<s;w++){const x=w*(i+1);for(let f=0;f<i;f++){const g=f+x,S=g,y=g+i+1,b=g+i+2,T=g+1;l.push(S,y,T),l.push(y,b,T)}}this.setIndex(l),this.setAttribute("position",new ft(c,3)),this.setAttribute("normal",new ft(u,3)),this.setAttribute("uv",new ft(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vs(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class pm extends Dt{constructor(e=1,n=32,i=16,s=0,r=Math.PI*2,o=0,l=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:s,phiLength:r,thetaStart:o,thetaLength:l},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const c=Math.min(o+l,Math.PI);let u=0;const d=[],p=new I,h=new I,m=[],v=[],w=[],x=[];for(let f=0;f<=i;f++){const g=[],S=f/i,y=o+S*l,b=e*Math.cos(y),T=Math.sqrt(e*e-b*b);let N=0;f===0&&o===0?N=.5/n:f===i&&c===Math.PI&&(N=-.5/n);for(let _=0;_<=n;_++){const C=_/n,R=s+C*r;p.x=-T*Math.cos(R),p.y=b,p.z=T*Math.sin(R),v.push(p.x,p.y,p.z),h.copy(p).normalize(),w.push(h.x,h.y,h.z),x.push(C+N,1-S),g.push(u++)}d.push(g)}for(let f=0;f<i;f++)for(let g=0;g<n;g++){const S=d[f][g+1],y=d[f][g],b=d[f+1][g],T=d[f+1][g+1];(f!==0||o>0)&&m.push(S,y,T),(f!==i-1||c<Math.PI)&&m.push(y,b,T)}this.setIndex(m),this.setAttribute("position",new ft(v,3)),this.setAttribute("normal",new ft(w,3)),this.setAttribute("uv",new ft(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pm(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class oy extends Dt{constructor(e=1,n=.4,i=12,s=48,r=Math.PI*2,o=0,l=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:n,radialSegments:i,tubularSegments:s,arc:r,thetaStart:o,thetaLength:l},i=Math.floor(i),s=Math.floor(s);const c=[],u=[],d=[],p=[],h=new I,m=new I,v=new I;for(let w=0;w<=i;w++){const x=o+w/i*l;for(let f=0;f<=s;f++){const g=f/s*r;m.x=(e+n*Math.cos(x))*Math.cos(g),m.y=(e+n*Math.cos(x))*Math.sin(g),m.z=n*Math.sin(x),u.push(m.x,m.y,m.z),h.x=e*Math.cos(g),h.y=e*Math.sin(g),v.subVectors(m,h).normalize(),d.push(v.x,v.y,v.z),p.push(f/s),p.push(w/i)}}for(let w=1;w<=i;w++)for(let x=1;x<=s;x++){const f=(s+1)*w+x-1,g=(s+1)*(w-1)+x-1,S=(s+1)*(w-1)+x,y=(s+1)*w+x;c.push(f,g,y),c.push(g,S,y)}this.setIndex(c),this.setAttribute("position",new ft(u,3)),this.setAttribute("normal",new ft(d,3)),this.setAttribute("uv",new ft(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new oy(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}function Wa(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const s=t[n][i];if(Tv(s))s.isRenderTargetTexture?(Ke("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=s.clone();else if(Array.isArray(s))if(Tv(s[0])){const r=[];for(let o=0,l=s.length;o<l;o++)r[o]=s[o].clone();e[n][i]=r}else e[n][i]=s.slice();else e[n][i]=s}}return e}function On(t){const e={};for(let n=0;n<t.length;n++){const i=Wa(t[n]);for(const s in i)e[s]=i[s]}return e}function Tv(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function g1(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function ly(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ht.workingColorSpace}const ul={clone:Wa,merge:On};var v1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,x1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Zt extends Gr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=v1,this.fragmentShader=x1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Wa(e.uniforms),this.uniformsGroups=g1(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?n.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[s]={type:"m4",value:o.toArray()}:n.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(e,n){if(super.fromJSON(e,n),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=n[s.value]||null;break;case"c":this.uniforms[i].value=new it().setHex(s.value);break;case"v2":this.uniforms[i].value=new Ue().fromArray(s.value);break;case"v3":this.uniforms[i].value=new I().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Yt().fromArray(s.value);break;case"m3":this.uniforms[i].value=new tt().fromArray(s.value);break;case"m4":this.uniforms[i].value=new At().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class cy extends Zt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class _1 extends Gr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=hE,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class y1 extends Gr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const mc=new I,gc=new rr,$i=new I;class uy extends Dn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new At,this.projectionMatrix=new At,this.projectionMatrixInverse=new At,this.coordinateSystem=Ji,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(mc,gc,$i),$i.x===1&&$i.y===1&&$i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(mc,gc,$i.set(1,1,1)).invert()}updateWorldMatrix(e,n,i=!1){super.updateWorldMatrix(e,n,i),this.matrixWorld.decompose(mc,gc,$i),$i.x===1&&$i.y===1&&$i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(mc,gc,$i.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Os=new I,Av=new Ue,Nv=new Ue;class yi extends uy{constructor(e=50,n=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=ll*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Bo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ll*2*Math.atan(Math.tan(Bo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Os.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Os.x,Os.y).multiplyScalar(-e/Os.z),Os.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Os.x,Os.y).multiplyScalar(-e/Os.z)}getViewSize(e,n){return this.getViewBounds(e,Av,Nv),n.subVectors(Nv,Av)}setViewOffset(e,n,i,s,r,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Bo*.5*this.fov)/this.zoom,i=2*n,s=this.aspect*i,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,u=o.fullHeight;r+=o.offsetX*s/c,n-=o.offsetY*i/u,s*=o.width/c,i*=o.height/u}const l=this.filmOffset;l!==0&&(r+=e*l/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}class mm extends uy{constructor(e=-1,n=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,o=i+e,l=s+n,c=s-n;if(this.view!==null&&this.view.enabled){const u=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=u*this.view.offsetX,o=r+u*this.view.width,l-=d*this.view.offsetY,c=l-d*this.view.height}this.projectionMatrix.makeOrthographic(r,o,l,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const ua=-90,da=1;class S1 extends Dn{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new yi(ua,da,e,n);s.layers=this.layers,this.add(s);const r=new yi(ua,da,e,n);r.layers=this.layers,this.add(r);const o=new yi(ua,da,e,n);o.layers=this.layers,this.add(o);const l=new yi(ua,da,e,n);l.layers=this.layers,this.add(l);const c=new yi(ua,da,e,n);c.layers=this.layers,this.add(c);const u=new yi(ua,da,e,n);u.layers=this.layers,this.add(u)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,s,r,o,l,c]=n;for(const u of n)this.remove(u);if(e===Ji)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),l.up.set(0,1,0),l.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===xu)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),l.up.set(0,-1,0),l.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const u of n)this.add(u),u.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,l,c,u,d]=this.children,p=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const w=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let x=!1;e.isWebGLRenderer===!0?x=e.state.buffers.depth.getReversed():x=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,r),e.setRenderTarget(i,1,s),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,2,s),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),e.setRenderTarget(i,3,s),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),e.setRenderTarget(i,4,s),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,u),i.texture.generateMipmaps=w,e.setRenderTarget(i,5,s),x&&e.autoClear===!1&&e.clearDepth(),e.render(n,d),e.setRenderTarget(p,h,m),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class M1 extends yi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class w1{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=b1.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function b1(){this._document.hidden===!1&&this.reset()}const Cv=new At;class E1{constructor(e,n,i=0,s=1/0){this.ray=new gl(e,n),this.near=i,this.far=s,this.camera=null,this.layers=new cm,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,n.projectionMatrix.elements[14]).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):mt("Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return Cv.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Cv),this}intersectObject(e,n=!0,i=[]){return Wf(e,this,i,n),i.sort(Rv),i}intersectObjects(e,n=!0,i=[]){for(let s=0,r=e.length;s<r;s++)Wf(e[s],this,i,n);return i.sort(Rv),i}}function Rv(t,e){return t.distance-e.distance}function Wf(t,e,n,i){let s=!0;if(t.layers.test(e.layers)&&t.raycast(e,n)===!1&&(s=!1),s===!0&&i===!0){const r=t.children;for(let o=0,l=r.length;o<l;o++)Wf(r[o],e,n,!0)}}class Pv{constructor(e=1,n=0,i=0){this.radius=e,this.phi=n,this.theta=i}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=lt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(lt(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Mm=class Mm{constructor(e,n,i,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,n,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,n=0){for(let i=0;i<4;i++)this.elements[i]=e[i+n];return this}set(e,n,i,s){const r=this.elements;return r[0]=e,r[2]=n,r[1]=i,r[3]=s,this}};Mm.prototype.isMatrix2=!0;let Lv=Mm;class T1 extends cr{constructor(e,n=null){super(),this.object=e,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Dv(t,e,n,i){const s=A1(i);switch(n){case $_:return t*e;case tm:return t*e/s.components*s.byteLength;case nm:return t*e/s.components*s.byteLength;case Fr:return t*e*2/s.components*s.byteLength;case im:return t*e*2/s.components*s.byteLength;case X_:return t*e*3/s.components*s.byteLength;case bi:return t*e*4/s.components*s.byteLength;case sm:return t*e*4/s.components*s.byteLength;case Uc:case Fc:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Oc:case jc:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case hf:case pf:return Math.max(t,16)*Math.max(e,8)/4;case df:case ff:return Math.max(t,8)*Math.max(e,8)/2;case mf:case gf:case xf:case _f:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case vf:case pu:case yf:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Sf:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Mf:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case wf:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case bf:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Ef:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Tf:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Af:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Nf:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Cf:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Rf:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Pf:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Lf:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Df:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case kf:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case If:case Uf:case Ff:return Math.ceil(t/4)*Math.ceil(e/4)*16;case Of:case jf:return Math.ceil(t/4)*Math.ceil(e/4)*8;case mu:case Bf:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function A1(t){switch(t){case Si:case H_:return{byteLength:1,components:1};case al:case V_:case Hn:return{byteLength:2,components:1};case Jp:case em:return{byteLength:2,components:4};case ss:case Qp:case Oi:return{byteLength:4,components:1};case G_:case W_:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Wp}}));typeof window<"u"&&(window.__THREE__?Ke("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Wp);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function dy(){let t=null,e=!1,n=null,i=null;function s(r,o){i=t.requestAnimationFrame(s),n(r,o)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(s),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){n=r},setContext:function(r){t=r}}}function N1(t){const e=new WeakMap;function n(l,c){const u=l.array,d=l.usage,p=u.byteLength,h=t.createBuffer();t.bindBuffer(c,h),t.bufferData(c,u,d),l.onUploadCallback();let m;if(u instanceof Float32Array)m=t.FLOAT;else if(typeof Float16Array<"u"&&u instanceof Float16Array)m=t.HALF_FLOAT;else if(u instanceof Uint16Array)l.isFloat16BufferAttribute?m=t.HALF_FLOAT:m=t.UNSIGNED_SHORT;else if(u instanceof Int16Array)m=t.SHORT;else if(u instanceof Uint32Array)m=t.UNSIGNED_INT;else if(u instanceof Int32Array)m=t.INT;else if(u instanceof Int8Array)m=t.BYTE;else if(u instanceof Uint8Array)m=t.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)m=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:h,type:m,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:p}}function i(l,c,u){const d=c.array,p=c.updateRanges;if(t.bindBuffer(u,l),p.length===0)t.bufferSubData(u,0,d);else{p.sort((m,v)=>m.start-v.start);let h=0;for(let m=1;m<p.length;m++){const v=p[h],w=p[m];w.start<=v.start+v.count+1?v.count=Math.max(v.count,w.start+w.count-v.start):(++h,p[h]=w)}p.length=h+1;for(let m=0,v=p.length;m<v;m++){const w=p[m];t.bufferSubData(u,w.start*d.BYTES_PER_ELEMENT,d,w.start,w.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(l){return l.isInterleavedBufferAttribute&&(l=l.data),e.get(l)}function r(l){l.isInterleavedBufferAttribute&&(l=l.data);const c=e.get(l);c&&(t.deleteBuffer(c.buffer),e.delete(l))}function o(l,c){if(l.isInterleavedBufferAttribute&&(l=l.data),l.isGLBufferAttribute){const d=e.get(l);(!d||d.version<l.version)&&e.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}const u=e.get(l);if(u===void 0)e.set(l,n(l,c));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(u.buffer,l,c),u.version=l.version}}return{get:s,remove:r,update:o}}var C1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,R1=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,P1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,L1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,D1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,k1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,I1=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,U1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,F1=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,O1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,j1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,B1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,z1=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,H1=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,V1=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,G1=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,W1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,$1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,X1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Y1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,q1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,K1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Z1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Q1=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,J1=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,eT=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,tT=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,nT=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,iT=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,sT=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,rT="gl_FragColor = linearToOutputTexel( gl_FragColor );",aT=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,oT=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,lT=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,cT=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,uT=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,dT=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,hT=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fT=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,pT=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,mT=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gT=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,vT=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,xT=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,_T=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,yT=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,ST=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,MT=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,wT=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,bT=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ET=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,TT=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,AT=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,NT=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,CT=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,RT=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,PT=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,LT=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,DT=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,kT=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,IT=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,UT=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,FT=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,OT=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,jT=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,BT=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,zT=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,HT=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,VT=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,GT=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,WT=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,$T=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,XT=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,YT=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,qT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,KT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ZT=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,QT=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,JT=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,eA=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,tA=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,nA=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,iA=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,sA=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,rA=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,aA=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,oA=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,lA=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,cA=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,uA=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dA=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,hA=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,fA=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,pA=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,mA=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gA=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,vA=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,xA=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,_A=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,yA=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,SA=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,MA=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,wA=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,bA=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,EA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,TA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,AA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,NA=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const CA=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,RA=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,PA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,LA=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,DA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kA=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,IA=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,UA=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,FA=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,OA=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,jA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,BA=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zA=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,HA=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,VA=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,GA=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,WA=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$A=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,XA=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,YA=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qA=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,KA=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,ZA=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,QA=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,JA=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,eN=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tN=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nN=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,iN=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,sN=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rN=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,aN=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,oN=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,lN=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ot={alphahash_fragment:C1,alphahash_pars_fragment:R1,alphamap_fragment:P1,alphamap_pars_fragment:L1,alphatest_fragment:D1,alphatest_pars_fragment:k1,aomap_fragment:I1,aomap_pars_fragment:U1,batching_pars_vertex:F1,batching_vertex:O1,begin_vertex:j1,beginnormal_vertex:B1,bsdfs:z1,iridescence_fragment:H1,bumpmap_pars_fragment:V1,clipping_planes_fragment:G1,clipping_planes_pars_fragment:W1,clipping_planes_pars_vertex:$1,clipping_planes_vertex:X1,color_fragment:Y1,color_pars_fragment:q1,color_pars_vertex:K1,color_vertex:Z1,common:Q1,cube_uv_reflection_fragment:J1,defaultnormal_vertex:eT,displacementmap_pars_vertex:tT,displacementmap_vertex:nT,emissivemap_fragment:iT,emissivemap_pars_fragment:sT,colorspace_fragment:rT,colorspace_pars_fragment:aT,envmap_fragment:oT,envmap_common_pars_fragment:lT,envmap_pars_fragment:cT,envmap_pars_vertex:uT,envmap_physical_pars_fragment:ST,envmap_vertex:dT,fog_vertex:hT,fog_pars_vertex:fT,fog_fragment:pT,fog_pars_fragment:mT,gradientmap_pars_fragment:gT,lightmap_pars_fragment:vT,lights_lambert_fragment:xT,lights_lambert_pars_fragment:_T,lights_pars_begin:yT,lights_toon_fragment:MT,lights_toon_pars_fragment:wT,lights_phong_fragment:bT,lights_phong_pars_fragment:ET,lights_physical_fragment:TT,lights_physical_pars_fragment:AT,lights_fragment_begin:NT,lights_fragment_maps:CT,lights_fragment_end:RT,lightprobes_pars_fragment:PT,logdepthbuf_fragment:LT,logdepthbuf_pars_fragment:DT,logdepthbuf_pars_vertex:kT,logdepthbuf_vertex:IT,map_fragment:UT,map_pars_fragment:FT,map_particle_fragment:OT,map_particle_pars_fragment:jT,metalnessmap_fragment:BT,metalnessmap_pars_fragment:zT,morphinstance_vertex:HT,morphcolor_vertex:VT,morphnormal_vertex:GT,morphtarget_pars_vertex:WT,morphtarget_vertex:$T,normal_fragment_begin:XT,normal_fragment_maps:YT,normal_pars_fragment:qT,normal_pars_vertex:KT,normal_vertex:ZT,normalmap_pars_fragment:QT,clearcoat_normal_fragment_begin:JT,clearcoat_normal_fragment_maps:eA,clearcoat_pars_fragment:tA,iridescence_pars_fragment:nA,opaque_fragment:iA,packing:sA,premultiplied_alpha_fragment:rA,project_vertex:aA,dithering_fragment:oA,dithering_pars_fragment:lA,roughnessmap_fragment:cA,roughnessmap_pars_fragment:uA,shadowmap_pars_fragment:dA,shadowmap_pars_vertex:hA,shadowmap_vertex:fA,shadowmask_pars_fragment:pA,skinbase_vertex:mA,skinning_pars_vertex:gA,skinning_vertex:vA,skinnormal_vertex:xA,specularmap_fragment:_A,specularmap_pars_fragment:yA,tonemapping_fragment:SA,tonemapping_pars_fragment:MA,transmission_fragment:wA,transmission_pars_fragment:bA,uv_pars_fragment:EA,uv_pars_vertex:TA,uv_vertex:AA,worldpos_vertex:NA,background_vert:CA,background_frag:RA,backgroundCube_vert:PA,backgroundCube_frag:LA,cube_vert:DA,cube_frag:kA,depth_vert:IA,depth_frag:UA,distance_vert:FA,distance_frag:OA,equirect_vert:jA,equirect_frag:BA,linedashed_vert:zA,linedashed_frag:HA,meshbasic_vert:VA,meshbasic_frag:GA,meshlambert_vert:WA,meshlambert_frag:$A,meshmatcap_vert:XA,meshmatcap_frag:YA,meshnormal_vert:qA,meshnormal_frag:KA,meshphong_vert:ZA,meshphong_frag:QA,meshphysical_vert:JA,meshphysical_frag:eN,meshtoon_vert:tN,meshtoon_frag:nN,points_vert:iN,points_frag:sN,shadow_vert:rN,shadow_frag:aN,sprite_vert:oN,sprite_frag:lN},Ne={common:{diffuse:{value:new it(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new tt}},envmap:{envMap:{value:null},envMapRotation:{value:new tt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new tt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new tt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new tt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new tt},normalScale:{value:new Ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new tt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new tt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new tt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new tt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new it(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new I},probesMax:{value:new I},probesResolution:{value:new I}},points:{diffuse:{value:new it(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0},uvTransform:{value:new tt}},sprite:{diffuse:{value:new it(16777215)},opacity:{value:1},center:{value:new Ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}}},Ki={basic:{uniforms:On([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.fog]),vertexShader:ot.meshbasic_vert,fragmentShader:ot.meshbasic_frag},lambert:{uniforms:On([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,Ne.lights,{emissive:{value:new it(0)},envMapIntensity:{value:1}}]),vertexShader:ot.meshlambert_vert,fragmentShader:ot.meshlambert_frag},phong:{uniforms:On([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,Ne.lights,{emissive:{value:new it(0)},specular:{value:new it(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ot.meshphong_vert,fragmentShader:ot.meshphong_frag},standard:{uniforms:On([Ne.common,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.roughnessmap,Ne.metalnessmap,Ne.fog,Ne.lights,{emissive:{value:new it(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ot.meshphysical_vert,fragmentShader:ot.meshphysical_frag},toon:{uniforms:On([Ne.common,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.gradientmap,Ne.fog,Ne.lights,{emissive:{value:new it(0)}}]),vertexShader:ot.meshtoon_vert,fragmentShader:ot.meshtoon_frag},matcap:{uniforms:On([Ne.common,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,{matcap:{value:null}}]),vertexShader:ot.meshmatcap_vert,fragmentShader:ot.meshmatcap_frag},points:{uniforms:On([Ne.points,Ne.fog]),vertexShader:ot.points_vert,fragmentShader:ot.points_frag},dashed:{uniforms:On([Ne.common,Ne.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ot.linedashed_vert,fragmentShader:ot.linedashed_frag},depth:{uniforms:On([Ne.common,Ne.displacementmap]),vertexShader:ot.depth_vert,fragmentShader:ot.depth_frag},normal:{uniforms:On([Ne.common,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,{opacity:{value:1}}]),vertexShader:ot.meshnormal_vert,fragmentShader:ot.meshnormal_frag},sprite:{uniforms:On([Ne.sprite,Ne.fog]),vertexShader:ot.sprite_vert,fragmentShader:ot.sprite_frag},background:{uniforms:{uvTransform:{value:new tt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ot.background_vert,fragmentShader:ot.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new tt}},vertexShader:ot.backgroundCube_vert,fragmentShader:ot.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ot.cube_vert,fragmentShader:ot.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ot.equirect_vert,fragmentShader:ot.equirect_frag},distance:{uniforms:On([Ne.common,Ne.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ot.distance_vert,fragmentShader:ot.distance_frag},shadow:{uniforms:On([Ne.lights,Ne.fog,{color:{value:new it(0)},opacity:{value:1}}]),vertexShader:ot.shadow_vert,fragmentShader:ot.shadow_frag}};Ki.physical={uniforms:On([Ki.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new tt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new tt},clearcoatNormalScale:{value:new Ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new tt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new tt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new tt},sheen:{value:0},sheenColor:{value:new it(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new tt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new tt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new tt},transmissionSamplerSize:{value:new Ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new tt},attenuationDistance:{value:0},attenuationColor:{value:new it(0)},specularColor:{value:new it(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new tt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new tt},anisotropyVector:{value:new Ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new tt}}]),vertexShader:ot.meshphysical_vert,fragmentShader:ot.meshphysical_frag};const vc={r:0,b:0,g:0},cN=new At,hy=new tt;hy.set(-1,0,0,0,1,0,0,0,1);function uN(t,e,n,i,s,r){const o=new it(0);let l=s===!0?0:1,c,u,d=null,p=0,h=null;function m(g){let S=g.isScene===!0?g.background:null;if(S&&S.isTexture){const y=g.backgroundBlurriness>0;S=e.get(S,y)}return S}function v(g){let S=!1;const y=m(g);y===null?x(o,l):y&&y.isColor&&(x(y,1),S=!0);const b=t.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(t.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function w(g,S){const y=m(S);y&&(y.isCubeTexture||y.mapping===Vu)?(u===void 0&&(u=new qt(new vl(1,1,1),new Zt({name:"BackgroundCubeMaterial",uniforms:Wa(Ki.backgroundCube.uniforms),vertexShader:Ki.backgroundCube.vertexShader,fragmentShader:Ki.backgroundCube.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(b,T,N){this.matrixWorld.copyPosition(N.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),u.material.uniforms.envMap.value=y,u.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(cN.makeRotationFromEuler(S.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&u.material.uniforms.backgroundRotation.value.premultiply(hy),u.material.toneMapped=ht.getTransfer(y.colorSpace)!==Tt,(d!==y||p!==y.version||h!==t.toneMapping)&&(u.material.needsUpdate=!0,d=y,p=y.version,h=t.toneMapping),u.layers.enableAll(),g.unshift(u,u.geometry,u.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new qt(new xl(2,2),new Zt({name:"BackgroundMaterial",uniforms:Wa(Ki.background.uniforms),vertexShader:Ki.background.vertexShader,fragmentShader:Ki.background.fragmentShader,side:Ir,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=ht.getTransfer(y.colorSpace)!==Tt,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(d!==y||p!==y.version||h!==t.toneMapping)&&(c.material.needsUpdate=!0,d=y,p=y.version,h=t.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null))}function x(g,S){g.getRGB(vc,ly(t)),n.buffers.color.setClear(vc.r,vc.g,vc.b,S,r)}function f(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(g,S=1){o.set(g),l=S,x(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,x(o,l)},render:v,addToRenderList:w,dispose:f}}function dN(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},s=h(null);let r=s,o=!1;function l(k,B,D,P,j){let Q=!1;const W=p(k,P,D,B);r!==W&&(r=W,u(r.object)),Q=m(k,P,D,j),Q&&v(k,P,D,j),j!==null&&e.update(j,t.ELEMENT_ARRAY_BUFFER),(Q||o)&&(o=!1,y(k,B,D,P),j!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(j).buffer))}function c(){return t.createVertexArray()}function u(k){return t.bindVertexArray(k)}function d(k){return t.deleteVertexArray(k)}function p(k,B,D,P){const j=P.wireframe===!0;let Q=i[B.id];Q===void 0&&(Q={},i[B.id]=Q);const W=k.isInstancedMesh===!0?k.id:0;let G=Q[W];G===void 0&&(G={},Q[W]=G);let H=G[D.id];H===void 0&&(H={},G[D.id]=H);let X=H[j];return X===void 0&&(X=h(c()),H[j]=X),X}function h(k){const B=[],D=[],P=[];for(let j=0;j<n;j++)B[j]=0,D[j]=0,P[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:D,attributeDivisors:P,object:k,attributes:{},index:null}}function m(k,B,D,P){const j=r.attributes,Q=B.attributes;let W=0;const G=D.getAttributes();for(const H in G)if(G[H].location>=0){const J=j[H];let ve=Q[H];if(ve===void 0&&(H==="instanceMatrix"&&k.instanceMatrix&&(ve=k.instanceMatrix),H==="instanceColor"&&k.instanceColor&&(ve=k.instanceColor)),J===void 0||J.attribute!==ve||ve&&J.data!==ve.data)return!0;W++}return r.attributesNum!==W||r.index!==P}function v(k,B,D,P){const j={},Q=B.attributes;let W=0;const G=D.getAttributes();for(const H in G)if(G[H].location>=0){let J=Q[H];J===void 0&&(H==="instanceMatrix"&&k.instanceMatrix&&(J=k.instanceMatrix),H==="instanceColor"&&k.instanceColor&&(J=k.instanceColor));const ve={};ve.attribute=J,J&&J.data&&(ve.data=J.data),j[H]=ve,W++}r.attributes=j,r.attributesNum=W,r.index=P}function w(){const k=r.newAttributes;for(let B=0,D=k.length;B<D;B++)k[B]=0}function x(k){f(k,0)}function f(k,B){const D=r.newAttributes,P=r.enabledAttributes,j=r.attributeDivisors;D[k]=1,P[k]===0&&(t.enableVertexAttribArray(k),P[k]=1),j[k]!==B&&(t.vertexAttribDivisor(k,B),j[k]=B)}function g(){const k=r.newAttributes,B=r.enabledAttributes;for(let D=0,P=B.length;D<P;D++)B[D]!==k[D]&&(t.disableVertexAttribArray(D),B[D]=0)}function S(k,B,D,P,j,Q,W){W===!0?t.vertexAttribIPointer(k,B,D,j,Q):t.vertexAttribPointer(k,B,D,P,j,Q)}function y(k,B,D,P){w();const j=P.attributes,Q=D.getAttributes(),W=B.defaultAttributeValues;for(const G in Q){const H=Q[G];if(H.location>=0){let X=j[G];if(X===void 0&&(G==="instanceMatrix"&&k.instanceMatrix&&(X=k.instanceMatrix),G==="instanceColor"&&k.instanceColor&&(X=k.instanceColor)),X!==void 0){const J=X.normalized,ve=X.itemSize,Ie=e.get(X);if(Ie===void 0)continue;const Qe=Ie.buffer,re=Ie.type,fe=Ie.bytesPerElement,E=re===t.INT||re===t.UNSIGNED_INT||X.gpuType===Qp;if(X.isInterleavedBufferAttribute){const F=X.data,ee=F.stride,ue=X.offset;if(F.isInstancedInterleavedBuffer){for(let ce=0;ce<H.locationSize;ce++)f(H.location+ce,F.meshPerAttribute);k.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=F.meshPerAttribute*F.count)}else for(let ce=0;ce<H.locationSize;ce++)x(H.location+ce);t.bindBuffer(t.ARRAY_BUFFER,Qe);for(let ce=0;ce<H.locationSize;ce++)S(H.location+ce,ve/H.locationSize,re,J,ee*fe,(ue+ve/H.locationSize*ce)*fe,E)}else{if(X.isInstancedBufferAttribute){for(let F=0;F<H.locationSize;F++)f(H.location+F,X.meshPerAttribute);k.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let F=0;F<H.locationSize;F++)x(H.location+F);t.bindBuffer(t.ARRAY_BUFFER,Qe);for(let F=0;F<H.locationSize;F++)S(H.location+F,ve/H.locationSize,re,J,ve*fe,ve/H.locationSize*F*fe,E)}}else if(W!==void 0){const J=W[G];if(J!==void 0)switch(J.length){case 2:t.vertexAttrib2fv(H.location,J);break;case 3:t.vertexAttrib3fv(H.location,J);break;case 4:t.vertexAttrib4fv(H.location,J);break;default:t.vertexAttrib1fv(H.location,J)}}}}g()}function b(){C();for(const k in i){const B=i[k];for(const D in B){const P=B[D];for(const j in P){const Q=P[j];for(const W in Q)d(Q[W].object),delete Q[W];delete P[j]}}delete i[k]}}function T(k){if(i[k.id]===void 0)return;const B=i[k.id];for(const D in B){const P=B[D];for(const j in P){const Q=P[j];for(const W in Q)d(Q[W].object),delete Q[W];delete P[j]}}delete i[k.id]}function N(k){for(const B in i){const D=i[B];for(const P in D){const j=D[P];if(j[k.id]===void 0)continue;const Q=j[k.id];for(const W in Q)d(Q[W].object),delete Q[W];delete j[k.id]}}}function _(k){for(const B in i){const D=i[B],P=k.isInstancedMesh===!0?k.id:0,j=D[P];if(j!==void 0){for(const Q in j){const W=j[Q];for(const G in W)d(W[G].object),delete W[G];delete j[Q]}delete D[P],Object.keys(D).length===0&&delete i[B]}}}function C(){R(),o=!0,r!==s&&(r=s,u(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:l,reset:C,resetDefaultState:R,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:_,releaseStatesOfProgram:N,initAttributes:w,enableAttribute:x,disableUnusedAttributes:g}}function hN(t,e,n){let i;function s(c){i=c}function r(c,u){t.drawArrays(i,c,u),n.update(u,i,1)}function o(c,u,d){d!==0&&(t.drawArraysInstanced(i,c,u,d),n.update(u,i,d))}function l(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,d);let h=0;for(let m=0;m<d;m++)h+=u[m];n.update(h,i,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=l}function fN(t,e,n,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const N=e.get("EXT_texture_filter_anisotropic");s=t.getParameter(N.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(N){return!(N!==bi&&i.convert(N)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function l(N){const _=N===Hn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(N!==Si&&N!==Oi&&!_&&i.convert(N)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE))}function c(N){if(N==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";N="mediump"}return N==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let u=n.precision!==void 0?n.precision:"highp";const d=c(u);d!==u&&(Ke("WebGLRenderer:",u,"not supported, using",d,"instead."),u=d);const p=n.logarithmicDepthBuffer===!0,h=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control");n.reversedDepthBuffer===!0&&h===!1&&Ke("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const m=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),w=t.getParameter(t.MAX_TEXTURE_SIZE),x=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),f=t.getParameter(t.MAX_VERTEX_ATTRIBS),g=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),S=t.getParameter(t.MAX_VARYING_VECTORS),y=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),b=t.getParameter(t.MAX_SAMPLES),T=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:l,precision:u,logarithmicDepthBuffer:p,reversedDepthBuffer:h,maxTextures:m,maxVertexTextures:v,maxTextureSize:w,maxCubemapSize:x,maxAttributes:f,maxVertexUniforms:g,maxVaryings:S,maxFragmentUniforms:y,maxSamples:b,samples:T}}function pN(t){const e=this;let n=null,i=0,s=!1,r=!1;const o=new vs,l=new tt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(p,h){const m=p.length!==0||h||i!==0||s;return s=h,i=p.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(p,h){n=d(p,h,0)},this.setState=function(p,h,m){const v=p.clippingPlanes,w=p.clipIntersection,x=p.clipShadows,f=t.get(p);if(!s||v===null||v.length===0||r&&!x)r?d(null):u();else{const g=r?0:i,S=g*4;let y=f.clippingState||null;c.value=y,y=d(v,h,S,m);for(let b=0;b!==S;++b)y[b]=n[b];f.clippingState=y,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=g}};function u(){c.value!==n&&(c.value=n,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(p,h,m,v){const w=p!==null?p.length:0;let x=null;if(w!==0){if(x=c.value,v!==!0||x===null){const f=m+w*4,g=h.matrixWorldInverse;l.getNormalMatrix(g),(x===null||x.length<f)&&(x=new Float32Array(f));for(let S=0,y=m;S!==w;++S,y+=4)o.copy(p[S]).applyMatrix4(g,l),o.normal.toArray(x,y),x[y+3]=o.constant}c.value=x,c.needsUpdate=!0}return e.numPlanes=w,e.numIntersection=0,x}}const Aa=4,mN=6,gN=20,vN=256,Mo=new mm,kv=new it;let Qd=null,Jd=0,eh=0,th=!1;const xN=new I,vr=new I;class Iv{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,s=100,r={}){const{size:o=256,position:l=xN}=r;Qd=this._renderer.getRenderTarget(),Jd=this._renderer.getActiveCubeFace(),eh=this._renderer.getActiveMipmapLevel(),th=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,s,c,l),n>0&&this._blur(c,0,0,n),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ov(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Fv(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Qd,Jd,eh),this._renderer.xr.enabled=th,e.scissorTest=!1,ha(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Ur||e.mapping===Ga?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Qd=this._renderer.getRenderTarget(),Jd=this._renderer.getActiveCubeFace(),eh=this._renderer.getActiveMipmapLevel(),th=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:yn,minFilter:yn,generateMipmaps:!1,type:Hn,format:bi,colorSpace:gu,depthBuffer:!1},s=Uv(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Uv(e,n,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=_N(r)),this._blurMaterial=SN(r,e,n),this._ggxMaterial=yN(r,e,n)}return s}_compileMaterial(e){const n=new qt(new Dt,e);this._renderer.compile(n,Mo)}_sceneToCubeUV(e,n,i,s,r){const c=new yi(90,1,n,i),u=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],p=this._renderer,h=p.autoClear,m=p.toneMapping;p.getClearColor(kv),p.toneMapping=is,p.autoClear=!1,p.state.buffers.depth.getReversed()&&(p.setRenderTarget(s),p.clearDepth(),p.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new qt(new vl,new xs({name:"PMREM.Background",side:Qn,depthWrite:!1,depthTest:!1})));const w=this._backgroundBox,x=w.material;let f=!1;const g=e.background;g?g.isColor&&(x.color.copy(g),e.background=null,f=!0):(x.color.copy(kv),f=!0);for(let S=0;S<6;S++){const y=S%3;y===0?(c.up.set(0,u[S],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+d[S],r.y,r.z)):y===1?(c.up.set(0,0,u[S]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+d[S],r.z)):(c.up.set(0,u[S],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+d[S]));const b=this._cubeSize;ha(s,y*b,S>2?b:0,b,b),p.setRenderTarget(s),f&&p.render(w,c),p.render(e,c)}p.toneMapping=m,p.autoClear=h,e.background=g}_textureToCubeUV(e,n){const i=this._renderer,s=e.mapping===Ur||e.mapping===Ga;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ov()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Fv());const r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;const l=r.uniforms;l.envMap.value=e;const c=this._cubeSize;ha(n,0,0,3*c,2*c),i.setRenderTarget(n),i.render(o,Mo)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);n.autoClear=i}_applyGGXFilter(e,n,i){const s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,l=this._lodMeshes[i];l.material=o;const c=o.uniforms,u=i/(this._lodMeshes.length-1),d=n/(this._lodMeshes.length-1),p=Math.sqrt(u*u-d*d),h=u*1.25,m=p*h,{_lodMax:v}=this,w=this._sizeLods[i],x=3*w*(i>v-Aa?i-v+Aa:0),f=4*(this._cubeSize-w);c.envMap.value=e.texture,c.roughness.value=m,c.mipInt.value=v-n,ha(r,x,f,3*w,2*w),s.setRenderTarget(r),s.render(l,Mo),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=v-i,ha(e,x,f,3*w,2*w),s.setRenderTarget(e),s.render(l,Mo)}_blur(e,n,i,s){const r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,n,i,o),this._blurPass(r,e,i,i,o)}_blurPass(e,n,i,s,r){const o=this._renderer,l=this._blurMaterial,c=this._lodMeshes[s];c.material=l;const u=l.uniforms;u.envMap.value=e.texture,u.sigma.value=r,u.mipInt.value=this._lodMax-i;const d=this._sizeLods[s],p=3*d*(s>this._lodMax-Aa?s-this._lodMax+Aa:0),h=4*(this._cubeSize-d);ha(n,p,h,3*d,2*d),o.setRenderTarget(n),o.render(c,Mo)}}function _N(t){const e=[],n=[];let i=t;const s=t-Aa+1+mN;for(let r=0;r<s;r++){const o=Math.pow(2,i);e.push(o);const l=1/(o-2),c=-l,u=1+l,d=[c,c,u,c,u,u,c,c,u,u,c,u],p=6,h=6,m=3,v=new Float32Array(m*h*p),w=new Float32Array(m*h*p);for(let f=0;f<p;f++){const g=f%3*2/3-1,S=f>2?0:-1,y=[g,S,0,g+2/3,S,0,g+2/3,S+1,0,g,S,0,g+2/3,S+1,0,g,S+1,0];v.set(y,m*h*f);for(let b=0;b<h;b++){const T=d[b*2]*2-1,N=d[b*2+1]*2-1;f===0?vr.set(1,N,T):f===1?vr.set(-T,1,-N):f===2?vr.set(-T,N,1):f===3?vr.set(-1,N,-T):f===4?vr.set(-T,-1,N):vr.set(T,N,-1),vr.toArray(w,(f*h+b)*m)}}const x=new Dt;x.setAttribute("position",new Ot(v,m)),x.setAttribute("outputDirection",new Ot(w,m)),n.push(new qt(x,null)),i>Aa&&i--}return{lodMeshes:n,sizeLods:e}}function Uv(t,e,n){const i=new Ln(t,e,n);return i.texture.mapping=Vu,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ha(t,e,n,i,s){t.viewport.set(e,n,i,s),t.scissor.set(e,n,i,s)}function yN(t,e,n){return new Zt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:vN,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Gu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ns,depthTest:!1,depthWrite:!1})}function SN(t,e,n){return new Zt({name:"SphericalGaussianBlur",defines:{SAMPLES:gN,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Gu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:ns,depthTest:!1,depthWrite:!1})}function Fv(){return new Zt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Gu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ns,depthTest:!1,depthWrite:!1})}function Ov(){return new Zt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Gu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ns,depthTest:!1,depthWrite:!1})}function Gu(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class fy extends Ln{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new ny(s),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new vl(5,5,5),r=new Zt({name:"CubemapFromEquirect",uniforms:Wa(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Qn,blending:ns});r.uniforms.tEquirect.value=n;const o=new qt(s,r),l=n.minFilter;return n.minFilter===Er&&(n.minFilter=yn),new S1(1,10,this).update(e,o),n.minFilter=l,o.geometry.dispose(),o.material.dispose(),this}clear(e,n=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,s);e.setRenderTarget(r)}}function MN(t){let e=new WeakMap,n=new WeakMap,i=null;function s(h,m=!1){return h==null?null:m?o(h):r(h)}function r(h){if(h&&h.isTexture){const m=h.mapping;if(m===Md||m===wd)if(e.has(h)){const v=e.get(h).texture;return l(v,h.mapping)}else{const v=h.image;if(v&&v.height>0){const w=new fy(v.height);return w.fromEquirectangularTexture(t,h),e.set(h,w),h.addEventListener("dispose",u),l(w.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){const m=h.mapping,v=m===Md||m===wd,w=m===Ur||m===Ga;if(v||w){let x=n.get(h);const f=x!==void 0?x.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==f)return i===null&&(i=new Iv(t)),x=v?i.fromEquirectangular(h,x):i.fromCubemap(h,x),x.texture.pmremVersion=h.pmremVersion,n.set(h,x),x.texture;if(x!==void 0)return x.texture;{const g=h.image;return v&&g&&g.height>0||w&&g&&c(g)?(i===null&&(i=new Iv(t)),x=v?i.fromEquirectangular(h):i.fromCubemap(h),x.texture.pmremVersion=h.pmremVersion,n.set(h,x),h.addEventListener("dispose",d),x.texture):null}}}return h}function l(h,m){return m===Md?h.mapping=Ur:m===wd&&(h.mapping=Ga),h}function c(h){let m=0;const v=6;for(let w=0;w<v;w++)h[w]!==void 0&&m++;return m===v}function u(h){const m=h.target;m.removeEventListener("dispose",u);const v=e.get(m);v!==void 0&&(e.delete(m),v.dispose())}function d(h){const m=h.target;m.removeEventListener("dispose",d);const v=n.get(m);v!==void 0&&(n.delete(m),v.dispose())}function p(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:p}}function wN(t){const e={};function n(i){if(e[i]!==void 0)return e[i];const s=t.getExtension(i);return e[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const s=n(i);return s===null&&Ia("WebGLRenderer: "+i+" extension not supported."),s}}}function bN(t,e,n,i){const s={},r=new WeakMap;function o(p){const h=p.target;h.index!==null&&e.remove(h.index);for(const v in h.attributes)e.remove(h.attributes[v]);h.removeEventListener("dispose",o),delete s[h.id];const m=r.get(h);m&&(e.remove(m),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function l(p,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,n.memory.geometries++),h}function c(p){const h=p.attributes;for(const m in h)e.update(h[m],t.ARRAY_BUFFER)}function u(p){const h=[],m=p.index,v=p.attributes.position;let w=0;if(v===void 0)return;if(m!==null){const g=m.array;w=m.version;for(let S=0,y=g.length;S<y;S+=3){const b=g[S+0],T=g[S+1],N=g[S+2];h.push(b,T,T,N,N,b)}}else{const g=v.array;w=v.version;for(let S=0,y=g.length/3-1;S<y;S+=3){const b=S+0,T=S+1,N=S+2;h.push(b,T,T,N,N,b)}}const x=new(v.count>=65535?J_:Q_)(h,1);x.version=w;const f=r.get(p);f&&e.remove(f),r.set(p,x)}function d(p){const h=r.get(p);if(h){const m=p.index;m!==null&&h.version<m.version&&u(p)}else u(p);return r.get(p)}return{get:l,update:c,getWireframeAttribute:d}}function EN(t,e,n){let i;function s(p){i=p}let r,o;function l(p){r=p.type,o=p.bytesPerElement}function c(p,h){t.drawElements(i,h,r,p*o),n.update(h,i,1)}function u(p,h,m){m!==0&&(t.drawElementsInstanced(i,h,r,p*o,m),n.update(h,i,m))}function d(p,h,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,r,p,0,m);let w=0;for(let x=0;x<m;x++)w+=h[x];n.update(w,i,1)}this.setMode=s,this.setIndex=l,this.render=c,this.renderInstances=u,this.renderMultiDraw=d}function TN(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,l){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=l*(r/3);break;case t.LINES:n.lines+=l*(r/2);break;case t.LINE_STRIP:n.lines+=l*(r-1);break;case t.LINE_LOOP:n.lines+=l*r;break;case t.POINTS:n.points+=l*r;break;default:mt("WebGLInfo: Unknown draw mode:",o);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:s,update:i}}function AN(t,e,n){const i=new WeakMap,s=new Yt;function r(o,l,c){const u=o.morphTargetInfluences,d=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,p=d!==void 0?d.length:0;let h=i.get(l);if(h===void 0||h.count!==p){let C=function(){N.dispose(),i.delete(l),l.removeEventListener("dispose",C)};h!==void 0&&h.texture.dispose();const m=l.morphAttributes.position!==void 0,v=l.morphAttributes.normal!==void 0,w=l.morphAttributes.color!==void 0,x=l.morphAttributes.position||[],f=l.morphAttributes.normal||[],g=l.morphAttributes.color||[];let S=0;m===!0&&(S=1),v===!0&&(S=2),w===!0&&(S=3);let y=l.attributes.position.count*S,b=1;y>e.maxTextureSize&&(b=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const T=new Float32Array(y*b*4*p),N=new K_(T,y,b,p);N.type=Oi,N.needsUpdate=!0;const _=S*4;for(let R=0;R<p;R++){const k=x[R],B=f[R],D=g[R],P=y*b*4*R;for(let j=0;j<k.count;j++){const Q=j*_;m===!0&&(s.fromBufferAttribute(k,j),T[P+Q+0]=s.x,T[P+Q+1]=s.y,T[P+Q+2]=s.z,T[P+Q+3]=0),v===!0&&(s.fromBufferAttribute(B,j),T[P+Q+4]=s.x,T[P+Q+5]=s.y,T[P+Q+6]=s.z,T[P+Q+7]=0),w===!0&&(s.fromBufferAttribute(D,j),T[P+Q+8]=s.x,T[P+Q+9]=s.y,T[P+Q+10]=s.z,T[P+Q+11]=D.itemSize===4?s.w:1)}}h={count:p,texture:N,size:new Ue(y,b)},i.set(l,h),l.addEventListener("dispose",C)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let m=0;for(let w=0;w<u.length;w++)m+=u[w];const v=l.morphTargetsRelative?1:1-m;c.getUniforms().setValue(t,"morphTargetBaseInfluence",v),c.getUniforms().setValue(t,"morphTargetInfluences",u)}c.getUniforms().setValue(t,"morphTargetsTexture",h.texture,n),c.getUniforms().setValue(t,"morphTargetsTextureSize",h.size)}return{update:r}}function NN(t,e,n,i,s){let r=new WeakMap;function o(u){const d=s.render.frame,p=u.geometry,h=e.get(u,p);if(r.get(h)!==d&&(e.update(h),r.set(h,d)),u.isInstancedMesh&&(u.hasEventListener("dispose",c)===!1&&u.addEventListener("dispose",c),r.get(u)!==d&&(n.update(u.instanceMatrix,t.ARRAY_BUFFER),u.instanceColor!==null&&n.update(u.instanceColor,t.ARRAY_BUFFER),r.set(u,d))),u.isSkinnedMesh){const m=u.skeleton;r.get(m)!==d&&(m.update(),r.set(m,d))}return h}function l(){r=new WeakMap}function c(u){const d=u.target;d.removeEventListener("dispose",c),i.releaseStatesOfObject(d),n.remove(d.instanceMatrix),d.instanceColor!==null&&n.remove(d.instanceColor)}return{update:o,dispose:l}}const CN={[$p]:"LINEAR_TONE_MAPPING",[Xp]:"REINHARD_TONE_MAPPING",[Yp]:"CINEON_TONE_MAPPING",[Hu]:"ACES_FILMIC_TONE_MAPPING",[Kp]:"AGX_TONE_MAPPING",[Zp]:"NEUTRAL_TONE_MAPPING",[qp]:"CUSTOM_TONE_MAPPING"};function RN(t,e,n,i,s,r){const o=new Ln(e,n,{type:t,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let l=null,c=null;const u=new Dt;u.setAttribute("position",new ft([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute("uv",new ft([0,2,0,0,2,0],2));const d=new cy({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),p=new qt(u,d),h=new mm(-1,1,1,-1,0,1);let m=null,v=null,w=!1,x,f=null,g=[],S=!1;this.setSize=function(y,b){o.setSize(y,b),l!==null&&l.setSize(y,b),c!==null&&c.setSize(y,b);for(let T=0;T<g.length;T++){const N=g[T];N.setSize&&N.setSize(y,b)}},this.setEffects=function(y){g=y,S=g.length>0&&g[0].isRenderPass===!0;const b=o.width,T=o.height;g.length>0&&l===null&&(l=new Ln(b,T,{type:Hn,depthBuffer:!1,stencilBuffer:!1}),c=new Ln(b,T,{type:Hn,depthBuffer:!1,stencilBuffer:!1}));for(let N=0;N<g.length;N++){const _=g[N];_.setSize&&_.setSize(b,T)}},this.begin=function(y,b){if(w||y.toneMapping===is&&g.length===0)return!1;if(f=b,b!==null){const T=b.width,N=b.height;(o.width!==T||o.height!==N)&&this.setSize(T,N)}return S===!1&&y.setRenderTarget(o),x=y.toneMapping,y.toneMapping=is,!0},this.hasRenderPass=function(){return S},this.end=function(y,b){y.toneMapping=x,w=!0;let T=o,N=l;for(let _=0;_<g.length;_++){const C=g[_];C.enabled!==!1&&(C.render(y,N,T,b),C.needsSwap!==!1&&(T=N,N=N===l?c:l))}if(m!==y.outputColorSpace||v!==y.toneMapping){m=y.outputColorSpace,v=y.toneMapping,d.defines={},ht.getTransfer(m)===Tt&&(d.defines.SRGB_TRANSFER="");const _=CN[v];_&&(d.defines[_]=""),d.needsUpdate=!0}d.uniforms.tDiffuse.value=T.texture,y.setRenderTarget(f),y.render(p,h),f=null,w=!1},this.isCompositing=function(){return w},this.dispose=function(){o.dispose(),l!==null&&l.dispose(),c!==null&&c.dispose(),u.dispose(),d.dispose()}}const py=new Pn,$f=new cl(1,1),my=new K_,gy=new $E,vy=new ny,jv=[],Bv=[],zv=new Float32Array(16),Hv=new Float32Array(9),Vv=new Float32Array(4);function Ka(t,e,n){const i=t[0];if(i<=0||i>0)return t;const s=e*n;let r=jv[s];if(r===void 0&&(r=new Float32Array(s),jv[s]=r),e!==0){i.toArray(r,0);for(let o=1,l=0;o!==e;++o)l+=n,t[o].toArray(r,l)}return r}function un(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function dn(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Wu(t,e){let n=Bv[e];n===void 0&&(n=new Int32Array(e),Bv[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function PN(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function LN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(un(n,e))return;t.uniform2fv(this.addr,e),dn(n,e)}}function DN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(un(n,e))return;t.uniform3fv(this.addr,e),dn(n,e)}}function kN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(un(n,e))return;t.uniform4fv(this.addr,e),dn(n,e)}}function IN(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(un(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),dn(n,e)}else{if(un(n,i))return;Vv.set(i),t.uniformMatrix2fv(this.addr,!1,Vv),dn(n,i)}}function UN(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(un(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),dn(n,e)}else{if(un(n,i))return;Hv.set(i),t.uniformMatrix3fv(this.addr,!1,Hv),dn(n,i)}}function FN(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(un(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),dn(n,e)}else{if(un(n,i))return;zv.set(i),t.uniformMatrix4fv(this.addr,!1,zv),dn(n,i)}}function ON(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function jN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(un(n,e))return;t.uniform2iv(this.addr,e),dn(n,e)}}function BN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(un(n,e))return;t.uniform3iv(this.addr,e),dn(n,e)}}function zN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(un(n,e))return;t.uniform4iv(this.addr,e),dn(n,e)}}function HN(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function VN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(un(n,e))return;t.uniform2uiv(this.addr,e),dn(n,e)}}function GN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(un(n,e))return;t.uniform3uiv(this.addr,e),dn(n,e)}}function WN(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(un(n,e))return;t.uniform4uiv(this.addr,e),dn(n,e)}}function $N(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s);let r;this.type===t.SAMPLER_2D_SHADOW?($f.compareFunction=n.isReversedDepthBuffer()?am:rm,r=$f):r=py,n.setTexture2D(e||r,s)}function XN(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTexture3D(e||gy,s)}function YN(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTextureCube(e||vy,s)}function qN(t,e,n){const i=this.cache,s=n.allocateTextureUnit();i[0]!==s&&(t.uniform1i(this.addr,s),i[0]=s),n.setTexture2DArray(e||my,s)}function KN(t){switch(t){case 5126:return PN;case 35664:return LN;case 35665:return DN;case 35666:return kN;case 35674:return IN;case 35675:return UN;case 35676:return FN;case 5124:case 35670:return ON;case 35667:case 35671:return jN;case 35668:case 35672:return BN;case 35669:case 35673:return zN;case 5125:return HN;case 36294:return VN;case 36295:return GN;case 36296:return WN;case 35678:case 36198:case 36298:case 36306:case 35682:return $N;case 35679:case 36299:case 36307:return XN;case 35680:case 36300:case 36308:case 36293:return YN;case 36289:case 36303:case 36311:case 36292:return qN}}function ZN(t,e){t.uniform1fv(this.addr,e)}function QN(t,e){const n=Ka(e,this.size,2);t.uniform2fv(this.addr,n)}function JN(t,e){const n=Ka(e,this.size,3);t.uniform3fv(this.addr,n)}function eC(t,e){const n=Ka(e,this.size,4);t.uniform4fv(this.addr,n)}function tC(t,e){const n=Ka(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function nC(t,e){const n=Ka(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function iC(t,e){const n=Ka(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function sC(t,e){t.uniform1iv(this.addr,e)}function rC(t,e){t.uniform2iv(this.addr,e)}function aC(t,e){t.uniform3iv(this.addr,e)}function oC(t,e){t.uniform4iv(this.addr,e)}function lC(t,e){t.uniform1uiv(this.addr,e)}function cC(t,e){t.uniform2uiv(this.addr,e)}function uC(t,e){t.uniform3uiv(this.addr,e)}function dC(t,e){t.uniform4uiv(this.addr,e)}function hC(t,e,n){const i=this.cache,s=e.length,r=Wu(n,s);un(i,r)||(t.uniform1iv(this.addr,r),dn(i,r));let o;this.type===t.SAMPLER_2D_SHADOW?o=$f:o=py;for(let l=0;l!==s;++l)n.setTexture2D(e[l]||o,r[l])}function fC(t,e,n){const i=this.cache,s=e.length,r=Wu(n,s);un(i,r)||(t.uniform1iv(this.addr,r),dn(i,r));for(let o=0;o!==s;++o)n.setTexture3D(e[o]||gy,r[o])}function pC(t,e,n){const i=this.cache,s=e.length,r=Wu(n,s);un(i,r)||(t.uniform1iv(this.addr,r),dn(i,r));for(let o=0;o!==s;++o)n.setTextureCube(e[o]||vy,r[o])}function mC(t,e,n){const i=this.cache,s=e.length,r=Wu(n,s);un(i,r)||(t.uniform1iv(this.addr,r),dn(i,r));for(let o=0;o!==s;++o)n.setTexture2DArray(e[o]||my,r[o])}function gC(t){switch(t){case 5126:return ZN;case 35664:return QN;case 35665:return JN;case 35666:return eC;case 35674:return tC;case 35675:return nC;case 35676:return iC;case 5124:case 35670:return sC;case 35667:case 35671:return rC;case 35668:case 35672:return aC;case 35669:case 35673:return oC;case 5125:return lC;case 36294:return cC;case 36295:return uC;case 36296:return dC;case 35678:case 36198:case 36298:case 36306:case 35682:return hC;case 35679:case 36299:case 36307:return fC;case 35680:case 36300:case 36308:case 36293:return pC;case 36289:case 36303:case 36311:case 36292:return mC}}class vC{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=KN(n.type)}}class xC{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=gC(n.type)}}class _C{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const l=s[r];l.setValue(e,n[l.id],i)}}}const nh=/(\w+)(\])?(\[|\.)?/g;function Gv(t,e){t.seq.push(e),t.map[e.id]=e}function yC(t,e,n){const i=t.name,s=i.length;for(nh.lastIndex=0;;){const r=nh.exec(i),o=nh.lastIndex;let l=r[1];const c=r[2]==="]",u=r[3];if(c&&(l=l|0),u===void 0||u==="["&&o+2===s){Gv(n,u===void 0?new vC(l,t,e):new xC(l,t,e));break}else{let p=n.map[l];p===void 0&&(p=new _C(l),Gv(n,p)),n=p}}}class Bc{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const l=e.getActiveUniform(n,o),c=e.getUniformLocation(n,l.name);yC(l,c,this)}const s=[],r=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,n,i,s){const r=this.map[n];r!==void 0&&r.setValue(e,i,s)}setOptional(e,n,i){const s=n[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,n,i,s){for(let r=0,o=n.length;r!==o;++r){const l=n[r],c=i[l.id];c.needsUpdate!==!1&&l.setValue(e,c.value,s)}}static seqWithValue(e,n){const i=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in n&&i.push(o)}return i}}function Wv(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const SC=37297;let MC=0;function wC(t,e){const n=t.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,n.length);for(let o=s;o<r;o++){const l=o+1;i.push(`${l===e?">":" "} ${l}: ${n[o]}`)}return i.join(`
`)}const $v=new tt;function bC(t){ht._getMatrix($v,ht.workingColorSpace,t);const e=`mat3( ${$v.elements.map(n=>n.toFixed(4))} )`;switch(ht.getTransfer(t)){case vu:return[e,"LinearTransferOETF"];case Tt:return[e,"sRGBTransferOETF"];default:return Ke("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function Xv(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=(t.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const l=parseInt(o[1]);return n.toUpperCase()+`

`+r+`

`+wC(t.getShaderSource(e),l)}else return r}function EC(t,e){const n=bC(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}const TC={[$p]:"Linear",[Xp]:"Reinhard",[Yp]:"Cineon",[Hu]:"ACESFilmic",[Kp]:"AgX",[Zp]:"Neutral",[qp]:"Custom"};function AC(t,e){const n=TC[e];return n===void 0?(Ke("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const xc=new I;function NC(){ht.getLuminanceCoefficients(xc);const t=xc.x.toFixed(4),e=xc.y.toFixed(4),n=xc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function CC(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Co).join(`
`)}function RC(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function PC(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=t.getActiveAttrib(e,s),o=r.name;let l=1;r.type===t.FLOAT_MAT2&&(l=2),r.type===t.FLOAT_MAT3&&(l=3),r.type===t.FLOAT_MAT4&&(l=4),n[o]={type:r.type,location:t.getAttribLocation(e,o),locationSize:l}}return n}function Co(t){return t!==""}function Yv(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function qv(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const LC=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xf(t){return t.replace(LC,kC)}const DC=new Map;function kC(t,e){let n=ot[e];if(n===void 0){const i=DC.get(e);if(i!==void 0)n=ot[i],Ke('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Xf(n)}const IC=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Kv(t){return t.replace(IC,UC)}function UC(t,e,n,i){let s="";for(let r=parseInt(e);r<parseInt(n);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Zv(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const FC={[Ic]:"SHADOWMAP_TYPE_PCF",[No]:"SHADOWMAP_TYPE_VSM"};function OC(t){return FC[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const jC={[Ur]:"ENVMAP_TYPE_CUBE",[Ga]:"ENVMAP_TYPE_CUBE",[Vu]:"ENVMAP_TYPE_CUBE_UV"};function BC(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":jC[t.envMapMode]||"ENVMAP_TYPE_CUBE"}const zC={[Ga]:"ENVMAP_MODE_REFRACTION"};function HC(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":zC[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}const VC={[B_]:"ENVMAP_BLENDING_MULTIPLY",[cE]:"ENVMAP_BLENDING_MIX",[uE]:"ENVMAP_BLENDING_ADD"};function GC(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":VC[t.combine]||"ENVMAP_BLENDING_NONE"}function WC(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function $C(t,e,n,i){const s=t.getContext(),r=n.defines;let o=n.vertexShader,l=n.fragmentShader;const c=OC(n),u=BC(n),d=HC(n),p=GC(n),h=WC(n),m=CC(n),v=RC(r),w=s.createProgram();let x,f,g=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(x=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(Co).join(`
`),x.length>0&&(x+=`
`),f=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(Co).join(`
`),f.length>0&&(f+=`
`)):(x=[Zv(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+d:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Co).join(`
`),f=[Zv(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.envMap?"#define "+d:"",n.envMap?"#define "+p:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==is?"#define TONE_MAPPING":"",n.toneMapping!==is?ot.tonemapping_pars_fragment:"",n.toneMapping!==is?AC("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",ot.colorspace_pars_fragment,EC("linearToOutputTexel",n.outputColorSpace),NC(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Co).join(`
`)),o=Xf(o),o=Yv(o,n),o=qv(o,n),l=Xf(l),l=Yv(l,n),l=qv(l,n),o=Kv(o),l=Kv(l),n.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,x=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,f=["#define varying in",n.glslVersion===qg?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===qg?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const S=g+x+o,y=g+f+l,b=Wv(s,s.VERTEX_SHADER,S),T=Wv(s,s.FRAGMENT_SHADER,y);s.attachShader(w,b),s.attachShader(w,T),n.index0AttributeName!==void 0?s.bindAttribLocation(w,0,n.index0AttributeName):n.hasPositionAttribute===!0&&s.bindAttribLocation(w,0,"position"),s.linkProgram(w);function N(k){if(t.debug.checkShaderErrors){const B=s.getProgramInfoLog(w)||"",D=s.getShaderInfoLog(b)||"",P=s.getShaderInfoLog(T)||"",j=B.trim(),Q=D.trim(),W=P.trim();let G=!0,H=!0;if(s.getProgramParameter(w,s.LINK_STATUS)===!1)if(G=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(s,w,b,T);else{const X=Xv(s,b,"vertex"),J=Xv(s,T,"fragment");mt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(w,s.VALIDATE_STATUS)+`

Material Name: `+k.name+`
Material Type: `+k.type+`

Program Info Log: `+j+`
`+X+`
`+J)}else j!==""?Ke("WebGLProgram: Program Info Log:",j):(Q===""||W==="")&&(H=!1);H&&(k.diagnostics={runnable:G,programLog:j,vertexShader:{log:Q,prefix:x},fragmentShader:{log:W,prefix:f}})}s.deleteShader(b),s.deleteShader(T),_=new Bc(s,w),C=PC(s,w)}let _;this.getUniforms=function(){return _===void 0&&N(this),_};let C;this.getAttributes=function(){return C===void 0&&N(this),C};let R=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(w,SC)),R},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(w),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=MC++,this.cacheKey=e,this.usedTimes=1,this.program=w,this.vertexShader=b,this.fragmentShader=T,this}let XC=0;class YC{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,n,i){const s=this._getShaderCacheForMaterial(e);return s.has(n)===!1&&(s.add(n),n.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new qC(e),n.set(e,i)),i}}class qC{constructor(e){this.id=XC++,this.code=e,this.usedTimes=0}}function KC(t){return t===Fr||t===pu||t===mu}function ZC(t,e,n,i,s,r){const o=new cm,l=new YC,c=new Set,u=[],d=new Map,p=i.logarithmicDepthBuffer;let h=i.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(_){return c.add(_),_===0?"uv":`uv${_}`}function w(_,C,R,k,B,D){const P=k.fog,j=B.geometry,Q=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?k.environment:null,W=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,G=e.get(_.envMap||Q,W),H=G&&G.mapping===Vu?G.image.height:null,X=m[_.type];_.precision!==null&&(h=i.getMaxPrecision(_.precision),h!==_.precision&&Ke("WebGLProgram.getParameters:",_.precision,"not supported, using",h,"instead."));const J=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,ve=J!==void 0?J.length:0;let Ie=0;j.morphAttributes.position!==void 0&&(Ie=1),j.morphAttributes.normal!==void 0&&(Ie=2),j.morphAttributes.color!==void 0&&(Ie=3);let Qe,re,fe,E;if(X){const St=Ki[X];Qe=St.vertexShader,re=St.fragmentShader}else{Qe=_.vertexShader,re=_.fragmentShader;const St=l.getVertexShaderStage(_),pt=l.getFragmentShaderStage(_);l.update(_,St,pt),fe=St.id,E=pt.id}const F=t.getRenderTarget(),ee=t.state.buffers.depth.getReversed(),ue=B.isInstancedMesh===!0,ce=B.isBatchedMesh===!0,qe=!!_.map,Ge=!!_.matcap,Le=!!G,Ae=!!_.aoMap,De=!!_.lightMap,Pe=!!_.bumpMap&&_.wireframe===!1,ut=!!_.normalMap,st=!!_.displacementMap,Ut=!!_.emissiveMap,bt=!!_.metalnessMap,gt=!!_.roughnessMap,U=_.anisotropy>0,nn=_.clearcoat>0,Re=_.dispersion>0,L=_.retroreflectivity>0,M=_.iridescence>0,V=_.sheen>0,K=_.transmission>0,te=U&&!!_.anisotropyMap,he=nn&&!!_.clearcoatMap,xe=nn&&!!_.clearcoatNormalMap,ne=nn&&!!_.clearcoatRoughnessMap,ae=M&&!!_.iridescenceMap,_e=M&&!!_.iridescenceThicknessMap,We=V&&!!_.sheenColorMap,Ee=V&&!!_.sheenRoughnessMap,ye=!!_.specularMap,$e=!!_.specularColorMap,Xe=!!_.specularIntensityMap,Je=K&&!!_.transmissionMap,z=K&&!!_.thicknessMap,ge=!!_.gradientMap,ie=!!_.alphaMap,we=_.alphaTest>0,pe=!!_.alphaHash,oe=!!_.extensions;let Ve=is;_.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(Ve=t.toneMapping);const ze={shaderID:X,shaderType:_.type,shaderName:_.name,vertexShader:Qe,fragmentShader:re,defines:_.defines,customVertexShaderID:fe,customFragmentShaderID:E,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:h,batching:ce,batchingColor:ce&&B._colorsTexture!==null,instancing:ue,instancingColor:ue&&B.instanceColor!==null,instancingMorph:ue&&B.morphTexture!==null,outputColorSpace:F===null?t.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:ht.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:qe,matcap:Ge,envMap:Le,envMapMode:Le&&G.mapping,envMapCubeUVHeight:H,aoMap:Ae,lightMap:De,bumpMap:Pe,normalMap:ut,displacementMap:st,emissiveMap:Ut,normalMapObjectSpace:ut&&_.normalMapType===fE,normalMapTangentSpace:ut&&_.normalMapType===Yg,packedNormalMap:ut&&_.normalMapType===Yg&&KC(_.normalMap.format),metalnessMap:bt,roughnessMap:gt,anisotropy:U,anisotropyMap:te,clearcoat:nn,clearcoatMap:he,clearcoatNormalMap:xe,clearcoatRoughnessMap:ne,dispersion:Re,retroreflection:L,iridescence:M,iridescenceMap:ae,iridescenceThicknessMap:_e,sheen:V,sheenColorMap:We,sheenRoughnessMap:Ee,specularMap:ye,specularColorMap:$e,specularIntensityMap:Xe,transmission:K,transmissionMap:Je,thicknessMap:z,gradientMap:ge,opaque:_.transparent===!1&&_.blending===jo&&_.alphaToCoverage===!1,alphaMap:ie,alphaTest:we,alphaHash:pe,combine:_.combine,mapUv:qe&&v(_.map.channel),aoMapUv:Ae&&v(_.aoMap.channel),lightMapUv:De&&v(_.lightMap.channel),bumpMapUv:Pe&&v(_.bumpMap.channel),normalMapUv:ut&&v(_.normalMap.channel),displacementMapUv:st&&v(_.displacementMap.channel),emissiveMapUv:Ut&&v(_.emissiveMap.channel),metalnessMapUv:bt&&v(_.metalnessMap.channel),roughnessMapUv:gt&&v(_.roughnessMap.channel),anisotropyMapUv:te&&v(_.anisotropyMap.channel),clearcoatMapUv:he&&v(_.clearcoatMap.channel),clearcoatNormalMapUv:xe&&v(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ne&&v(_.clearcoatRoughnessMap.channel),iridescenceMapUv:ae&&v(_.iridescenceMap.channel),iridescenceThicknessMapUv:_e&&v(_.iridescenceThicknessMap.channel),sheenColorMapUv:We&&v(_.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&v(_.sheenRoughnessMap.channel),specularMapUv:ye&&v(_.specularMap.channel),specularColorMapUv:$e&&v(_.specularColorMap.channel),specularIntensityMapUv:Xe&&v(_.specularIntensityMap.channel),transmissionMapUv:Je&&v(_.transmissionMap.channel),thicknessMapUv:z&&v(_.thicknessMap.channel),alphaMapUv:ie&&v(_.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(ut||U),vertexNormals:!!j.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!j.attributes.uv&&(qe||ie),fog:!!P,useFog:_.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||j.attributes.normal===void 0&&ut===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:ee,skinning:B.isSkinnedMesh===!0,hasPositionAttribute:j.attributes.position!==void 0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:ve,morphTextureStride:Ie,numSunLights:C.sun.length,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numSunLightShadows:C.sunShadowMap.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numLightProbeGrids:D.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:t.shadowMap.enabled&&R.length>0,shadowMapType:t.shadowMap.type,toneMapping:Ve,decodeVideoTexture:qe&&_.map.isVideoTexture===!0&&ht.getTransfer(_.map.colorSpace)===Tt,decodeVideoTextureEmissive:Ut&&_.emissiveMap.isVideoTexture===!0&&ht.getTransfer(_.emissiveMap.colorSpace)===Tt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Cn,flipSided:_.side===Qn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:oe&&_.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(oe&&_.extensions.multiDraw===!0||ce)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return ze.vertexUv1s=c.has(1),ze.vertexUv2s=c.has(2),ze.vertexUv3s=c.has(3),c.clear(),ze}function x(_){const C=[];if(_.shaderID?C.push(_.shaderID):(C.push(_.customVertexShaderID),C.push(_.customFragmentShaderID)),_.defines!==void 0)for(const R in _.defines)C.push(R),C.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(f(C,_),g(C,_),C.push(t.outputColorSpace)),C.push(_.customProgramCacheKey),C.join()}function f(_,C){_.push(C.precision),_.push(C.outputColorSpace),_.push(C.envMapMode),_.push(C.envMapCubeUVHeight),_.push(C.mapUv),_.push(C.alphaMapUv),_.push(C.lightMapUv),_.push(C.aoMapUv),_.push(C.bumpMapUv),_.push(C.normalMapUv),_.push(C.displacementMapUv),_.push(C.emissiveMapUv),_.push(C.metalnessMapUv),_.push(C.roughnessMapUv),_.push(C.anisotropyMapUv),_.push(C.clearcoatMapUv),_.push(C.clearcoatNormalMapUv),_.push(C.clearcoatRoughnessMapUv),_.push(C.iridescenceMapUv),_.push(C.iridescenceThicknessMapUv),_.push(C.sheenColorMapUv),_.push(C.sheenRoughnessMapUv),_.push(C.specularMapUv),_.push(C.specularColorMapUv),_.push(C.specularIntensityMapUv),_.push(C.transmissionMapUv),_.push(C.thicknessMapUv),_.push(C.combine),_.push(C.fogExp2),_.push(C.sizeAttenuation),_.push(C.morphTargetsCount),_.push(C.morphAttributeCount),_.push(C.numSunLights),_.push(C.numDirLights),_.push(C.numPointLights),_.push(C.numSpotLights),_.push(C.numSpotLightMaps),_.push(C.numHemiLights),_.push(C.numRectAreaLights),_.push(C.numSunLightShadows),_.push(C.numDirLightShadows),_.push(C.numPointLightShadows),_.push(C.numSpotLightShadows),_.push(C.numSpotLightShadowsWithMaps),_.push(C.numLightProbes),_.push(C.shadowMapType),_.push(C.toneMapping),_.push(C.numClippingPlanes),_.push(C.numClipIntersection),_.push(C.depthPacking)}function g(_,C){o.disableAll(),C.instancing&&o.enable(0),C.instancingColor&&o.enable(1),C.instancingMorph&&o.enable(2),C.matcap&&o.enable(3),C.envMap&&o.enable(4),C.normalMapObjectSpace&&o.enable(5),C.normalMapTangentSpace&&o.enable(6),C.clearcoat&&o.enable(7),C.iridescence&&o.enable(8),C.alphaTest&&o.enable(9),C.vertexColors&&o.enable(10),C.vertexAlphas&&o.enable(11),C.vertexUv1s&&o.enable(12),C.vertexUv2s&&o.enable(13),C.vertexUv3s&&o.enable(14),C.vertexTangents&&o.enable(15),C.anisotropy&&o.enable(16),C.alphaHash&&o.enable(17),C.batching&&o.enable(18),C.dispersion&&o.enable(19),C.retroreflection&&o.enable(24),C.batchingColor&&o.enable(20),C.gradientMap&&o.enable(21),C.packedNormalMap&&o.enable(22),C.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),C.fog&&o.enable(0),C.useFog&&o.enable(1),C.flatShading&&o.enable(2),C.logarithmicDepthBuffer&&o.enable(3),C.reversedDepthBuffer&&o.enable(4),C.skinning&&o.enable(5),C.morphTargets&&o.enable(6),C.morphNormals&&o.enable(7),C.morphColors&&o.enable(8),C.premultipliedAlpha&&o.enable(9),C.shadowMapEnabled&&o.enable(10),C.doubleSided&&o.enable(11),C.flipSided&&o.enable(12),C.useDepthPacking&&o.enable(13),C.dithering&&o.enable(14),C.transmission&&o.enable(15),C.sheen&&o.enable(16),C.opaque&&o.enable(17),C.pointsUvs&&o.enable(18),C.decodeVideoTexture&&o.enable(19),C.decodeVideoTextureEmissive&&o.enable(20),C.alphaToCoverage&&o.enable(21),C.numLightProbeGrids>0&&o.enable(22),C.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function S(_){const C=m[_.type];let R;if(C){const k=Ki[C];R=ul.clone(k.uniforms)}else R=_.uniforms;return R}function y(_,C){let R=d.get(C);return R!==void 0?++R.usedTimes:(R=new $C(t,C,_,s),u.push(R),d.set(C,R)),R}function b(_){if(--_.usedTimes===0){const C=u.indexOf(_);u[C]=u[u.length-1],u.pop(),d.delete(_.cacheKey),_.destroy()}}function T(_){l.remove(_)}function N(){l.dispose()}return{getParameters:w,getProgramCacheKey:x,getUniforms:S,acquireProgram:y,releaseProgram:b,releaseShaderCache:T,programs:u,dispose:N}}function QC(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let l=t.get(o);return l===void 0&&(l={},t.set(o,l)),l}function i(o){t.delete(o)}function s(o,l,c){t.get(o)[l]=c}function r(){t=new WeakMap}return{has:e,get:n,remove:i,update:s,dispose:r}}function JC(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function Qv(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function Jv(){const t=[];let e=0;const n=[],i=[],s=[];function r(){e=0,n.length=0,i.length=0,s.length=0}function o(h){let m=0;return h.isInstancedMesh&&(m+=2),h.isSkinnedMesh&&(m+=1),m}function l(h,m,v,w,x,f){let g=t[e];return g===void 0?(g={id:h.id,object:h,geometry:m,material:v,materialVariant:o(h),groupOrder:w,renderOrder:h.renderOrder,z:x,group:f},t[e]=g):(g.id=h.id,g.object=h,g.geometry=m,g.material=v,g.materialVariant=o(h),g.groupOrder=w,g.renderOrder=h.renderOrder,g.z=x,g.group=f),e++,g}function c(h,m,v,w,x,f,g){g.reversedDepth===!0&&(x=-x);const S=l(h,m,v,w,x,f);v.transmission>0?i.push(S):v.transparent===!0?s.push(S):n.push(S)}function u(h,m,v,w,x,f){const g=l(h,m,v,w,x,f);v.transmission>0?i.unshift(g):v.transparent===!0?s.unshift(g):n.unshift(g)}function d(h,m){n.length>1&&n.sort(h||JC),i.length>1&&i.sort(m||Qv),s.length>1&&s.sort(m||Qv)}function p(){for(let h=e,m=t.length;h<m;h++){const v=t[h];if(v.id===null)break;v.id=null,v.object=null,v.geometry=null,v.material=null,v.group=null}}return{opaque:n,transmissive:i,transparent:s,init:r,push:c,unshift:u,finish:p,sort:d}}function eR(){let t=new WeakMap;function e(i,s){const r=t.get(i);let o;return r===void 0?(o=new Jv,t.set(i,[o])):s>=r.length?(o=new Jv,r.push(o)):o=r[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function tR(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={direction:new I,color:new it};break;case"SpotLight":n={position:new I,direction:new I,color:new it,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new I,color:new it,distance:0,decay:0};break;case"HemisphereLight":n={direction:new I,skyColor:new it,groundColor:new it};break;case"RectAreaLight":n={color:new it,position:new I,halfWidth:new I,halfHeight:new I};break}return t[e.id]=n,n}}}function nR(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let iR=0;function sR(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function rR(t){const e=new tR,n=nR(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)i.probe.push(new I);const s=new I,r=new At,o=new At;function l(u){let d=0,p=0,h=0;for(let B=0;B<9;B++)i.probe[B].set(0,0,0);let m=0,v=0,w=0,x=0,f=0,g=0,S=0,y=0,b=0,T=0,N=0,_=0,C=0,R=0;u.sort(sR);for(let B=0,D=u.length;B<D;B++){const P=u[B],j=P.color,Q=P.intensity,W=P.distance;let G=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Fr?G=P.shadow.map.texture:G=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)d+=j.r*Q,p+=j.g*Q,h+=j.b*Q;else if(P.isLightProbe){for(let H=0;H<9;H++)i.probe[H].addScaledVector(P.sh.coefficients[H],Q);R++}else if(P.isSunLight){const H=e.get(P);if(H.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const X=P.shadow,J=n.get(P);J.shadowIntensity=X.intensity,J.shadowBias=X.bias,J.shadowNormalBias=X.normalBias,J.shadowRadius=X.radius,J.shadowMapSize.copy(X.mapSize).multiply(X.getFrameExtents()),i.sunShadow[v]=J,i.sunShadowMap[v]=G;const ve=X.getViewportCount();for(let Ie=0;Ie<ve;Ie++)i.sunShadowMatrix[w+Ie]=X.getMatrix(Ie),i.sunShadowCascade[w+Ie]=X._cascadeData[Ie];w+=ve,v++}i.sun[m]=H,m++}else if(P.isDirectionalLight){const H=e.get(P);if(H.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const X=P.shadow,J=n.get(P);J.shadowIntensity=X.intensity,J.shadowBias=X.bias,J.shadowNormalBias=X.normalBias,J.shadowRadius=X.radius,J.shadowMapSize=X.mapSize,i.directionalShadow[x]=J,i.directionalShadowMap[x]=G,i.directionalShadowMatrix[x]=P.shadow.matrix,b++}i.directional[x]=H,x++}else if(P.isSpotLight){const H=e.get(P);H.position.setFromMatrixPosition(P.matrixWorld),H.color.copy(j).multiplyScalar(Q),H.distance=W,H.coneCos=Math.cos(P.angle),H.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),H.decay=P.decay,i.spot[g]=H;const X=P.shadow;if(P.map&&(i.spotLightMap[_]=P.map,_++,X.updateMatrices(P),P.castShadow&&C++),i.spotLightMatrix[g]=X.matrix,P.castShadow){const J=n.get(P);J.shadowIntensity=X.intensity,J.shadowBias=X.bias,J.shadowNormalBias=X.normalBias,J.shadowRadius=X.radius,J.shadowMapSize=X.mapSize,i.spotShadow[g]=J,i.spotShadowMap[g]=G,N++}g++}else if(P.isRectAreaLight){const H=e.get(P);H.color.copy(j).multiplyScalar(Q),H.halfWidth.set(P.width*.5,0,0),H.halfHeight.set(0,P.height*.5,0),i.rectArea[S]=H,S++}else if(P.isPointLight){const H=e.get(P);if(H.color.copy(P.color).multiplyScalar(P.intensity),H.distance=P.distance,H.decay=P.decay,P.castShadow){const X=P.shadow,J=n.get(P);J.shadowIntensity=X.intensity,J.shadowBias=X.bias,J.shadowNormalBias=X.normalBias,J.shadowRadius=X.radius,J.shadowMapSize=X.mapSize,J.shadowCameraNear=X.camera.near,J.shadowCameraFar=X.camera.far,i.pointShadow[f]=J,i.pointShadowMap[f]=G,i.pointShadowMatrix[f]=P.shadow.matrix,T++}i.point[f]=H,f++}else if(P.isHemisphereLight){const H=e.get(P);H.skyColor.copy(P.color).multiplyScalar(Q),H.groundColor.copy(P.groundColor).multiplyScalar(Q),i.hemi[y]=H,y++}}S>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ne.LTC_FLOAT_1,i.rectAreaLTC2=Ne.LTC_FLOAT_2):(i.rectAreaLTC1=Ne.LTC_HALF_1,i.rectAreaLTC2=Ne.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=p,i.ambient[2]=h;const k=i.hash;(k.sunLength!==m||k.directionalLength!==x||k.pointLength!==f||k.spotLength!==g||k.rectAreaLength!==S||k.hemiLength!==y||k.numSunShadows!==v||k.numDirectionalShadows!==b||k.numPointShadows!==T||k.numSpotShadows!==N||k.numSpotMaps!==_||k.numLightProbes!==R)&&(i.sun.length=m,i.directional.length=x,i.spot.length=g,i.rectArea.length=S,i.point.length=f,i.hemi.length=y,i.sunShadow.length=v,i.sunShadowMap.length=v,i.sunShadowMatrix.length=w,i.sunShadowCascade.length=w,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.directionalShadowMatrix.length=b,i.pointShadow.length=T,i.pointShadowMap.length=T,i.pointShadowMatrix.length=T,i.spotShadow.length=N,i.spotShadowMap.length=N,i.spotLightMatrix.length=N+_-C,i.spotLightMap.length=_,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=R,k.sunLength=m,k.directionalLength=x,k.pointLength=f,k.spotLength=g,k.rectAreaLength=S,k.hemiLength=y,k.numSunShadows=v,k.numDirectionalShadows=b,k.numPointShadows=T,k.numSpotShadows=N,k.numSpotMaps=_,k.numLightProbes=R,i.version=iR++)}function c(u,d){let p=0,h=0,m=0,v=0,w=0,x=0;const f=d.matrixWorldInverse;for(let g=0,S=u.length;g<S;g++){const y=u[g];if(y.isSunLight){const b=i.sun[p];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(f),p++}else if(y.isDirectionalLight){const b=i.directional[h];b.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(f),h++}else if(y.isSpotLight){const b=i.spot[v];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(f),b.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(f),v++}else if(y.isRectAreaLight){const b=i.rectArea[w];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(f),o.identity(),r.copy(y.matrixWorld),r.premultiply(f),o.extractRotation(r),b.halfWidth.set(y.width*.5,0,0),b.halfHeight.set(0,y.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),w++}else if(y.isPointLight){const b=i.point[m];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(f),m++}else if(y.isHemisphereLight){const b=i.hemi[x];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(f),x++}}}return{setup:l,setupView:c,state:i}}function ex(t){const e=new rR(t),n=[],i=[],s=[];function r(h){p.camera=h,n.length=0,i.length=0,s.length=0}function o(h){n.push(h)}function l(h){i.push(h)}function c(h){s.push(h)}function u(){e.setup(n)}function d(h){e.setupView(n,h)}const p={lightsArray:n,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:p,setupLights:u,setupLightsView:d,pushLight:o,pushShadow:l,pushLightProbeGrid:c}}function aR(t){let e=new WeakMap;function n(s,r=0){const o=e.get(s);let l;return o===void 0?(l=new ex(t),e.set(s,[l])):r>=o.length?(l=new ex(t),o.push(l)):l=o[r],l}function i(){e=new WeakMap}return{get:n,dispose:i}}const oR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,lR=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,cR=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],uR=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],tx=new At,wo=new I,ih=new I;function dR(t,e,n){let i=new ty;const s=new Ue,r=new Ue,o=new Yt,l=new _1,c=new y1,u={},d=n.maxTextureSize,p={[Ir]:Qn,[Qn]:Ir,[Cn]:Cn},h=new Zt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ue},radius:{value:4}},vertexShader:oR,fragmentShader:lR}),m=h.clone();m.defines.HORIZONTAL_PASS=1;const v=new Dt;v.setAttribute("position",new Ot(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new qt(v,h),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ic;let f=this.type;this.render=function(T,N,_){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||T.length===0)return;this.type===Gb&&(Ke("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ic);const C=t.getRenderTarget(),R=t.getActiveCubeFace(),k=t.getActiveMipmapLevel(),B=t.state;B.setBlending(ns),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const D=f!==this.type;D&&N.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(j=>j.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,j=T.length;P<j;P++){const Q=T[P],W=Q.shadow;if(W===void 0){Ke("WebGLShadowMap:",Q,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);const G=W.getFrameExtents();s.multiply(G),r.copy(W.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/G.x),s.x=r.x*G.x,W.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/G.y),s.y=r.y*G.y,W.mapSize.y=r.y));const H=t.state.buffers.depth.getReversed();if(W.camera._reversedDepth=H,W.map===null||D===!0){if(W.map!==null&&(W.map.depthTexture!==null&&(W.map.depthTexture.dispose(),W.map.depthTexture=null),W.map.dispose()),this.type===No){if(Q.isPointLight){Ke("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}W.map=new Ln(s.x,s.y,{format:Fr,type:Hn,minFilter:yn,magFilter:yn,generateMipmaps:!1}),W.map.texture.name=Q.name+".shadowMap",W.map.depthTexture=new cl(s.x,s.y,Oi),W.map.depthTexture.name=Q.name+".shadowMapDepth",W.map.depthTexture.format=Ns,W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=_n,W.map.depthTexture.magFilter=_n}else Q.isPointLight?(W.map=new fy(s.x),W.map.depthTexture=new h1(s.x,ss)):(W.map=new Ln(s.x,s.y),W.map.depthTexture=new cl(s.x,s.y,ss)),W.map.depthTexture.name=Q.name+".shadowMap",W.map.depthTexture.format=Ns,this.type===Ic?(W.map.depthTexture.compareFunction=H?am:rm,W.map.depthTexture.minFilter=yn,W.map.depthTexture.magFilter=yn):(W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=_n,W.map.depthTexture.magFilter=_n);W.camera.updateProjectionMatrix()}W.map.isWebGLCubeRenderTarget!==!0&&(W.map.width!==s.x||W.map.height!==s.y)&&W.map.setSize(s.x,s.y);const X=W.map.isWebGLCubeRenderTarget?6:W.getViewportCount();Q.isPointLight!==!0&&W.updateMatrices(Q,_);for(let J=0;J<X;J++){const ve=W.getCamera(J);if(Q.isPointLight){const Ie=W.camera,Qe=W.matrix,re=Q.distance||Ie.far;re!==Ie.far&&(Ie.far=re,Ie.updateProjectionMatrix()),wo.setFromMatrixPosition(Q.matrixWorld),Ie.position.copy(wo),ih.copy(Ie.position),ih.add(cR[J]),Ie.up.copy(uR[J]),Ie.lookAt(ih),Ie.updateMatrixWorld(),Qe.makeTranslation(-wo.x,-wo.y,-wo.z),tx.multiplyMatrices(Ie.projectionMatrix,Ie.matrixWorldInverse),W._frustum.setFromProjectionMatrix(tx,Ie.coordinateSystem,Ie.reversedDepth)}if(W.map.isWebGLCubeRenderTarget)t.setRenderTarget(W.map,J),t.clear();else{J===0&&(t.setRenderTarget(W.map),t.clear());const Ie=W.getViewport(J);o.set(r.x*Ie.x,r.y*Ie.y,r.x*Ie.z,r.y*Ie.w),B.viewport(o)}i=W.getFrustum(J),y(N,_,ve,Q,this.type)}W.isPointLightShadow!==!0&&this.type===No&&g(W,_),W.needsUpdate=!1}f=this.type,x.needsUpdate=!1,t.setRenderTarget(C,R,k)};function g(T,N){const _=e.update(w);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null?T.mapPass=new Ln(s.x,s.y,{format:Fr,type:Hn}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value.set(T.map.width,T.map.height),h.uniforms.radius.value=T.radius,t.setRenderTarget(T.mapPass),t.clear(),t.renderBufferDirect(N,null,_,h,w,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value.set(T.map.width,T.map.height),m.uniforms.radius.value=T.radius,t.setRenderTarget(T.map),t.clear(),t.renderBufferDirect(N,null,_,m,w,null)}function S(T,N,_,C){let R=null;const k=_.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(k!==void 0)R=k;else if(R=_.isPointLight===!0?c:l,t.localClippingEnabled&&N.clipShadows===!0&&Array.isArray(N.clippingPlanes)&&N.clippingPlanes.length!==0||N.displacementMap&&N.displacementScale!==0||N.alphaMap&&N.alphaTest>0||N.map&&N.alphaTest>0||N.alphaToCoverage===!0){const B=R.uuid,D=N.uuid;let P=u[B];P===void 0&&(P={},u[B]=P);let j=P[D];j===void 0&&(j=R.clone(),P[D]=j,N.addEventListener("dispose",b)),R=j}if(R.visible=N.visible,R.wireframe=N.wireframe,C===No?R.side=N.shadowSide!==null?N.shadowSide:N.side:R.side=N.shadowSide!==null?N.shadowSide:p[N.side],R.alphaMap=N.alphaMap,R.alphaTest=N.alphaToCoverage===!0?.5:N.alphaTest,R.map=N.map,R.clipShadows=N.clipShadows,R.clippingPlanes=N.clippingPlanes,R.clipIntersection=N.clipIntersection,R.displacementMap=N.displacementMap,R.displacementScale=N.displacementScale,R.displacementBias=N.displacementBias,R.wireframeLinewidth=N.wireframeLinewidth,R.linewidth=N.linewidth,_.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const B=t.properties.get(R);B.light=_}return R}function y(T,N,_,C,R){if(T.visible===!1)return;if(T.layers.test(N.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&R===No)&&(!T.frustumCulled||T.intersectsFrustum(i))){T.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,T.matrixWorld);const D=e.update(T),P=T.material;if(Array.isArray(P)){const j=D.groups;for(let Q=0,W=j.length;Q<W;Q++){const G=j[Q],H=P[G.materialIndex];if(H&&H.visible){const X=S(T,H,C,R);T.onBeforeShadow(t,T,N,_,D,X,G),t.renderBufferDirect(_,null,D,X,T,G),T.onAfterShadow(t,T,N,_,D,X,G)}}}else if(P.visible){const j=S(T,P,C,R);T.onBeforeShadow(t,T,N,_,D,j,null),t.renderBufferDirect(_,null,D,j,T,null),T.onAfterShadow(t,T,N,_,D,j,null)}}const B=T.children;for(let D=0,P=B.length;D<P;D++)y(B[D],N,_,C,R)}function b(T){T.target.removeEventListener("dispose",b);for(const _ in u){const C=u[_],R=T.target.uuid;R in C&&(C[R].dispose(),delete C[R])}}}function hR(t,e){function n(){let z=!1;const ge=new Yt;let ie=null;const we=new Yt(0,0,0,0);return{setMask:function(pe){ie!==pe&&!z&&(t.colorMask(pe,pe,pe,pe),ie=pe)},setLocked:function(pe){z=pe},setClear:function(pe,oe,Ve,ze,St){St===!0&&(pe*=ze,oe*=ze,Ve*=ze),ge.set(pe,oe,Ve,ze),we.equals(ge)===!1&&(t.clearColor(pe,oe,Ve,ze),we.copy(ge))},reset:function(){z=!1,ie=null,we.set(-1,0,0,0)}}}function i(){let z=!1,ge=!1,ie=null,we=null,pe=null;return{setReversed:function(oe){if(ge!==oe){const Ve=e.get("EXT_clip_control");oe?Ve.clipControlEXT(Ve.LOWER_LEFT_EXT,Ve.ZERO_TO_ONE_EXT):Ve.clipControlEXT(Ve.LOWER_LEFT_EXT,Ve.NEGATIVE_ONE_TO_ONE_EXT),ge=oe;const ze=pe;pe=null,this.setClear(ze)}},getReversed:function(){return ge},setTest:function(oe){oe?F(t.DEPTH_TEST):ee(t.DEPTH_TEST)},setMask:function(oe){ie!==oe&&!z&&(t.depthMask(oe),ie=oe)},setFunc:function(oe){if(ge&&(oe=bE[oe]),we!==oe){switch(oe){case nf:t.depthFunc(t.NEVER);break;case sf:t.depthFunc(t.ALWAYS);break;case rf:t.depthFunc(t.LESS);break;case rl:t.depthFunc(t.LEQUAL);break;case af:t.depthFunc(t.EQUAL);break;case of:t.depthFunc(t.GEQUAL);break;case lf:t.depthFunc(t.GREATER);break;case cf:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}we=oe}},setLocked:function(oe){z=oe},setClear:function(oe){pe!==oe&&(pe=oe,ge&&(oe=1-oe),t.clearDepth(oe))},reset:function(){z=!1,ie=null,we=null,pe=null,ge=!1}}}function s(){let z=!1,ge=null,ie=null,we=null,pe=null,oe=null,Ve=null,ze=null,St=null;return{setTest:function(pt){z||(pt?F(t.STENCIL_TEST):ee(t.STENCIL_TEST))},setMask:function(pt){ge!==pt&&!z&&(t.stencilMask(pt),ge=pt)},setFunc:function(pt,In,pi){(ie!==pt||we!==In||pe!==pi)&&(t.stencilFunc(pt,In,pi),ie=pt,we=In,pe=pi)},setOp:function(pt,In,pi){(oe!==pt||Ve!==In||ze!==pi)&&(t.stencilOp(pt,In,pi),oe=pt,Ve=In,ze=pi)},setLocked:function(pt){z=pt},setClear:function(pt){St!==pt&&(t.clearStencil(pt),St=pt)},reset:function(){z=!1,ge=null,ie=null,we=null,pe=null,oe=null,Ve=null,ze=null,St=null}}}const r=new n,o=new i,l=new s,c=new WeakMap,u=new WeakMap;let d={},p={},h={},m=new WeakMap,v=[],w=null,x=!1,f=null,g=null,S=null,y=null,b=null,T=null,N=null,_=new it(0,0,0),C=0,R=!1,k=null,B=null,D=null,P=null,j=null;const Q=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,G=0;const H=t.getParameter(t.VERSION);H.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(H)[1]),W=G>=1):H.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),W=G>=2);let X=null,J={};const ve=t.getParameter(t.SCISSOR_BOX),Ie=t.getParameter(t.VIEWPORT),Qe=new Yt().fromArray(ve),re=new Yt().fromArray(Ie);function fe(z,ge,ie,we){const pe=new Uint8Array(4),oe=t.createTexture();t.bindTexture(z,oe),t.texParameteri(z,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(z,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Ve=0;Ve<ie;Ve++)z===t.TEXTURE_3D||z===t.TEXTURE_2D_ARRAY?t.texImage3D(ge,0,t.RGBA,1,1,we,0,t.RGBA,t.UNSIGNED_BYTE,pe):t.texImage2D(ge+Ve,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,pe);return oe}const E={};E[t.TEXTURE_2D]=fe(t.TEXTURE_2D,t.TEXTURE_2D,1),E[t.TEXTURE_CUBE_MAP]=fe(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),E[t.TEXTURE_2D_ARRAY]=fe(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),E[t.TEXTURE_3D]=fe(t.TEXTURE_3D,t.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),l.setClear(0),F(t.DEPTH_TEST),o.setFunc(rl),Pe(!1),ut(Wg),F(t.CULL_FACE),Ae(ns);function F(z){d[z]!==!0&&(t.enable(z),d[z]=!0)}function ee(z){d[z]!==!1&&(t.disable(z),d[z]=!1)}function ue(z,ge){return h[z]!==ge?(t.bindFramebuffer(z,ge),h[z]=ge,z===t.DRAW_FRAMEBUFFER&&(h[t.FRAMEBUFFER]=ge),z===t.FRAMEBUFFER&&(h[t.DRAW_FRAMEBUFFER]=ge),!0):!1}function ce(z,ge){let ie=v,we=!1;if(z){ie=m.get(ge),ie===void 0&&(ie=[],m.set(ge,ie));const pe=z.textures;if(ie.length!==pe.length||ie[0]!==t.COLOR_ATTACHMENT0){for(let oe=0,Ve=pe.length;oe<Ve;oe++)ie[oe]=t.COLOR_ATTACHMENT0+oe;ie.length=pe.length,we=!0}}else ie[0]!==t.BACK&&(ie[0]=t.BACK,we=!0);we&&t.drawBuffers(ie)}function qe(z){return w!==z?(t.useProgram(z),w=z,!0):!1}const Ge={[fa]:t.FUNC_ADD,[$b]:t.FUNC_SUBTRACT,[Xb]:t.FUNC_REVERSE_SUBTRACT};Ge[Yb]=t.MIN,Ge[qb]=t.MAX;const Le={[Kb]:t.ZERO,[Zb]:t.ONE,[Qb]:t.SRC_COLOR,[O_]:t.SRC_ALPHA,[sE]:t.SRC_ALPHA_SATURATE,[nE]:t.DST_COLOR,[eE]:t.DST_ALPHA,[Jb]:t.ONE_MINUS_SRC_COLOR,[j_]:t.ONE_MINUS_SRC_ALPHA,[iE]:t.ONE_MINUS_DST_COLOR,[tE]:t.ONE_MINUS_DST_ALPHA,[rE]:t.CONSTANT_COLOR,[aE]:t.ONE_MINUS_CONSTANT_COLOR,[oE]:t.CONSTANT_ALPHA,[lE]:t.ONE_MINUS_CONSTANT_ALPHA};function Ae(z,ge,ie,we,pe,oe,Ve,ze,St,pt){if(z===ns){x===!0&&(ee(t.BLEND),x=!1);return}if(x===!1&&(F(t.BLEND),x=!0),z!==Wb){if(z!==f||pt!==R){if((g!==fa||b!==fa)&&(t.blendEquation(t.FUNC_ADD),g=fa,b=fa),pt)switch(z){case jo:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case en:t.blendFunc(t.ONE,t.ONE);break;case $g:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Xg:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:mt("WebGLState: Invalid blending: ",z);break}else switch(z){case jo:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case en:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case $g:mt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Xg:mt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:mt("WebGLState: Invalid blending: ",z);break}S=null,y=null,T=null,N=null,_.set(0,0,0),C=0,f=z,R=pt}return}pe=pe||ge,oe=oe||ie,Ve=Ve||we,(ge!==g||pe!==b)&&(t.blendEquationSeparate(Ge[ge],Ge[pe]),g=ge,b=pe),(ie!==S||we!==y||oe!==T||Ve!==N)&&(t.blendFuncSeparate(Le[ie],Le[we],Le[oe],Le[Ve]),S=ie,y=we,T=oe,N=Ve),(ze.equals(_)===!1||St!==C)&&(t.blendColor(ze.r,ze.g,ze.b,St),_.copy(ze),C=St),f=z,R=!1}function De(z,ge){z.side===Cn?ee(t.CULL_FACE):F(t.CULL_FACE);let ie=z.side===Qn;ge&&(ie=!ie),Pe(ie),z.blending===jo&&z.transparent===!1?Ae(ns):Ae(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),o.setFunc(z.depthFunc),o.setTest(z.depthTest),o.setMask(z.depthWrite),r.setMask(z.colorWrite);const we=z.stencilWrite;l.setTest(we),we&&(l.setMask(z.stencilWriteMask),l.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),l.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),Ut(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?F(t.SAMPLE_ALPHA_TO_COVERAGE):ee(t.SAMPLE_ALPHA_TO_COVERAGE)}function Pe(z){k!==z&&(z?t.frontFace(t.CW):t.frontFace(t.CCW),k=z)}function ut(z){z!==Hb?(F(t.CULL_FACE),z!==B&&(z===Wg?t.cullFace(t.BACK):z===Vb?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):ee(t.CULL_FACE),B=z}function st(z){z!==D&&(W&&t.lineWidth(z),D=z)}function Ut(z,ge,ie){z?(F(t.POLYGON_OFFSET_FILL),(P!==ge||j!==ie)&&(P=ge,j=ie,o.getReversed()&&(ge=-ge),t.polygonOffset(ge,ie))):ee(t.POLYGON_OFFSET_FILL)}function bt(z){z?F(t.SCISSOR_TEST):ee(t.SCISSOR_TEST)}function gt(z){z===void 0&&(z=t.TEXTURE0+Q-1),X!==z&&(t.activeTexture(z),X=z)}function U(z,ge,ie){ie===void 0&&(X===null?ie=t.TEXTURE0+Q-1:ie=X);let we=J[ie];we===void 0&&(we={type:void 0,texture:void 0},J[ie]=we),(we.type!==z||we.texture!==ge)&&(X!==ie&&(t.activeTexture(ie),X=ie),t.bindTexture(z,ge||E[z]),we.type=z,we.texture=ge)}function nn(){const z=J[X];z!==void 0&&z.type!==void 0&&(t.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function Re(){try{t.compressedTexImage2D(...arguments)}catch(z){mt("WebGLState:",z)}}function L(){try{t.compressedTexImage3D(...arguments)}catch(z){mt("WebGLState:",z)}}function M(){try{t.texSubImage2D(...arguments)}catch(z){mt("WebGLState:",z)}}function V(){try{t.texSubImage3D(...arguments)}catch(z){mt("WebGLState:",z)}}function K(){try{t.compressedTexSubImage2D(...arguments)}catch(z){mt("WebGLState:",z)}}function te(){try{t.compressedTexSubImage3D(...arguments)}catch(z){mt("WebGLState:",z)}}function he(){try{t.texStorage2D(...arguments)}catch(z){mt("WebGLState:",z)}}function xe(){try{t.texStorage3D(...arguments)}catch(z){mt("WebGLState:",z)}}function ne(){try{t.texImage2D(...arguments)}catch(z){mt("WebGLState:",z)}}function ae(){try{t.texImage3D(...arguments)}catch(z){mt("WebGLState:",z)}}function _e(z){return p[z]!==void 0?p[z]:t.getParameter(z)}function We(z,ge){p[z]!==ge&&(t.pixelStorei(z,ge),p[z]=ge)}function Ee(z){Qe.equals(z)===!1&&(t.scissor(z.x,z.y,z.z,z.w),Qe.copy(z))}function ye(z){re.equals(z)===!1&&(t.viewport(z.x,z.y,z.z,z.w),re.copy(z))}function $e(z,ge){let ie=u.get(ge);ie===void 0&&(ie=new WeakMap,u.set(ge,ie));let we=ie.get(z);we===void 0&&(we=t.getUniformBlockIndex(ge,z.name),ie.set(z,we))}function Xe(z,ge){const we=u.get(ge).get(z);c.get(ge)!==we&&(t.uniformBlockBinding(ge,we,z.__bindingPointIndex),c.set(ge,we))}function Je(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),d={},p={},X=null,J={},h={},m=new WeakMap,v=[],w=null,x=!1,f=null,g=null,S=null,y=null,b=null,T=null,N=null,_=new it(0,0,0),C=0,R=!1,k=null,B=null,D=null,P=null,j=null,Qe.set(0,0,t.canvas.width,t.canvas.height),re.set(0,0,t.canvas.width,t.canvas.height),r.reset(),o.reset(),l.reset()}return{buffers:{color:r,depth:o,stencil:l},enable:F,disable:ee,bindFramebuffer:ue,drawBuffers:ce,useProgram:qe,setBlending:Ae,setMaterial:De,setFlipSided:Pe,setCullFace:ut,setLineWidth:st,setPolygonOffset:Ut,setScissorTest:bt,activeTexture:gt,bindTexture:U,unbindTexture:nn,compressedTexImage2D:Re,compressedTexImage3D:L,texImage2D:ne,texImage3D:ae,pixelStorei:We,getParameter:_e,updateUBOMapping:$e,uniformBlockBinding:Xe,texStorage2D:he,texStorage3D:xe,texSubImage2D:M,texSubImage3D:V,compressedTexSubImage2D:K,compressedTexSubImage3D:te,scissor:Ee,viewport:ye,reset:Je}}function fR(t,e,n,i,s,r,o){const l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new Ue,d=new WeakMap,p=new Set;let h;const m=new WeakMap;let v=!1;try{v=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function w(L,M){return v?new OffscreenCanvas(L,M):_u("canvas")}function x(L,M,V){let K=1;const te=Re(L);if((te.width>V||te.height>V)&&(K=V/Math.max(te.width,te.height)),K<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const he=Math.floor(K*te.width),xe=Math.floor(K*te.height);h===void 0&&(h=w(he,xe));const ne=M?w(he,xe):h;return ne.width=he,ne.height=xe,ne.getContext("2d").drawImage(L,0,0,he,xe),Ke("WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+he+"x"+xe+")."),ne}else return"data"in L&&Ke("WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),L;return L}function f(L){return L.generateMipmaps}function g(L){t.generateMipmap(L)}function S(L){return L.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?t.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function y(L,M,V,K,te,he=!1){if(L!==null){if(t[L]!==void 0)return t[L];Ke("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let xe;K&&(xe=e.get("EXT_texture_norm16"),xe||Ke("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ne=M;if(M===t.RED&&(V===t.FLOAT&&(ne=t.R32F),V===t.HALF_FLOAT&&(ne=t.R16F),V===t.UNSIGNED_BYTE&&(ne=t.R8),V===t.UNSIGNED_SHORT&&xe&&(ne=xe.R16_EXT),V===t.SHORT&&xe&&(ne=xe.R16_SNORM_EXT)),M===t.RED_INTEGER&&(V===t.UNSIGNED_BYTE&&(ne=t.R8UI),V===t.UNSIGNED_SHORT&&(ne=t.R16UI),V===t.UNSIGNED_INT&&(ne=t.R32UI),V===t.BYTE&&(ne=t.R8I),V===t.SHORT&&(ne=t.R16I),V===t.INT&&(ne=t.R32I)),M===t.RG&&(V===t.FLOAT&&(ne=t.RG32F),V===t.HALF_FLOAT&&(ne=t.RG16F),V===t.UNSIGNED_BYTE&&(ne=t.RG8),V===t.UNSIGNED_SHORT&&xe&&(ne=xe.RG16_EXT),V===t.SHORT&&xe&&(ne=xe.RG16_SNORM_EXT)),M===t.RG_INTEGER&&(V===t.UNSIGNED_BYTE&&(ne=t.RG8UI),V===t.UNSIGNED_SHORT&&(ne=t.RG16UI),V===t.UNSIGNED_INT&&(ne=t.RG32UI),V===t.BYTE&&(ne=t.RG8I),V===t.SHORT&&(ne=t.RG16I),V===t.INT&&(ne=t.RG32I)),M===t.RGB_INTEGER&&(V===t.UNSIGNED_BYTE&&(ne=t.RGB8UI),V===t.UNSIGNED_SHORT&&(ne=t.RGB16UI),V===t.UNSIGNED_INT&&(ne=t.RGB32UI),V===t.BYTE&&(ne=t.RGB8I),V===t.SHORT&&(ne=t.RGB16I),V===t.INT&&(ne=t.RGB32I)),M===t.RGBA_INTEGER&&(V===t.UNSIGNED_BYTE&&(ne=t.RGBA8UI),V===t.UNSIGNED_SHORT&&(ne=t.RGBA16UI),V===t.UNSIGNED_INT&&(ne=t.RGBA32UI),V===t.BYTE&&(ne=t.RGBA8I),V===t.SHORT&&(ne=t.RGBA16I),V===t.INT&&(ne=t.RGBA32I)),M===t.RGB&&(V===t.UNSIGNED_SHORT&&xe&&(ne=xe.RGB16_EXT),V===t.SHORT&&xe&&(ne=xe.RGB16_SNORM_EXT),V===t.UNSIGNED_INT_5_9_9_9_REV&&(ne=t.RGB9_E5),V===t.UNSIGNED_INT_10F_11F_11F_REV&&(ne=t.R11F_G11F_B10F)),M===t.RGBA){const ae=he?vu:ht.getTransfer(te);V===t.FLOAT&&(ne=t.RGBA32F),V===t.HALF_FLOAT&&(ne=t.RGBA16F),V===t.UNSIGNED_BYTE&&(ne=ae===Tt?t.SRGB8_ALPHA8:t.RGBA8),V===t.UNSIGNED_SHORT&&xe&&(ne=xe.RGBA16_EXT),V===t.SHORT&&xe&&(ne=xe.RGBA16_SNORM_EXT),V===t.UNSIGNED_SHORT_4_4_4_4&&(ne=t.RGBA4),V===t.UNSIGNED_SHORT_5_5_5_1&&(ne=t.RGB5_A1)}return(ne===t.R16F||ne===t.R32F||ne===t.RG16F||ne===t.RG32F||ne===t.RGBA16F||ne===t.RGBA32F)&&e.get("EXT_color_buffer_float"),ne}function b(L,M){let V;return L?M===null||M===ss||M===ol?V=t.DEPTH24_STENCIL8:M===Oi?V=t.DEPTH32F_STENCIL8:M===al&&(V=t.DEPTH24_STENCIL8,Ke("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===ss||M===ol?V=t.DEPTH_COMPONENT24:M===Oi?V=t.DEPTH_COMPONENT32F:M===al&&(V=t.DEPTH_COMPONENT16),V}function T(L,M){return f(L)===!0||L.isFramebufferTexture&&L.minFilter!==_n&&L.minFilter!==yn?Math.log2(Math.max(M.width,M.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?M.mipmaps.length:1}function N(L){const M=L.target;M.removeEventListener("dispose",N),C(M),M.isVideoTexture&&d.delete(M),M.isHTMLTexture&&p.delete(M)}function _(L){const M=L.target;M.removeEventListener("dispose",_),k(M)}function C(L){const M=i.get(L);if(M.__webglInit===void 0)return;const V=L.source,K=m.get(V);if(K){const te=K[M.__cacheKey];te.usedTimes--,te.usedTimes===0&&R(L),Object.keys(K).length===0&&m.delete(V)}i.remove(L)}function R(L){const M=i.get(L);t.deleteTexture(M.__webglTexture);const V=L.source,K=m.get(V);delete K[M.__cacheKey],o.memory.textures--}function k(L){const M=i.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),i.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(M.__webglFramebuffer[K]))for(let te=0;te<M.__webglFramebuffer[K].length;te++)t.deleteFramebuffer(M.__webglFramebuffer[K][te]);else t.deleteFramebuffer(M.__webglFramebuffer[K]);M.__webglDepthbuffer&&t.deleteRenderbuffer(M.__webglDepthbuffer[K])}else{if(Array.isArray(M.__webglFramebuffer))for(let K=0;K<M.__webglFramebuffer.length;K++)t.deleteFramebuffer(M.__webglFramebuffer[K]);else t.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&t.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&t.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let K=0;K<M.__webglColorRenderbuffer.length;K++)M.__webglColorRenderbuffer[K]&&t.deleteRenderbuffer(M.__webglColorRenderbuffer[K]);M.__webglDepthRenderbuffer&&t.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const V=L.textures;for(let K=0,te=V.length;K<te;K++){const he=i.get(V[K]);he.__webglTexture&&(t.deleteTexture(he.__webglTexture),o.memory.textures--),i.remove(V[K])}i.remove(L)}let B=0;function D(){B=0}function P(){return B}function j(L){B=L}function Q(){const L=B;return L>=s.maxTextures&&Ke("WebGLTextures: Trying to use "+(L+1)+" texture units while this GPU supports only "+s.maxTextures),B+=1,L}function W(L){const M=[];return M.push(L.wrapS),M.push(L.wrapT),M.push(L.wrapR||0),M.push(L.magFilter),M.push(L.minFilter),M.push(L.anisotropy),M.push(L.internalFormat),M.push(L.format),M.push(L.type),M.push(L.generateMipmaps),M.push(L.premultiplyAlpha),M.push(L.flipY),M.push(L.unpackAlignment),M.push(L.colorSpace),M.join()}function G(L,M){const V=i.get(L);if(L.isVideoTexture&&U(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&V.__version!==L.version){const K=L.image;if(K===null)Ke("WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)Ke("WebGLRenderer: Texture marked for update but image is incomplete");else{ee(V,L,M);return}}else L.isExternalTexture&&(V.__webglTexture=L.sourceTexture?L.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,V.__webglTexture,t.TEXTURE0+M)}function H(L,M){const V=i.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&V.__version!==L.version){ee(V,L,M);return}else L.isExternalTexture&&(V.__webglTexture=L.sourceTexture?L.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,V.__webglTexture,t.TEXTURE0+M)}function X(L,M){const V=i.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&V.__version!==L.version){ee(V,L,M);return}n.bindTexture(t.TEXTURE_3D,V.__webglTexture,t.TEXTURE0+M)}function J(L,M){const V=i.get(L);if(L.isCubeDepthTexture!==!0&&L.version>0&&V.__version!==L.version){ue(V,L,M);return}n.bindTexture(t.TEXTURE_CUBE_MAP,V.__webglTexture,t.TEXTURE0+M)}const ve={[fu]:t.REPEAT,[Qi]:t.CLAMP_TO_EDGE,[uf]:t.MIRRORED_REPEAT},Ie={[_n]:t.NEAREST,[dE]:t.NEAREST_MIPMAP_NEAREST,[zl]:t.NEAREST_MIPMAP_LINEAR,[yn]:t.LINEAR,[bd]:t.LINEAR_MIPMAP_NEAREST,[Er]:t.LINEAR_MIPMAP_LINEAR},Qe={[mE]:t.NEVER,[yE]:t.ALWAYS,[gE]:t.LESS,[rm]:t.LEQUAL,[vE]:t.EQUAL,[am]:t.GEQUAL,[xE]:t.GREATER,[_E]:t.NOTEQUAL};function re(L,M){if(M.type===Oi&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===yn||M.magFilter===bd||M.magFilter===zl||M.magFilter===Er||M.minFilter===yn||M.minFilter===bd||M.minFilter===zl||M.minFilter===Er)&&Ke("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(L,t.TEXTURE_WRAP_S,ve[M.wrapS]),t.texParameteri(L,t.TEXTURE_WRAP_T,ve[M.wrapT]),(L===t.TEXTURE_3D||L===t.TEXTURE_2D_ARRAY)&&t.texParameteri(L,t.TEXTURE_WRAP_R,ve[M.wrapR]),t.texParameteri(L,t.TEXTURE_MAG_FILTER,Ie[M.magFilter]),t.texParameteri(L,t.TEXTURE_MIN_FILTER,Ie[M.minFilter]),M.compareFunction&&(t.texParameteri(L,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(L,t.TEXTURE_COMPARE_FUNC,Qe[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===_n||M.minFilter!==zl&&M.minFilter!==Er||M.type===Oi&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const V=e.get("EXT_texture_filter_anisotropic");t.texParameterf(L,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function fe(L,M){let V=!1;L.__webglInit===void 0&&(L.__webglInit=!0,M.addEventListener("dispose",N));const K=M.source;let te=m.get(K);te===void 0&&(te={},m.set(K,te));const he=W(M);if(he!==L.__cacheKey){te[he]===void 0&&(te[he]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,V=!0),te[he].usedTimes++;const xe=te[L.__cacheKey];xe!==void 0&&(te[L.__cacheKey].usedTimes--,xe.usedTimes===0&&R(M)),L.__cacheKey=he,L.__webglTexture=te[he].texture}return V}function E(L,M,V){return Math.floor(Math.floor(L/V)/M)}function F(L,M,V,K){const he=L.updateRanges;if(he.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,M.width,M.height,V,K,M.data);else{he.sort((We,Ee)=>We.start-Ee.start);let xe=0;for(let We=1;We<he.length;We++){const Ee=he[xe],ye=he[We],$e=Ee.start+Ee.count,Xe=E(ye.start,M.width,4),Je=E(Ee.start,M.width,4);ye.start<=$e+1&&Xe===Je&&E(ye.start+ye.count-1,M.width,4)===Xe?Ee.count=Math.max(Ee.count,ye.start+ye.count-Ee.start):(++xe,he[xe]=ye)}he.length=xe+1;const ne=n.getParameter(t.UNPACK_ROW_LENGTH),ae=n.getParameter(t.UNPACK_SKIP_PIXELS),_e=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,M.width);for(let We=0,Ee=he.length;We<Ee;We++){const ye=he[We],$e=Math.floor(ye.start/4),Xe=Math.ceil(ye.count/4),Je=$e%M.width,z=Math.floor($e/M.width),ge=Xe,ie=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,Je),n.pixelStorei(t.UNPACK_SKIP_ROWS,z),n.texSubImage2D(t.TEXTURE_2D,0,Je,z,ge,ie,V,K,M.data)}L.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,ne),n.pixelStorei(t.UNPACK_SKIP_PIXELS,ae),n.pixelStorei(t.UNPACK_SKIP_ROWS,_e)}}function ee(L,M,V){let K=t.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(K=t.TEXTURE_2D_ARRAY),M.isData3DTexture&&(K=t.TEXTURE_3D);const te=fe(L,M),he=M.source;n.bindTexture(K,L.__webglTexture,t.TEXTURE0+V);const xe=i.get(he);if(he.version!==xe.__version||te===!0){if(n.activeTexture(t.TEXTURE0+V),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const ie=ht.getPrimaries(ht.workingColorSpace),we=M.colorSpace===$s?null:ht.getPrimaries(M.colorSpace),pe=M.colorSpace===$s||ie===we?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe)}n.pixelStorei(t.UNPACK_ALIGNMENT,M.unpackAlignment);let ae=x(M.image,!1,s.maxTextureSize);ae=nn(M,ae);const _e=r.convert(M.format,M.colorSpace),We=r.convert(M.type);let Ee=y(M.internalFormat,_e,We,M.normalized,M.colorSpace,M.isVideoTexture);re(K,M);let ye;const $e=M.mipmaps,Xe=M.isVideoTexture!==!0,Je=xe.__version===void 0||te===!0,z=he.dataReady,ge=T(M,ae);if(M.isDepthTexture)Ee=b(M.format===Tr,M.type),Je&&(Xe?n.texStorage2D(t.TEXTURE_2D,1,Ee,ae.width,ae.height):n.texImage2D(t.TEXTURE_2D,0,Ee,ae.width,ae.height,0,_e,We,null));else if(M.isDataTexture)if($e.length>0){Xe&&Je&&n.texStorage2D(t.TEXTURE_2D,ge,Ee,$e[0].width,$e[0].height);for(let ie=0,we=$e.length;ie<we;ie++)ye=$e[ie],Xe?z&&n.texSubImage2D(t.TEXTURE_2D,ie,0,0,ye.width,ye.height,_e,We,ye.data):n.texImage2D(t.TEXTURE_2D,ie,Ee,ye.width,ye.height,0,_e,We,ye.data);M.generateMipmaps=!1}else Xe?(Je&&n.texStorage2D(t.TEXTURE_2D,ge,Ee,ae.width,ae.height),z&&F(M,ae,_e,We)):n.texImage2D(t.TEXTURE_2D,0,Ee,ae.width,ae.height,0,_e,We,ae.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Xe&&Je&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ge,Ee,$e[0].width,$e[0].height,ae.depth);for(let ie=0,we=$e.length;ie<we;ie++)if(ye=$e[ie],M.format!==bi)if(_e!==null)if(Xe){if(z)if(M.layerUpdates.size>0){const pe=Dv(ye.width,ye.height,M.format,M.type);for(const oe of M.layerUpdates){const Ve=ye.data.subarray(oe*pe/ye.data.BYTES_PER_ELEMENT,(oe+1)*pe/ye.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ie,0,0,oe,ye.width,ye.height,1,_e,Ve)}}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ie,0,0,0,ye.width,ye.height,ae.depth,_e,ye.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,ie,Ee,ye.width,ye.height,ae.depth,0,ye.data,0,0);else Ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xe?z&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,ie,0,0,0,ye.width,ye.height,ae.depth,_e,We,ye.data):n.texImage3D(t.TEXTURE_2D_ARRAY,ie,Ee,ye.width,ye.height,ae.depth,0,_e,We,ye.data);M.layerUpdates.size>0&&M.clearLayerUpdates()}else{Xe&&Je&&n.texStorage2D(t.TEXTURE_2D,ge,Ee,$e[0].width,$e[0].height);for(let ie=0,we=$e.length;ie<we;ie++)ye=$e[ie],M.format!==bi?_e!==null?Xe?z&&n.compressedTexSubImage2D(t.TEXTURE_2D,ie,0,0,ye.width,ye.height,_e,ye.data):n.compressedTexImage2D(t.TEXTURE_2D,ie,Ee,ye.width,ye.height,0,ye.data):Ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?z&&n.texSubImage2D(t.TEXTURE_2D,ie,0,0,ye.width,ye.height,_e,We,ye.data):n.texImage2D(t.TEXTURE_2D,ie,Ee,ye.width,ye.height,0,_e,We,ye.data)}else if(M.isDataArrayTexture)if(Xe){if(Je&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ge,Ee,ae.width,ae.height,ae.depth),z)if(M.layerUpdates.size>0){const ie=Dv(ae.width,ae.height,M.format,M.type);for(const we of M.layerUpdates){const pe=ae.data.subarray(we*ie/ae.data.BYTES_PER_ELEMENT,(we+1)*ie/ae.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,we,ae.width,ae.height,1,_e,We,pe)}M.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,ae.width,ae.height,ae.depth,_e,We,ae.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Ee,ae.width,ae.height,ae.depth,0,_e,We,ae.data);else if(M.isData3DTexture)Xe?(Je&&n.texStorage3D(t.TEXTURE_3D,ge,Ee,ae.width,ae.height,ae.depth),z&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,ae.width,ae.height,ae.depth,_e,We,ae.data)):n.texImage3D(t.TEXTURE_3D,0,Ee,ae.width,ae.height,ae.depth,0,_e,We,ae.data);else if(M.isFramebufferTexture){if(Je)if(Xe)n.texStorage2D(t.TEXTURE_2D,ge,Ee,ae.width,ae.height);else{let ie=ae.width,we=ae.height;for(let pe=0;pe<ge;pe++)n.texImage2D(t.TEXTURE_2D,pe,Ee,ie,we,0,_e,We,null),ie>>=1,we>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in t){const ie=t.canvas;if(ie.hasAttribute("layoutsubtree")||ie.setAttribute("layoutsubtree","true"),ae.parentNode!==ie){ie.appendChild(ae),p.add(M),ie.onpaint=we=>{const pe=we.changedElements;for(const oe of p)pe.includes(oe.image)&&(oe.needsUpdate=!0)},ie.requestPaint();return}if(t.texElementImage2D.length===3)t.texElementImage2D(t.TEXTURE_2D,t.RGBA8,ae);else{const pe=t.RGBA,oe=t.RGBA,Ve=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,0,pe,oe,Ve,ae)}t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if($e.length>0){if(Xe&&Je){const ie=Re($e[0]);n.texStorage2D(t.TEXTURE_2D,ge,Ee,ie.width,ie.height)}for(let ie=0,we=$e.length;ie<we;ie++)ye=$e[ie],Xe?z&&n.texSubImage2D(t.TEXTURE_2D,ie,0,0,_e,We,ye):n.texImage2D(t.TEXTURE_2D,ie,Ee,_e,We,ye);M.generateMipmaps=!1}else if(Xe){if(Je){const ie=Re(ae);n.texStorage2D(t.TEXTURE_2D,ge,Ee,ie.width,ie.height)}z&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,_e,We,ae)}else n.texImage2D(t.TEXTURE_2D,0,Ee,_e,We,ae);f(M)&&g(K),xe.__version=he.version,M.onUpdate&&M.onUpdate(M)}L.__version=M.version}function ue(L,M,V){if(M.image.length!==6)return;const K=fe(L,M),te=M.source;n.bindTexture(t.TEXTURE_CUBE_MAP,L.__webglTexture,t.TEXTURE0+V);const he=i.get(te);if(te.version!==he.__version||K===!0){n.activeTexture(t.TEXTURE0+V);const xe=ht.getPrimaries(ht.workingColorSpace),ne=M.colorSpace===$s?null:ht.getPrimaries(M.colorSpace),ae=M.colorSpace===$s||xe===ne?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ae);const _e=M.isCompressedTexture||M.image[0].isCompressedTexture,We=M.image[0]&&M.image[0].isDataTexture,Ee=[];for(let oe=0;oe<6;oe++)!_e&&!We?Ee[oe]=x(M.image[oe],!0,s.maxCubemapSize):Ee[oe]=We?M.image[oe].image:M.image[oe],Ee[oe]=nn(M,Ee[oe]);const ye=Ee[0],$e=r.convert(M.format,M.colorSpace),Xe=r.convert(M.type),Je=y(M.internalFormat,$e,Xe,M.normalized,M.colorSpace),z=M.isVideoTexture!==!0,ge=he.__version===void 0||K===!0,ie=te.dataReady;let we=T(M,ye);re(t.TEXTURE_CUBE_MAP,M);let pe;if(_e){z&&ge&&n.texStorage2D(t.TEXTURE_CUBE_MAP,we,Je,ye.width,ye.height);for(let oe=0;oe<6;oe++){pe=Ee[oe].mipmaps;for(let Ve=0;Ve<pe.length;Ve++){const ze=pe[Ve];M.format!==bi?$e!==null?z?ie&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ve,0,0,ze.width,ze.height,$e,ze.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ve,Je,ze.width,ze.height,0,ze.data):Ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):z?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ve,0,0,ze.width,ze.height,$e,Xe,ze.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ve,Je,ze.width,ze.height,0,$e,Xe,ze.data)}}}else{if(pe=M.mipmaps,z&&ge){pe.length>0&&we++;const oe=Re(Ee[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,we,Je,oe.width,oe.height)}for(let oe=0;oe<6;oe++)if(We){z?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,Ee[oe].width,Ee[oe].height,$e,Xe,Ee[oe].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,Je,Ee[oe].width,Ee[oe].height,0,$e,Xe,Ee[oe].data);for(let Ve=0;Ve<pe.length;Ve++){const St=pe[Ve].image[oe].image;z?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ve+1,0,0,St.width,St.height,$e,Xe,St.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ve+1,Je,St.width,St.height,0,$e,Xe,St.data)}}else{z?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,$e,Xe,Ee[oe]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,Je,$e,Xe,Ee[oe]);for(let Ve=0;Ve<pe.length;Ve++){const ze=pe[Ve];z?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ve+1,0,0,$e,Xe,ze.image[oe]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ve+1,Je,$e,Xe,ze.image[oe])}}}f(M)&&g(t.TEXTURE_CUBE_MAP),he.__version=te.version,M.onUpdate&&M.onUpdate(M)}L.__version=M.version}function ce(L,M,V,K,te,he){const xe=r.convert(V.format,V.colorSpace),ne=r.convert(V.type),ae=y(V.internalFormat,xe,ne,V.normalized,V.colorSpace),_e=i.get(M),We=i.get(V);if(We.__renderTarget=M,!_e.__hasExternalTextures){const Ee=Math.max(1,M.width>>he),ye=Math.max(1,M.height>>he);te===t.TEXTURE_3D||te===t.TEXTURE_2D_ARRAY?n.texImage3D(te,he,ae,Ee,ye,M.depth,0,xe,ne,null):n.texImage2D(te,he,ae,Ee,ye,0,xe,ne,null)}n.bindFramebuffer(t.FRAMEBUFFER,L),gt(M)?l.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,K,te,We.__webglTexture,0,bt(M)):(te===t.TEXTURE_2D||te>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,K,te,We.__webglTexture,he),n.bindFramebuffer(t.FRAMEBUFFER,null)}function qe(L,M,V){if(t.bindRenderbuffer(t.RENDERBUFFER,L),M.depthBuffer){const K=M.depthTexture,te=K&&K.isDepthTexture?K.type:null,he=b(M.stencilBuffer,te),xe=M.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;gt(M)?l.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,bt(M),he,M.width,M.height):V?t.renderbufferStorageMultisample(t.RENDERBUFFER,bt(M),he,M.width,M.height):t.renderbufferStorage(t.RENDERBUFFER,he,M.width,M.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,xe,t.RENDERBUFFER,L)}else{const K=M.textures;for(let te=0;te<K.length;te++){const he=K[te],xe=r.convert(he.format,he.colorSpace),ne=r.convert(he.type),ae=y(he.internalFormat,xe,ne,he.normalized,he.colorSpace);gt(M)?l.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,bt(M),ae,M.width,M.height):V?t.renderbufferStorageMultisample(t.RENDERBUFFER,bt(M),ae,M.width,M.height):t.renderbufferStorage(t.RENDERBUFFER,ae,M.width,M.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Ge(L,M,V){const K=M.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,L),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const te=i.get(M.depthTexture);if(te.__renderTarget=M,(!te.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),K){if(te.__webglInit===void 0&&(te.__webglInit=!0,M.depthTexture.addEventListener("dispose",N)),te.__webglTexture===void 0){te.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,te.__webglTexture),re(t.TEXTURE_CUBE_MAP,M.depthTexture);const _e=r.convert(M.depthTexture.format),We=r.convert(M.depthTexture.type);let Ee;M.depthTexture.format===Ns?Ee=t.DEPTH_COMPONENT24:M.depthTexture.format===Tr&&(Ee=t.DEPTH24_STENCIL8);for(let ye=0;ye<6;ye++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,Ee,M.width,M.height,0,_e,We,null)}}else G(M.depthTexture,0);const he=te.__webglTexture,xe=bt(M),ne=K?t.TEXTURE_CUBE_MAP_POSITIVE_X+V:t.TEXTURE_2D,ae=M.depthTexture.format===Tr?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(M.depthTexture.format===Ns)gt(M)?l.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,ae,ne,he,0,xe):t.framebufferTexture2D(t.FRAMEBUFFER,ae,ne,he,0);else if(M.depthTexture.format===Tr)gt(M)?l.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,ae,ne,he,0,xe):t.framebufferTexture2D(t.FRAMEBUFFER,ae,ne,he,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Le(L){const M=i.get(L),V=L.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==L.depthTexture){const K=L.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),K){const te=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,K.removeEventListener("dispose",te)};K.addEventListener("dispose",te),M.__depthDisposeCallback=te}M.__boundDepthTexture=K}if(L.depthTexture&&!M.__autoAllocateDepthBuffer)if(V)for(let K=0;K<6;K++)Ge(M.__webglFramebuffer[K],L,K);else{const K=L.texture.mipmaps;K&&K.length>0?Ge(M.__webglFramebuffer[0],L,0):Ge(M.__webglFramebuffer,L,0)}else if(V){M.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(n.bindFramebuffer(t.FRAMEBUFFER,M.__webglFramebuffer[K]),M.__webglDepthbuffer[K]===void 0)M.__webglDepthbuffer[K]=t.createRenderbuffer(),qe(M.__webglDepthbuffer[K],L,!1);else{const te=L.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,he=M.__webglDepthbuffer[K];t.bindRenderbuffer(t.RENDERBUFFER,he),t.framebufferRenderbuffer(t.FRAMEBUFFER,te,t.RENDERBUFFER,he)}}else{const K=L.texture.mipmaps;if(K&&K.length>0?n.bindFramebuffer(t.FRAMEBUFFER,M.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=t.createRenderbuffer(),qe(M.__webglDepthbuffer,L,!1);else{const te=L.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,he=M.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,he),t.framebufferRenderbuffer(t.FRAMEBUFFER,te,t.RENDERBUFFER,he)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Ae(L,M,V){const K=i.get(L);M!==void 0&&ce(K.__webglFramebuffer,L,L.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),V!==void 0&&Le(L)}function De(L){const M=L.texture,V=i.get(L),K=i.get(M);L.addEventListener("dispose",_);const te=L.textures,he=L.isWebGLCubeRenderTarget===!0,xe=te.length>1;if(xe||(K.__webglTexture===void 0&&(K.__webglTexture=t.createTexture()),K.__version=M.version,o.memory.textures++),he){V.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer[ne]=[];for(let ae=0;ae<M.mipmaps.length;ae++)V.__webglFramebuffer[ne][ae]=t.createFramebuffer()}else V.__webglFramebuffer[ne]=t.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer=[];for(let ne=0;ne<M.mipmaps.length;ne++)V.__webglFramebuffer[ne]=t.createFramebuffer()}else V.__webglFramebuffer=t.createFramebuffer();if(xe)for(let ne=0,ae=te.length;ne<ae;ne++){const _e=i.get(te[ne]);_e.__webglTexture===void 0&&(_e.__webglTexture=t.createTexture(),o.memory.textures++)}if(L.samples>0&&gt(L)===!1){V.__webglMultisampledFramebuffer=t.createFramebuffer(),V.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let ne=0;ne<te.length;ne++){const ae=te[ne];V.__webglColorRenderbuffer[ne]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,V.__webglColorRenderbuffer[ne]);const _e=r.convert(ae.format,ae.colorSpace),We=r.convert(ae.type),Ee=y(ae.internalFormat,_e,We,ae.normalized,ae.colorSpace,L.isXRRenderTarget===!0),ye=bt(L);t.renderbufferStorageMultisample(t.RENDERBUFFER,ye,Ee,L.width,L.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ne,t.RENDERBUFFER,V.__webglColorRenderbuffer[ne])}t.bindRenderbuffer(t.RENDERBUFFER,null),L.depthBuffer&&(V.__webglDepthRenderbuffer=t.createRenderbuffer(),qe(V.__webglDepthRenderbuffer,L,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(he){n.bindTexture(t.TEXTURE_CUBE_MAP,K.__webglTexture),re(t.TEXTURE_CUBE_MAP,M);for(let ne=0;ne<6;ne++)if(M.mipmaps&&M.mipmaps.length>0)for(let ae=0;ae<M.mipmaps.length;ae++)ce(V.__webglFramebuffer[ne][ae],L,M,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ae);else ce(V.__webglFramebuffer[ne],L,M,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);f(M)&&g(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(xe){for(let ne=0,ae=te.length;ne<ae;ne++){const _e=te[ne],We=i.get(_e);let Ee=t.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(Ee=L.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(Ee,We.__webglTexture),re(Ee,_e),ce(V.__webglFramebuffer,L,_e,t.COLOR_ATTACHMENT0+ne,Ee,0),f(_e)&&g(Ee)}n.unbindTexture()}else{let ne=t.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ne=L.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(ne,K.__webglTexture),re(ne,M),M.mipmaps&&M.mipmaps.length>0)for(let ae=0;ae<M.mipmaps.length;ae++)ce(V.__webglFramebuffer[ae],L,M,t.COLOR_ATTACHMENT0,ne,ae);else ce(V.__webglFramebuffer,L,M,t.COLOR_ATTACHMENT0,ne,0);f(M)&&g(ne),n.unbindTexture()}L.depthBuffer&&Le(L)}function Pe(L){const M=L.textures;for(let V=0,K=M.length;V<K;V++){const te=M[V];if(f(te)){const he=S(L),xe=i.get(te).__webglTexture;n.bindTexture(he,xe),g(he),n.unbindTexture()}}}const ut=[],st=[];function Ut(L){if(L.samples>0){if(gt(L)===!1){const M=L.textures,V=L.width,K=L.height;let te=t.COLOR_BUFFER_BIT;const he=L.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,xe=i.get(L),ne=M.length>1;if(ne)for(let _e=0;_e<M.length;_e++)n.bindFramebuffer(t.FRAMEBUFFER,xe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+_e,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,xe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+_e,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,xe.__webglMultisampledFramebuffer);const ae=L.texture.mipmaps;ae&&ae.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,xe.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,xe.__webglFramebuffer);for(let _e=0;_e<M.length;_e++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(te|=t.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(te|=t.STENCIL_BUFFER_BIT)),ne){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,xe.__webglColorRenderbuffer[_e]);const We=i.get(M[_e]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,We,0)}t.blitFramebuffer(0,0,V,K,0,0,V,K,te,t.NEAREST),c===!0&&(ut.length=0,st.length=0,ut.push(t.COLOR_ATTACHMENT0+_e),L.depthBuffer&&L.storeMultisampledDepthBuffer===!1&&(ut.push(he),st.push(he),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,st)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,ut))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),ne)for(let _e=0;_e<M.length;_e++){n.bindFramebuffer(t.FRAMEBUFFER,xe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+_e,t.RENDERBUFFER,xe.__webglColorRenderbuffer[_e]);const We=i.get(M[_e]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,xe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+_e,t.TEXTURE_2D,We,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,xe.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.storeMultisampledDepthBuffer===!1&&c){const M=L.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[M])}}}function bt(L){return Math.min(s.maxSamples,L.samples)}function gt(L){const M=i.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function U(L){const M=o.render.frame;d.get(L)!==M&&(d.set(L,M),L.update())}function nn(L,M){const V=L.colorSpace,K=L.format,te=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||V!==gu&&V!==$s&&(ht.getTransfer(V)===Tt?(K!==bi||te!==Si)&&Ke("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):mt("WebGLTextures: Unsupported texture color space:",V)),M}function Re(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(u.width=L.naturalWidth||L.width,u.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(u.width=L.displayWidth,u.height=L.displayHeight):(u.width=L.width,u.height=L.height),u}this.allocateTextureUnit=Q,this.resetTextureUnits=D,this.getTextureUnits=P,this.setTextureUnits=j,this.setTexture2D=G,this.setTexture2DArray=H,this.setTexture3D=X,this.setTextureCube=J,this.rebindTextures=Ae,this.setupRenderTarget=De,this.updateRenderTargetMipmap=Pe,this.updateMultisampleRenderTarget=Ut,this.setupDepthRenderbuffer=Le,this.setupFrameBufferTexture=ce,this.useMultisampledRTT=gt,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function pR(t,e){function n(i,s=$s){let r;const o=ht.getTransfer(s);if(i===Si)return t.UNSIGNED_BYTE;if(i===Jp)return t.UNSIGNED_SHORT_4_4_4_4;if(i===em)return t.UNSIGNED_SHORT_5_5_5_1;if(i===G_)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===W_)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===H_)return t.BYTE;if(i===V_)return t.SHORT;if(i===al)return t.UNSIGNED_SHORT;if(i===Qp)return t.INT;if(i===ss)return t.UNSIGNED_INT;if(i===Oi)return t.FLOAT;if(i===Hn)return t.HALF_FLOAT;if(i===$_)return t.ALPHA;if(i===X_)return t.RGB;if(i===bi)return t.RGBA;if(i===Ns)return t.DEPTH_COMPONENT;if(i===Tr)return t.DEPTH_STENCIL;if(i===tm)return t.RED;if(i===nm)return t.RED_INTEGER;if(i===Fr)return t.RG;if(i===im)return t.RG_INTEGER;if(i===sm)return t.RGBA_INTEGER;if(i===Uc||i===Fc||i===Oc||i===jc)if(o===Tt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Uc)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Fc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Oc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===jc)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Uc)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Fc)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Oc)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===jc)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===df||i===hf||i===ff||i===pf)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===df)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===hf)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ff)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===pf)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===mf||i===gf||i===vf||i===xf||i===_f||i===pu||i===yf)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===mf||i===gf)return o===Tt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===vf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===xf)return r.COMPRESSED_R11_EAC;if(i===_f)return r.COMPRESSED_SIGNED_R11_EAC;if(i===pu)return r.COMPRESSED_RG11_EAC;if(i===yf)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Sf||i===Mf||i===wf||i===bf||i===Ef||i===Tf||i===Af||i===Nf||i===Cf||i===Rf||i===Pf||i===Lf||i===Df||i===kf)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Sf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Mf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===wf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===bf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ef)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Tf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Af)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Nf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Cf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Rf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Pf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Lf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Df)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===kf)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===If||i===Uf||i===Ff)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===If)return o===Tt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Uf)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ff)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Of||i===jf||i===mu||i===Bf)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Of)return r.COMPRESSED_RED_RGTC1_EXT;if(i===jf)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===mu)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Bf)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ol?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}const mR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,gR=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class vR{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){const i=new sy(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new Zt({vertexShader:mR,fragmentShader:gR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new qt(new xl(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class xR extends cr{constructor(e,n){super();const i=this;let s=null,r=1,o=null,l="local-floor",c=1,u=null,d=null,p=null,h=null,m=null,v=null;const w=typeof XRWebGLBinding<"u",x=new vR,f={},g=n.getContextAttributes();let S=null,y=null;const b=[],T=[],N=new Ue;let _=null,C=null;const R=new yi;R.viewport=new Yt;const k=new yi;k.viewport=new Yt;const B=[R,k],D=new M1;let P=null,j=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(E){let F=b[E];return F===void 0&&(F=new Pd,b[E]=F),F.getTargetRaySpace()},this.getControllerGrip=function(E){let F=b[E];return F===void 0&&(F=new Pd,b[E]=F),F.getGripSpace()},this.getHand=function(E){let F=b[E];return F===void 0&&(F=new Pd,b[E]=F),F.getHandSpace()};function Q(E){const F=T.indexOf(E.inputSource);if(F===-1)return;const ee=b[F];ee!==void 0&&(ee.update(E.inputSource,E.frame,u||o),ee.dispatchEvent({type:E.type,data:E.inputSource}))}function W(){s.removeEventListener("select",Q),s.removeEventListener("selectstart",Q),s.removeEventListener("selectend",Q),s.removeEventListener("squeeze",Q),s.removeEventListener("squeezestart",Q),s.removeEventListener("squeezeend",Q),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",G);for(let E=0;E<b.length;E++){const F=T[E];F!==null&&(T[E]=null,b[E].disconnect(F))}P=null,j=null,x.reset();for(const E in f)delete f[E];if(e.setRenderTarget(S),m=null,h=null,p=null,s=null,y=null,fe.stop(),i.isPresenting=!1,e.setPixelRatio(_),e.setSize(N.width,N.height,!1),C!==null){const E=C.camera;E.fov=C.fov,E.zoom=C.zoom,E.updateProjectionMatrix(),C=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(E){r=E,i.isPresenting===!0&&Ke("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(E){l=E,i.isPresenting===!0&&Ke("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return u||o},this.setReferenceSpace=function(E){u=E},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return p===null&&w&&(p=new XRWebGLBinding(s,n)),p},this.getFrame=function(){return v},this.getSession=function(){return s},this.setSession=async function(E){if(s=E,s!==null){if(S=e.getRenderTarget(),s.addEventListener("select",Q),s.addEventListener("selectstart",Q),s.addEventListener("selectend",Q),s.addEventListener("squeeze",Q),s.addEventListener("squeezestart",Q),s.addEventListener("squeezeend",Q),s.addEventListener("end",W),s.addEventListener("inputsourceschange",G),g.xrCompatible!==!0&&await n.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(N),w&&"createProjectionLayer"in XRWebGLBinding.prototype){let ee=null,ue=null,ce=null;g.depth&&(ce=g.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ee=g.stencil?Tr:Ns,ue=g.stencil?ol:ss);const qe={colorFormat:n.RGBA8,depthFormat:ce,scaleFactor:r};p=this.getBinding(),h=p.createProjectionLayer(qe),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),y=new Ln(h.textureWidth,h.textureHeight,{format:bi,type:Si,depthTexture:new cl(h.textureWidth,h.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,ee),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const ee={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,n,ee),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),y=new Ln(m.framebufferWidth,m.framebufferHeight,{format:bi,type:Si,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1,storeMultisampledDepthBuffer:m.ignoreDepthValues===!1,storeMultisampledStencilBuffer:m.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),u=null,o=await s.requestReferenceSpace(l),fe.setContext(s),fe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function G(E){for(let F=0;F<E.removed.length;F++){const ee=E.removed[F],ue=T.indexOf(ee);ue>=0&&(T[ue]=null,b[ue].disconnect(ee))}for(let F=0;F<E.added.length;F++){const ee=E.added[F];let ue=T.indexOf(ee);if(ue===-1){for(let qe=0;qe<b.length;qe++)if(qe>=T.length){T.push(ee),ue=qe;break}else if(T[qe]===null){T[qe]=ee,ue=qe;break}if(ue===-1)break}const ce=b[ue];ce&&ce.connect(ee)}}const H=new I,X=new I;function J(E,F,ee){H.setFromMatrixPosition(F.matrixWorld),X.setFromMatrixPosition(ee.matrixWorld);const ue=H.distanceTo(X),ce=F.projectionMatrix.elements,qe=ee.projectionMatrix.elements,Ge=ce[14]/(ce[10]-1),Le=ce[14]/(ce[10]+1),Ae=(ce[9]+1)/ce[5],De=(ce[9]-1)/ce[5],Pe=(ce[8]-1)/ce[0],ut=(qe[8]+1)/qe[0],st=Ge*Pe,Ut=Ge*ut,bt=ue/(-Pe+ut),gt=bt*-Pe;if(F.matrixWorld.decompose(E.position,E.quaternion,E.scale),E.translateX(gt),E.translateZ(bt),E.matrixWorld.compose(E.position,E.quaternion,E.scale),E.matrixWorldInverse.copy(E.matrixWorld).invert(),ce[10]===-1)E.projectionMatrix.copy(F.projectionMatrix),E.projectionMatrixInverse.copy(F.projectionMatrixInverse);else{const U=Ge+bt,nn=Le+bt,Re=st-gt,L=Ut+(ue-gt),M=Ae*Le/nn*U,V=De*Le/nn*U;E.projectionMatrix.makePerspective(Re,L,M,V,U,nn),E.projectionMatrixInverse.copy(E.projectionMatrix).invert()}}function ve(E,F){F===null?E.matrixWorld.copy(E.matrix):E.matrixWorld.multiplyMatrices(F.matrixWorld,E.matrix),E.matrixWorldInverse.copy(E.matrixWorld).invert()}this.updateCamera=function(E){if(s===null)return;let F=E.near,ee=E.far;x.texture!==null&&(x.depthNear>0&&(F=x.depthNear),x.depthFar>0&&(ee=x.depthFar)),D.near=k.near=R.near=F,D.far=k.far=R.far=ee,(P!==D.near||j!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),P=D.near,j=D.far),D.layers.mask=E.layers.mask|6,R.layers.mask=D.layers.mask&-5,k.layers.mask=D.layers.mask&-3;const ue=E.parent,ce=D.cameras;ve(D,ue);for(let qe=0;qe<ce.length;qe++)ve(ce[qe],ue);ce.length===2?J(D,R,k):D.projectionMatrix.copy(R.projectionMatrix),C===null&&E.isPerspectiveCamera&&(C={camera:E,fov:E.fov,zoom:E.zoom}),Ie(E,D,ue)};function Ie(E,F,ee){ee===null?E.matrix.copy(F.matrixWorld):(E.matrix.copy(ee.matrixWorld),E.matrix.invert(),E.matrix.multiply(F.matrixWorld)),E.matrix.decompose(E.position,E.quaternion,E.scale),E.updateMatrixWorld(!0),E.projectionMatrix.copy(F.projectionMatrix),E.projectionMatrixInverse.copy(F.projectionMatrixInverse),E.isPerspectiveCamera&&(E.fov=ll*2*Math.atan(1/E.projectionMatrix.elements[5]),E.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(h===null&&m===null))return c},this.setFoveation=function(E){c=E,h!==null&&(h.fixedFoveation=E),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=E)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(D)},this.getCameraTexture=function(E){return f[E]};let Qe=null;function re(E,F){if(d=F.getViewerPose(u||o),v=F,d!==null){const ee=d.views;m!==null&&(e.setRenderTargetFramebuffer(y,m.framebuffer),e.setRenderTarget(y));let ue=!1;ee.length!==D.cameras.length&&(D.cameras.length=0,ue=!0);for(let Le=0;Le<ee.length;Le++){const Ae=ee[Le];let De=null;if(m!==null)De=m.getViewport(Ae);else{const ut=p.getViewSubImage(h,Ae);De=ut.viewport,Le===0&&(e.setRenderTargetTextures(y,ut.colorTexture,ut.depthStencilTexture),e.setRenderTarget(y))}let Pe=B[Le];Pe===void 0&&(Pe=new yi,Pe.layers.enable(Le),Pe.viewport=new Yt,B[Le]=Pe),Pe.matrix.fromArray(Ae.transform.matrix),Pe.matrix.decompose(Pe.position,Pe.quaternion,Pe.scale),Pe.projectionMatrix.fromArray(Ae.projectionMatrix),Pe.projectionMatrixInverse.copy(Pe.projectionMatrix).invert(),Pe.viewport.set(De.x,De.y,De.width,De.height),Le===0&&(D.matrix.copy(Pe.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),ue===!0&&D.cameras.push(Pe)}const ce=s.enabledFeatures;if(ce&&ce.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&w){p=i.getBinding();const Le=p.getDepthInformation(ee[0]);Le&&Le.isValid&&Le.texture&&x.init(Le,s.renderState)}if(ce&&ce.includes("camera-access")&&w){e.state.unbindTexture(),p=i.getBinding();for(let Le=0;Le<ee.length;Le++){const Ae=ee[Le].camera;if(Ae){let De=f[Ae];De||(De=new sy,f[Ae]=De);const Pe=p.getCameraImage(Ae);De.sourceTexture=Pe}}}}for(let ee=0;ee<b.length;ee++){const ue=T[ee],ce=b[ee];ue!==null&&ce!==void 0&&ce.update(ue,F,u||o)}Qe&&Qe(E,F),F.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:F}),v=null}const fe=new dy;fe.setAnimationLoop(re),this.setAnimationLoop=function(E){Qe=E},this.dispose=function(){}}}const _R=new At,xy=new tt;xy.set(-1,0,0,0,1,0,0,0,1);function yR(t,e){function n(x,f){x.matrixAutoUpdate===!0&&x.updateMatrix(),f.value.copy(x.matrix)}function i(x,f){f.color.getRGB(x.fogColor.value,ly(t)),f.isFog?(x.fogNear.value=f.near,x.fogFar.value=f.far):f.isFogExp2&&(x.fogDensity.value=f.density)}function s(x,f,g,S,y){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?r(x,f):f.isMeshLambertMaterial?(r(x,f),f.envMap&&(x.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(r(x,f),p(x,f)):f.isMeshPhongMaterial?(r(x,f),d(x,f),f.envMap&&(x.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(r(x,f),h(x,f),f.isMeshPhysicalMaterial&&m(x,f,y)):f.isMeshMatcapMaterial?(r(x,f),v(x,f)):f.isMeshDepthMaterial?r(x,f):f.isMeshDistanceMaterial?(r(x,f),w(x,f)):f.isMeshNormalMaterial?r(x,f):f.isLineBasicMaterial?(o(x,f),f.isLineDashedMaterial&&l(x,f)):f.isPointsMaterial?c(x,f,g,S):f.isSpriteMaterial?u(x,f):f.isShadowMaterial?(x.color.value.copy(f.color),x.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(x,f){x.opacity.value=f.opacity,f.color&&x.diffuse.value.copy(f.color),f.emissive&&x.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(x.map.value=f.map,n(f.map,x.mapTransform)),f.alphaMap&&(x.alphaMap.value=f.alphaMap,n(f.alphaMap,x.alphaMapTransform)),f.bumpMap&&(x.bumpMap.value=f.bumpMap,n(f.bumpMap,x.bumpMapTransform),x.bumpScale.value=f.bumpScale,f.side===Qn&&(x.bumpScale.value*=-1)),f.normalMap&&(x.normalMap.value=f.normalMap,n(f.normalMap,x.normalMapTransform),x.normalScale.value.copy(f.normalScale),f.side===Qn&&x.normalScale.value.negate()),f.displacementMap&&(x.displacementMap.value=f.displacementMap,n(f.displacementMap,x.displacementMapTransform),x.displacementScale.value=f.displacementScale,x.displacementBias.value=f.displacementBias),f.emissiveMap&&(x.emissiveMap.value=f.emissiveMap,n(f.emissiveMap,x.emissiveMapTransform)),f.specularMap&&(x.specularMap.value=f.specularMap,n(f.specularMap,x.specularMapTransform)),f.alphaTest>0&&(x.alphaTest.value=f.alphaTest);const g=e.get(f),S=g.envMap,y=g.envMapRotation;S&&(x.envMap.value=S,x.envMapRotation.value.setFromMatrix4(_R.makeRotationFromEuler(y)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&x.envMapRotation.value.premultiply(xy),x.reflectivity.value=f.reflectivity,x.ior.value=f.ior,x.refractionRatio.value=f.refractionRatio),f.lightMap&&(x.lightMap.value=f.lightMap,x.lightMapIntensity.value=f.lightMapIntensity,n(f.lightMap,x.lightMapTransform)),f.aoMap&&(x.aoMap.value=f.aoMap,x.aoMapIntensity.value=f.aoMapIntensity,n(f.aoMap,x.aoMapTransform))}function o(x,f){x.diffuse.value.copy(f.color),x.opacity.value=f.opacity,f.map&&(x.map.value=f.map,n(f.map,x.mapTransform))}function l(x,f){x.dashSize.value=f.dashSize,x.totalSize.value=f.dashSize+f.gapSize,x.scale.value=f.scale}function c(x,f,g,S){x.diffuse.value.copy(f.color),x.opacity.value=f.opacity,x.size.value=f.size*g,x.scale.value=S*.5,f.map&&(x.map.value=f.map,n(f.map,x.uvTransform)),f.alphaMap&&(x.alphaMap.value=f.alphaMap,n(f.alphaMap,x.alphaMapTransform)),f.alphaTest>0&&(x.alphaTest.value=f.alphaTest)}function u(x,f){x.diffuse.value.copy(f.color),x.opacity.value=f.opacity,x.rotation.value=f.rotation,f.map&&(x.map.value=f.map,n(f.map,x.mapTransform)),f.alphaMap&&(x.alphaMap.value=f.alphaMap,n(f.alphaMap,x.alphaMapTransform)),f.alphaTest>0&&(x.alphaTest.value=f.alphaTest)}function d(x,f){x.specular.value.copy(f.specular),x.shininess.value=Math.max(f.shininess,1e-4)}function p(x,f){f.gradientMap&&(x.gradientMap.value=f.gradientMap)}function h(x,f){x.metalness.value=f.metalness,f.metalnessMap&&(x.metalnessMap.value=f.metalnessMap,n(f.metalnessMap,x.metalnessMapTransform)),x.roughness.value=f.roughness,f.roughnessMap&&(x.roughnessMap.value=f.roughnessMap,n(f.roughnessMap,x.roughnessMapTransform)),f.envMap&&(x.envMapIntensity.value=f.envMapIntensity)}function m(x,f,g){x.ior.value=f.ior,f.sheen>0&&(x.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),x.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(x.sheenColorMap.value=f.sheenColorMap,n(f.sheenColorMap,x.sheenColorMapTransform)),f.sheenRoughnessMap&&(x.sheenRoughnessMap.value=f.sheenRoughnessMap,n(f.sheenRoughnessMap,x.sheenRoughnessMapTransform))),f.clearcoat>0&&(x.clearcoat.value=f.clearcoat,x.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(x.clearcoatMap.value=f.clearcoatMap,n(f.clearcoatMap,x.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,n(f.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(x.clearcoatNormalMap.value=f.clearcoatNormalMap,n(f.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Qn&&x.clearcoatNormalScale.value.negate())),f.dispersion>0&&(x.dispersion.value=f.dispersion),f.retroreflectivity>0&&(x.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(x.iridescence.value=f.iridescence,x.iridescenceIOR.value=f.iridescenceIOR,x.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(x.iridescenceMap.value=f.iridescenceMap,n(f.iridescenceMap,x.iridescenceMapTransform)),f.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=f.iridescenceThicknessMap,n(f.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),f.transmission>0&&(x.transmission.value=f.transmission,x.transmissionSamplerMap.value=g.texture,x.transmissionSamplerSize.value.set(g.width,g.height),f.transmissionMap&&(x.transmissionMap.value=f.transmissionMap,n(f.transmissionMap,x.transmissionMapTransform)),x.thickness.value=f.thickness,f.thicknessMap&&(x.thicknessMap.value=f.thicknessMap,n(f.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=f.attenuationDistance,x.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(x.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(x.anisotropyMap.value=f.anisotropyMap,n(f.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=f.specularIntensity,x.specularColor.value.copy(f.specularColor),f.specularColorMap&&(x.specularColorMap.value=f.specularColorMap,n(f.specularColorMap,x.specularColorMapTransform)),f.specularIntensityMap&&(x.specularIntensityMap.value=f.specularIntensityMap,n(f.specularIntensityMap,x.specularIntensityMapTransform))}function v(x,f){f.matcap&&(x.matcap.value=f.matcap)}function w(x,f){const g=e.get(f).light;x.referencePosition.value.setFromMatrixPosition(g.matrixWorld),x.nearDistance.value=g.shadow.camera.near,x.farDistance.value=g.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function SR(t,e,n,i){let s={},r={},o=[];const l=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,b){const T=b.program;i.uniformBlockBinding(y,T)}function u(y,b){let T=s[y.id];T===void 0&&(x(y),T=d(y),s[y.id]=T,y.addEventListener("dispose",g));const N=b.program;i.updateUBOMapping(y,N);const _=e.render.frame;r[y.id]!==_&&(h(y),r[y.id]=_)}function d(y){const b=p();y.__bindingPointIndex=b;const T=t.createBuffer(),N=y.__size,_=y.usage;return t.bindBuffer(t.UNIFORM_BUFFER,T),t.bufferData(t.UNIFORM_BUFFER,N,_),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,b,T),T}function p(){for(let y=0;y<l;y++)if(o.indexOf(y)===-1)return o.push(y),y;return mt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(y){const b=s[y.id],T=y.uniforms,N=y.__cache;t.bindBuffer(t.UNIFORM_BUFFER,b);for(let _=0,C=T.length;_<C;_++){const R=T[_];if(Array.isArray(R))for(let k=0,B=R.length;k<B;k++)m(R[k],_,k,N);else m(R,_,0,N)}t.bindBuffer(t.UNIFORM_BUFFER,null)}function m(y,b,T,N){if(w(y,b,T,N)===!0){const _=y.__offset,C=y.value;if(Array.isArray(C)){let R=0;for(let k=0;k<C.length;k++){const B=C[k],D=f(B);v(B,y.__data,R),typeof B!="number"&&typeof B!="boolean"&&!B.isMatrix3&&!ArrayBuffer.isView(B)&&(R+=D.storage/Float32Array.BYTES_PER_ELEMENT)}}else v(C,y.__data,0);t.bufferSubData(t.UNIFORM_BUFFER,_,y.__data)}}function v(y,b,T){typeof y=="number"||typeof y=="boolean"?b[0]=y:y.isMatrix3?(b[0]=y.elements[0],b[1]=y.elements[1],b[2]=y.elements[2],b[3]=0,b[4]=y.elements[3],b[5]=y.elements[4],b[6]=y.elements[5],b[7]=0,b[8]=y.elements[6],b[9]=y.elements[7],b[10]=y.elements[8],b[11]=0):ArrayBuffer.isView(y)?b.set(new y.constructor(y.buffer,y.byteOffset,b.length)):y.toArray(b,T)}function w(y,b,T,N){const _=y.value,C=b+"_"+T;if(N[C]===void 0)return typeof _=="number"||typeof _=="boolean"?N[C]=_:ArrayBuffer.isView(_)?N[C]=_.slice():N[C]=_.clone(),!0;{const R=N[C];if(typeof _=="number"||typeof _=="boolean"){if(R!==_)return N[C]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(R.equals(_)===!1)return R.copy(_),!0}}return!1}function x(y){const b=y.uniforms;let T=0;const N=16;for(let C=0,R=b.length;C<R;C++){const k=Array.isArray(b[C])?b[C]:[b[C]];for(let B=0,D=k.length;B<D;B++){const P=k[B],j=Array.isArray(P.value)?P.value:[P.value];for(let Q=0,W=j.length;Q<W;Q++){const G=j[Q],H=f(G),X=T%N,J=X%H.boundary,ve=X+J;T+=J,ve!==0&&N-ve<H.storage&&(T+=N-ve),P.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=T,T+=H.storage}}}const _=T%N;return _>0&&(T+=N-_),y.__size=T,y.__cache={},this}function f(y){const b={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(b.boundary=4,b.storage=4):y.isVector2?(b.boundary=8,b.storage=8):y.isVector3||y.isColor?(b.boundary=16,b.storage=12):y.isVector4?(b.boundary=16,b.storage=16):y.isMatrix3?(b.boundary=48,b.storage=48):y.isMatrix4?(b.boundary=64,b.storage=64):y.isTexture?Ke("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(b.boundary=16,b.storage=y.byteLength):Ke("WebGLRenderer: Unsupported uniform value type.",y),b}function g(y){const b=y.target;b.removeEventListener("dispose",g);const T=o.indexOf(b.__bindingPointIndex);o.splice(T,1),t.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function S(){for(const y in s)t.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:c,update:u,dispose:S}}const MR=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Xi=null;function wR(){return Xi===null&&(Xi=new um(MR,16,16,Fr,Hn),Xi.name="DFG_LUT",Xi.minFilter=yn,Xi.magFilter=yn,Xi.wrapS=Qi,Xi.wrapT=Qi,Xi.generateMipmaps=!1,Xi.needsUpdate=!0),Xi}class bR{constructor(e={}){const{canvas:n=ME(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:l=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:u=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:h=!1,outputBufferType:m=Si}=e;this.isWebGLRenderer=!0;let v;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");v=i.getContextAttributes().alpha}else v=o;const w=m,x=new Set([sm,im,nm]),f=new Set([Si,ss,al,ol,Jp,em]),g=new Uint32Array(4),S=new Int32Array(4),y=new I;let b=null,T=null;const N=[],_=[];let C=null;this.domElement=n,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=is,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let k=!1,B=null,D=null,P=null,j=null;this._outputColorSpace=$n;let Q=0,W=0,G=null,H=-1,X=null;const J=new Yt,ve=new Yt;let Ie=null;const Qe=new it(0);let re=0,fe=n.width,E=n.height,F=1,ee=null,ue=null;const ce=new Yt(0,0,fe,E),qe=new Yt(0,0,fe,E);let Ge=!1;const Le=new ty;let Ae=!1,De=!1;const Pe=new At,ut=new I,st=new Yt,Ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let bt=!1;function gt(){return G===null?F:1}let U=i;function nn(A,O){return n.getContext(A,O)}let Re,L,M,V,K,te,he,xe,ne,ae,_e,We,Ee,ye,$e,Xe,Je,z,ge,ie,we,pe,oe;try{const A={alpha:!0,depth:s,stencil:r,antialias:l,premultipliedAlpha:c,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:p};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Wp}`),n.addEventListener("webglcontextlost",St,!1),n.addEventListener("webglcontextrestored",pt,!1),n.addEventListener("webglcontextcreationerror",In,!1),U===null){const O="webgl2";if(U=nn(O,A),U===null)throw nn(O)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ve()}catch(A){throw n.removeEventListener("webglcontextlost",St,!1),n.removeEventListener("webglcontextrestored",pt,!1),n.removeEventListener("webglcontextcreationerror",In,!1),mt("WebGLRenderer: "+A.message),A}function Ve(){Re=new wN(U),Re.init(),we=new pR(U,Re),L=new fN(U,Re,e,we),M=new hR(U,Re),L.reversedDepthBuffer&&h&&M.buffers.depth.setReversed(!0),D=U.createFramebuffer(),P=U.createFramebuffer(),j=U.createFramebuffer(),V=new TN(U),K=new QC,te=new fR(U,Re,M,K,L,we,V),he=new MN(R),xe=new N1(U),pe=new dN(U,xe),ne=new bN(U,xe,V,pe),ae=new NN(U,ne,xe,pe,V),z=new AN(U,L,te),$e=new pN(K),_e=new ZC(R,he,Re,L,pe,$e),We=new yR(R,K),Ee=new eR,ye=new aR(Re),Je=new uN(R,he,M,ae,v,c),Xe=new dR(R,ae,L),oe=new SR(U,V,L,M),ge=new hN(U,Re,V),ie=new EN(U,Re,V),V.programs=_e.programs,R.capabilities=L,R.extensions=Re,R.properties=K,R.renderLists=Ee,R.shadowMap=Xe,R.state=M,R.info=V}w!==Si&&(C=new RN(w,n.width,n.height,l,s,r));const ze=new xR(R,U);this.xr=ze,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const A=Re.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Re.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return F},this.setPixelRatio=function(A){A!==void 0&&(F=A,this.setSize(fe,E,!1))},this.getSize=function(A){return A.set(fe,E)},this.setSize=function(A,O,Z=!0){if(ze.isPresenting){Ke("WebGLRenderer: Can't change size while VR device is presenting.");return}fe=A,E=O,n.width=Math.floor(A*F),n.height=Math.floor(O*F),Z===!0&&(n.style.width=A+"px",n.style.height=O+"px"),C!==null&&C.setSize(n.width,n.height),this.setViewport(0,0,A,O)},this.getDrawingBufferSize=function(A){return A.set(fe*F,E*F).floor()},this.setDrawingBufferSize=function(A,O,Z){fe=A,E=O,F=Z,n.width=Math.floor(A*Z),n.height=Math.floor(O*Z),this.setViewport(0,0,A,O)},this.setEffects=function(A){if(w===Si){mt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let O=0;O<A.length;O++)if(A[O].isOutputPass===!0){Ke("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}C.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(J)},this.getViewport=function(A){return A.copy(ce)},this.setViewport=function(A,O,Z,q){A.isVector4?ce.set(A.x,A.y,A.z,A.w):ce.set(A,O,Z,q),M.viewport(J.copy(ce).multiplyScalar(F).round())},this.getScissor=function(A){return A.copy(qe)},this.setScissor=function(A,O,Z,q){A.isVector4?qe.set(A.x,A.y,A.z,A.w):qe.set(A,O,Z,q),M.scissor(ve.copy(qe).multiplyScalar(F).round())},this.getScissorTest=function(){return Ge},this.setScissorTest=function(A){M.setScissorTest(Ge=A)},this.setOpaqueSort=function(A){ee=A},this.setTransparentSort=function(A){ue=A},this.getClearColor=function(A){return A.copy(Je.getClearColor())},this.setClearColor=function(){Je.setClearColor(...arguments)},this.getClearAlpha=function(){return Je.getClearAlpha()},this.setClearAlpha=function(){Je.setClearAlpha(...arguments)},this.clear=function(A=!0,O=!0,Z=!0){let q=0;if(A){let $=!1;if(G!==null){const Te=G.texture.format;$=x.has(Te)}if($){const Te=G.texture.type,Se=f.has(Te),Me=Je.getClearColor(),Fe=Je.getClearAlpha(),He=Me.r,nt=Me.g,rt=Me.b;Se?(g[0]=He,g[1]=nt,g[2]=rt,g[3]=Fe,U.clearBufferuiv(U.COLOR,0,g)):(S[0]=He,S[1]=nt,S[2]=rt,S[3]=Fe,U.clearBufferiv(U.COLOR,0,S))}else q|=U.COLOR_BUFFER_BIT}O&&(q|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Z&&(q|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),q!==0&&U.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),B=A},this.dispose=function(){n.removeEventListener("webglcontextlost",St,!1),n.removeEventListener("webglcontextrestored",pt,!1),n.removeEventListener("webglcontextcreationerror",In,!1),Je.dispose(),Ee.dispose(),ye.dispose(),K.dispose(),he.dispose(),ae.dispose(),pe.dispose(),oe.dispose(),_e.dispose(),ze.dispose(),ze.removeEventListener("sessionstart",Qa),ze.removeEventListener("sessionend",Sl),Hi.stop()};function St(A){A.preventDefault(),yu("WebGLRenderer: Context Lost."),k=!0}function pt(){yu("WebGLRenderer: Context Restored."),k=!1;const A=V.autoReset,O=Xe.enabled,Z=Xe.autoUpdate,q=Xe.needsUpdate,$=Xe.type;Ve(),V.autoReset=A,Xe.enabled=O,Xe.autoUpdate=Z,Xe.needsUpdate=q,Xe.type=$}function In(A){mt("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function pi(A){const O=A.target;O.removeEventListener("dispose",pi),_l(O)}function _l(A){Wr(A),K.remove(A)}function Wr(A){const O=K.get(A).programs;O!==void 0&&(O.forEach(function(Z){_e.releaseProgram(Z)}),A.isShaderMaterial&&_e.releaseShaderCache(A))}this.renderBufferDirect=function(A,O,Z,q,$,Te){O===null&&(O=Ut);const Se=$.isMesh&&$.matrixWorld.determinantAffine()<0,Me=$r(A,O,Z,q,$);M.setMaterial(q,Se);let Fe=Z.index,He=1;if(q.wireframe===!0){if(Fe=ne.getWireframeAttribute(Z),Fe===void 0)return;He=2}const nt=Z.drawRange,rt=Z.attributes.position;let Oe=nt.start*He,vt=(nt.start+nt.count)*He;Te!==null&&(Oe=Math.max(Oe,Te.start*He),vt=Math.min(vt,(Te.start+Te.count)*He)),Fe!==null?(Oe=Math.max(Oe,0),vt=Math.min(vt,Fe.count)):rt!=null&&(Oe=Math.max(Oe,0),vt=Math.min(vt,rt.count));const Vt=vt-Oe;if(Vt<0||Vt===1/0)return;pe.setup($,q,Me,Z,Fe);let Lt,Et=ge;if(Fe!==null&&(Lt=xe.get(Fe),Et=ie,Et.setIndex(Lt)),$.isMesh)q.wireframe===!0?(M.setLineWidth(q.wireframeLinewidth*gt()),Et.setMode(U.LINES)):Et.setMode(U.TRIANGLES);else if($.isLine){let sn=q.linewidth;sn===void 0&&(sn=1),M.setLineWidth(sn*gt()),$.isLineSegments?Et.setMode(U.LINES):$.isLineLoop?Et.setMode(U.LINE_LOOP):Et.setMode(U.LINE_STRIP)}else $.isPoints?Et.setMode(U.POINTS):$.isSprite&&Et.setMode(U.TRIANGLES);if($.isBatchedMesh)if(Re.get("WEBGL_multi_draw"))Et.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const sn=$._multiDrawStarts,Ce=$._multiDrawCounts,hn=$._multiDrawCount,ct=Fe?xe.get(Fe).bytesPerElement:1,fn=K.get(q).currentProgram.getUniforms();for(let Jn=0;Jn<hn;Jn++)fn.setValue(U,"_gl_DrawID",Jn),Et.render(sn[Jn]/ct,Ce[Jn])}else if($.isInstancedMesh)Et.renderInstances(Oe,Vt,$.count);else if(Z.isInstancedBufferGeometry){const sn=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,Ce=Math.min(Z.instanceCount,sn);Et.renderInstances(Oe,Vt,Ce)}else Et.render(Oe,Vt)};function Ht(A,O,Z,q){B!==null&&A.isNodeMaterial&&B.setObject(q,A),Ae===!0&&$e.setState(A,Z,!1),A.transparent===!0&&A.side===Cn&&A.forceSinglePass===!1?(A.side=Qn,A.needsUpdate=!0,dr(A,O,q),A.side=Ir,A.needsUpdate=!0,dr(A,O,q),A.side=Cn):dr(A,O,q)}this.compile=function(A,O,Z=null){Z===null&&(Z=A),B!==null&&B.renderStart(A,O,Z),T=ye.get(Z),T.init(O),_.push(T),Z.traverseVisible(function($){$.isLight&&$.layers.test(O.layers)&&(T.pushLight($),$.castShadow&&T.pushShadow($))}),A!==Z&&A.traverseVisible(function($){$.isLight&&$.layers.test(O.layers)&&(T.pushLight($),$.castShadow&&T.pushShadow($))}),T.setupLights(),B!==null&&B.updateLights(T.state.lightsArray),De=this.localClippingEnabled,Ae=$e.init(this.clippingPlanes,De),Ae===!0&&$e.setGlobalState(this.clippingPlanes,O),B!==null&&Xe.render(T.state.shadowsArray,Z,O);const q=new Set;return A.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const Te=$.material;if(Te)if(Array.isArray(Te))for(let Se=0;Se<Te.length;Se++){const Me=Te[Se];Ht(Me,Z,O,$),q.add(Me)}else Ht(Te,Z,O,$),q.add(Te)}),T=_.pop(),B!==null&&B.renderEnd(),q},this.compileAsync=function(A,O,Z=null){const q=this.compile(A,O,Z);return new Promise($=>{function Te(){if(q.forEach(function(Se){const Fe=K.get(Se).currentProgram;(Fe===void 0||Fe.isReady())&&q.delete(Se)}),q.size===0){$(A);return}setTimeout(Te,10)}Re.get("KHR_parallel_shader_compile")!==null?Te():setTimeout(Te,10)})};let mi=null;function yl(A){mi&&mi(A)}function Qa(){Hi.stop()}function Sl(){Hi.start()}const Hi=new dy;Hi.setAnimationLoop(yl),typeof self<"u"&&Hi.setContext(self),this.setAnimationLoop=function(A){mi=A,ze.setAnimationLoop(A),A===null?Hi.stop():Hi.start()},ze.addEventListener("sessionstart",Qa),ze.addEventListener("sessionend",Sl),this.render=function(A,O){if(O!==void 0&&O.isCamera!==!0){mt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(k===!0)return;B!==null&&B.renderStart(A,O);const Z=ze.enabled===!0&&ze.isPresenting===!0,q=C!==null&&(G===null||Z)&&C.begin(R,G);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),ze.enabled===!0&&ze.isPresenting===!0&&(C===null||C.isCompositing()===!1)&&(ze.cameraAutoUpdate===!0&&ze.updateCamera(O),O=ze.getCamera()),A.isScene===!0&&A.onBeforeRender(R,A,O,G),T=ye.get(A,_.length),T.init(O),T.state.textureUnits=te.getTextureUnits(),_.push(T),Pe.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Le.setFromProjectionMatrix(Pe,Ji,O.reversedDepth),De=this.localClippingEnabled,Ae=$e.init(this.clippingPlanes,De),b=Ee.get(A,N.length),b.init(),N.push(b),ze.enabled===!0&&ze.isPresenting===!0){const Se=R.xr.getDepthSensingMesh();Se!==null&&Rs(Se,O,-1/0,R.sortObjects)}Rs(A,O,0,R.sortObjects),b.finish(),B!==null&&B.updateLights(T.state.lightsArray),R.sortObjects===!0&&b.sort(ee,ue),bt=ze.enabled===!1||ze.isPresenting===!1||ze.hasDepthSensing()===!1,bt&&Je.addToRenderList(b,A),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ae===!0&&$e.beginShadows();const $=T.state.shadowsArray;if(Xe.render($,A,O),Ae===!0&&$e.endShadows(),(q&&C.hasRenderPass())===!1){const Se=b.opaque,Me=b.transmissive;if(T.setupLights(),O.isArrayCamera){const Fe=O.cameras;if(Me.length>0)for(let He=0,nt=Fe.length;He<nt;He++){const rt=Fe[He];Ja(Se,Me,A,rt)}bt&&Je.render(A);for(let He=0,nt=Fe.length;He<nt;He++){const rt=Fe[He];Ps(b,A,rt,rt.viewport)}}else Me.length>0&&Ja(Se,Me,A,O),bt&&Je.render(A),Ps(b,A,O)}G!==null&&W===0&&(te.updateMultisampleRenderTarget(G),te.updateRenderTargetMipmap(G)),q&&C.end(R),A.isScene===!0&&A.onAfterRender(R,A,O),pe.resetDefaultState(),H=-1,X=null,_.pop(),_.length>0?(T=_[_.length-1],te.setTextureUnits(T.state.textureUnits),Ae===!0&&$e.setGlobalState(R.clippingPlanes,T.state.camera)):T=null,N.pop(),N.length>0?b=N[N.length-1]:b=null,B!==null&&B.renderEnd()};function Rs(A,O,Z,q){if(A.visible===!1)return;if(A.layers.test(O.layers)){if(A.isGroup)Z=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(O);else if(A.isLightProbeGrid)T.pushLightProbeGrid(A);else if(A.isLight)T.pushLight(A),A.castShadow&&T.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||A.intersectsFrustum(Le)){q&&st.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Pe);const Se=ae.update(A),Me=A.material;Me.visible&&b.push(A,Se,Me,Z,st.z,null,O)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||A.intersectsFrustum(Le))){const Se=ae.update(A),Me=A.material;if(q&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),st.copy(A.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),st.copy(Se.boundingSphere.center)),st.applyMatrix4(A.matrixWorld).applyMatrix4(Pe)),Array.isArray(Me)){const Fe=Se.groups;for(let He=0,nt=Fe.length;He<nt;He++){const rt=Fe[He],Oe=Me[rt.materialIndex];Oe&&Oe.visible&&b.push(A,Se,Oe,Z,st.z,rt,O)}}else Me.visible&&b.push(A,Se,Me,Z,st.z,null,O)}}const Te=A.children;for(let Se=0,Me=Te.length;Se<Me;Se++)Rs(Te[Se],O,Z,q)}function Ps(A,O,Z,q){const{opaque:$,transmissive:Te,transparent:Se}=A;T.setupLightsView(Z),Ae===!0&&$e.setGlobalState(R.clippingPlanes,Z),q&&M.viewport(J.copy(q)),$.length>0&&ur($,O,Z),Te.length>0&&ur(Te,O,Z),Se.length>0&&ur(Se,O,Z),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function Ja(A,O,Z,q){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[q.id]===void 0){const Oe=Re.has("EXT_color_buffer_half_float")||Re.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[q.id]=new Ln(1,1,{generateMipmaps:!0,type:Oe?Hn:Si,minFilter:Er,samples:Math.max(4,L.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ht.workingColorSpace})}const Te=T.state.transmissionRenderTarget[q.id],Se=q.viewport||J;Te.setSize(Se.z*R.transmissionResolutionScale,Se.w*R.transmissionResolutionScale);const Me=R.getRenderTarget(),Fe=R.getActiveCubeFace(),He=R.getActiveMipmapLevel();R.setRenderTarget(Te),R.getClearColor(Qe),re=R.getClearAlpha(),re<1&&R.setClearColor(16777215,.5),R.clear(),bt&&Je.render(Z);const nt=R.toneMapping;R.toneMapping=is;const rt=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),T.setupLightsView(q),Ae===!0&&$e.setGlobalState(R.clippingPlanes,q),ur(A,Z,q),te.updateMultisampleRenderTarget(Te),te.updateRenderTargetMipmap(Te),Re.has("WEBGL_multisampled_render_to_texture")===!1){let Oe=!1;for(let vt=0,Vt=O.length;vt<Vt;vt++){const Lt=O[vt],{object:Et,geometry:sn,material:Ce,group:hn}=Lt;if(Ce.side===Cn&&Et.layers.test(q.layers)){const ct=Ce.side;Ce.side=Qn,Ce.needsUpdate=!0,rs(Et,Z,q,sn,Ce,hn),Ce.side=ct,Ce.needsUpdate=!0,Oe=!0}}Oe===!0&&(te.updateMultisampleRenderTarget(Te),te.updateRenderTargetMipmap(Te))}R.setRenderTarget(Me,Fe,He),R.setClearColor(Qe,re),rt!==void 0&&(q.viewport=rt),R.toneMapping=nt}function ur(A,O,Z){const q=O.isScene===!0?O.overrideMaterial:null;for(let $=0,Te=A.length;$<Te;$++){const Se=A[$],{object:Me,geometry:Fe,group:He}=Se;let nt=Se.material;nt.allowOverride===!0&&q!==null&&(nt=q),Me.layers.test(Z.layers)&&rs(Me,O,Z,Fe,nt,He)}}function rs(A,O,Z,q,$,Te){B!==null&&$.isNodeMaterial&&B.setObject(A,$),A.onBeforeRender(R,O,Z,q,$,Te),A.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),$.onBeforeRender(R,O,Z,q,A,Te),$.transparent===!0&&$.side===Cn&&$.forceSinglePass===!1?($.side=Qn,$.needsUpdate=!0,R.renderBufferDirect(Z,O,q,$,A,Te),$.side=Ir,$.needsUpdate=!0,R.renderBufferDirect(Z,O,q,$,A,Te),$.side=Cn):R.renderBufferDirect(Z,O,q,$,A,Te),A.onAfterRender(R,O,Z,q,$,Te)}function dr(A,O,Z){O.isScene!==!0&&(O=Ut);const q=K.get(A),$=T.state.lights,Te=T.state.shadowsArray,Se=$.state.version,Me=_e.getParameters(A,$.state,Te,O,Z,T.state.lightProbeGridArray),Fe=_e.getProgramCacheKey(Me);let He=q.programs;q.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?O.environment:null,q.fog=O.fog;const nt=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;q.envMap=he.get(A.envMap||q.environment,nt),q.envMapRotation=q.environment!==null&&A.envMap===null?O.environmentRotation:A.envMapRotation,He===void 0&&(A.addEventListener("dispose",pi),He=new Map,q.programs=He);let rt=He.get(Fe);if(rt!==void 0){if(q.currentProgram===rt&&q.lightsStateVersion===Se)return to(A,Me),rt}else Me.uniforms=_e.getUniforms(A),B!==null&&A.isNodeMaterial&&B.build(A,Z,Me),A.onBeforeCompile(Me,R),rt=_e.acquireProgram(Me,Fe),He.set(Fe,rt),q.uniforms=Me.uniforms;const Oe=q.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Oe.clippingPlanes=$e.uniform),to(A,Me),q.needsLights=$u(A),q.lightsStateVersion=Se,q.needsLights&&(Oe.ambientLightColor.value=$.state.ambient,Oe.lightProbe.value=$.state.probe,Oe.sunLights.value=$.state.sun,Oe.sunLightShadows.value=$.state.sunShadow,Oe.directionalLights.value=$.state.directional,Oe.directionalLightShadows.value=$.state.directionalShadow,Oe.spotLights.value=$.state.spot,Oe.spotLightShadows.value=$.state.spotShadow,Oe.rectAreaLights.value=$.state.rectArea,Oe.ltc_1.value=$.state.rectAreaLTC1,Oe.ltc_2.value=$.state.rectAreaLTC2,Oe.pointLights.value=$.state.point,Oe.pointLightShadows.value=$.state.pointShadow,Oe.hemisphereLights.value=$.state.hemi,Oe.sunShadowMatrix.value=$.state.sunShadowMatrix,Oe.sunShadowCascade.value=$.state.sunShadowCascade,Oe.directionalShadowMatrix.value=$.state.directionalShadowMatrix,Oe.spotLightMatrix.value=$.state.spotLightMatrix,Oe.spotLightMap.value=$.state.spotLightMap,Oe.pointShadowMatrix.value=$.state.pointShadowMatrix),q.lightProbeGrid=T.state.lightProbeGridArray.length>0,q.currentProgram=rt,q.uniformsList=null,rt}function eo(A){if(A.uniformsList===null){const O=A.currentProgram.getUniforms();A.uniformsList=Bc.seqWithValue(O.seq,A.uniforms)}return A.uniformsList}function to(A,O){const Z=K.get(A);Z.outputColorSpace=O.outputColorSpace,Z.batching=O.batching,Z.batchingColor=O.batchingColor,Z.instancing=O.instancing,Z.instancingColor=O.instancingColor,Z.instancingMorph=O.instancingMorph,Z.skinning=O.skinning,Z.morphTargets=O.morphTargets,Z.morphNormals=O.morphNormals,Z.morphColors=O.morphColors,Z.morphTargetsCount=O.morphTargetsCount,Z.numClippingPlanes=O.numClippingPlanes,Z.numIntersection=O.numClipIntersection,Z.vertexAlphas=O.vertexAlphas,Z.vertexTangents=O.vertexTangents,Z.toneMapping=O.toneMapping}function Ls(A,O){if(A.length===0)return null;if(A.length===1)return A[0].texture!==null?A[0]:null;y.setFromMatrixPosition(O.matrixWorld);for(let Z=0,q=A.length;Z<q;Z++){const $=A[Z];if($.texture!==null&&$.boundingBox.containsPoint(y))return $}return null}function $r(A,O,Z,q,$){O.isScene!==!0&&(O=Ut),te.resetTextureUnits();const Te=O.fog,Se=q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial?O.environment:null,Me=G===null?R.outputColorSpace:G.isXRRenderTarget===!0?G.texture.colorSpace:ht.workingColorSpace,Fe=q.isMeshStandardMaterial||q.isMeshLambertMaterial&&!q.envMap||q.isMeshPhongMaterial&&!q.envMap,He=he.get(q.envMap||Se,Fe),nt=q.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,rt=!!Z.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Oe=!!Z.morphAttributes.position,vt=!!Z.morphAttributes.normal,Vt=!!Z.morphAttributes.color;let Lt=is;q.toneMapped&&(G===null||G.isXRRenderTarget===!0)&&(Lt=R.toneMapping);const Et=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,sn=Et!==void 0?Et.length:0,Ce=K.get(q),hn=T.state.lights;if(Ae===!0&&(De===!0||A!==X)){const xt=A===X&&q.id===H;$e.setState(q,A,xt)}let ct=!1;q.version===Ce.__version?(Ce.needsLights&&Ce.lightsStateVersion!==hn.state.version||Ce.outputColorSpace!==Me||$.isBatchedMesh&&Ce.batching===!1||!$.isBatchedMesh&&Ce.batching===!0||$.isBatchedMesh&&Ce.batchingColor===!0&&$._colorsTexture===null||$.isBatchedMesh&&Ce.batchingColor===!1&&$._colorsTexture!==null||$.isInstancedMesh&&Ce.instancing===!1||!$.isInstancedMesh&&Ce.instancing===!0||$.isSkinnedMesh&&Ce.skinning===!1||!$.isSkinnedMesh&&Ce.skinning===!0||$.isInstancedMesh&&Ce.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&Ce.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&Ce.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&Ce.instancingMorph===!1&&$.morphTexture!==null||Ce.envMap!==He||q.fog===!0&&Ce.fog!==Te||Ce.numClippingPlanes!==void 0&&(Ce.numClippingPlanes!==$e.numPlanes||Ce.numIntersection!==$e.numIntersection)||Ce.vertexAlphas!==nt||Ce.vertexTangents!==rt||Ce.morphTargets!==Oe||Ce.morphNormals!==vt||Ce.morphColors!==Vt||Ce.toneMapping!==Lt||Ce.morphTargetsCount!==sn||!!Ce.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(ct=!0):(ct=!0,Ce.__version=q.version);let fn=Ce.currentProgram;ct===!0&&(fn=dr(q,O,$),B&&q.isNodeMaterial&&B.onUpdateProgram(q,fn,Ce));let Jn=!1,Ni=!1,ei=!1;const wt=fn.getUniforms(),kt=Ce.uniforms;if(M.useProgram(fn.program)&&(Jn=!0,Ni=!0,ei=!0),q.id!==H&&(H=q.id,Ni=!0),Ce.needsLights){const xt=Ls(T.state.lightProbeGridArray,$);Ce.lightProbeGrid!==xt&&(Ce.lightProbeGrid=xt,Ni=!0)}if(Jn||X!==A){M.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),wt.setValue(U,"projectionMatrix",A.projectionMatrix),wt.setValue(U,"viewMatrix",A.matrixWorldInverse);const Ci=wt.map.cameraPosition;Ci!==void 0&&Ci.setValue(U,ut.setFromMatrixPosition(A.matrixWorld)),L.logarithmicDepthBuffer&&wt.setValue(U,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&wt.setValue(U,"isOrthographic",A.isOrthographicCamera===!0),X!==A&&(X=A,Ni=!0,ei=!0)}if(Ce.needsLights&&(hn.state.sunShadowMap.length>0&&wt.setValue(U,"sunShadowMap",hn.state.sunShadowMap,te),hn.state.directionalShadowMap.length>0&&wt.setValue(U,"directionalShadowMap",hn.state.directionalShadowMap,te),hn.state.spotShadowMap.length>0&&wt.setValue(U,"spotShadowMap",hn.state.spotShadowMap,te),hn.state.pointShadowMap.length>0&&wt.setValue(U,"pointShadowMap",hn.state.pointShadowMap,te)),$.isSkinnedMesh){wt.setOptional(U,$,"bindMatrix"),wt.setOptional(U,$,"bindMatrixInverse");const xt=$.skeleton;xt&&(xt.boneTexture===null&&xt.computeBoneTexture(),wt.setValue(U,"boneTexture",xt.boneTexture,te))}$.isBatchedMesh&&(wt.setOptional(U,$,"batchingTexture"),wt.setValue(U,"batchingTexture",$._matricesTexture,te),wt.setOptional(U,$,"batchingIdTexture"),wt.setValue(U,"batchingIdTexture",$._indirectTexture,te),wt.setOptional(U,$,"batchingColorTexture"),$._colorsTexture!==null&&wt.setValue(U,"batchingColorTexture",$._colorsTexture,te));const Vi=Z.morphAttributes;if((Vi.position!==void 0||Vi.normal!==void 0||Vi.color!==void 0)&&z.update($,Z,fn),(Ni||Ce.receiveShadow!==$.receiveShadow)&&(Ce.receiveShadow=$.receiveShadow,wt.setValue(U,"receiveShadow",$.receiveShadow)),(q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial)&&q.envMap===null&&O.environment!==null&&(kt.envMapIntensity.value=O.environmentIntensity),kt.dfgLUT!==void 0&&(kt.dfgLUT.value=wR()),Ni){if(wt.setValue(U,"toneMappingExposure",R.toneMappingExposure),Ce.needsLights&&Xr(kt,ei),Te&&q.fog===!0&&We.refreshFogUniforms(kt,Te),We.refreshMaterialUniforms(kt,q,F,E,T.state.transmissionRenderTarget[A.id]),Ce.needsLights&&Ce.lightProbeGrid){const xt=Ce.lightProbeGrid;kt.probesSH.value=xt.texture,kt.probesMin.value.copy(xt.boundingBox.min),kt.probesMax.value.copy(xt.boundingBox.max),kt.probesResolution.value.copy(xt.resolution)}Bc.upload(U,eo(Ce),kt,te)}if(q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Bc.upload(U,eo(Ce),kt,te),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&wt.setValue(U,"center",$.center),wt.setValue(U,"modelViewMatrix",$.modelViewMatrix),wt.setValue(U,"normalMatrix",$.normalMatrix),wt.setValue(U,"modelMatrix",$.matrixWorld),q.uniformsGroups!==void 0){const xt=q.uniformsGroups;for(let Ci=0,as=xt.length;Ci<as;Ci++){const wn=xt[Ci];oe.update(wn,fn),oe.bind(wn,fn)}}return fn}function Xr(A,O){A.ambientLightColor.needsUpdate=O,A.lightProbe.needsUpdate=O,A.sunLights.needsUpdate=O,A.sunLightShadows.needsUpdate=O,A.directionalLights.needsUpdate=O,A.directionalLightShadows.needsUpdate=O,A.pointLights.needsUpdate=O,A.pointLightShadows.needsUpdate=O,A.spotLights.needsUpdate=O,A.spotLightShadows.needsUpdate=O,A.rectAreaLights.needsUpdate=O,A.hemisphereLights.needsUpdate=O}function $u(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return Q},this.getActiveMipmapLevel=function(){return W},this.getRenderTarget=function(){return G},this.setRenderTargetTextures=function(A,O,Z){const q=K.get(A);q.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),K.get(A.texture).__webglTexture=O,K.get(A.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:Z,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,O){const Z=K.get(A);Z.__webglFramebuffer=O,Z.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(A,O=0,Z=0){G=A,Q=O,W=Z;let q=null,$=!1,Te=!1;if(A){const Me=K.get(A);if(Me.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(U.FRAMEBUFFER,Me.__webglFramebuffer),J.copy(A.viewport),ve.copy(A.scissor),Ie=A.scissorTest,M.viewport(J),M.scissor(ve),M.setScissorTest(Ie),H=-1;return}else if(Me.__webglFramebuffer===void 0)te.setupRenderTarget(A);else if(Me.__hasExternalTextures)te.rebindTextures(A,K.get(A.texture).__webglTexture,K.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const nt=A.depthTexture;if(Me.__boundDepthTexture!==nt){if(nt!==null&&K.has(nt)&&(A.width!==nt.image.width||A.height!==nt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");te.setupDepthRenderbuffer(A)}}const Fe=A.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(Te=!0);const He=K.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(He[O])?q=He[O][Z]:q=He[O],$=!0):A.samples>0&&te.useMultisampledRTT(A)===!1?q=K.get(A).__webglMultisampledFramebuffer:Array.isArray(He)?q=He[Z]:q=He,J.copy(A.viewport),ve.copy(A.scissor),Ie=A.scissorTest}else J.copy(ce).multiplyScalar(F).floor(),ve.copy(qe).multiplyScalar(F).floor(),Ie=Ge;if(Z!==0&&(q=D),M.bindFramebuffer(U.FRAMEBUFFER,q)&&M.drawBuffers(A,q),M.viewport(J),M.scissor(ve),M.setScissorTest(Ie),$){const Me=K.get(A.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+O,Me.__webglTexture,Z)}else if(Te){const Me=O;for(let Fe=0;Fe<A.textures.length;Fe++){const He=K.get(A.textures[Fe]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Fe,He.__webglTexture,Z,Me)}}else if(A!==null&&Z!==0){const Me=K.get(A.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Me.__webglTexture,Z)}H=-1};function Ml(A){const O=K.get(A);return(O.__readFormat!==A.format||O.__readType!==A.type)&&(O.__readFormat=A.format,O.__readType=A.type,O.__formatReadable=L.textureFormatReadable(A.format),O.__typeReadable=L.textureTypeReadable(A.type)),O}this.readRenderTargetPixels=function(A,O,Z,q,$,Te,Se,Me=0){if(!(A&&A.isWebGLRenderTarget)){mt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Fe=K.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Se!==void 0&&(Fe=Fe[Se]),Fe){M.bindFramebuffer(U.FRAMEBUFFER,Fe);try{const He=A.textures[Me],nt=He.format,rt=He.type;A.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Me);const Oe=Ml(He);if(Oe.__formatReadable===!1){mt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Oe.__typeReadable===!1){mt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=A.width-q&&Z>=0&&Z<=A.height-$&&U.readPixels(O,Z,q,$,we.convert(nt),we.convert(rt),Te)}finally{const He=G!==null?K.get(G).__webglFramebuffer:null;M.bindFramebuffer(U.FRAMEBUFFER,He)}}},this.readRenderTargetPixelsAsync=async function(A,O,Z,q,$,Te,Se,Me=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Fe=K.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Se!==void 0&&(Fe=Fe[Se]),Fe)if(O>=0&&O<=A.width-q&&Z>=0&&Z<=A.height-$){M.bindFramebuffer(U.FRAMEBUFFER,Fe);const He=A.textures[Me],nt=He.format,rt=He.type;A.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Me);const Oe=Ml(He);if(Oe.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Oe.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const vt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,vt),U.bufferData(U.PIXEL_PACK_BUFFER,Te.byteLength,U.STREAM_READ),U.readPixels(O,Z,q,$,we.convert(nt),we.convert(rt),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);const Vt=G!==null?K.get(G).__webglFramebuffer:null;M.bindFramebuffer(U.FRAMEBUFFER,Vt);const Lt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await wE(U,Lt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,vt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,Te),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(vt),U.deleteSync(Lt),Te}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,O=null,Z=0){const q=Math.pow(2,-Z),$=Math.floor(A.image.width*q),Te=Math.floor(A.image.height*q),Se=O!==null?O.x:0,Me=O!==null?O.y:0;te.setTexture2D(A,0),U.copyTexSubImage2D(U.TEXTURE_2D,Z,0,0,Se,Me,$,Te),M.unbindTexture()},this.copyTextureToTexture=function(A,O,Z=null,q=null,$=0,Te=0){let Se,Me,Fe,He,nt,rt,Oe,vt,Vt;const Lt=A.isCompressedTexture?A.mipmaps[Te]:A.image;if(Z!==null)Se=Z.max.x-Z.min.x,Me=Z.max.y-Z.min.y,Fe=Z.isBox3?Z.max.z-Z.min.z:1,He=Z.min.x,nt=Z.min.y,rt=Z.isBox3?Z.min.z:0;else{const kt=Math.pow(2,-$);Se=Math.floor(Lt.width*kt),Me=Math.floor(Lt.height*kt),A.isDataArrayTexture?Fe=Lt.depth:A.isData3DTexture?Fe=Math.floor(Lt.depth*kt):Fe=1,He=0,nt=0,rt=0}q!==null?(Oe=q.x,vt=q.y,Vt=q.z):(Oe=0,vt=0,Vt=0);const Et=we.convert(O.format),sn=we.convert(O.type);let Ce;O.isData3DTexture?(te.setTexture3D(O,0),Ce=U.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(te.setTexture2DArray(O,0),Ce=U.TEXTURE_2D_ARRAY):(te.setTexture2D(O,0),Ce=U.TEXTURE_2D),M.activeTexture(U.TEXTURE0),M.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,O.flipY),M.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),M.pixelStorei(U.UNPACK_ALIGNMENT,O.unpackAlignment);const hn=M.getParameter(U.UNPACK_ROW_LENGTH),ct=M.getParameter(U.UNPACK_IMAGE_HEIGHT),fn=M.getParameter(U.UNPACK_SKIP_PIXELS),Jn=M.getParameter(U.UNPACK_SKIP_ROWS),Ni=M.getParameter(U.UNPACK_SKIP_IMAGES);M.pixelStorei(U.UNPACK_ROW_LENGTH,Lt.width),M.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Lt.height),M.pixelStorei(U.UNPACK_SKIP_PIXELS,He),M.pixelStorei(U.UNPACK_SKIP_ROWS,nt),M.pixelStorei(U.UNPACK_SKIP_IMAGES,rt);const ei=A.isDataArrayTexture||A.isData3DTexture,wt=O.isDataArrayTexture||O.isData3DTexture;if(A.isDepthTexture){const kt=K.get(A),Vi=K.get(O),xt=K.get(kt.__renderTarget),Ci=K.get(Vi.__renderTarget);M.bindFramebuffer(U.READ_FRAMEBUFFER,xt.__webglFramebuffer),M.bindFramebuffer(U.DRAW_FRAMEBUFFER,Ci.__webglFramebuffer);for(let as=0;as<Fe;as++)ei&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,K.get(A).__webglTexture,$,rt+as),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,K.get(O).__webglTexture,Te,Vt+as)),U.blitFramebuffer(He,nt,Se,Me,Oe,vt,Se,Me,U.DEPTH_BUFFER_BIT,U.NEAREST);M.bindFramebuffer(U.READ_FRAMEBUFFER,null),M.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if($!==0||A.isRenderTargetTexture||K.has(A)){const kt=K.get(A),Vi=K.get(O);M.bindFramebuffer(U.READ_FRAMEBUFFER,P),M.bindFramebuffer(U.DRAW_FRAMEBUFFER,j);for(let xt=0;xt<Fe;xt++)ei?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,kt.__webglTexture,$,rt+xt):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,kt.__webglTexture,$),wt?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Vi.__webglTexture,Te,Vt+xt):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Vi.__webglTexture,Te),$!==0?U.blitFramebuffer(He,nt,Se,Me,Oe,vt,Se,Me,U.COLOR_BUFFER_BIT,U.NEAREST):wt?U.copyTexSubImage3D(Ce,Te,Oe,vt,Vt+xt,He,nt,Se,Me):U.copyTexSubImage2D(Ce,Te,Oe,vt,He,nt,Se,Me);M.bindFramebuffer(U.READ_FRAMEBUFFER,null),M.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else wt?A.isDataTexture||A.isData3DTexture?U.texSubImage3D(Ce,Te,Oe,vt,Vt,Se,Me,Fe,Et,sn,Lt.data):O.isCompressedArrayTexture?U.compressedTexSubImage3D(Ce,Te,Oe,vt,Vt,Se,Me,Fe,Et,Lt.data):U.texSubImage3D(Ce,Te,Oe,vt,Vt,Se,Me,Fe,Et,sn,Lt):A.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,Te,Oe,vt,Se,Me,Et,sn,Lt.data):A.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,Te,Oe,vt,Lt.width,Lt.height,Et,Lt.data):U.texSubImage2D(U.TEXTURE_2D,Te,Oe,vt,Se,Me,Et,sn,Lt);M.pixelStorei(U.UNPACK_ROW_LENGTH,hn),M.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ct),M.pixelStorei(U.UNPACK_SKIP_PIXELS,fn),M.pixelStorei(U.UNPACK_SKIP_ROWS,Jn),M.pixelStorei(U.UNPACK_SKIP_IMAGES,Ni),Te===0&&O.generateMipmaps&&U.generateMipmap(Ce),M.unbindTexture()},this.initRenderTarget=function(A){K.get(A).__webglFramebuffer===void 0&&te.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?te.setTextureCube(A,0):A.isData3DTexture?te.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?te.setTexture2DArray(A,0):te.setTexture2D(A,0),M.unbindTexture()},this.resetState=function(){Q=0,W=0,G=null,M.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ji}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=ht._getDrawingBufferColorSpace(e),n.unpackColorSpace=ht._getUnpackColorSpace()}}const nx={type:"change"},gm={type:"start"},_y={type:"end"},_c=new gl,ix=new vs,ER=Math.cos(70*zf.DEG2RAD),an=new I,Wn=2*Math.PI,Rt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},sh=1e-6;class TR extends T1{constructor(e,n=null){super(e,n),this.state=Rt.NONE,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ka.ROTATE,MIDDLE:ka.DOLLY,RIGHT:ka.PAN},this.touches={ONE:Ta.ROTATE,TWO:Ta.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new rr,this._lastTargetPosition=new I,this._quat=new rr().setFromUnitVectors(e.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Pv,this._sphericalDelta=new Pv,this._scale=1,this._panOffset=new I,this._rotateStart=new Ue,this._rotateEnd=new Ue,this._rotateDelta=new Ue,this._panStart=new Ue,this._panEnd=new Ue,this._panDelta=new Ue,this._dollyStart=new Ue,this._dollyEnd=new Ue,this._dollyDelta=new Ue,this._dollyDirection=new I,this._mouse=new Ue,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=NR.bind(this),this._onPointerDown=AR.bind(this),this._onPointerUp=CR.bind(this),this._onContextMenu=UR.bind(this),this._onMouseWheel=LR.bind(this),this._onKeyDown=DR.bind(this),this._onTouchStart=kR.bind(this),this._onTouchMove=IR.bind(this),this._onMouseDown=RR.bind(this),this._onMouseMove=PR.bind(this),this._interceptControlDown=FR.bind(this),this._interceptControlUp=OR.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=Rt.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();const e=this.domElement.getRootNode();e.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),e.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(nx),this.update(),this.state=Rt.NONE}pan(e,n){this._pan(e,n),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const n=this.object.position;an.copy(n).sub(this.target),an.applyQuaternion(this._quat),this._spherical.setFromVector3(an),this.autoRotate&&this.state===Rt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Wn:i>Math.PI&&(i-=Wn),s<-Math.PI?s+=Wn:s>Math.PI&&(s-=Wn),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(an.setFromSpherical(this._spherical),an.applyQuaternion(this._quatInverse),n.copy(this.target).add(an),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const l=an.length();o=this._clampDistance(l*this._scale);const c=l-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const l=new I(this._mouse.x,this._mouse.y,0);l.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const u=new I(this._mouse.x,this._mouse.y,0);u.unproject(this.object),this.object.position.sub(u).add(l),this.object.updateMatrixWorld(),o=an.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(_c.origin.copy(this.object.position),_c.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(_c.direction))<ER?this.object.lookAt(this.target):(ix.setFromNormalAndCoplanarPoint(this.object.up,this.target),_c.intersectPlane(ix,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>sh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>sh||this._lastTargetPosition.distanceToSquared(this.target)>sh?(this.dispatchEvent(nx),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Wn/60*this.autoRotateSpeed*e:Wn/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){an.setFromMatrixColumn(n,0),an.multiplyScalar(-e),this._panOffset.add(an)}_panUp(e,n){this.screenSpacePanning===!0?an.setFromMatrixColumn(n,1):(an.setFromMatrixColumn(n,0),an.crossVectors(this.object.up,an)),an.multiplyScalar(e),this._panOffset.add(an)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;an.copy(s).sub(this.target);let r=an.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*n*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=n-i.top,o=i.width,l=i.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/l)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(Wn*this._rotateDelta.x/n.clientHeight),this._rotateUp(Wn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,s=e.pageY-n.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(Wn*this._rotateDelta.x/n.clientHeight),this._rotateUp(Wn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,s=e.pageY-n.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+n.x)*.5,l=(e.pageY+n.y)*.5;this._updateZoomParameters(o,l)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new Ue,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function AR(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function NR(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function CR(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(_y),this.state=Rt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function RR(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ka.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=Rt.DOLLY;break;case ka.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=Rt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=Rt.ROTATE}break;case ka.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=Rt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=Rt.PAN}break;default:this.state=Rt.NONE}this.state!==Rt.NONE&&this.dispatchEvent(gm)}function PR(t){switch(this.state){case Rt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case Rt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case Rt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function LR(t){this.enabled===!1||this.enableZoom===!1||this.state!==Rt.NONE||(t.preventDefault(),this.dispatchEvent(gm),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(_y))}function DR(t){this.enabled!==!1&&this._handleKeyDown(t)}function kR(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case Ta.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=Rt.TOUCH_ROTATE;break;case Ta.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=Rt.TOUCH_PAN;break;default:this.state=Rt.NONE}break;case 2:switch(this.touches.TWO){case Ta.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=Rt.TOUCH_DOLLY_PAN;break;case Ta.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=Rt.TOUCH_DOLLY_ROTATE;break;default:this.state=Rt.NONE}break;default:this.state=Rt.NONE}this.state!==Rt.NONE&&this.dispatchEvent(gm)}function IR(t){switch(this._trackPointer(t),this.state){case Rt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case Rt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case Rt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case Rt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=Rt.NONE}}function UR(t){this.enabled!==!1&&t.preventDefault()}function FR(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function OR(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const zc={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Za{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const jR=new mm(-1,1,1,-1,0,1);class BR extends Dt{constructor(){super(),this.setAttribute("position",new ft([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ft([0,2,0,0,2,0],2))}}const zR=new BR;class vm{constructor(e){this._mesh=new qt(zR,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,jR)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Yf extends Za{constructor(e,n="tDiffuse"){super(),this.textureID=n,this.uniforms=null,this.material=null,e instanceof Zt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ul.clone(e.uniforms),this.material=new Zt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new vm(this.material)}render(e,n,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class sx extends Za{constructor(e,n){super(),this.scene=e,this.camera=n,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,n,i){const s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,l;this.inverse?(o=0,l=1):(o=1,l=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(l),r.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class HR extends Za{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class VR{constructor(e,n){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),n===void 0){const i=e.getSize(new Ue);this._width=i.width,this._height=i.height,n=new Ln(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Hn}),n.texture.name="EffectComposer.rt1"}else this._width=n.width,this._height=n.height;this.renderTarget1=n,this.renderTarget2=n.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Yf(zc),this.copyPass.material.blending=ns,this.timer=new w1}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,n){this.passes.splice(n,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const n=this.passes.indexOf(e);n!==-1&&this.passes.splice(n,1)}isLastEnabledPass(e){for(let n=e+1;n<this.passes.length;n++)if(this.passes[n].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const n=this.renderer.getRenderTarget();let i=!1;for(let s=0,r=this.passes.length;s<r;s++){const o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),o.needsSwap){if(i){const l=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(l.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(l.EQUAL,1,4294967295)}this.swapBuffers()}sx!==void 0&&(o instanceof sx?i=!0:o instanceof HR&&(i=!1))}}this.renderer.setRenderTarget(n)}reset(e){if(e===void 0){const n=this.renderer.getSize(new Ue);this._pixelRatio=this.renderer.getPixelRatio(),this._width=n.width,this._height=n.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,n){this._width=e,this._height=n;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class GR extends Za{constructor(e,n,i=null,s=null,r=null){super(),this.scene=e,this.camera=n,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new it}render(e,n,i){const s=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=s}}const WR={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new it(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class $a extends Za{constructor(e,n=1,i,s){super(),this.strength=n,this.radius=i,this.threshold=s,this.resolution=e!==void 0?new Ue(e.x,e.y):new Ue(256,256),this.clearColor=new it(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Ln(r,o,{type:Hn,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const p=new Ln(r,o,{type:Hn,depthBuffer:!1});p.texture.name="UnrealBloomPass.h"+d,p.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(p);const h=new Ln(r,o,{type:Hn,depthBuffer:!1});h.texture.name="UnrealBloomPass.v"+d,h.texture.generateMipmaps=!1,this.renderTargetsVertical.push(h),r=Math.round(r/2),o=Math.round(o/2)}const l=WR;this.highPassUniforms=ul.clone(l.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Zt({uniforms:this.highPassUniforms,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new Ue(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=n,this.compositeMaterial.uniforms.bloomRadius.value=.1;const u=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=u,this.bloomTintColors=[new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ul.clone(zc.uniforms),this.blendMaterial=new Zt({uniforms:this.copyUniforms,vertexShader:zc.vertexShader,fragmentShader:zc.fragmentShader,premultipliedAlpha:!0,blending:en,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new it,this._oldClearAlpha=1,this._basic=new xs,this._fsQuad=new vm(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,n){let i=Math.round(e/2),s=Math.round(n/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Ue(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(e,n,i,s,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let l=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=l.texture,this.separableBlurMaterials[c].uniforms.direction.value=$a.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=$a.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),l=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){const n=[],i=e/3;for(let o=0;o<e;o++)n.push(.39894*Math.exp(-.5*o*o/(i*i))/i);const s=[],r=[];for(let o=1;o<e;o+=2){const l=n[o],c=o+1<e?n[o+1]:0,u=l+c;s.push((o*l+(o+1)*c)/u),r.push(u)}return new Zt({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new Ue(.5,.5)},direction:{value:new Ue(.5,.5)},centerWeight:{value:n[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new Zt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}$a.BlurDirectionX=new Ue(1,0);$a.BlurDirectionY=new Ue(0,1);const yc={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class $R extends Za{constructor(){super(),this.isOutputPass=!0,this.uniforms=ul.clone(yc.uniforms),this.material=new cy({name:yc.name,uniforms:this.uniforms,vertexShader:yc.vertexShader,fragmentShader:yc.fragmentShader}),this._fsQuad=new vm(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,n,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},ht.getTransfer(this._outputColorSpace)===Tt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===$p?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Xp?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Yp?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Hu?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Kp?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Zp?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===qp&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const XR={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new Ue(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;

			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {

				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );

		}`},ms=[{key:"corvid",name:"Corvid",role:"growth + SEO",color:16723349,css:"#ff2d95"},{key:"herald",name:"Herald",role:"sales",color:4646655,css:"#46e6ff"},{key:"steward",name:"Steward",role:"projects",color:3530895,css:"#35e08f"},{key:"bard",name:"Bard",role:"studio",color:11623423,css:"#b15bff"},{key:"regent",name:"Regent",role:"the CEO",color:15911244,css:"#f2c94c"},{key:"intel",name:"Korvus Intel",role:"the crawler",color:16742959,css:"#ff7a2f",outpost:!0}],rh=ms.filter(t=>!t.outpost),ii=Object.fromEntries(ms.map(t=>[t.key,t])),rx=34,si=3,ax=54,ox=`
uniform vec3 uCam; uniform float uBeam;
varying vec2 vLocal; varying float vBeam;
void main(){
  vLocal = position.xy;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vec3 tang = normalize(mat3(modelMatrix) * vec3(-position.y, position.x, 0.0));
  float b = 1.0 + uBeam * dot(tang, normalize(uCam - wp.xyz));
  vBeam = pow(max(b, 0.12), 2.4);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,lx=`
uniform float uTime; uniform float uInner; uniform float uOuter; uniform float uGain; uniform sampler2D uTex;
varying vec2 vLocal; varying float vBeam;
vec2 layer(float lt, float ang, float t){
  float spin = lt * (0.16 + 0.8 * (1.0 - t));
  return texture2D(uTex, vec2((ang - spin) * 0.15915494, t)).rg;
}
void main(){
  float r = length(vLocal);
  float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
  float ang = atan(vLocal.y, vLocal.x);
  float P = 40.0;
  float t1 = mod(uTime, P), t2 = mod(uTime + P * 0.5, P);
  float w = abs(t1 / P * 2.0 - 1.0);
  vec2 n2 = layer(t1, ang, t) * (1.0 - w) + layer(t2, ang, t) * w;
  float n = n2.x;
  float bands = 0.72 + 0.28 * sin(r * 8.5 + n * 7.0);
  float dens = pow(n, 1.4) * 1.9 * bands;
  float fall = pow(1.0 - t, 1.6) * smoothstep(0.0, 0.07, t);
  vec3 c0 = vec3(1.0, 0.93, 0.97), c1 = vec3(1.0, 0.2, 0.6), c2 = vec3(0.5, 0.12, 0.85), c3 = vec3(0.14, 0.04, 0.3);
  vec3 col = mix(c0, c1, smoothstep(0.0, 0.24, t));
  col = mix(col, c2, smoothstep(0.24, 0.62, t));
  col = mix(col, c3, smoothstep(0.62, 1.0, t));
  col += vec3(1.0, 0.76, 0.38) * smoothstep(0.66, 0.86, n2.y) * 0.85 * (1.0 - t);
  gl_FragColor = vec4(col * dens * fall * vBeam * uGain, 1.0);
}`,cx=`
attribute float size; attribute float phase;
uniform float uTime; uniform float uScale; uniform float uPR; uniform float uAtten;
varying vec3 vColor; varying float vTw;
void main(){
  vColor = color;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vTw = 0.8 + 0.2 * sin(uTime * (0.7 + phase * 1.7) + phase * 31.0);
  float s = uAtten > 0.5 ? size * uScale / max(1.0, -mv.z) : size;
  gl_PointSize = clamp(s, 1.0, 22.0) * uPR;
  gl_Position = projectionMatrix * mv;
}`,ux=`
uniform float uGain; varying vec3 vColor; varying float vTw;
void main(){
  vec2 c = gl_PointCoord - 0.5; float d2 = dot(c, c);
  float a = exp(-d2 * 80.0) + 0.16 * exp(-d2 * 14.0);
  if (a < 0.012) discard;
  gl_FragColor = vec4(vColor * a * uGain * vTw, 1.0);
}`,YR="varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",qR=`
uniform float uTime; varying vec3 vW;
void main(){
  float TAU = 6.2831853;
  float r = length(vW.xz);
  float rs = r / 12.0;
  float rd = abs(fract(rs - 0.5) - 0.5);
  float rl = 1.0 - smoothstep(0.0, fwidth(rs) * 1.4, rd);
  float a = atan(vW.z, vW.x);
  float sp = a / (TAU / 36.0);
  float sd = abs(fract(sp - 0.5) - 0.5);
  float sl = (1.0 - smoothstep(0.0, fwidth(sp) * 1.4, sd)) * smoothstep(10.0, 26.0, r);
  float ph = fract(a / TAU - uTime * 0.045);
  float sweep = pow(1.0 - ph, 7.0);
  float fade = smoothstep(170.0, 40.0, r) * smoothstep(5.0, 14.0, r);
  float lines = (rl * 0.55 + sl * 0.22) * fade;
  vec3 col = vec3(1.0, 0.18, 0.58) * lines * (0.3 + 0.5 * sweep) + vec3(1.0, 0.76, 0.4) * fade * sweep * (lines * 1.6 + 0.05);
  gl_FragColor = vec4(col * 0.5, 1.0);
}`,KR={uniforms:{tDiffuse:{value:null},uTime:{value:0},uRes:{value:new Ue(1,1)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`
uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uRes; varying vec2 vUv;
float rnd(vec2 c){ return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 d = vUv - 0.5; float r2 = dot(d, d);
  float ca = 0.012 * r2;
  vec3 col;
  col.r = texture2D(tDiffuse, vUv + d * ca).r;
  col.g = texture2D(tDiffuse, vUv).g;
  col.b = texture2D(tDiffuse, vUv - d * ca).b;
  col += vec3(0.012, 0.008, 0.03) * (1.0 - r2 * 2.2);
  col *= 1.0 - r2 * 0.95;
  col += (rnd(vUv * uRes + fract(uTime)) - 0.5) * 0.03;
  col *= 0.975 + 0.025 * sin(vUv.y * uRes.y * 1.3);
  gl_FragColor = vec4(col, 1.0);
}`};function ri(t){let e=2166136261;for(let n=0;n<t.length;n++)e^=t.charCodeAt(n),e=Math.imul(e,16777619);return(e>>>0)/4294967295}function Sc(t){const e=Math.max(0,(Date.now()-t)/1e3);return e<3600?`${Math.round(e/60)}m ago`:e<86400?`${Math.round(e/3600)}h ago`:`${Math.round(e/86400)}d ago`}function ZR(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function QR(t){const e=[];let n=!1;for(const i of t.replace(/^---[\s\S]*?\n---\n/,"").split(`
`)){let s=ZR(i);s=s.replace(/\*\*([^*]+)\*\*/g,"<b>$1</b>").replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\[\[([^\]|#]+)(?:[#|]([^\]]*))?\]\]/g,(l,c,u)=>`<a class="bx-wl" data-t="${c.trim()}">${u||c}</a>`);const r=/^\s*[-*]\s+(.*)$/.exec(s);if(r){n||(e.push("<ul>"),n=!0),e.push(`<li>${r[1]}</li>`);continue}n&&(e.push("</ul>"),n=!1);const o=/^(#{1,4})\s+(.*)$/.exec(s);o?e.push(`<h${Math.min(4,o[1].length+1)}>${o[2]}</h${Math.min(4,o[1].length+1)}>`):s.trim()&&e.push(`<p>${s}</p>`)}return n&&e.push("</ul>"),e.join("")}function dx(t){const n=document.createElement("canvas");n.width=n.height=256;const i=n.getContext("2d"),s=i.createImageData(256,256),r=(c,u)=>{const d=Math.sin(c*127.1+u*311.7+t*74.7)*43758.5453;return d-Math.floor(d)},o=(c,u)=>{const d=Math.floor(c),p=Math.floor(u);let h=c-d,m=u-p;h=h*h*(3-2*h),m=m*m*(3-2*m);const v=r(d,p),w=r(d+1,p),x=r(d,p+1),f=r(d+1,p+1);return v+(w-v)*h+(x-v)*m+(v-w-x+f)*h*m};for(let c=0;c<256;c++)for(let u=0;u<256;u++){let d=0,p=.5,h=3.2;for(let g=0;g<5;g++)d+=p*o(u/256*h,c/256*h),h*=2.05,p*=.5;const m=u/256-.5,v=c/256-.5,w=Math.max(0,1-Math.sqrt(m*m+v*v)*2),x=Math.min(1,Math.max(0,(d-.32)*1.9))*w*w,f=(c*256+u)*4;s.data[f]=s.data[f+1]=s.data[f+2]=255,s.data[f+3]=Math.round(x*255)}i.putImageData(s,0,0);const l=new iy(n);return l.colorSpace=$n,l}function JR(){const n=new Uint8Array(524288),i=(l,c,u)=>{const d=Math.sin(l*127.1+c*311.7+u*74.7)*43758.5453;return d-Math.floor(d)},s=(l,c,u,d)=>{const p=Math.floor(l),h=Math.floor(c);let m=l-p,v=c-h;m=m*m*(3-2*m),v=v*v*(3-2*v);const w=(p%u+u)%u,x=(w+1)%u,f=i(w,h,d),g=i(x,h,d),S=i(w,h+1,d),y=i(x,h+1,d);return f+(g-f)*m+(S-f)*v+(f-g-S+y)*m*v},r=(l,c,u)=>{let d=0,p=.5,h=14,m=7;for(let v=0;v<5;v++)d+=p*s(l*h,c*m+v*3.1,h,u+v),h*=2,m*=2,p*=.5;return d};for(let l=0;l<128;l++)for(let c=0;c<1024;c++){const u=c/1024,d=l/128,p=(l*1024+c)*4;n[p]=Math.round(Math.min(1,r(u,d,1)*1.25)*255),n[p+1]=Math.round(Math.min(1,r(u,d*1.7,9))*255),n[p+3]=255}const o=new um(n,1024,128,bi);return o.wrapS=fu,o.wrapT=Qi,o.magFilter=o.minFilter=yn,o.generateMipmaps=!1,o.needsUpdate=!0,o}function e2(){const t=(e,n)=>{const s=document.createElement("canvas");s.width=s.height=128;const r=s.getContext("2d");r.translate(64,64),n&&r.scale(-1,1),r.lineJoin="round",r.beginPath(),r.moveTo(-40,6),r.lineTo(-22,2),e?(r.quadraticCurveTo(-14,-30,-30,-50),r.quadraticCurveTo(-2,-36,6,-6),r.quadraticCurveTo(14,-40,34,-46),r.quadraticCurveTo(22,-18,14,-2)):(r.quadraticCurveTo(-18,26,-34,40),r.quadraticCurveTo(-4,30,6,6),r.quadraticCurveTo(16,30,30,36),r.quadraticCurveTo(22,14,14,-2)),r.quadraticCurveTo(24,-8,30,-6),r.lineTo(44,-3),r.lineTo(30,2),r.quadraticCurveTo(10,12,-22,10),r.lineTo(-40,6),r.closePath(),r.fillStyle="#0b0710",r.fill(),r.strokeStyle="#ff2d95",r.lineWidth=3,r.shadowColor="#ff2d95",r.shadowBlur=8,r.stroke(),r.shadowBlur=0,r.fillStyle="#ffc857",r.beginPath(),r.arc(29,-5,2.4,0,Math.PI*2),r.fill();const o=new iy(s);return o.colorSpace=$n,o};return{upR:t(!0,!1),dnR:t(!1,!1),upL:t(!0,!0),dnL:t(!1,!0)}}const yy="bx-quality";function hx(){try{const t=localStorage.getItem(yy);return t==="high"||t==="eco"?t:"auto"}catch{return"auto"}}const fx=[[.62,.74,1],[.85,.9,1],[1,.97,.9],[1,.84,.62],[1,.66,.5]],t2=()=>{var re,fe;const t=Y.useRef(null),e=Y.useRef(null),n=Y.useRef(null),i=Y.useRef(null),s=Y.useRef(-1),[r,o]=Y.useState(null),[l,c]=Y.useState(!1),[u,d]=Y.useState("galaxy"),[p,h]=Y.useState(null),[m,v]=Y.useState(!1),[w,x]=Y.useState(""),[f,g]=Y.useState(-1),[S,y]=Y.useState(!0),[b,T]=Y.useState(hx),N=Y.useRef(()=>{}),_=E=>{T(E);try{localStorage.setItem(yy,E)}catch{}N.current(E)},C=Y.useRef(()=>{}),R=Y.useRef(()=>{}),k=Y.useRef(()=>{});Y.useEffect(()=>{let E=!0;const F=()=>Pw().then(ue=>{E&&(ue?o(ue):c(!0))});F();const ee=setInterval(F,5*60*1e3);return()=>{E=!1,clearInterval(ee)}},[]),Y.useEffect(()=>{if(!r)return;const E=setTimeout(()=>y(!1),2500);return()=>clearTimeout(E)},[r]);const B=Y.useMemo(()=>{const E=new Map;return r==null||r.nodes.forEach((F,ee)=>{E.has(F.t.toLowerCase())||E.set(F.t.toLowerCase(),ee),E.set(F.id.replace(/\.md$/,"").toLowerCase(),ee)}),E},[r]),D=async E=>{v(!0);const F=await Lw(E);v(!1),F&&h(F);const ee=(r==null?void 0:r.nodes.findIndex(ue=>ue.id===E))??-1;ee>=0&&u==="galaxy"&&C.current(ee)},P=Y.useRef(D);P.current=D,Y.useEffect(()=>{if(!r||u!=="galaxy"||!t.current)return;const E=t.current,F=()=>E.clientWidth||800,ee=()=>E.clientHeight||600,ue=window.devicePixelRatio||1,ce=hx(),qe=se=>se==="high"?Math.min(ue,1.5):se==="eco"?.7:Math.min(ue,1);let Ge=qe(ce),Le=Ge;const Ae=new e1,De=new yi(50,F()/ee(),.1,2e3);De.position.set(0,150,300);const Pe=new bR({antialias:!1,powerPreference:"high-performance"});Pe.setPixelRatio(Ge),Pe.setSize(F(),ee()),Pe.setClearColor(131590,1),Pe.toneMapping=Hu,Pe.toneMappingExposure=.95,E.appendChild(Pe.domElement);const ut=new Ln(F()*Ge,ee()*Ge,{type:Hn}),st=new VR(Pe,ut);st.setPixelRatio(Ge),st.setSize(F(),ee()),st.addPass(new GR(Ae,De));const Ut=new $a(new Ue(F(),ee()),.75,.18,.82);st.addPass(Ut),st.addPass(new $R);const bt=new Yf(XR);bt.uniforms.resolution.value.set(1/(F()*Ge),1/(ee()*Ge)),st.addPass(bt),Ut.enabled=ce!=="eco";const gt=new Yf(KR);gt.uniforms.uRes.value.set(F()*Ge,ee()*Ge),st.addPass(gt);const U=new TR(De,Pe.domElement);U.enableDamping=!0,U.dampingFactor=.06,U.minDistance=7,U.maxDistance=260,U.autoRotateSpeed=.16,U.maxPolarAngle=Math.PI*.62;const nn=[],Re=se=>(nn.push(se),se),L=[],M=(se,le)=>{const ke=Re(new Zt({uniforms:{uTime:{value:0},uScale:{value:ee()/2},uPR:{value:Ge},uAtten:{value:se?1:0},uGain:{value:le}},vertexShader:cx,fragmentShader:ux,vertexColors:!0,transparent:!0,depthWrite:!1,blending:en}));return L.push(ke.uniforms.uTime),ke},V=[];{const ke=new Float32Array(14400),me=new Float32Array(4800*3),je=new Float32Array(4800),Ze=new Float32Array(4800),Nt=new At().makeRotationX(.45).multiply(new At().makeRotationZ(.3)),pn=new I;for(let at=0;at<4800;at++){if(at<3e3){const _t=520+Math.random()*420,Qt=Math.random()*Math.PI*2,gi=Math.acos(2*Math.random()-1);pn.set(_t*Math.sin(gi)*Math.cos(Qt),_t*Math.cos(gi),_t*Math.sin(gi)*Math.sin(Qt))}else{const _t=Math.random()*Math.PI*2,Qt=(Math.random()+Math.random()+Math.random()-1.5)*60;pn.set(Math.cos(_t)*600,Qt,Math.sin(_t)*600).applyMatrix4(Nt)}ke.set([pn.x,pn.y,pn.z],at*3);const rn=fx[Math.floor(Math.random()*fx.length)],Gi=at<3e3?.25+Math.pow(Math.random(),3)*1.4:.18+Math.random()*.45;me.set([rn[0]*Gi,rn[1]*Gi,rn[2]*Gi],at*3),je[at]=at<3e3?1.4+Math.pow(Math.random(),4)*4.2:1.1+Math.random()*1.4,Ze[at]=Math.random()}const be=Re(new Dt);be.setAttribute("position",new Ot(ke,3)),be.setAttribute("color",new Ot(me,3)),be.setAttribute("size",new Ot(je,1)),be.setAttribute("phase",new Ot(Ze,1));const et=M(!1,1);V.push(et),Ae.add(new pc(be,et))}const K=Re(new Zt({uniforms:{uTime:{value:0}},vertexShader:YR,fragmentShader:qR,transparent:!0,depthWrite:!1,blending:en}));L.push(K.uniforms.uTime);const te=new qt(Re(new xl(360,360)),K);te.rotation.x=-Math.PI/2,te.position.y=-17,Ae.add(te);const he=new qi;Ae.add(he),he.add(new qt(Re(new pm(si,64,64)),Re(new xs({color:0}))));const xe=Re(JR()),ne=(se,le,ke,me)=>({uTex:{value:xe},uTime:{value:0},uInner:{value:se},uOuter:{value:le},uGain:{value:ke},uBeam:{value:me},uCam:{value:De.position}}),ae=Re(new Zt({uniforms:ne(si*1.85,si*5.2,.95,.72),vertexShader:ox,fragmentShader:lx,transparent:!0,depthWrite:!1,blending:en,side:Cn}));L.push(ae.uniforms.uTime);const _e=new qt(Re(new Vs(si*1.85,si*5.2,256,6)),ae);_e.rotation.x=-Math.PI/2+.16,he.add(_e);const We=Re(new Zt({uniforms:ne(si*1.12,si*1.9,.42,0),vertexShader:ox,fragmentShader:lx,transparent:!0,depthWrite:!1,blending:en,side:Cn}));L.push(We.uniforms.uTime);const Ee=new qt(Re(new Vs(si*1.12,si*1.9,192,4)),We);he.add(Ee);const ye=Re(new xs({transparent:!0,blending:en,depthWrite:!1,side:Cn}));ye.color.setRGB(1.9,1.35,1.6);const $e=new qt(Re(new Vs(si*1.02,si*1.07,160)),ye);he.add($e);const Xe=new qi;Xe.position.y=si+4.2,Ae.add(Xe);const Je=Re(new yr({transparent:!0,opacity:.9,blending:en,depthWrite:!1}));Je.color.setRGB(2.6,.5,1.5);{const ke=[],me=(be,et,at)=>[Math.cos(be)*et,at,Math.sin(be)*et],je=(be,et)=>{for(let at=0;at<48;at++)ke.push(...me(at/48*Math.PI*2,be,et),...me((at+1)/48*Math.PI*2,be,et))};je(3.6,0),je(3.6*1.05,-.55),je(3.6*1,.42);for(let be=0;be<5*2;be++){const et=be/10*Math.PI*2,at=(be+1)/(5*2)*Math.PI*2,rn=be%2?1.15:2.9,Gi=(be+1)%2?1.15:2.9;ke.push(...me(et,3.6*(be%2?1:1.05),rn),...me(at,3.6*((be+1)%2?1:1.05),Gi)),ke.push(...me(et,3.6*(be%2?1:1.05),rn),...me(et,3.6,.42))}const Ze=Re(new Dt);Ze.setAttribute("position",new ft(ke,3)),Xe.add(new dc(Ze,Je));const Nt=Re(new xs({transparent:!0,opacity:.07,blending:en,depthWrite:!1,side:Cn}));Nt.color.setRGB(1,.2,.6);const pn=new qt(Re(new dm(3.6,3.6*1.05,.97,48,1,!0)),Nt);pn.position.y=-.065,Xe.add(pn)}const z=(()=>{const se=Re(new Zt({uniforms:{uTime:{value:0},uScale:{value:ee()/2},uPR:{value:Ge},uAtten:{value:1},uGain:{value:1}},vertexShader:cx,fragmentShader:ux,vertexColors:!0,transparent:!0,depthWrite:!1,blending:en}));return L.push(se.uniforms.uTime),se})();{const se=[],le=[],ke=[],me=[];for(let Ze=0;Ze<5;Ze++){const Nt=Ze/5*Math.PI*2;se.push(Math.cos(Nt)*3.78,2.9,Math.sin(Nt)*3.78),se.push(Math.cos(Nt+Math.PI/5)*3.6,.2,Math.sin(Nt+Math.PI/5)*3.6),le.push(2.2,1.6,.6,1.9,.4,1.2),ke.push(3.2,2.2),me.push(Ze/5,Ze/5+.5)}const je=Re(new Dt);je.setAttribute("position",new ft(se,3)),je.setAttribute("color",new ft(le,3)),je.setAttribute("size",new ft(ke,1)),je.setAttribute("phase",new ft(me,1)),Xe.add(new pc(je,z))}const ge=new qi;{const se=Re(new yr({transparent:!0,opacity:.55,blending:en,depthWrite:!1}));se.color.setRGB(1,.74,.38);const le=-16.9,ke=2,me=[[4,24],[4,9],[12,16],[18,5],[24,16],[32,9],[32,24],[4,24]],je=[],Ze=(_t,Qt)=>[(_t-18)*ke,le,(Qt-16.5)*ke];for(let _t=0;_t<me.length-1;_t++)je.push(...Ze(...me[_t]),...Ze(...me[_t+1]));je.push(...Ze(8,28),...Ze(28,28));const Nt=.93,pn=(_t,Qt)=>[(_t-18)*ke*Nt,le,(Qt-16.5)*ke*Nt];for(let _t=0;_t<me.length-1;_t++)je.push(...pn(...me[_t]),...pn(...me[_t+1]));const be=Re(new Dt);be.setAttribute("position",new ft(je,3)),Ae.add(new dc(be,se));const et=[],at=_t=>{for(let Qt=0;Qt<128;Qt++){const gi=Qt/128*Math.PI*2,Am=(Qt+1)/128*Math.PI*2;et.push(Math.cos(gi)*_t,le,Math.sin(gi)*_t,Math.cos(Am)*_t,le,Math.sin(Am)*_t)}};at(30),at(31.4);for(let _t=0;_t<72;_t++){const Qt=_t/72*Math.PI*2,gi=_t%6?32.4:33.6;et.push(Math.cos(Qt)*31.4,le,Math.sin(Qt)*31.4,Math.cos(Qt)*gi,le,Math.sin(Qt)*gi)}const rn=Re(new Dt);rn.setAttribute("position",new ft(et,3));const Gi=Re(new yr({transparent:!0,opacity:.32,blending:en,depthWrite:!1}));Gi.color.setRGB(1,.3,.7),ge.add(new dc(rn,Gi)),Ae.add(ge)}const ie=e2();Object.values(ie).forEach(se=>Re(se));const we=[{r:11,y:4,w:.18,ph:0},{r:15,y:7.5,w:-.13,ph:2.1},{r:19.5,y:2.5,w:.1,ph:4.2}].map(se=>{const le=Re(new Hf({map:ie.upR,transparent:!0,depthWrite:!1,alphaTest:.04}));le.color.setRGB(1.7,1.7,1.7);const ke=new dv(le);return ke.scale.set(3.6,3.6,1),Ae.add(ke),{...se,sp:ke,m:le,left:!1,up:!0}}),pe={};rh.forEach((se,le)=>{const ke=le/rh.length*Math.PI*2+.4;pe[se.key]=new I(Math.cos(ke)*rx,(ri(se.key)-.5)*6,Math.sin(ke)*rx)});const oe=.4+Math.PI*2*3.5/rh.length,Ve=new I(Math.cos(oe)*ax,8,Math.sin(oe)*ax);pe.intel=Ve;const ze=new it(ii.intel.color),St=new qi;St.position.copy(Ve).add(new I(0,-2.5,0)),Ae.add(St);const pt=new qi;St.add(pt),[.1,.05,.022].forEach((se,le)=>{const ke=Re(new xs({color:ze,transparent:!0,opacity:se,blending:en,depthWrite:!1,side:Cn})),me=new qt(Re(new Vs(2.5,14,24,1,-le*.22,.22)),ke);me.rotation.x=-Math.PI/2,pt.add(me)});{const se=Re(new xs({color:ze,transparent:!0,opacity:.22,blending:en,depthWrite:!1,side:Cn})),le=new qt(Re(new Vs(13.85,14.1,96)),se);le.rotation.x=-Math.PI/2,St.add(le)}const In=Re(new yr({transparent:!0,opacity:.8,blending:en,depthWrite:!1}));In.color.copy(ze).multiplyScalar(2.2),St.add(new Vf(Re(new Dt().setFromPoints([new I(0,0,0),new I(0,13,0)])),In));const pi=[Re(dx(1)),Re(dx(2))],_l=[];ms.forEach(se=>{const le=r.stats.perDesk[se.key]||0,ke=12+Math.min(30,Math.sqrt(le)*.95);for(let me=0;me<2;me++){const je=new dv(Re(new Hf({map:pi[me],color:se.color,transparent:!0,opacity:.045+me*.015,blending:en,depthWrite:!1}))),Ze=ke*(1.25-me*.22);je.scale.set(Ze,Ze*(.75+ri(se.key+me)*.4),1),je.position.copy(pe[se.key]).add(new I((ri(se.key+"x"+me)-.5)*6,(ri(se.key+"y"+me)-.5)*3,(ri(se.key+"z"+me)-.5)*6)),je.material.rotation=ri(se.key+"r"+me)*Math.PI,Ae.add(je),_l.push(je)}});const Wr=r.nodes.length,Ht=new Float32Array(Wr*3),mi=new Float32Array(Wr*3),yl=new Float32Array(Wr),Qa=new Float32Array(Wr),Sl=Date.now()/1e3,Hi={},Rs=new it;r.nodes.forEach((se,le)=>{var at;const ke=pe[se.d]||new I,me=Hi[se.d]=(Hi[se.d]||0)+1,je=se.s?new I((ri(se.s)-.5)*9,(ri(se.s+"y")-.5)*3,(ri(se.s+"z")-.5)*9):new I,Ze=.6+Math.sqrt(me)*.42*(1+ri(se.id)*.35),Nt=me*2.39996+ri(se.id+"a")*.6,pn=(ri(se.id+"b")-.5)*(2+Ze*.25);Ht.set([ke.x+je.x+Math.cos(Nt)*Ze,ke.y+je.y+pn,ke.z+je.z+Math.sin(Nt)*Ze],le*3);const be=(Sl-se.m)/86400,et=be<1?1.35:Math.max(.42,1-be/30);Rs.setHex(((at=ii[se.d])==null?void 0:at.color)??16777215).multiplyScalar(et),mi.set([Rs.r,Rs.g,Rs.b],le*3),yl[le]=.9+Math.min(3.2,se.g*.4)+(be<1?.4:0),Qa[le]=ri(se.id+"p")});const Ps=Re(new Dt);Ps.setAttribute("position",new Ot(Ht,3)),Ps.setAttribute("color",new Ot(mi,3)),Ps.setAttribute("size",new Ot(yl,1)),Ps.setAttribute("phase",new Ot(Qa,1));const Ja=M(!0,1);V.push(Ja);const ur=new pc(Ps,Ja);Ae.add(ur);const rs=r.edges.slice(0,3500);{const se=new Float32Array(rs.length*6),le=new Float32Array(rs.length*6);rs.forEach(([me,je],Ze)=>{se.set([Ht[me*3],Ht[me*3+1],Ht[me*3+2],Ht[je*3],Ht[je*3+1],Ht[je*3+2]],Ze*6),le.set([mi[me*3],mi[me*3+1],mi[me*3+2],mi[je*3],mi[je*3+1],mi[je*3+2]],Ze*6)});const ke=Re(new Dt);ke.setAttribute("position",new Ot(se,3)),ke.setAttribute("color",new Ot(le,3)),Ae.add(new dc(ke,Re(new yr({vertexColors:!0,transparent:!0,opacity:.12,blending:en,depthWrite:!1}))))}const dr=(se,le,ke,me,je)=>{const Ze=1-me;return je.set(Ze*Ze*se.x+2*Ze*me*le.x+me*me*ke.x,Ze*Ze*se.y+2*Ze*me*le.y+me*me*ke.y,Ze*Ze*se.z+2*Ze*me*le.z+me*me*ke.z)},eo=new I,to={};ms.forEach(se=>{const le=pe[se.key].clone().multiplyScalar(.5).add(new I(0,9,0));to[se.key]=le;const ke=[];for(let je=0;je<=40;je++)ke.push(dr(pe[se.key],le,eo,je/40,new I));const me=Re(new Dt().setFromPoints(ke));Ae.add(new Vf(me,Re(new yr({color:se.color,transparent:!0,opacity:.14,blending:en,depthWrite:!1}))))});const Ls=150,$r=new Float32Array(Ls*3),Xr=new Float32Array(Ls*3),$u=new Float32Array(Ls).fill(1.8),Ml=new Float32Array(Ls).map(()=>Math.random()),A=[],O=se=>{var me;const le=se||{a:new I,ctrl:new I,b:new I,t:0,sp:0,color:new it},ke=Math.random();if(ke<.16){const je=Ve.clone().normalize().add(new I(Math.random()-.5,(Math.random()-.3)*.7,Math.random()-.5).multiplyScalar(1.3)).normalize();le.a.copy(Ve).addScaledVector(je,110+Math.random()*90),le.b.copy(Ve).add(new I((Math.random()-.5)*3,(Math.random()-.5)*2,(Math.random()-.5)*3)),le.ctrl.copy(le.a).add(le.b).multiplyScalar(.5).add(new I((Math.random()-.5)*30,(Math.random()-.5)*16,(Math.random()-.5)*30)),le.color.copy(ze).lerp(new it(1,.95,.85),.25),le.sp=.22+Math.random()*.2}else if(rs.length&&ke<.66){const[je,Ze]=rs[Math.floor(Math.random()*rs.length)];le.a.set(Ht[je*3],Ht[je*3+1],Ht[je*3+2]),le.b.set(Ht[Ze*3],Ht[Ze*3+1],Ht[Ze*3+2]),le.ctrl.copy(le.a).add(le.b).multiplyScalar(.5),le.ctrl.y+=le.a.distanceTo(le.b)*.18,le.color.setHex(((me=ii[r.nodes[je].d])==null?void 0:me.color)??16777215),le.sp=.25+Math.random()*.35}else{const je=ms[Math.floor(Math.random()*ms.length)];if(!pe[je.key])return O(le);le.a.copy(pe[je.key]).add(new I((Math.random()-.5)*4,(Math.random()-.5)*2,(Math.random()-.5)*4)),le.ctrl.copy(to[je.key]),le.b.set(0,0,0),le.color.setHex(je.color),le.sp=.12+Math.random()*.12}return le.t=se?0:Math.random(),le};for(let se=0;se<Ls;se++)A.push(O());const Z=Re(new Dt);Z.setAttribute("position",new Ot($r,3)),Z.setAttribute("color",new Ot(Xr,3)),Z.setAttribute("size",new Ot($u,1)),Z.setAttribute("phase",new Ot(Ml,1));const q=M(!0,1);V.push(q),Ae.add(new pc(Z,q));const $=new qi,Te=Re(new xs({transparent:!0,opacity:0,blending:en,depthWrite:!1,side:Cn}));Te.color.setRGB(2.2,2.2,2.4);for(let se=0;se<4;se++)$.add(new qt(Re(new Vs(1.5,1.62,24,1,se*Math.PI/2+.25,Math.PI/2-.5)),Te));Ae.add($);let Se=null,Me=performance.now();const Fe=(se,le,ke=.9,me)=>{const je=(me||De.position.clone().sub(U.target)).clone().normalize();Se={from:De.position.clone(),to:se.clone().add(je.multiplyScalar(le)),tFrom:U.target.clone(),tTo:se.clone(),t:0,sp:ke},U.autoRotate=!1,Me=performance.now()};U.addEventListener("start",()=>{Se=null,U.autoRotate=!1,Me=Number.POSITIVE_INFINITY}),U.addEventListener("end",()=>{Me=performance.now()}),C.current=se=>{const le=new I(Ht[se*3],Ht[se*3+1],Ht[se*3+2]);$.position.copy(le),Te.opacity=1,Fe(le,13)},R.current=se=>{pe[se]&&Fe(pe[se],32)},k.current=()=>Fe(new I,20),Fe(new I,104,.42,new I(0,.42,1));const He=new E1;He.params.Points={threshold:.7};const nt=new Ue,rt=se=>{const le=Pe.domElement.getBoundingClientRect();nt.set((se.clientX-le.left)/le.width*2-1,-((se.clientY-le.top)/le.height)*2+1),He.setFromCamera(nt,De);const ke=He.intersectObject(ur)[0];return ke?ke.index??-1:-1};let Oe={x:0,y:0};const vt=se=>{Oe={x:se.clientX,y:se.clientY}},Vt=se=>{if(Math.hypot(se.clientX-Oe.x,se.clientY-Oe.y)>5)return;const le=rt(se);le>=0&&P.current(r.nodes[le].id)};let Lt=0;const Et=se=>{const le=performance.now();if(le-Lt<50)return;Lt=le;const ke=rt(se);ke!==s.current&&(s.current=ke,g(ke)),Pe.domElement.style.cursor=ke>=0?"pointer":"grab"},sn=()=>{s.current=-1,g(-1)};Pe.domElement.addEventListener("pointerdown",vt),Pe.domElement.addEventListener("pointerup",Vt),Pe.domElement.addEventListener("pointermove",Et),Pe.domElement.addEventListener("pointerleave",sn);const Ce=()=>{De.aspect=F()/ee(),De.updateProjectionMatrix(),Pe.setPixelRatio(Ge),Pe.setSize(F(),ee()),st.setPixelRatio(Ge),st.setSize(F(),ee()),bt.uniforms.resolution.value.set(1/(F()*Ge),1/(ee()*Ge)),gt.uniforms.uRes.value.set(F()*Ge,ee()*Ge);for(const se of[...V,z])se.uniforms.uScale.value=ee()/2,se.uniforms.uPR.value=Ge};window.addEventListener("resize",Ce);let hn=ce,ct=0,fn=0;N.current=se=>{hn=se,Ge=Le=qe(se),Ut.enabled=se!=="eco",ct=fn=0,Ce()};let Jn=!0;const Ni=new IntersectionObserver(se=>{var le;Jn=((le=se[0])==null?void 0:le.isIntersecting)??!0});Ni.observe(E);const ei={};if(e.current){e.current.innerHTML="";const se=(le,ke,me,je,Ze)=>{const Nt=document.createElement("div");Nt.className=le==="__core"?"bx-tag bx-tag-down":le==="intel"?"bx-tag bx-tag-out":"bx-tag",Nt.style.setProperty("--c",je),Nt.innerHTML=`<div class="bx-tag-box"><b>${ke}</b><span>${me}</span></div><div class="bx-tag-line"></div><div class="bx-tag-dot"></div>`,Nt.onclick=Ze,e.current.appendChild(Nt),ei[le]=Nt};ms.forEach(le=>se(le.key,le.name.toUpperCase(),`${le.role} &middot; ${(r.stats.perDesk[le.key]||0).toLocaleString()} nodes`,le.css,()=>R.current(le.key))),se("__core","THE INSTITUTION","the crown's law","#ffc857",()=>{r.stats.core&&P.current(r.stats.core),k.current()})}let wt=0,kt=performance.now();const Vi=kt;let xt=16,Ci=0,as=0;const wn=new I,wm=new I,wl=new I,bm={},Em=(se,le,ke,me)=>{const je=bm[se]||(bm[se]={d:"",tf:"",op:""}),Ze=ei[se].style;je.d!==le&&(Ze.display=je.d=le),le!=="none"&&(je.tf!==ke&&(Ze.transform=je.tf=ke),je.op!==me&&(Ze.opacity=je.op=me))},Tm=()=>{wt=requestAnimationFrame(Tm);const se=performance.now();if(!Jn||document.hidden){kt=se;return}const le=(se-kt)/1e3,ke=Math.min(.05,le);kt=se;const me=(se-Vi)/1e3;for(const be of L)be.value=me;gt.uniforms.uTime.value=me,Ee.lookAt(De.position),$e.lookAt(De.position),$.lookAt(De.position),$.rotateZ(me*.9),Te.opacity>0&&$.scale.setScalar(1+Math.sin(me*3.2)*.08),_l.forEach((be,et)=>{be.material.rotation+=ke*(et%2?.006:-.004)}),Xe.rotation.y=me*.22,Xe.position.y=si+4.2+Math.sin(me*.8)*.3,Je.opacity=.8+.12*Math.sin(me*2.3)+(Math.sin(me*17)>.985?-.35:0),ge.rotation.y=-me*.02,pt.rotation.y=-me*1.1,In.opacity=.35+.55*Math.pow(.5+.5*Math.sin(me*3.4),6);for(const be of we){const et=be.ph+me*be.w;be.sp.position.set(Math.cos(et)*be.r,be.y+Math.sin(me*.7+be.ph)*.8,Math.sin(et)*be.r),wn.copy(be.sp.position).project(De),wm.set(Math.cos(et+.05*Math.sign(be.w))*be.r,be.sp.position.y,Math.sin(et+.05*Math.sign(be.w))*be.r).project(De);const at=wm.x<wn.x,rn=Math.sin(me*7.5+be.ph*3)>0;(at!==be.left||rn!==be.up)&&(be.left=at,be.up=rn,be.m.map=at?rn?ie.upL:ie.dnL:rn?ie.upR:ie.dnR)}for(let be=0;be<Ls;be++){const et=A[be];et.t+=ke*et.sp,et.t>=1&&O(et),dr(et.a,et.ctrl,et.b,et.t,wl),$r[be*3]=wl.x,$r[be*3+1]=wl.y,$r[be*3+2]=wl.z;const at=Math.sin(Math.PI*et.t)*2.2;Xr[be*3]=et.color.r*at,Xr[be*3+1]=et.color.g*at,Xr[be*3+2]=et.color.b*at}if(Z.attributes.position.needsUpdate=!0,Z.attributes.color.needsUpdate=!0,Se){Se.t=Math.min(1,Se.t+ke*Se.sp);const be=1-Math.pow(1-Se.t,3);De.position.lerpVectors(Se.from,Se.to,be),U.target.lerpVectors(Se.tFrom,Se.tTo,be),Se.t>=1&&(Se=null,Me=se)}else se-Me>14e3&&(U.autoRotate=!0);if(U.update(),st.render(ke),xt=xt*.94+Math.min(250,le*1e3)*.06,Ci+=ke,hn==="auto"&&Ci>2.5){const be=Math.min(.25,le);ct=xt>24?ct+be:0,fn=xt<18.5?fn+be:0,ct>1.5?(ct=0,Ge>.65?(Le=Ge-.05,Ge=Math.max(.6,Ge-.1),Ce()):Ut.enabled&&xt>30&&(Ut.enabled=!1)):fn>5&&(fn=0,Ge+.1<=Le&&(Ge+=.1,Ce()))}const je=F(),Ze=ee(),Nt={};for(const be in ei){wn.copy(be==="__core"?eo:pe[be]),wn.project(De);const et=wn.z<1&&Math.abs(wn.x)<1.2&&Math.abs(wn.y)<1.2,at=Math.round((wn.x+1)/2*je),rn=Math.round((1-wn.y)/2*Ze);Nt[be]=[at,rn],be!=="__core"?Em(be,et?"flex":"none",`translate(${at}px,${rn}px) translate(-50%,-100%)`,"1"):ei[be].dataset.vis=et?"1":""}if(ei.__core&&Nt.__core){const[be,et]=Nt.__core;let at=!1;for(const _t in Nt){if(_t==="__core")continue;const[Qt,gi]=Nt[_t];Math.abs(Qt-be)<130&&gi-et>-10&&gi-et<150&&(at=!0)}const[rn,Gi]=Nt.__core;Em("__core",ei.__core.dataset.vis?"flex":"none",`translate(${rn}px,${Gi}px) translate(-50%,0%)`,at?"0.12":"1")}const pn=s.current;if(n.current&&(pn>=0?(wn.set(Ht[pn*3],Ht[pn*3+1],Ht[pn*3+2]).project(De),n.current.style.display=wn.z<1?"block":"none",n.current.style.transform=`translate(${(wn.x+1)/2*je}px,${(1-wn.y)/2*Ze}px)`):n.current.style.display="none"),i.current&&se-as>250){as=se;const be=De.position.distanceTo(U.target),et=((zf.radToDeg(U.getAzimuthalAngle())+360)%360).toFixed(0).padStart(3,"0"),at=zf.radToDeg(Math.PI/2-U.getPolarAngle()).toFixed(0);i.current.innerHTML=`<span>RNG <b>${be.toFixed(1)}</b></span><span>AZ <b>${et}&deg;</b></span><span>EL <b>${at}&deg;</b></span><span>FPS <b>${Math.round(1e3/xt)}</b></span><span>RES <b>${Ge.toFixed(1)}x</b></span><span>${Ut.enabled?"HDR":"PERF"}</span>`}};return Tm(),()=>{cancelAnimationFrame(wt),Ni.disconnect(),N.current=()=>{},window.removeEventListener("resize",Ce),Pe.domElement.removeEventListener("pointerdown",vt),Pe.domElement.removeEventListener("pointerup",Vt),Pe.domElement.removeEventListener("pointermove",Et),Pe.domElement.removeEventListener("pointerleave",sn),U.dispose(),nn.forEach(se=>se.dispose()),Ut.dispose(),st.dispose(),Pe.dispose(),Pe.domElement.parentNode&&Pe.domElement.parentNode.removeChild(Pe.domElement),e.current&&(e.current.innerHTML="")}},[r,u]);const j=Y.useMemo(()=>{const E=w.trim().toLowerCase();return!r||E.length<2?[]:r.nodes.filter(F=>F.t.toLowerCase().includes(E)).slice(0,12)},[w,r]),Q=E=>{const F=E.target.closest(".bx-wl");if(!F||!r)return;const ee=B.get(String(F.dataset.t||"").toLowerCase());ee!==void 0&&D(r.nodes[ee].id)},W=r==null?void 0:r.stats,G=Math.max(1,...(W==null?void 0:W.days)||[1]),H=Math.max(1,...Object.values((W==null?void 0:W.perDesk)||{a:1})),X=Math.max(1,...(W==null?void 0:W.connected.map(E=>E.deg))||[1]),J=r&&f>=0?r.nodes[f]:null,ve=r?new Date(r.builtAt).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1,timeZone:"America/New_York"}):"",Ie=E=>{const F=Math.max(1,...E);return E.map((ee,ue)=>`${ue/(E.length-1)*100},${30-ee/F*26}`).join(" ")},Qe=p?ii[p.id.split("/")[0]]:null;return a.jsxs("div",{className:"bx",children:[a.jsxs("div",{className:"bx-top",children:[a.jsxs("div",{children:[a.jsx("div",{className:"eyebrow",children:"The Brain"}),a.jsx("h1",{className:"bx-h1",children:"The mind of the company"})]}),a.jsxs("div",{className:"bx-top-r",children:[r?a.jsxs("span",{className:"bx-live",children:[a.jsx("i",{})," LIVE ",a.jsxs("em",{children:["synced ",ve," ET"]})]}):null,a.jsxs("div",{className:"bx-pills",children:[a.jsx("button",{className:u==="galaxy"?"on":"",onClick:()=>d("galaxy"),children:"Galaxy"}),a.jsx("button",{className:u==="dashboard"?"on":"",onClick:()=>d("dashboard"),children:"Dashboard"})]})]})]}),r?a.jsxs("div",{className:"bx-body",children:[u==="galaxy"?a.jsxs("div",{className:"bx-stage",children:[a.jsx("div",{ref:t,className:"bx-canvas"}),a.jsx("div",{ref:e,className:"bx-labels"}),a.jsxs("div",{ref:n,className:"bx-lock",children:[a.jsx("i",{}),a.jsx("i",{}),a.jsx("i",{}),a.jsx("i",{}),J?a.jsxs("div",{className:"bx-lock-info",style:{"--c":(re=ii[J.d])==null?void 0:re.css},children:[a.jsxs("em",{children:["NODE LOCK // ",(fe=ii[J.d])==null?void 0:fe.name.toUpperCase()]}),a.jsx("b",{children:J.t}),a.jsxs("span",{children:[J.g," link",J.g===1?"":"s"," · ",Sc(J.m*1e3)]})]}):null]}),a.jsxs("div",{className:"bx-frame",children:[a.jsx("span",{}),a.jsx("span",{}),a.jsx("span",{}),a.jsx("span",{})]}),a.jsxs("div",{className:"bx-hud bx-tl",children:[a.jsxs("div",{className:"bx-hud-t",children:[a.jsxs("svg",{className:"bx-crown",viewBox:"0 0 36 32","aria-hidden":"true",children:[a.jsx("path",{d:"M4 24 L4 9 L12 16 L18 5 L24 16 L32 9 L32 24 Z"}),a.jsx("path",{d:"M8 28 L28 28"})]}),"BLACKCROWN ",a.jsx("span",{children:"// NEURAL MAP"})," ",a.jsx("em",{children:"LIVE"})]}),a.jsxs("div",{className:"bx-hud-row",children:[a.jsxs("span",{children:["NODES ",a.jsx("b",{children:W.notes.toLocaleString()})]}),a.jsxs("span",{children:["LINKS ",a.jsx("b",{children:W.links.toLocaleString()})]}),a.jsxs("span",{children:["TODAY ",a.jsx("b",{children:W.updatedToday})]})]})]}),a.jsxs("div",{className:"bx-legend",children:[ms.map(E=>a.jsxs("button",{onClick:()=>R.current(E.key),style:{"--c":E.css},children:[a.jsx("i",{}),E.name,a.jsx("b",{children:(W.perDesk[E.key]||0).toLocaleString()})]},E.key)),a.jsxs("button",{onClick:()=>k.current(),style:{"--c":"#ffc857"},children:[a.jsx("i",{}),"Institution",a.jsx("b",{children:"core"})]})]}),a.jsx("div",{ref:i,className:"bx-hud bx-tele"}),a.jsx("div",{className:"bx-qual",role:"group","aria-label":"Render quality",children:["auto","high","eco"].map(E=>a.jsx("button",{className:b===E?"on":"",onClick:()=>_(E),title:E==="auto"?"Adapts to your GPU":E==="high"?"Full resolution, full glow":"Lightest load, no glow",children:E},E))}),a.jsx("div",{className:"bx-hint",children:"Drag to orbit · scroll to zoom · click a desk to fly · click a star to read"}),a.jsxs("div",{className:"bx-ticker",children:[a.jsx("span",{className:"bx-ticker-k",children:"ACTIVITY"}),a.jsx("div",{className:"bx-ticker-win",children:a.jsx("div",{className:"bx-ticker-track",children:[0,1].map(E=>W.recent.map(F=>{var ee,ue;return a.jsxs("button",{onClick:()=>D(F.id),children:[a.jsx("i",{style:{background:(ee=ii[F.desk])==null?void 0:ee.css}}),(ue=ii[F.desk])==null?void 0:ue.name.toUpperCase()," ",a.jsx("em",{children:F.title})," ",Sc(F.mtime)]},`${E}-${F.id}`)}))})})]}),S?a.jsx("div",{className:"bx-boot",children:a.jsxs("div",{className:"bx-boot-in",children:[a.jsxs("div",{className:"bx-boot-t",children:[a.jsxs("svg",{className:"bx-crown",viewBox:"0 0 36 32","aria-hidden":"true",children:[a.jsx("path",{d:"M4 24 L4 9 L12 16 L18 5 L24 16 L32 9 L32 24 Z"}),a.jsx("path",{d:"M8 28 L28 28"})]}),"BLACKCROWN"]}),a.jsx("div",{className:"bx-boot-l",style:{animationDelay:"0.1s"},children:"vault link ............ ok"}),a.jsxs("div",{className:"bx-boot-l",style:{animationDelay:"0.35s"},children:["nodes ................. ",W.notes.toLocaleString()]}),a.jsxs("div",{className:"bx-boot-l",style:{animationDelay:"0.6s"},children:["links ................. ",W.links.toLocaleString()]}),a.jsxs("div",{className:"bx-boot-l",style:{animationDelay:"0.85s"},children:["crawler feed .......... ",(W.perDesk.intel||0).toLocaleString()," nodes"]}),a.jsx("div",{className:"bx-boot-l",style:{animationDelay:"1.1s"},children:"crown link ............ sealed"}),a.jsx("div",{className:"bx-boot-l",style:{animationDelay:"1.35s"},children:"watchers .............. aloft"}),a.jsx("div",{className:"bx-boot-m",style:{animationDelay:"1.6s"},children:"Claim your crown."}),a.jsx("div",{className:"bx-boot-bar",children:a.jsx("i",{})})]})}):null]},"galaxy"):a.jsxs("div",{className:"bx-dash",children:[a.jsx("div",{className:"bx-cards",children:[{k:"Notes",v:W.notes,sub:"five desks and the crawler",c:"#ff2d95",spark:null},{k:"Crawler feed",v:W.perDesk.intel||0,sub:"Korvus Intel notes in the vault",c:"#ff7a2f",spark:null},{k:"Touched today",v:W.updatedToday,sub:"14 day activity",c:"#35e08f",spark:W.days},{k:"Links",v:W.links,sub:`wikilinks between notes, ${W.lessons} healer lessons`,c:"#ffc857",spark:null}].map(E=>a.jsxs("div",{className:"bx-card",style:{"--c":E.c},children:[a.jsx("div",{className:"bx-card-k",children:E.k}),a.jsx("div",{className:"bx-card-v",children:E.v.toLocaleString()}),E.spark?a.jsx("svg",{className:"bx-spark",viewBox:"0 0 100 32",preserveAspectRatio:"none",children:a.jsx("polyline",{points:Ie(E.spark)})}):null,a.jsx("div",{className:"bx-card-s",children:E.sub})]},E.k))}),a.jsxs("div",{className:"bx-grid",children:[a.jsxs("div",{className:"bx-panel bx-wide",children:[a.jsx("div",{className:"bx-panel-h",children:"Vault activity // last 14 days"}),a.jsx("div",{className:"bx-bars",children:W.days.map((E,F)=>a.jsxs("div",{className:"bx-bar",title:`${E} notes`,children:[a.jsx("i",{style:{height:`${E/G*100}%`}}),a.jsx("span",{children:F===13?"today":F%3===1?`-${13-F}d`:""})]},F))})]}),a.jsxs("div",{className:"bx-panel",children:[a.jsx("div",{className:"bx-panel-h",children:"Nodes by desk"}),ms.map(E=>a.jsxs("div",{className:"bx-row",style:{"--c":E.css},children:[a.jsx("span",{className:"bx-row-k",children:E.name}),a.jsx("span",{className:"bx-row-bar",children:a.jsx("i",{style:{width:`${(W.perDesk[E.key]||0)/H*100}%`}})}),a.jsx("span",{className:"bx-row-v",children:(W.perDesk[E.key]||0).toLocaleString()})]},E.key))]}),a.jsxs("div",{className:"bx-panel",children:[a.jsx("div",{className:"bx-panel-h",children:"Most connected nodes"}),W.connected.map(E=>{var F;return a.jsxs("button",{className:"bx-row bx-link",onClick:()=>D(E.id),style:{"--c":(F=ii[E.desk])==null?void 0:F.css},children:[a.jsx("span",{className:"bx-row-k",children:E.title}),a.jsx("span",{className:"bx-row-bar",children:a.jsx("i",{style:{width:`${E.deg/X*100}%`}})}),a.jsx("span",{className:"bx-row-v",children:E.deg})]},E.id)})]}),a.jsxs("div",{className:"bx-panel bx-wide",children:[a.jsx("div",{className:"bx-panel-h",children:"Recent activity"}),W.recent.map(E=>{var F,ee;return a.jsxs("button",{className:"bx-act",onClick:()=>D(E.id),children:[a.jsx("i",{style:{background:(F=ii[E.desk])==null?void 0:F.css}}),a.jsx("span",{className:"bx-act-t",children:E.title}),a.jsx("span",{className:"bx-act-d",children:(ee=ii[E.desk])==null?void 0:ee.name}),a.jsx("span",{className:"bx-act-a",children:Sc(E.mtime)})]},E.id)})]})]})]},"dashboard"),a.jsxs("aside",{className:"bx-reader",children:[a.jsxs("div",{className:"bx-search",children:[a.jsx("span",{className:"bx-prompt",children:">"}),a.jsx("input",{value:w,onChange:E=>x(E.target.value),placeholder:"query the vault",spellCheck:!1}),j.length?a.jsx("div",{className:"bx-results",children:j.map(E=>{var F,ee;return a.jsxs("button",{onClick:()=>{x(""),D(E.id)},children:[a.jsx("i",{style:{background:(F=ii[E.d])==null?void 0:F.css}}),E.t,a.jsx("span",{children:(ee=ii[E.d])==null?void 0:ee.name})]},E.id)})}):null]}),p?a.jsxs("div",{className:"bx-note",style:{"--c":(Qe==null?void 0:Qe.css)||"#ff2d95"},children:[a.jsxs("div",{className:"bx-note-bar",children:[a.jsx("span",{children:"NODE INSPECTOR"}),a.jsx("button",{className:"bx-x",onClick:()=>h(null),"aria-label":"Close",children:"×"})]}),a.jsx("span",{className:"bx-tag-chip",children:(Qe==null?void 0:Qe.name)||"Vault"}),a.jsx("h2",{children:p.title}),a.jsxs("div",{className:"bx-note-meta",children:[a.jsx("span",{children:p.id}),a.jsxs("span",{children:["updated ",Sc(p.mtime)]})]}),a.jsx("div",{className:"bx-md",onClick:Q,dangerouslySetInnerHTML:{__html:QR(p.text)}}),p.truncated?a.jsx("div",{className:"bx-note-meta",children:"Long note, showing the first 80 KB."}):null]},p.id):a.jsxs("div",{className:"bx-note-empty",children:[a.jsx("div",{className:"bx-radar",children:a.jsx("i",{})}),a.jsx("b",{children:m?"ACQUIRING...":"AWAITING TARGET"}),a.jsx("span",{children:"Select a star, a desk, or query the vault to read what the agents wrote."})]})]})]}):a.jsx("div",{className:"bx-empty",children:a.jsxs("div",{className:"bx-boot-in",children:[a.jsx("div",{className:"bx-boot-t",children:"NEURAL MAP"}),a.jsx("div",{className:"bx-boot-l",children:l?"vault link ............ FAILED. Check the brain sync.":"vault link ............ reading"}),l?null:a.jsx("div",{className:"bx-boot-bar",children:a.jsx("i",{})})]})})]})},n2=()=>a.jsxs("svg",{width:"52",height:"44",viewBox:"0 0 36 30",fill:"none",stroke:"#FF2D95",strokeWidth:1.8,strokeLinejoin:"round",strokeLinecap:"round",style:{filter:"drop-shadow(0 0 10px rgba(255,45,149,.75))"},children:[a.jsx("path",{d:"M4 24 L4 9 L12 16 L18 5 L24 16 L32 9 L32 24 Z"}),a.jsx("line",{x1:"7",y1:"28",x2:"29",y2:"28"})]}),i2=({me:t,onSuccess:e})=>{const[n,i]=Y.useState(""),[s,r]=Y.useState(""),[o,l]=Y.useState(!1),[c,u]=Y.useState(""),d=!!(t!=null&&t.setup),p=t===null,h=async m=>{if(m.preventDefault(),!o){u(""),l(!0);try{await Cw(n.trim(),s),e()}catch(v){u(v instanceof Error?v.message:"Login failed.")}finally{l(!1)}}};return a.jsxs("div",{className:"login-wrap",children:[a.jsx("div",{className:"login-aura"}),a.jsxs("form",{className:"login-card",onSubmit:h,children:[a.jsx("div",{className:"login-crown",children:a.jsx(n2,{})}),a.jsx("div",{className:"login-title",children:"BlackCrown"}),a.jsx("div",{className:"login-sub",children:"Admin access"}),p?a.jsx("div",{className:"login-note err",children:"Could not reach the service. Make sure blackcrown-render is running on the server."}):d?a.jsxs("div",{className:"login-note",children:["First-time setup: add ",a.jsx("span",{className:"mono",children:"ADMIN_USER"})," and"," ",a.jsx("span",{className:"mono",children:"ADMIN_PASSWORD"})," to the"," ",a.jsx("span",{className:"mono",children:".env"})," file on the server, restart the service, then sign in here."]}):null,a.jsx("label",{className:"login-label",htmlFor:"bc-user",children:"Name"}),a.jsx("input",{id:"bc-user",className:"login-input",autoComplete:"username",value:n,onChange:m=>i(m.target.value),disabled:o}),a.jsx("label",{className:"login-label",htmlFor:"bc-pass",children:"Password"}),a.jsx("input",{id:"bc-pass",className:"login-input",type:"password",autoComplete:"current-password",value:s,onChange:m=>r(m.target.value),disabled:o}),c?a.jsx("div",{className:"login-note err",children:c}):null,a.jsx("button",{className:"btn login-btn",type:"submit",disabled:o||!n||!s,children:o?"Checking...":"Enter the crown"}),a.jsx("div",{className:"login-foot",children:"BlackCrownVxJ LLC · private system"})]})]})},px=({quiet:t})=>a.jsxs("div",{className:t?"metro quiet":"metro","aria-hidden":"true",children:[a.jsx("div",{className:"metro-grid"}),a.jsxs("svg",{className:"metro-avenues",viewBox:"0 0 1600 900",preserveAspectRatio:"xMidYMax slice",children:[a.jsx("path",{id:"ave1",d:"M-50 700 C 400 660, 1200 740, 1650 680",fill:"none"}),a.jsx("path",{id:"ave2",d:"M-50 780 C 500 820, 1100 760, 1650 810",fill:"none"}),a.jsx("path",{id:"ave3",d:"M200 920 C 300 600, 420 380, 520 -20",fill:"none"}),a.jsx("path",{id:"ave4",d:"M1380 920 C 1300 620, 1220 360, 1150 -20",fill:"none"}),a.jsxs("g",{className:"metro-trace",children:[a.jsx("use",{href:"#ave1"}),a.jsx("use",{href:"#ave2"}),a.jsx("use",{href:"#ave3"}),a.jsx("use",{href:"#ave4"})]}),a.jsxs("g",{className:"metro-packets",children:[a.jsx("circle",{r:"3.2",className:"pk pk-cyan",children:a.jsx("animateMotion",{dur:"9s",repeatCount:"indefinite",rotate:"auto",children:a.jsx("mpath",{href:"#ave1"})})}),a.jsx("circle",{r:"2.6",className:"pk pk-pink",children:a.jsx("animateMotion",{dur:"13s",begin:"-5s",repeatCount:"indefinite",children:a.jsx("mpath",{href:"#ave1"})})}),a.jsx("circle",{r:"3",className:"pk pk-pink",children:a.jsx("animateMotion",{dur:"11s",begin:"-2s",repeatCount:"indefinite",children:a.jsx("mpath",{href:"#ave2"})})}),a.jsx("circle",{r:"2.4",className:"pk pk-cyan",children:a.jsx("animateMotion",{dur:"15s",begin:"-9s",repeatCount:"indefinite",children:a.jsx("mpath",{href:"#ave2"})})}),a.jsx("circle",{r:"2.6",className:"pk pk-cyan",children:a.jsx("animateMotion",{dur:"12s",begin:"-4s",repeatCount:"indefinite",children:a.jsx("mpath",{href:"#ave3"})})}),a.jsx("circle",{r:"2.6",className:"pk pk-gold",children:a.jsx("animateMotion",{dur:"17s",begin:"-11s",repeatCount:"indefinite",children:a.jsx("mpath",{href:"#ave4"})})})]})]}),a.jsxs("svg",{className:"metro-skyline",viewBox:"0 0 1600 220",preserveAspectRatio:"xMidYMax slice",children:[a.jsx("path",{d:"M0 220 L0 150 L60 150 L60 110 L95 110 L95 170 L150 170 L150 90 L165 90 L165 70 L205 70 L205 160 L260 160 L260 120 L320 120 L320 180 L380 180 L380 60 L395 60 L395 40 L430 40 L430 150 L500 150 L500 100 L560 100 L560 175 L640 175 L640 130 L700 130 L700 55 L715 55 L715 30 L755 30 L755 140 L820 140 L820 95 L880 95 L880 165 L950 165 L950 115 L1010 115 L1010 180 L1080 180 L1080 75 L1095 75 L1095 50 L1135 50 L1135 150 L1200 150 L1200 105 L1260 105 L1260 170 L1330 170 L1330 85 L1390 85 L1390 155 L1460 155 L1460 120 L1530 120 L1530 185 L1600 185 L1600 220 Z",className:"sky-fill"}),a.jsxs("g",{className:"sky-lights",children:[a.jsx("rect",{x:"166",y:"78",width:"4",height:"4"}),a.jsx("rect",{x:"388",y:"48",width:"4",height:"4"}),a.jsx("rect",{x:"708",y:"38",width:"4",height:"4"}),a.jsx("rect",{x:"1088",y:"58",width:"4",height:"4"}),a.jsx("rect",{x:"438",y:"118",width:"3",height:"3"}),a.jsx("rect",{x:"828",y:"112",width:"3",height:"3"}),a.jsx("rect",{x:"1268",y:"122",width:"3",height:"3"}),a.jsx("rect",{x:"585",y:"128",width:"3",height:"3"})]})]})]}),s2=()=>{const[t,e]=Y.useState("dashboard"),[n,i]=Y.useState(null),[s,r]=Y.useState(!1),o=()=>Nw().then(c=>{i(c),r(!0)});if(Y.useEffect(()=>{o()},[]),!s)return a.jsx("div",{className:"boot",children:"BlackCrown Admin..."});if(!(n!=null&&n.authed))return a.jsxs(a.Fragment,{children:[a.jsx(px,{}),a.jsx(i2,{me:n,onSuccess:o})]});const l=async()=>{await Rw(),o()};return a.jsxs(a.Fragment,{children:[a.jsx(px,{quiet:t==="dashboard"||t==="brain"}),a.jsxs("div",{className:"layout",children:[a.jsx(KM,{active:t,onChange:e,onLogout:l}),a.jsxs("main",{className:"main",children:[t==="dashboard"?a.jsx(bb,{}):null,t==="paperbot"?a.jsx(zb,{}):null,t==="seo"?a.jsx(qw,{}):null,t==="ceo"?a.jsx(Jw,{}):null,t==="sales"?a.jsx(Sd,{k:"herald",eyebrow:"Sales",blurb:"Your advertising and sales rep. Reads the funnel, builds campaigns, files every move through Regent for your word."}):null,t==="projects"?a.jsx(Sd,{k:"steward",eyebrow:"Projects",blurb:"Your project manager. Runs the board, hands work to the other agents, and grows Eclipse-X with its own minion crew."}):null,t==="studio"?a.jsx(Sd,{k:"bard",eyebrow:"Studio",blurb:"Your video studio chief. Directs every clip, bakes exact brand text on with the forge, and pulls captions and angles from the other desks."}):null,t==="brain"?a.jsx(t2,{}):null,t==="command"?a.jsx(ob,{}):null,t==="stats"?a.jsx(pb,{}):null,t==="settings"?a.jsx(gb,{}):null]})]})]})},mx=document.getElementById("root");mx&&N_(mx).render(a.jsx(jr.StrictMode,{children:a.jsx(s2,{})}));export{E1 as $,Hu as A,Qn as B,it as C,um as D,VR as E,XR as F,qi as G,Hn as H,r2 as I,ft as J,dc as K,yn as L,qt as M,Vs as N,$R as O,yi as P,Ot as Q,GR as R,e1 as S,oy as T,$a as U,I as V,bR as W,TR as X,a as Y,a2 as Z,zf as _,Ln as a,o2 as a0,Ue as b,Yf as c,Zt as d,pm as e,vl as f,At as g,mv as h,pc as i,bi as j,fu as k,Er as l,Yt as m,xl as n,iy as o,$n as p,ay as q,Y as r,dm as s,xs as t,en as u,Hf as v,dv as w,Cn as x,yr as y,Dt as z};
