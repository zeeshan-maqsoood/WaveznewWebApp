import React, {useContext, useEffect, useState} from "react"
import {makeStyles} from "@material-ui/core/styles"
import Router from "next/router"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Slider from "@material-ui/core/Slider"
// i18n
// eslint-disable-next-line no-duplicate-imports
import {useRouter} from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import Context from "../../store/context"
import {Menu, MenuItem} from "@material-ui/core"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"

const useStyles = makeStyles((theme) => ({
    main_div: {
        width: "100%"
    },
    slider: {
        width: "99%"
    },
    header: {
        textAlign: "center"
    },
    saveButton: {
        color: theme.palette.background.default
    }
}))

const PriceFilter = ({
                         handlePriceFilter, setNumPrice, setMNumMinPrice, setMNumMaxPrice,
                         closeModal = () => {
                         }
                     }) => {
    const router = useRouter()
    const {locale} = router
    const t = locale === "en" ? en : fr

    const classes = useStyles()
    const [value, setValue] = useState([10, 1000])
    const {globalState, globalDispatch} = useContext(Context)
    const [valueUp, setValueUp] = useState(globalState.addSliderPrice)
    const handleChange = (event, newValue) => {
        setValue([newValue[0], newValue[1]])
        globalDispatch({type: "SET_SLIDER_PRICE", payload: newValue})
        setValueUp(newValue)

        setNumPrice(newValue[1])
        setMNumMinPrice(newValue[0])
        setMNumMaxPrice(newValue[1])
    }
    const handlePriceTypeChange = (val) => {
        globalDispatch({type: "SET_SLIDER_PRICE_TYPE", payload: val})
    }
    const [anchorEl, setAnchorEl] = useState(null)
    const [time, setTime] = useState('Hour')

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)

    }

    return (
        <div className={classes.main_div}>
            <div>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    {`per / ${time}`} <ArrowDropDownIcon/>
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem value={'hour'} onClick={() => { handleClose(); handlePriceTypeChange("HOUR"); setTime("Hour") }}>Hour</MenuItem>
                    <MenuItem value={'day'} onClick={() => { handleClose(); handlePriceTypeChange("DAY"); setTime("Day") }}>Day</MenuItem>
                    <MenuItem value={'Week'} onClick={() => { handleClose(); handlePriceTypeChange("WEEK"); setTime("Week") }}>Week</MenuItem>

                </Menu>
            </div>
            <div className={classes.header}>
                <Typography variant="body1" color="textPrimary">
                    {valueUp[0] !== 0 ?
                        (
                            `$${valueUp[0]} - $${valueUp[1]}`
                        ) : (
                            `$${value[0]} - $${value[1]}`
                        )
                    }
                    /{`${time}`}
                    {/*{t.search.filter.day}*/}
                </Typography>
            </div>
            <Slider value={valueUp}
                    onChange={handleChange}
                    min={10} max={10000}
                    className={classes.slider}/>
            <Grid container>
                <Grid item xs={4} sm={7}/>
                <Grid item xs={4} sm={2}>
                    <Button
                        onClick={() => closeModal(setMNumMaxPrice(100), setMNumMinPrice(10), setNumPrice(100), globalDispatch({
                            type: "SET_SLIDER_PRICE",
                            payload: [10, 1000]
                        }))}
                        variant="outlined"
                        color="primary"
                        style={{
                            fontWeight: "400",
                            textTransform: "capitalize",
                            fontSize: "18px",
                            maxWidth: "150px"
                        }}
                    >
                        <Typography variant="body2" color="primary">
                            {t.search.filter.clear}
                        </Typography>
                    </Button>
                </Grid>
                <Grid item xs={4} sm={2}>
                    <Button
                        onClick={() => {
                            // handlePriceFilter();
                            closeModal()

                        }}
                        variant="contained"
                        color="primary"
                        className={classes.saveButton}
                        style={{
                            fontWeight: "400",
                            textTransform: "capitalize",
                            fontSize: "18px",
                            maxWidth: "150px"
                        }}
                    >
                        <Typography variant="body2">{t.search.filter.save}</Typography>
                    </Button>
                </Grid>
            </Grid>
        </div>

    )
}
export default PriceFilter
