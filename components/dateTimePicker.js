import React, {useContext, useState} from 'react'
import Datetime from "react-datetime"
import {makeStyles} from "@material-ui/core/styles"
import FormControl from "@material-ui/core/FormControl"
import {DateRange} from 'react-date-range'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css'
import Context from "../store/context" // theme css file
const useStyles = makeStyles((theme) => ({
    label: {
        color: theme.palette.text.greyTransparent,
        cursor: "pointer",
        display: "inline-flex",
        fontSize: "16px",
        transition: "0.3s ease all",
        lineHeight: "1.428571429",
        fontWeight: "400",
        paddingLeft: "0"
    },
    form_control: {
        width: '220px',
        backgroundColor: theme.palette.background.whisper,
        fontWeight: '400',
        fontSize: '18px',
        borderRadius: '5px',
        justifyContent: 'center',
        justifyItems: 'center',
        paddingLeft: '20px',
        paddingTop: '5px',
        paddingBottom: '5px',
        paddingRight: '5px'
    }
}))

export default function DateTimePicker({dates, setDates}) {
    const classes = useStyles()

    return (
        <div className="App">
            <DateRange
                editableDateInputs={true}
                onChange={item => setDates([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dates}
                minDate={new Date()}
            />
        </div>
    )
}