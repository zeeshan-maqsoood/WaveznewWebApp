import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Router from "next/router"
import Button from "@material-ui/core/Button"
import Typography from '@material-ui/core/Typography'
import Grid from "@material-ui/core/Grid"
import Counter from '../../pages/addList/counter'
// i18n
// eslint-disable-next-line no-duplicate-imports
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import { MenuItem, Select } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        justifyContent: "center",
        marginBottom: 20,
        alignItems: "center"
    },
    durationSelect: {
        textAlign: "right",
        paddingRight: 15
    },
    btnMonth: {
        width: 100,
        marginLeft: 5,
        marginRight: 5
    },
    inputContainer: {
        marginBottom: 40,
        display: "flex",
        justifyContent: "center",
        padding: 0
    }
}))

const FlexibleFilter = ({ closeModal = () => { } }) => {
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr

    const classes = useStyles()
    const [duration, setDuration] = useState("MONTH")
    const [month, setMonth] = useState("MAR")

    return (
        <>
            <Grid container item xs={12}>
                <Grid item xs={12} lg={12} className={classes.container}>
                    {/* <Grid item xs={2} /> */}
                    <Grid item xs={6}>
                        <Typography className={classes.durationSelect}>Duration: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Select
                            inputProps={{ "data-testid": "duration" }}
                            variant="outlined"
                            value={duration || ""}
                            onChange={(event) => { setDuration(event?.target?.value) }}
                            textAlign="left"
                        >
                            <MenuItem value={"WEEKEND"}>Weekend</MenuItem>
                            <MenuItem value={"WEEK"}>Week</MenuItem>
                            <MenuItem value={"MONTH"}>Month</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
                {duration === "MONTH" &&
                    <Grid item container xs={12} spacing={0} style={{ padding: 0 }}>
                        <Grid item xs={12} className={classes.inputContainer} spacing={0}>
                            {/* <Button className={classes.btnMonth} color={month === "JAN" ? "primary" : "default"} variant="contained" onClick={() => setMonth("JAN")}>
                                Jan</Button> */}
                            {/* <Button className={classes.btnMonth} color={month === "FEB" ? "primary" : "default"} variant="contained" onClick={() => setMonth("FEB")}>
                                Feb</Button> */}
                            <Button className={classes.btnMonth} color={month === "MAR" ? "primary" : "default"} variant="contained" onClick={() => setMonth("MAR")}>
                                Mar</Button>
                            <Button className={classes.btnMonth} color={month === "APR" ? "primary" : "default"} variant="contained" onClick={() => setMonth("APR")}>
                                Apr</Button>
                            <Button className={classes.btnMonth} color={month === "MAY" ? "primary" : "default"} variant="contained" onClick={() => setMonth("MAY")}>
                                May</Button>
                        </Grid>
                        <Grid item xs={12} className={classes.inputContainer} spacing={0}>
                            <Button className={classes.btnMonth} color={month === "JUNE" ? "primary" : "default"} variant="contained" onClick={() => setMonth("JUNE")}>
                                June</Button>
                            <Button className={classes.btnMonth} color={month === "JULY" ? "primary" : "default"} variant="contained" onClick={() => setMonth("JULY")}>
                                July</Button>
                            <Button className={classes.btnMonth} color={month === "AUG" ? "primary" : "default"} variant="contained" onClick={() => setMonth("AUG")}>
                                Aug</Button>
                            {/* <Button className={classes.btnMonth} color={month === "SEPT" ? "primary" : "default"} variant="contained" onClick={() => setMonth("SEPT")}>
                                Sept</Button> */}
                            {/* <Button className={classes.btnMonth} color={month === "OCT" ? "primary" : "default"} variant="contained" onClick={() => setMonth("OCT")}>
                                Oct</Button> */}
                            {/* <Button className={classes.btnMonth} color={month === "NOV" ? "primary" : "default"} variant="contained" onClick={() => setMonth("NOV")}>
                                Nov</Button> */}
                            {/* <Button className={classes.btnMonth} color={month === "DEC" ? "primary" : "default"} variant="contained" onClick={() => setMonth("DEC")}>
                                Dec</Button> */}
                        </Grid>
                    </Grid>}
            </Grid>
        </>
    )
}
export default FlexibleFilter
