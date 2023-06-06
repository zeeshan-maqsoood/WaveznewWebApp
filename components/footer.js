import React from 'react'
import Link from "next/link"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Box from '@material-ui/core/Box'
import Image from "next/image"
import CardMedia from '@material-ui/core/CardMedia'
import Session from '../sessionService'
// i18n
import { useRouter } from "next/router"
import en from "../locales/en.js"
import fr from "../locales/fr.js"

const useStyles = makeStyles((theme) => ({
    footer_container: {
        display: 'inline-block',
        width: '100%',
        marginTop: 50,
        fontFamily: "Roboto, sans-serif",

        [theme.breakpoints.down("md")]: {
            height: "300px"
        },
        [theme.breakpoints.down("sm")]: {
            height: "200px"
        }
    }
}))

const Footer = ({
                    privacyPolicyLink,
                    partnersLink,
                    termsOfServiceLink,
                    howItWorksLink,
                    aboutWavezLink
                }) => {
    const styles = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr

    return (
      <div>
        <div
          style={{
            marginLeft: '5%',
            marginRight: '5%',
            marginTop: '1%',
            marginBottom: '2%',
            padding: '10px',
            alignContent: 'center'
          }}
        >
          <div
            style={{
              display: 'inline-block',
              width: '100%',
              marginTop: 50,
              fontFamily: 'Roboto, sans-serif',
              maxHeight: '300px'
            }}
          >
            <Grid container direction="row" spacing={2}>
              <Grid
                item
                xs
                container
                direction="column"
                style={{ cursor: 'pointer', textAlign: 'center' }}
              >
                <Link legacyBehavior href="/">
                  <a>
                    <Image
                      src="/assets/images/footerlogo.png"
                      alt="logo"
                      width={100}
                      height={20}
                    />
                  </a>
                </Link>
              </Grid>
              <Grid item container xs direction="column">
                <Typography variant="body1" color="textPrimary" paragraph>
                  {t.footer.about}
                </Typography>
                {/*<Link href="/doc/aboutWaveshare">*/}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  paragraph
                  style={{ cursor: 'pointer' }}
                >
                  {aboutWavezLink && aboutWavezLink !== '' ? (
                    <a
                      href={aboutWavezLink}
                      rel="noopener noreferrer"
                      target="_blank"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {t.footer.aboutWaveshare}
                    </a>
                  ) : (
                    t.footer.aboutWaveshare
                  )}
                </Typography>
                {/*</Link>*/}
                {/*<Link href="/doc/howItWorks">*/}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  paragraph
                  style={{ cursor: 'pointer' }}
                >
                  {howItWorksLink && howItWorksLink !== '' ? (
                    <a
                      href={howItWorksLink}
                      rel="noopener noreferrer"
                      target="_blank"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {t.footer.how}
                    </a>
                  ) : (
                    t.footer.how
                  )}
                </Typography>
                {/*</Link>*/}
                <Link legacyBehavior href="/doc/partners">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    paragraph
                    style={{ cursor: 'pointer' }}
                  >
                    {t.footer.partners}
                  </Typography>
                </Link>
              </Grid>
              <Grid xs item container direction="column">
                <Typography variant="body1" color="textPrimary" paragraph>
                  {t.footer.support}
                </Typography>
                <Link legacyBehavior href="/doc/FAQ">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    paragraph
                    style={{ cursor: 'pointer' }}
                  >
                    {t.footer.faq}
                  </Typography>
                </Link>
                <Link legacyBehavior href="/doc/contactUs">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    paragraph
                    style={{ cursor: 'pointer' }}
                  >
                    {t.footer.contactUs}
                  </Typography>
                </Link>
                {/*<Link href="/doc/privacyPolicy">*/}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  paragraph
                  style={{ cursor: 'pointer' }}
                >
                  {privacyPolicyLink && privacyPolicyLink !== '' ? (
                    <a
                      href={privacyPolicyLink}
                      rel="noopener noreferrer"
                      target="_blank"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {t.footer.privacyPolicy}
                    </a>
                  ) : (
                    t.footer.privacyPolicy
                  )}
                </Typography>
                {/*</Link>*/}
                {/*<Link href="/doc/termsOfService">*/}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  paragraph
                  style={{ cursor: 'pointer' }}
                >
                  {termsOfServiceLink && termsOfServiceLink !== '' ? (
                    <a
                      href={termsOfServiceLink}
                      rel="noopener noreferrer"
                      target="_blank"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {t.footer.termsOfService}
                    </a>
                  ) : (
                    t.footer.termsOfService
                  )}
                </Typography>
                {/*</Link>*/}
              </Grid>
              <Grid item xs container direction="column">
                <Typography variant="body1" color="textPrimary" paragraph>
                  {t.footer.getTheApp}
                </Typography>
                <Link legacyBehavior href="/doc/appStoreClickableIcon">
                  <a>
                    <Image
                      src={
                        Session.getTheme() !== 'DARK'
                          ? '/assets/images/App_Store_2.png'
                          : '/assets/images/App_Store_Dark.png'
                      }
                      alt="logo"
                      width={144}
                      height={42}
                    />
                  </a>
                </Link>
                <br />
                <Link legacyBehavior href="/doc/googlePlayclickableIcon">
                  <a>
                    <Image
                      src={
                        Session.getTheme() !== 'DARK'
                          ? '/assets/images/Google_Store_2.png'
                          : '/assets/images/Google_Store_Dark.png'
                      }
                      alt="logo"
                      width={144}
                      height={42}
                    />
                  </a>
                </Link>
              </Grid>
            </Grid>
          </div>
        </div>
        <hr />
        <div
          style={{
            flexDirection: 'row',
            marginLeft: '5%',
            marginRight: '5%',
            marginTop: '2%',
            marginBottom: '6%',
            padding: '10px'
          }}
        >
          <div
            style={{
              justifyContent: 'space-evenly',
              display: 'flex',
              width: '150px',
              float: 'left'
            }}
          >
            {/* <Link href="/">
                        <a>
                            <Image
                                src="/assets/images/twitter.png"
                                alt="logo"
                                width="22px"
                                height="22px"
                            />
                        </a>
                    </Link>
                    <Link href="/">
                        <a>
                            <Image
                                src="/assets/images/instagram.png"
                                alt="logo"
                                width="22px"
                                height="22px"
                            />
                        </a>
                    </Link>
                    <Link href="/">
                        <a>
                            <Image
                                src="/assets/images/facebook.png"
                                alt="logo"
                                width="22px"
                                height="22px"
                            />
                        </a>
                    </Link> */}
          </div>
          <div
            style={{
              float: 'right'
            }}
          >
            <Typography variant="body1" color="textSecondary" paragraph>
              &copy; {new Date().getFullYear()} {t.wavezInc}
            </Typography>
          </div>
        </div>
      </div>
    )
}

export default Footer
