/*! (c) Andrea Giammarchi - ISC */
const HTMLParsedElement=(()=>{const e="DOMContentLoaded",t=new WeakMap,n=e=>{do{if(e.nextSibling)return!0}while(e=e.parentNode);return!1},s=(t,n,s,a)=>{n.disconnect(),s.removeEventListener(e,a),r(t)},r=e=>{t.set(e,!0),e.parsedCallback()};return class extends HTMLElement{connectedCallback(){if("parsedCallback"in this&&!t.has(this)){const a=this,{ownerDocument:i}=a;if(t.set(a,!1),"complete"===i.readyState||n(a))Promise.resolve(a).then(r);else{const t=()=>s(a,r,i,t);i.addEventListener(e,t);const r=new MutationObserver(()=>{if(n(a))return s(a,r,i,t),!0});r.observe(a.parentNode,{childList:!0,subtree:!0})}}}get parsed(){return t.has(this)?!0===t.get(this):n(this)}}})();