import React, { useEffect, useState } from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import ApiInstance from '../../pages/api/baseApiIinstance'
import { Chip, InputAdornment, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import Grid from "@material-ui/core/Grid"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en"
import fr from "../../locales/fr"
import theme from "../../src/theme"

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        borderRadius: 0,
        padding: theme.spacing(0.5),
        margin: 0
    },
    chip: {
        margin: theme.spacing(0.5)
    }
}))

export default function FeatureAutocomplete({ startingIds, features, updateFeatures, setUnsavedChanges = () => { }, setBackgroundBlue = false }) {
    const classes = useStyles()
    const [allFeatures, setAllFeatures] = useState([
{
    }
])
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr
    const [inputText, setInputText] = useState("")

    useEffect(() => {
        let isMounted = true               // note mutable flag
        const callApi = () => { // retrieve all options for searching
            ApiInstance().get('vessel/feature').then((response) => {
                const listFeature = []
                for (let index = 0; index < response.data.length; index++) {
                    listFeature.push(response.data[index])
                }
                if (isMounted) {
                    setAllFeatures(listFeature)
                }
            })
        }
        callApi()
        return () => { isMounted = false } // use cleanup to toggle value, if unmounted
    }, [])

    useEffect(() => { // use startingId parameter to restore features after allFeatures is updated
        if (allFeatures !==[{}]) {
            const restoredFeatures = []
            // eslint-disable-next-line no-var
            for (var i = 0; i <= startingIds?.length - 1; i++) {
                const thisFeature = allFeatures.find(feat => feat._id === startingIds?.[i])
                thisFeature ? restoredFeatures.push(thisFeature) : null
            }
            updateFeatures(restoredFeatures)
        }
    }, [allFeatures, startingIds])

    const handleDelete = (featureToDelete) => () => { // delete feature from array
        updateFeatures((feats) => feats.filter((feat) => feat._id !== featureToDelete._id))
        setUnsavedChanges()
        setInputText("")
    }

    const onFeatureSelect = (value) => { // add feature to array if value is truthy and unique
        if (value && !features.find((feat) => feat._id === value._id)) {
            updateFeatures([...features, value])
            setUnsavedChanges()
        }
    }

    return (
        <>
            <Autocomplete
                value={inputText}
                options={allFeatures}
                getOptionLabel={(option) => option.feature}
                style={{ width: "100%" }}
                onChange={(event, value) => { setInputText(value), onFeatureSelect(value) }}
                renderInput={(params) => <TextField {...params} label={t.editListing.vesselDescription.featuresPlaceholder} variant="outlined" />}
            />
            <Paper component="ul" elevation={0} className={classes.root} style={setBackgroundBlue ? { backgroundColor: theme.palette.background.pattensBlue } : {}}>
                {features.map((data) => {

                    return (
                        <li key={data._id}>
                            <Chip
                                label={data.feature}
                                onDelete={handleDelete(data)}
                                className={classes.chip}
                                color="primary"
                                style={{ borderRadius: 5 }}
                            />
                        </li>
                    )
                })}
            </Paper>
        </>
    )
}
