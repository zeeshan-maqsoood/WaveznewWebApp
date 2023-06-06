import React, {useEffect, useState} from "react"
import {makeStyles} from "@material-ui/core/styles"
import NavBar from "../../../../../components/admin-panel/navBar"
import {useRouter} from "next/router"
import Grid from "@material-ui/core/Grid"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import {TextField, Typography} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ArrowRightIcon from "@material-ui/icons/ArrowRight"
import Divider from "@material-ui/core/Divider"
import Box from "@material-ui/core/Box"
import API from "../../../../api/baseApiIinstance"
import Session from "../../../../../sessionService"
import theme from "../../../../../src/theme"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        fontFamily: "Roboto",
        color: theme.palette.title.matterhorn
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary
    },
    text: {
        font: "Roboto",
        color: theme.palette.text.grey,
        fontSize: 24
    }
}))

export default function AddListing() {
    const classes = useStyles()
    const router = useRouter()
    const token = Session.getToken("Wavetoken")

    const [apiValue, setApiValueAge] = useState('')

    const [apiValueCRV_GREATER, setApiValueCRV_GREATER] = useState('')
    const [apiValueCRV_GREATER_PASSENGER, setApiValueCRV_GREATER_PASSENGER] = useState('')
    const [apiValueSVOP_MED_SDV_BS_LESS_EQUAL, setApiValueSVOP_MED_SDV_BS_LESS_EQUAL] = useState('')
    const [apiValueLimited_MASTER_60_MED_SDV_BS_LESS, setApiValueLimited_MASTER_60_MED_SDV_BS_LESS] = useState('')
    const [apiValueMASTER_150_MED_BST_LESS_EQUAL, setApiValueMASTER_150_MED_BST_LESS_EQUAL] = useState('')
    const [apiValueMASTER_500_MED_BST_LESS_EQUAL, setApiValueMASTER_500_MED_BST_LESS_EQUAL] = useState('')

    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [age, setAge] = useState('')

    const [CRV_GREATER, setCRV_GREATER] = useState('')
    const [CRV_GREATER_PASSENGER, setCRV_GREATER_PASSENGER] = useState('')
    const [SVOP_MED_SDV_BS_LESS_EQUAL, setSVOP_MED_SDV_BS_LESS_EQUAL] = useState('')
    const [Limited_MASTER_60_MED_SDV_BS_LESS, setLimited_MASTER_60_MED_SDV_BS_LESS] = useState('')
    const [MASTER_150_MED_BST_LESS_EQUAL, setMASTER_150_MED_BST_LESS_EQUAL] = useState('')
    const [MASTER_500_MED_BST_LESS_EQUAL, setMASTER_500_MED_BST_LESS_EQUAL] = useState('')

    const onClickBack = () => {
        router.push("/admin-panel/pages/add-listing")
    }

    const onClickReset = () => {
        setAge(apiValue)
        setCRV_GREATER(apiValueCRV_GREATER)
        setCRV_GREATER_PASSENGER(apiValueCRV_GREATER_PASSENGER)
        setSVOP_MED_SDV_BS_LESS_EQUAL(apiValueSVOP_MED_SDV_BS_LESS_EQUAL)
        setLimited_MASTER_60_MED_SDV_BS_LESS(apiValueLimited_MASTER_60_MED_SDV_BS_LESS)
        setMASTER_150_MED_BST_LESS_EQUAL(apiValueMASTER_150_MED_BST_LESS_EQUAL)
        setMASTER_500_MED_BST_LESS_EQUAL(apiValueMASTER_500_MED_BST_LESS_EQUAL)
        setUnsavedChanges(false)
    }

    const handleSave = () => {
        API()
            .put(
                `configuration/MAXIMUM_VESSEL_AGE`,
                {
                    key: "MAXIMUM_VESSEL_AGE",
                    numberValue: age
                },
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValueAge(response.data.numberValue)
                    console.log("response ", response.data)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

        API()
            .put(
                `configuration/CRV_GREATER`,
                {
                    key: "CRV_GREATER",
                    numberValue: CRV_GREATER
                },
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValueCRV_GREATER(response.data.numberValue)
                    console.log("response ", response.data)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

        API()
            .put(
                `configuration/CRV_GREATER_PASSENGER`,
                {
                    key: "CRV_GREATER_PASSENGER",
                    numberValue: CRV_GREATER_PASSENGER
                },
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValueCRV_GREATER_PASSENGER(response.data.numberValue)
                    console.log("response ", response.data)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

        API()
            .put(
                `configuration/SVOP_MED_SDV_BS_LESS_EQUAL`,
                {
                    key: "SVOP_MED_SDV_BS_LESS_EQUAL",
                    numberValue: SVOP_MED_SDV_BS_LESS_EQUAL
                },
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValueSVOP_MED_SDV_BS_LESS_EQUAL(response.data.numberValue)
                    console.log("response ", response.data)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

        API()
            .put(
                `configuration/Limited_MASTER_60_MED_SDV_BS_LESS`,
                {
                    key: "Limited_MASTER_60_MED_SDV_BS_LESS",
                    numberValue: Limited_MASTER_60_MED_SDV_BS_LESS
                },
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValueLimited_MASTER_60_MED_SDV_BS_LESS(response.data.numberValue)
                    console.log("response ", response.data)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

        API()
            .put(
                `configuration/MASTER_150_MED_BST_LESS_EQUAL`,
                {
                    key: "MASTER_150_MED_BST_LESS_EQUAL",
                    numberValue: MASTER_150_MED_BST_LESS_EQUAL
                },
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValueMASTER_150_MED_BST_LESS_EQUAL(response.data.numberValue)
                    console.log("response ", response.data)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

        API()
            .put(
                `configuration/MASTER_500_MED_BST_LESS_EQUAL`,
                {
                    key: "MASTER_500_MED_BST_LESS_EQUAL",
                    numberValue: MASTER_500_MED_BST_LESS_EQUAL
                },
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValueMASTER_500_MED_BST_LESS_EQUAL(response.data.numberValue)
                    console.log("response ", response.data)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
    }

    useEffect(() => {
        setAge(apiValue)
        setCRV_GREATER(apiValueCRV_GREATER)
        setCRV_GREATER_PASSENGER(apiValueCRV_GREATER_PASSENGER)
        setSVOP_MED_SDV_BS_LESS_EQUAL(apiValueSVOP_MED_SDV_BS_LESS_EQUAL)
        setLimited_MASTER_60_MED_SDV_BS_LESS(apiValueLimited_MASTER_60_MED_SDV_BS_LESS)
        setMASTER_150_MED_BST_LESS_EQUAL(apiValueMASTER_150_MED_BST_LESS_EQUAL)
        setMASTER_500_MED_BST_LESS_EQUAL(apiValueMASTER_500_MED_BST_LESS_EQUAL)
        setUnsavedChanges(false)
    }, [apiValue, apiValueCRV_GREATER, apiValueSVOP_MED_SDV_BS_LESS_EQUAL, apiValueLimited_MASTER_60_MED_SDV_BS_LESS, apiValueMASTER_150_MED_BST_LESS_EQUAL, apiValueMASTER_500_MED_BST_LESS_EQUAL, apiValueCRV_GREATER_PASSENGER])

    useEffect(() => {
        API()
            .get(
                `configuration/MAXIMUM_VESSEL_AGE`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValueAge(response.data.numberValue)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

        API()
            .get(
                `configuration/CRV_GREATER`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValueCRV_GREATER(response.data.numberValue)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

        API()
            .get(
                `configuration/CRV_GREATER_PASSENGER`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValueCRV_GREATER_PASSENGER(response.data.numberValue)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

        API()
            .get(
                `configuration/SVOP_MED_SDV_BS_LESS_EQUAL`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValueSVOP_MED_SDV_BS_LESS_EQUAL(response.data.numberValue)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

        API()
            .get(
                `configuration/Limited_MASTER_60_MED_SDV_BS_LESS`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValueLimited_MASTER_60_MED_SDV_BS_LESS(response.data.numberValue)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

        API()
            .get(
                `configuration/MASTER_150_MED_BST_LESS_EQUAL`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValueMASTER_150_MED_BST_LESS_EQUAL(response.data.numberValue)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

        API()
            .get(
                `configuration/MASTER_500_MED_BST_LESS_EQUAL`,
                {
                    headers: {
                        authorization: `Bearer ${  token}`,
                        accept: "application/json"
                    }
                }
            )
            .then((response) => {
                console.log("response is ", response)
                if ((response.status = 200)) {
                    setApiValueMASTER_500_MED_BST_LESS_EQUAL(response.data.numberValue)
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })

    }, [])

    const handleFeatures = () => {
        router.push("/admin-panel/pages/add-listing/vessel-description/features")
    }

    const handleFuel = () => {
        router.push("/admin-panel/pages/add-listing/vessel-description/type-of-fuel")
    }

    return (
        <>
            <NavBar/>
            <div className={classes.root}>
                <Grid
                    style={{
                        marginRight: "auto",
                        marginLeft: "16rem",
                        marginTop: "8%",
                        width: "73%"
                    }}
                    container
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid style={{display: "flex"}} item xs={12}>
                                <ArrowBackIcon
                                    onClick={onClickBack}
                                    style={{fontSize: "2rem", cursor: "pointer"}}
                                />
                                <Typography
                                    style={{marginLeft: '15px', fontWeight: "500"}}
                                    variant="h5"
                                    gutterBottom
                                >
                                    Vessel Description
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            boxShadow={3}
                            bgcolor="background.paper"
                            m={1}
                            p={1}>
                            <List
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                className={classes.root}>
                                <ListItem button>
                                    <ListItemText onClick={() => {
                                        handleFeatures()
                                    }} primary="Features"/>
                                    <ArrowRightIcon/>
                                </ListItem>
                                <Divider/>
                                <ListItem button>
                                    <ListItemText onClick={() => {
                                        handleFuel()
                                    }} primary="Types of Fuel"/>
                                    <ArrowRightIcon/>
                                </ListItem>
                                <Divider/>
                                <Typography
                                    style={{
                                        fontSize: '1rem',
                                        fontFamily: "Roboto",
                                        fontWeight: '400',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.00938em',
                                        paddingLeft: 16,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: 16,
                                        marginBottom: 0
                                    }}
                                    gutterBottom
                                >
                                    Maximum Vessel age <form style={{
                                    width: '4rem',
                                    marginLeft: '1rem',
                                    marginRight: '1rem'
                                }} className={classes.root} noValidate autoComplete="off">
                                    <TextField id="outlined-basic" variant="outlined"
                                               type="number"
                                               value={age}
                                               onChange={(event, value) => {
                                                   (event?.target?.value ? setAge(event.target.value) : setAge(""))
                                                   setUnsavedChanges(apiValue !== event?.target?.value)
                                               }}
                                    />
                                </form>
                                    (in years)
                                </Typography>
                                <Divider/>
                                <Typography
                                    style={{
                                        fontSize: '1rem',
                                        fontFamily: "Roboto",
                                        fontWeight: "bold",
                                        lineHeight: '1.5',
                                        letterSpacing: '0.00938em',
                                        paddingLeft: 16,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: 16,
                                        marginBottom: 0
                                    }}
                                    gutterBottom
                                >
                                    Chartering Metric Requirements
                                </Typography>
                                <Divider/>
                                <Typography
                                    style={{
                                        fontSize: '1rem',
                                        fontFamily: "Roboto",
                                        fontWeight: '400',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.00938em',
                                        paddingLeft: 16,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: 16,
                                        marginBottom: 0
                                    }}
                                    gutterBottom
                                >
                                    Vessels would require a CRV if greater than <form style={{
                                    width: '8rem',
                                    marginLeft: '1rem',
                                    marginRight: '1rem'
                                }} className={classes.root} noValidate autoComplete="off">
                                    <TextField id="outlined-basic" variant="outlined"
                                               type="number"
                                               value={CRV_GREATER}
                                               onChange={(event, value) => {
                                                   (event?.target?.value ? setCRV_GREATER(event.target.value) : setCRV_GREATER(""))
                                                   setUnsavedChanges(apiValueCRV_GREATER !== event?.target?.value)
                                               }}/>
                                </form>
                                    GT or Passengers greater than or equal to
                                    <form style={{
                                        width: '8rem',
                                        marginLeft: '1rem',
                                        marginRight: '1rem'
                                    }} className={classes.root} noValidate autoComplete="off">
                                        <TextField id="outlined-basic" variant="outlined"
                                                   type="number"
                                                   value={CRV_GREATER_PASSENGER}
                                                   onChange={(event, value) => {
                                                       (event?.target?.value ? setCRV_GREATER_PASSENGER(event.target.value) : setCRV_GREATER_PASSENGER(""))
                                                       setUnsavedChanges(apiValueCRV_GREATER_PASSENGER !== event?.target?.value)
                                                   }}/>
                                    </form>
                                </Typography>
                                <Divider/>


                                <Typography
                                    style={{
                                        fontSize: '1rem',
                                        fontFamily: "Roboto",
                                        fontWeight: '400',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.00938em',
                                        paddingLeft: 16,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: 16,
                                        marginBottom: 0
                                    }}
                                    gutterBottom
                                >
                                    Vessel Operators would be required to upload a SVOP and MED-SDV-BS (Minimum) if the
                                    Vessel being listed is less than or equal to <form style={{
                                    width: '8rem',
                                    marginLeft: '1rem',
                                    marginRight: '1rem'
                                }} className={classes.root} noValidate autoComplete="off">
                                    <TextField id="outlined-basic" variant="outlined"
                                               type="number"
                                               value={SVOP_MED_SDV_BS_LESS_EQUAL}
                                               onChange={(event, value) => {
                                                   (event?.target?.value ? setSVOP_MED_SDV_BS_LESS_EQUAL(event.target.value) : setSVOP_MED_SDV_BS_LESS_EQUAL(0))
                                                   setUnsavedChanges(apiValueSVOP_MED_SDV_BS_LESS_EQUAL !== event?.target?.value)
                                               }}/>
                                </form>
                                    GT
                                </Typography>
                                <Divider/>


                                <Typography
                                    style={{
                                        fontSize: '1rem',
                                        fontFamily: "Roboto",
                                        fontWeight: '400',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.00938em',
                                        paddingLeft: 16,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: 16,
                                        marginBottom: 0
                                    }}
                                    gutterBottom
                                >
                                    Vessel Operators would be required to upload a Limited Master and MED-SDV-BS
                                    (Minimum) if the Vessel being listed is less than or equal to <form style={{
                                    width: '8rem',
                                    marginLeft: '1rem',
                                    marginRight: '1rem'
                                }} className={classes.root} noValidate autoComplete="off">
                                    <TextField id="outlined-basic" variant="outlined"
                                               type="number"
                                               value={Limited_MASTER_60_MED_SDV_BS_LESS}
                                               onChange={(event, value) => {
                                                   (event?.target?.value ? setLimited_MASTER_60_MED_SDV_BS_LESS(event.target.value) : setLimited_MASTER_60_MED_SDV_BS_LESS(""))
                                                   setUnsavedChanges(apiValueLimited_MASTER_60_MED_SDV_BS_LESS !== event?.target?.value)
                                               }}/>
                                </form>
                                    GT
                                </Typography>
                                <Divider/>


                                <Typography
                                    style={{
                                        fontSize: '1rem',
                                        fontFamily: "Roboto",
                                        fontWeight: '400',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.00938em',
                                        paddingLeft: 16,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: 16,
                                        marginBottom: 0
                                    }}
                                    gutterBottom
                                >
                                    Vessel Operators would be required to upload a Master 150GT and MED BST (Minimum) if
                                    the Vessel being listed is less than or equal to <form style={{
                                    width: '8rem',
                                    marginLeft: '1rem',
                                    marginRight: '1rem'
                                }} className={classes.root} noValidate autoComplete="off">
                                    <TextField id="outlined-basic" variant="outlined"
                                               type="number"
                                               value={MASTER_150_MED_BST_LESS_EQUAL}
                                               onChange={(event, value) => {
                                                   (event?.target?.value ? setMASTER_150_MED_BST_LESS_EQUAL(event.target.value) : setMASTER_150_MED_BST_LESS_EQUAL(""))
                                                   setUnsavedChanges(apiValueMASTER_150_MED_BST_LESS_EQUAL !== event?.target?.value)
                                               }}/>
                                </form>
                                    GT
                                </Typography>
                                <Divider/>


                                <Typography
                                    style={{
                                        fontSize: '1rem',
                                        fontFamily: "Roboto",
                                        fontWeight: '400',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.00938em',
                                        paddingLeft: 16,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: 16,
                                        marginBottom: 0
                                    }}
                                    gutterBottom
                                >
                                    Vessel Operators would be required to upload a Master 500GT and MED BST (Minimum) if
                                    the Vessel being listed is less than or equal to <form style={{
                                    width: '8rem',
                                    marginLeft: '1rem',
                                    marginRight: '1rem'
                                }} className={classes.root} noValidate autoComplete="off">
                                    <TextField id="outlined-basic" variant="outlined"
                                               type="number"
                                               value={MASTER_500_MED_BST_LESS_EQUAL}
                                               onChange={(event, value) => {
                                                   (event?.target?.value ? setMASTER_500_MED_BST_LESS_EQUAL(event.target.value) : setMASTER_500_MED_BST_LESS_EQUAL(""))
                                                   setUnsavedChanges(apiValueMASTER_500_MED_BST_LESS_EQUAL !== event?.target?.value)
                                               }}/>
                                </form>
                                    GT
                                </Typography>
                                <Divider/>

                                <Grid style={{
                                    textAlign: 'center',
paddingTop: '2rem',
                                    paddingBottom: '1rem'
                                }} item xs={12}>
                                    <Button
                                        style={{marginRight: "3rem"}}
                                        variant="contained"
                                        color="primary"
                                        disabled={!unsavedChanges}
                                        onClick={() => {
                                            handleSave()
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button onClick={() => {
                                        onClickReset()
                                    }}
                                            style={{color: theme.palette.button.red}}>Reset</Button>
                                </Grid>
                            </List>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}
