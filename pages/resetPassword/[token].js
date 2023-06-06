import React from "react"
import SetPasswordComponent from '../../components/login/setPassword'
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

const ResetPassword = (props) => {
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr
  return <SetPasswordComponent header={t.setPasswordPage.headerSet}/>
}
export default ResetPassword
