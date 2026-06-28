import Script from "next/script";

/**
 * Tracking do site — GTM-K5DK33L3 (contêiner principal do Recanto do Açaí).
 *
 * GA4 e Google Ads são gerenciados inteiramente pelo GTM (sem gtag.js direto).
 * O GTM container deve ter configurados:
 *   - Tag GA4 Configuration (G-K3SWZDFF95)
 *   - Tag Google Ads Conversion Linker (AW-17856564369)
 *   - Tags de evento GA4 para: generate_lead, qualify_lead, begin_checkout, purchase
 *
 * Meta Pixel carrega diretamente (fora do GTM).
 *
 * Env (Vercel):
 *   NEXT_PUBLIC_GTM_ID        → GTM-K5DK33L3 (fallback hardcoded)
 *   NEXT_PUBLIC_META_PIXEL_ID → ID do Pixel do Meta
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-K5DK33L3";
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const META_TEST_CODE = process.env.NEXT_PUBLIC_META_TEST_CODE || "";

export function Analytics() {
  return (
    <>
      {/* ─── GTM — carrega GA4 + Google Ads via contêiner ─── */}
      {GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
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
