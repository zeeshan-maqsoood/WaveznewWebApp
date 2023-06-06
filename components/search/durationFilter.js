import React, { useContext, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Router from "next/router"
import Button from "@material-ui/core/Button"
import Typography from '@material-ui/core/Typography'
import Grid from "@material-ui/core/Grid"
import Counter from '../../pages/addList/counter'
import FlexibleFilter from './flexibleFilter'
// i18n
// eslint-disable-next-line no-duplicate-imports
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import DateTimePicker from "../dateTimePicker"
import Context from "../../store/context"

const useStyles = makeStyles((theme) => ({
    btnContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: 20
    },
    counterText: {
        fontSize: 24,
        width: "100%",
        display: "inline-block"
    },
    date_picker_div: {
        display: 'flex',
        justifyContent: 'center',
        justifyItems: 'center',
        marginLeft: '20%',
        [theme.breakpoints.down("xs")]: {
            marginLeft: '-26px'
        }
    },
    labelsDiv: {
        width: "332px",
        display: "flex",
        justifyContent: "space-evenly",
        fontSize: 24,
        fontWeight: "bold"
    },
    labels: {
        fontSize: 24
    }
}))

const DurationFilter = ({
    closeModal = () => {
    }
}) => {
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr
    const classes = useStyles()
    const [inputType, setInputType] = useState("CALENDAR")
    const { globalState, globalDispatch } = useContext(Context)
    const [dates, setDates] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ])

    const saveDates = () => {
        globalDispatch({ type: "SET_DURATION", payload: dates })
        console.log("dates", dates)
        globalDispatch({ type: "SET_DURATION_TYPE", payload: inputType })
    }
    return (
        <>
            <Grid container item xs={12}>
                <div className={classes.date_picker_div}>
                    <div className={classes.labelsDiv}>
                        <Typography style={{ paddingRight: "15px" }} variant="h6" color="textSecondary">
                            {t.calendar.startPicker}
                        </Typography>
                        <Typography style={{ paddingLeft: "15px" }} variant="h6" color="textSecondary">
                            {t.calendar.endPicker}
                        </Typography>
                    </div>
                </div>
                <Grid className={classes.date_picker_div}>
                    <DateTimePicker setDates={(newDates) => setDates(newDates)} dates={dates} />
                </Grid>
                {/*Flexible filter removed*/}
                {/*<Grid item xs={12} lg={12} className={classes.btnContainer}>*/}
                {/*    <Button disableElevation={inputType != "CALENDAR"}*/}
                {/*            style={{borderTopRightRadius: 0, borderBottomRightRadius: 0}} onClick={() => {*/}
                {/*        setInputType("CALENDAR")*/}
                {/*    }} color={inputType == "CALENDAR" ? "primary" : "default"} variant={"contained"}*/}
                {/*            data-testid="btnCalendar">Calendar</Button>*/}
                {/*    <Button disableElevation={inputType != "FLEXIBLE"}*/}
                {/*            style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}} onClick={() => {*/}
                {/*        setInputType("FLEXIBLE")*/}
                {/*    }} color={inputType == "FLEXIBLE" ? "primary" : "default"} variant={"contained"}*/}
                {/*            data-testid="btnFlexible">Flexible</Button>*/}
                {/*</Grid>*/}
                {/*{inputType === "CALENDAR" ?*/}
                {/*    (*/}
                {/*        <Grid className={classes.date_picker_div}>*/}
                {/*            <DateTimePicker setDates={(newDates)=>setDates(newDates) }  dates={dates}/>*/}
                {/*        </Grid>*/}
                {/*    ) : (*/}
                {/*        inputType === "FLEXIBLE" &&*/}
                {/*        <FlexibleFilter/>*/}
                {/*    )*/}
                {/*}*/}
            </Grid>
            <hr />
            <Grid container item xs={12}>
                <Grid item xs={4} sm={7} />
                <Grid item xs={4} sm={2}>
                    <Button
                        onClick={() => closeModal()}
                        variant="outlined"
                        color="primary"
                        style={{
                            fontWeight: "400",
                            textTransform: "capitalize",
                            fontSize: "18px",
                            maxWidth: "150px"
                        }}>
                        <Typography variant="body2" color="primary">{t.search.filter.clear}</Typography>
                    </Button>
                </Grid>
                <Grid item xs={4} sm={2}>
                    <Button
                        onClick={() => {
                            saveDates(), closeModal()
                        }}
                        variant="contained"
                        color="primary"
                        style={{
                            fontWeight: "400",
                            textTransform: "capitalize",
                            fontSize: "18px",
                            maxWidth: "150px"
                        }}>
                        <Typography variant="body2">{t.search.filter.save}</Typography>
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}
export default DurationFilter
