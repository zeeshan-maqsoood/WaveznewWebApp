import React from "react"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

export default function CancellationPolicy() {
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const body = (
    <div style={{ maxWidth: "500px" }}>
      <h2 style={{ marginBottom: 0 }}>{t.tripsPage.upcoming.title}</h2>
      <p style={{ marginTop: 0 }}>{t.tripsPage.upcoming.subtitle}</p>
      <p style={{ marginBottom: 0, backgroundColor: "yellow", maxWidth: "150px" }}>
        {t.tripsPage.upcoming.content1Title}
      </p>
      <p style={{ marginTop: 0 }}>{t.tripsPage.upcoming.content1}</p>
      <p style={{ marginBottom: 0, backgroundColor: "yellow", maxWidth: "290px" }}>
        {t.tripsPage.upcoming.content2Title}
      </p>
      <p style={{ marginTop: 0 }}>{t.tripsPage.upcoming.content2}</p>
      <p style={{ marginBottom: 0, backgroundColor: "yellow", maxWidth: "210px" }}>
        {t.tripsPage.upcoming.content3Title}
      </p>
      <p style={{ marginTop: 0 }}>{t.tripsPage.upcoming.content3}</p>
      <p style={{ marginBottom: 0, backgroundColor: "yellow", maxWidth: "370px" }}>
        {t.tripsPage.upcoming.cancelByGuest}
      </p>
      <p style={{ marginTop: 0 }}>
        {t.tripsPage.upcoming.cancelByGuestContent}
      </p>
      <p>{t.tripsPage.upcoming.cancelCompensation}</p>
      <h2 style={{ marginBottom: 0 }}>Cancellation by Vessel Owner</h2>
      <p style={{ marginTop: 0 }}>{t.tripsPage.upcoming.cancelByOwner}</p>
      <p style={{ marginTop: 0, marginBottom: 0 }}>
        {t.tripsPage.upcoming.cancelByOwnerContent1}
      </p>
      <p style={{ marginTop: 0 }}>
        {t.tripsPage.upcoming.cancelByOwnerContent2}
      </p>
      <p style={{ marginBottom: 0 }}>{t.tripsPage.upcoming.vesselOwner}</p>
      <p style={{ marginTop: 0, marginBottom: 0 }}>
        {t.tripsPage.upcoming.vesselOwnerContent1}
      </p>
      <p style={{ marginTop: 0 }}>{t.tripsPage.upcoming.vesselOwnerContent2}</p>
    </div>
  )

  return (
    <>
      <div>{body}</div>
    </>
  )
}
