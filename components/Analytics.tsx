import Script from "next/script";

// Env (Vercel):
//   NEXT_PUBLIC_GTM_ID        → GTM-K5DK33L3 (fallback hardcoded)
//   NEXT_PUBLIC_GA4_ID        → G-K3SWZDFF95
//   NEXT_PUBLIC_AW_ID         → AW-17856564369
//   NEXT_PUBLIC_META_PIXEL_ID → ID do Pixel do Meta
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-K5DK33L3";
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "G-K3SWZDFF95";
const AW_ID  = process.env.NEXT_PUBLIC_AW_ID  || "AW-17856564369";
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const META_TEST_CODE = process.env.NEXT_PUBLIC_META_TEST_CODE || "";

export function Analytics() {
  return (
    <>
      {/* ─── GTM — mecanismo principal de tracking ─── */}
      {GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}

      {/* ─── gtag.js direto — garante window.gtag para chamadas diretas ao Google Ads ─── */}
      {/* send_page_view: false evita page view duplicado (GTM já envia) */}
      {GA4_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('js',new Date());
gtag('config','${GA4_ID}',{send_page_view:false});
gtag('config','${AW_ID}',{send_page_view:false});`}
          </Script>
        </>
      )}

      {/* ─── Meta Pixel (direto, independente do GTM) ─── */}
      {PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}'${META_TEST_CODE ? `, {test_event_code: '${META_TEST_CODE}'}` : ""});fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  );
}
