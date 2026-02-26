"use client"

import Script from "next/script"

export default function AdBanner() {
  return (
    <div className="flex justify-center my-6">
      <Script
        async
        data-cfasync="false"
        src="https://pl28802401.effectivegatecpm.com/66767c8fc0dea2105b822768e6a80f04/invoke.js"
        strategy="afterInteractive"
      />
      <div id="container-66767c8fc0dea2105b822768e6a80f04" />
    </div>
  )
}
