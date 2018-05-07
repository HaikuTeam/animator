/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import assign from './../../vendor/assign';

/* tslint:disable */
const snip = new Function(`
  (function(e,a){if(!a.__SV){var b=window;try{var c,l,i,j=b.location,g=j.hash;c=function(a,b){return(l=a.match(RegExp(b+"=([^&]*)")))?l[1]:null};g&&c(g,"state")&&(i=JSON.parse(decodeURIComponent(c(g,"state"))),"mpeditor"===i.action&&(b.sessionStorage.setItem("_mpcehash",g),history.replaceState(i.desiredHash||"",e.title,j.pathname+j.search)))}catch(m){}var k,h;window['mixpanel']=a;a._i=[];a.init=function(b,c,f){function e(b,a){var c=a.split(".");2==c.length&&(b=b[c[0]],a=c[1]);b[a]=function(){b.push([a].concat(Array.prototype.slice.call(arguments,
  0)))}}var d=a;"undefined"!==typeof f?d=a[f]=[]:f="mixpanel";d.people=d.people||[];d.toString=function(b){var a="mixpanel";"mixpanel"!==f&&(a+="."+f);b||(a+=" (stub)");return a};d.people.toString=function(){return d.toString(1)+".people (stub)"};k="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
  for(h=0;h<k.length;h++)e(d,k[h]);a._i.push([b,c,f])};a.__SV=1.2;}})(document,window.mixpanel||[]);
`);
/* tslint:enable */

export default function mixpanelInit(mixpanelToken, component) {
  // Only initialize Mixpanel if we're running in the browser
  if (typeof window !== 'undefined') {
    // Don't initialize multiple times if multiple components are on the page
    if (!window['mixpanel']) {
      snip();

      const head = document.getElementsByTagName('head')[0];

      const script = document.createElement('script');
      script.async = true;
      script.type = 'text/javascript';
      script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
      head.appendChild(script);

      window['mixpanel'].init(mixpanelToken, {ip: false});
    }

    const metadata = (component.bytecode && component.bytecode.metadata) || {};

    window['mixpanel'].track(
      'component:initialize',
      assign(
        {
          platform: 'dom',
        },
        metadata,
      ),
    );
  }
}
