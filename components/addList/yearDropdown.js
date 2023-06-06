import React, { useEffect, useState } from 'react'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { FormHelperText, makeStyles, TextField } from '@material-ui/core'
import API from '../../pages/api/baseApiIinstance'
import Session from "../../sessionService"
// i18n
import { useRouter } from "next/router"
import en from "../../locales/en"
import fr from "../../locales/fr"

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 24,
        fontWeight: 500,
        paddingTop: 10
    }
}))

export default function YearDropdown({ setUnsavedChanges, vesselYear, setVesselYear, yearIsValid, setYearIsValid, labelStyles = {} }) {
    const classes = useStyles()
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr
    const [maxVesselAge, setMaxVesselAge] = useState(0)
    const [options, setOptions] = useState([{ year: "" }])

    useEffect(() => {
        // determine number of years to display
        API().get(`/configuration/MAXIMUM_VESSEL_AGE`)
            .then((response) => {
                if (response.data) {
                    console.log("Response.data: ", response.data)
                    setMaxVesselAge(response.data.numberValue)
                }
            }).catch((e) => {
                // router.push("/somethingWentWrong");
                console.log("Error from get featured listings is: ", e)
            })
    }, []) // Empty array ensures that effect is only run on mount

    useEffect(() => {
        // populate years array from current year going back YEARS_OLD_ALLOWED
        const currYear = new Date().getFullYear()
        const years = [maxVesselAge]
        for (let index = 0; index <= maxVesselAge; index++) {
            years[index] = { year: String(currYear - index) }
        }
        setOptions(years)
    }, [maxVesselAge])

    return (
        <>
            <p className={classes.title} style={labelStyles}>{t.editListing.vesselDescription.yearLabel}</p>
            <Autocomplete
                id="year-select"
                style={{ width: 300 }}
                options={options}
                classes={{
                    option: classes.option
                }}
                autoHighlight
                value={{ year: vesselYear }}
                onChange={(event, value) => {
                    setUnsavedChanges(true)
                    setYearIsValid(true)
                    {
                        value === undefined || value === null
                            ? setVesselYear("")
                            : setVesselYear(value.year)
                    }
                }}
                getOptionSelected={(option, value) => option?.year === value?.year}
                getOptionLabel={(option) => option?.year}
                renderOption={(option) => (
                    <React.Fragment>
                        {option.year}
                    </React.Fragment>
                )}
                renderInput={(params) => (
                    <>
                        <TextField
                            {...params}
                            name={"year-select-text"}
                            data-testid="year"
                            label={t.addListStep3.yearPlaceholder}
                            style={{ width: 150 }}
                            variant="outlined"
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password' // disable autocomplete and autofill
                            }}
                            error={!yearIsValid}
                        />
                        <FormHelperText error> {!yearIsValid ? t.addListStep3.errorYear : null} </FormHelperText>
                    </>
                )}
            />
        </>
    )
}
