'use client';

import React, { useEffect, useState } from 'react';
import { ThemeDropdown } from '@/components/theme';
import { Box } from '@frigade/react';
import HeadContent from '@/components/head-content';
import Script from 'next/script';

export function Main({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeadContent />
      <div className="flex w-full grow px-6 xl:px-0 lg:hidden">
        <Box className="bg-grid -z-1"></Box>
        <div className="relative max-w-7xl shadow-sm bg-background rounded-lg w-full justify-center items-center border flex mx-auto p-6">
          <p className="text-sm font-medium text-muted-foreground">
            This demo is optimized for larger screens.
          </p>
        </div>
      </div>
      <div className="hidden lg:flex w-full grow px-6 xl:px-0">
        <Box className="bg-grid -z-1"></Box>
        <div className="relative max-w-7xl shadow-sm bg-background rounded-lg w-full justify-center items-center border flex mx-auto p-6">
          <div className="absolute left-6 top-6 z-10">
            <ThemeDropdown />
          </div>
          {children}
        </div>
      </div>
      <Scripts />
    </>
  );
}

function Scripts() {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  if (domLoaded) {
    return (
      <>
        <Script
          id="gtag"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WL6B5EKN4K"
        ></Script>
        <Script id="gtag-script">
          {`  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WL6B5EKN4K');`}
        </Script>
        <Script id="koala">
          {`!function(t){if(window.ko)return;window.ko=[],["identify","track","removeListeners","open","on","off","qualify","ready"].forEach(function(t){ko[t]=function(){var n=[].slice.call(arguments);return n.unshift(t),ko.push(n),ko}});var n=document.createElement("script");n.async=!0,n.setAttribute("src","https://cdn.getkoala.com/v1/pk_211a1bb6ecee2b11dbe259ec95f3f88a66f1/sdk.js"),(document.body || document.head).appendChild(n)}();`}
        </Script>
        <Script id="posthog">
          {`  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init push capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_V9yoG0UsQv5NJo5d1kXlgSoftbP9wfVbj7cUIKCzgZ',{api_host:'https://api2.frigade.com', 
        })`}
        </Script>
      </>
    );
  }

  return null;
}
