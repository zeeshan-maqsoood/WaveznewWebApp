import React from 'react'
import {useRouter} from "next/router"
import en from "../../locales/en"
import fr from "../../locales/fr"
import {makeStyles} from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
    main_div:{
        padding:'5px'
    }
}))
export default function CancellationPolicy(closeModal = () => {
}) {
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr

    return (
        <div className={classes.main_div} >
            <h2
                style={{ marginBottom: 0, backgroundColor: "yellow" }}
            >
                {t.bookingCancellationPolicy.generalTitle}
            </h2>
            <h2 style={{ marginTop: 0 }}>{t.bookingCancellationPolicy.subTitle}</h2>
            <h3
                style={{
                    marginTop: 0,
                    marginBottom: 0,
                    backgroundColor: "yellow"

                }}
            >
                {t.bookingCancellationPolicy.serviceFeeTitle}
            </h3>
            <p style={{ marginTop: 0, marginBottom: 0 }}>
                {t.bookingCancellationPolicy.serviceFeeContent1}
            </p>
            <p style={{ marginTop: 0, marginBottom: 0 }}>
                {t.bookingCancellationPolicy.serviceFeeContent2}
            </p>
            <p style={{ marginTop: 0 }}>
                {t.bookingCancellationPolicy.serviceFeeContent3}
            </p>
            <p
                style={{
                    marginTop: 0,
                    marginBottom: 0,
                    backgroundColor: "yellow",
                    width: "100px"
                }}
            >
                {t.bookingCancellationPolicy.example}
            </p>
            <p style={{ marginTop: 0, marginBottom: 0 }}>
                {t.bookingCancellationPolicy.exampleContent}
            </p>
            <p style={{ marginTop: 0 }}>
                {t.bookingCancellationPolicy.exampleContent2}
            </p>
            <h2
                style={{ marginBottom: 0, backgroundColor: "yellow", width: "220px" }}
            >
                {t.bookingCancellationPolicy.guestTermsTitle}
            </h2>
            <p style={{ marginTop: 0 }}>
                {t.bookingCancellationPolicy.getTermsContent1}
            </p>
            <p style={{ marginTop: 0 }}>
                {t.bookingCancellationPolicy.getTermsContent2}
            </p>
            <p style={{ marginTop: 0 }}>
                {t.bookingCancellationPolicy.getTermsContent3}
            </p>
            <h2
                style={{ marginBottom: 0, backgroundColor: "yellow", width: "280px" }}
            >
                {t.bookingCancellationPolicy.vesselOwnerTermsTitle}
            </h2>
            <p style={{ marginTop: 0 }}>
                {t.bookingCancellationPolicy.vesselOwnerTermsContent}
            </p>
            <h2
                style={{ marginBottom: 0, backgroundColor: "yellow", width: "330px" }}
            >
                {t.bookingCancellationPolicy.refundPolicyTitle}
            </h2>
            <h3 style={{ marginTop: 0, marginBottom: 0 }}>
                {t.bookingCancellationPolicy.refundPolicySubTitle}
            </h3>
            <p style={{ marginTop: 0 }}>
                {t.bookingCancellationPolicy.refundPolicyContent1}
            </p>
            <p style={{ marginTop: 0 }}>
                {t.bookingCancellationPolicy.refundPolicyContent2}
            </p>
            <p style={{ marginTop: 0 }}>
                {t.bookingCancellationPolicy.refundPolicyContent3}
            </p>
            <h2 style={{ marginBottom: 0 }}>{t.tripsPage.upcoming.title}</h2>
            <p style={{ marginTop: 0 }}>{t.tripsPage.upcoming.subtitle}</p>
            <p style={{ marginBottom: 0, backgroundColor: "yellow"  }}>
                {t.tripsPage.upcoming.content1Title}
            </p>
            <p style={{ marginTop: 0 }}>{t.tripsPage.upcoming.content1}</p>
            <p style={{ marginBottom: 0, backgroundColor: "yellow"  }}>
                {t.tripsPage.upcoming.content2Title}
            </p>
            <p style={{ marginTop: 0 }}>{t.tripsPage.upcoming.content2}</p>
            <p style={{ marginBottom: 0, backgroundColor: "yellow"  }}>
                {t.tripsPage.upcoming.content3Title}
            </p>
            <p style={{ marginTop: 0 }}>{t.tripsPage.upcoming.content3}</p>
            <p style={{ marginBottom: 0, backgroundColor: "yellow" }}>
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
            <p style={{ marginTop: 0, marginBottom: 0 }}>
                {t.tripsPage.upcoming.vesselOwnerContent2}
            </p>
            <h2 style={{ marginBottom: 0, backgroundColor: "yellow"  }}>
                {t.bookingCancellationPolicy.taxTitle}
            </h2>
            <p style={{ marginTop: 0, marginBottom: 0 }}>
                {t.bookingCancellationPolicy.taxContent}
            </p>
            <br/>
            <hr/>
        </div>
    )
}
