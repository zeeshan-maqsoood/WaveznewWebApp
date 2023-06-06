import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import parse from 'autosuggest-highlight/parse'
import throttle from 'lodash/throttle'
import Geocode from "react-geocode"

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import { FormHelperText } from '@material-ui/core'

function loadScript(src, position, id) {
    if (!position) {
        return
    }

    const script = document.createElement('script')
    script.setAttribute('async', '')
    script.setAttribute('id', id)
    script.src = src
    position.appendChild(script)
}

const autocompleteService = { current: null }

const useStyles = makeStyles((theme) => ({
    icon: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2)
    }
}))

export default function GoogleMaps({ onUpdate = () => { }, restoreValue, locationIsValid = true, inpProps, inputWidth = 500, errorShift = "0px", size = "medium" }) {
    Geocode.setApiKey(process.env.googleMapsApiKey)
    const classes = useStyles()
    const [value, setValue] = React.useState(null)
    const [inputValue, setInputValue] = React.useState('')
    const [options, setOptions] = React.useState([])
    const loaded = React.useRef(false)

    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr

    const fetch = React.useMemo(
        () =>
            throttle((request, callback) => {
                autocompleteService.current.getPlacePredictions(request, callback)
            }, 200),
        []
    )

    React.useEffect(() => {
        let active = true

        if (!autocompleteService.current && window.google) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService()
        }
        if (!autocompleteService.current) {
            return undefined
        }

        if (inputValue === '') {
            setOptions(value ? [value] : [])
            return undefined
        }

        fetch({ input: inputValue }, (results) => {
            if (active) {
                let newOptions = []

                if (value) {
                    newOptions = [value]
                }

                if (results) {
                    newOptions = [...newOptions, ...results]
                }

                setOptions(newOptions)
            }
        })

        return () => {
            active = false
        }
    }, [value, inputValue, fetch])

    React.useEffect(() => {
        restoreValue && setValue(restoreValue)
    }, [restoreValue])

    const handleChange = (newValue) => {
        if (newValue !== undefined) {
            Geocode.fromAddress(newValue.description).then(
                (response) => {
                    console.log(newValue)
                    console.log(response)
                    const { lat, lng } = response.results[0].geometry.location
                    console.log(lat, lng)
                    onUpdate(response.results[0], [lat, lng], newValue.description)
                },
                (error) => {
                    console.error(error)
                }
            )
        } else {
            onUpdate(undefined, undefined, undefined)
        }
    }

    return (
        <Autocomplete
            size={size}
            inputProps={inpProps}
            style={{ width: inputWidth, display: "inline-block" }}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options)
                setValue(newValue)
                handleChange(newValue)
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue)
            }}
            renderInput={(params) => (
                <>
                    <TextField {...params} label={t.addListStep2.addLocation} variant="outlined" error={!locationIsValid} />
                    <FormHelperText error style={{ position: "relative", left: errorShift }}> {!locationIsValid ? t.addListStep2.errorLocation : null} </FormHelperText>
                </>
            )}
            renderOption={(option) => {
                const matches = option?.structured_formatting?.main_text_matched_substrings
                const parts = option?.structured_formatting?.main_text ? parse(
                    option?.structured_formatting?.main_text,
                    matches?.map((match) => [match?.offset, match?.offset + match?.length])
                ) : null

                return (
                    <Grid container alignItems="center">
                        <Grid item>
                            <LocationOnIcon className={classes.icon} />
                        </Grid>
                        <Grid item xs>
                            {parts?.map((part, index) => (
                                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                                    {part.text}
                                </span>
                            ))}

                            <Typography variant="body2" color="textSecondary">
                                {option?.structured_formatting?.secondary_text}
                            </Typography>
                        </Grid>
                    </Grid>
                )
            }}
        />
    )
}