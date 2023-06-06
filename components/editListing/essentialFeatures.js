import React, { useEffect, useState } from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import { FormControlLabel, FormHelperText } from '@material-ui/core'
// eslint-disable-next-line no-duplicate-imports
import { makeStyles } from '@material-ui/core'

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en"
import fr from "../../locales/fr"
import theme from "../../src/theme"

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

const useStyles = makeStyles((theme) => ({
    label: {
        fontWeight: "500",
        fontSize: 18
    },
    title: {
        fontSize: 24,
        fontWeight: 500,
        paddingTop: 10
    }
}))

export default function EssentialFeatures({ shouldBeRestored, setIsValid, validate, resetFlag, clearErrors, resetClearErrors }) {
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr

    const [jacketsChecked, setJacketsChecked] = useState(false)
    const [firstAidChecked, setFirstAidChecked] = useState(false)
    const [flashlightChecked, setFlashlightChecked] = useState(false)
    const [ropeChecked, setRopeChecked] = useState(false)
    const [jacketIsValid, setJacketIsValid] = useState(true)
    const [firstAidIsValid, setFirstAidIsValid] = useState(true)
    const [flashlightIsValid, setFlashlightIsValid] = useState(true)
    const [ropeIsValid, setRopeIsValid] = useState(true)

    useEffect(() => { // set all checked if restore value sent
        if (shouldBeRestored) {
            setJacketsChecked(true)
            setFirstAidChecked(true)
            setFlashlightChecked(true)
            setRopeChecked(true)
        }
    }, [shouldBeRestored])

    useEffect(() => { // validate checkboxes, then reset flag
        if (validate) {
            { !jacketsChecked ? setJacketIsValid(false) : null }
            { !firstAidChecked ? setFirstAidIsValid(false) : null }
            { !flashlightChecked ? setFlashlightIsValid(false) : null }
            { !ropeChecked ? setRopeIsValid(false) : null }
            resetFlag()
        }
    }, [validate])

    useEffect(() => {
        jacketsChecked && firstAidChecked && flashlightChecked && ropeChecked
            ? setIsValid(true)
            : setIsValid(false)
    }, [jacketsChecked, firstAidChecked, flashlightChecked, ropeChecked])

    useEffect(() => {
        if (clearErrors) {
            setJacketIsValid(true)
            setFirstAidIsValid(true)
            setFlashlightIsValid(true)
            setRopeIsValid(true)
            resetClearErrors()
        }
    }, [clearErrors])

    return (
        <>
            <p className={classes.title}>{t.essentialFeatures.header}</p>
            < FormControlLabel
                control={
                    < Checkbox
                        checked={jacketsChecked}
                        onChange={() => { setJacketsChecked(val => !val), setJacketIsValid(true) }}
                        name="lifeJackets"
                        style={{ color: theme.palette.buttonPrimary.main }}
                        inputProps={{ "data-testid": "jacketsCheckbox" }}
                    />
                }
                label={t.essentialFeatures.lifejacket}
                className={classes.label}
            />
            <FormHelperText error> {!jacketIsValid ? t.essentialFeatures.errorMessage : null} </FormHelperText>
            <br />
            < FormControlLabel
                control={
                    < Checkbox
                        checked={firstAidChecked}
                        onChange={() => { setFirstAidChecked(val => !val), setFirstAidIsValid(true) }}
                        name="firstAid"
                        style={{ color: theme.palette.buttonPrimary.main }}
                        inputProps={{ "data-testid": "firstAidCheckbox" }}
                    />
                }
                label={t.essentialFeatures.firstAid}
                className={classes.label}
            />
            <FormHelperText error> {!firstAidIsValid ? t.essentialFeatures.errorMessage : null} </FormHelperText>
            <br />
            < FormControlLabel
                control={
                    < Checkbox
                        checked={flashlightChecked}
                        onChange={() => { setFlashlightChecked(val => !val), setFlashlightIsValid(true) }}
                        name="flashlight"
                        style={{ color: theme.palette.buttonPrimary.main }}
                        inputProps={{ "data-testid": "flashlightCheckbox" }}
                    />
                }
                label={t.essentialFeatures.flashlight}
                className={classes.label}
            />
            <FormHelperText error> {!flashlightIsValid ? t.essentialFeatures.errorMessage : null} </FormHelperText>
            <br />
            < FormControlLabel
                control={
                    < Checkbox
                        checked={ropeChecked}
                        onChange={() => { setRopeChecked(val => !val), setRopeIsValid(true) }}
                        name="rope"
                        style={{ color: theme.palette.buttonPrimary.main }}
                        inputProps={{ "data-testid": "ropeCheckbox" }}
                    />
                }
                label={t.essentialFeatures.rope}
                className={classes.label}
            />
            <FormHelperText error> {!ropeIsValid ? t.essentialFeatures.errorMessage : null} </FormHelperText>
        </>
    )
}
