import React from "react"
import Link from 'next/link'
import Navbar, { IMAGE_HEIGHT } from "../components/navbar/navBar"
import Image from "next/image"
import styles from "../components/navbar/navBar.module.css"
// i18n
import { useRouter } from "next/router"
import en from "../locales/en"
import fr from "../locales/fr"

function SomethingWentWrong(props) {
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr

    return (
      <>
        <Navbar />
        <div className="not-found ">
          <img
            src="https://picsum.photos/200/300?grayscale"
            alt="logo"
            width="500px"
            height="400px"
            className={styles.pointer_style}
          />
          <h1> {t.somethingWentWrong.oops}</h1>
          <h2> {t.somethingWentWrong.header}</h2>
          <p>
            {' '}
            {t.somethingWentWrong.text}{' '}
            <Link legacyBehavior href={'/'}>
              <a>{t.somethingWentWrong.link}</a>
            </Link>
          </p>
        </div>
      </>
    )
}

export default SomethingWentWrong