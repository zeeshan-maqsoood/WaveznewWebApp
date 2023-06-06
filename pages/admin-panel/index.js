import React, {useContext, useEffect, useState} from "react"
import {makeStyles} from '@material-ui/core/styles'
import Grid from "@material-ui/core/Grid"
import {Chart} from "react-google-charts"
import NavBar from "../../components/admin-panel/navBar"
// Over ten different commonly used charts are available
import {ActiveUsersChart, AnalyticsDashboard, SessionsByDateChart, SessionsGeoChart} from 'react-analytics-charts'
import {Paper} from "@material-ui/core"
import ApiInstance from "../api/baseApiIinstance"
import moment from "moment"
import theme from "../../src/theme"
import {useRouter} from "next/router"
import Context from "../../store/context"

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
        width: 430
    }
}))

export default function LandingPage() {
    const classes = useStyles()
    const [users, setUsers] = useState([['Month', 'Users'], [0, 0]])
    const [charters, setCharters] = useState([['Month', 'Charters'], [0, 0]])
    const [rentals, setRentals] = useState([['Month', 'Rentals'], [0, 0]])
    const [stays, setStays] = useState([['Month', 'Stays'], [0, 0]])
    const [totalVessels, setTotalVessels] = useState([['Task', 'Hours per Day'], ['', 0]])
    const router = useRouter()
    const {globalState, globalDispatch} = useContext(Context)
    useEffect(() => {
        if (globalState.pseudoLogin) {
            globalDispatch({type: "SET_PSEUDO_LOGIN", payload: false})
            router.reload()
        }

        let isMounted = true
        const callApi = () => {
            ApiInstance().get('/dashboard/listUsers').then((response) => {
                const listUser = [['Month', 'Users']]
                for (let index = 0; index < response.data.length; index++) {
                    const sortedUsers = response.data.sort(function (a, b) {
                        if (a._id.month < b._id.month) {
                            return -1
                        }
                        if (a._id.month > b._id.month) {
                            return 1
                        }
                        return 0
                    })
                    listUser.push([moment().month(sortedUsers[index]._id.month - 1).format('MMMM'), sortedUsers[index].count])
                }
                if (isMounted) {
                    setUsers(listUser)
                }
            })
            ApiInstance().get('/dashboard/listVessels').then((response) => {
                const listCharters = [['Month', 'Charters']]
                const listStays = [['Month', 'Stays']]
                const listRentals = [['Month', 'Rentals']]
                const listTotalVessels = [['Task', 'Hours per Day']]

                listTotalVessels.push(['Rentals', response.data[0].rentalsSum[0].count])
                listTotalVessels.push(['Stays', response.data[0].staysSum[0].count])
                listTotalVessels.push(['Charters', response.data[0].chartersSum[0].count])
                console.log(listTotalVessels)
                // eslint-disable-next-line no-var
                for (var index = 0; index < response.data[0].rentals.length; index++) {
                    const sortedRentals = response.data[0].rentals.sort(function (a, b) {
                        if (a._id.month < b._id.month) {
                            return -1
                        }
                        if (a._id.month > b._id.month) {
                            return 1
                        }
                        return 0
                    })
                    listRentals.push([moment().month(sortedRentals[index]._id.month - 1).format('MMMM'), sortedRentals[index].count])
                    //sortedRentals[index]._id.month.toString()
                }

                // eslint-disable-next-line no-var
                for (var index = 0; index < response.data[0].stays.length; index++) {
                    const sortedStays = response.data[0].stays.sort(function (a, b) {
                        if (a._id.month < b._id.month) {
                            return -1
                        }
                        if (a._id.month > b._id.month) {
                            return 1
                        }
                        return 0
                    })
                    listStays.push([moment().month(sortedStays[index]._id.month - 1).format('MMMM'), sortedStays[index].count])
                }

                // eslint-disable-next-line no-var
                for (var index = 0; index < response.data[0].charters.length; index++) {
                    const sortedCharters = response.data[0].charters.sort(function (a, b) {
                        if (a._id.month < b._id.month) {
                            return -1
                        }
                        if (a._id.month > b._id.month) {
                            return 1
                        }
                        return 0
                    })
                    listCharters.push([moment().month(sortedCharters[index]._id.month - 1).format('MMMM'), sortedCharters[index].count])
                }
                if (isMounted) {
                    setTotalVessels(listTotalVessels)
                    setCharters(listCharters)
                    setStays(listStays)
                    setRentals(listRentals)
                }
            })
        }
        callApi()
        return () => {
            isMounted = false
        }
    }, [])

    const clientId = process.env.googleAnalyticsClientID
    return (
        <>
            <NavBar/>
            <div style={{marginTop: '5rem', marginLeft: '16rem'}}>
                <div>To Access Google Analytics <a
                    href="https://analytics.google.com/analytics/web/?authuser=1#/report-home/a199116091w275227097p244559561"
                    target="_blank">Dashboard</a></div>
                <AnalyticsDashboard
                    authOptions={{clientId}}
                    renderCharts={(gapi, viewId) => {
                        return (
                            <>
                                <div style={{textAlign: '-webkit-center', margin: '3rem'}}>
                                    <Grid item xs={12}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <Paper className={classes.paper}
                                                       style={{width: 470, height: 'fit-content'}}>
                                                    <ActiveUsersChart
                                                        gapi={gapi}
                                                        viewId={viewId}
                                                        options={{
                                                            title: `Users Activity - 7 Days`
                                                        }}
                                                        days={7}
                                                        activeUserDays={7}
                                                    />
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Paper className={classes.paper}
                                                       style={{width: 470, height: 'fit-content'}}>
                                                    <SessionsByDateChart
                                                        gapi={gapi}
                                                        options={{
                                                            title: `Site Traffic`
                                                        }}
                                                        viewId={viewId}
                                                        days={7}
                                                        showPageViews
                                                        showUsers
                                                    />
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <Paper className={classes.paper} style={{width: 470}}>
                                                    <SessionsGeoChart
                                                        gapi={gapi}
                                                        viewId={viewId}
                                                        showPageViews
                                                    />
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Paper className={classes.paper}
                                                       style={{width: 470}}>
                                                    <Chart
                                                        width={'auto'}
                                                        height={'300px'}
                                                        chartType="PieChart"
                                                        loader={<div>Loading Chart</div>}
                                                        data={totalVessels}
                                                        options={{
                                                            title: 'Vessels Listed',
                                                            colors: [theme.palette.background.cerulean, theme.palette.background.irisBlue, theme.palette.background.blizzardBlue],
                                                            hAxis: {
                                                                title: 'Month',
                                                                titleTextStyle: {
                                                                    color: theme.palette.background.nightRider,
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: 400
                                                                }
                                                            },
                                                            vAxis: {minValue: 0},
                                                            // For the legend to fit, we make the chart area smaller
                                                            chartArea: {width: '400', height: 'auto'}
                                                            // lineWidth: 25
                                                        }}
                                                    />
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <div style={{overflow: 'auto', display: '-webkit-box', marginTop: '1rem'}}>
                                        <Grid item style={{marginRight: '3rem'}}>
                                            <Paper className={classes.paper}
                                                   style={{width: 650}}>
                                                <Chart
                                                    width={'auto'}
                                                    height={'400px'}
                                                    chartType="ColumnChart"
                                                    loader={<div>Loading Chart</div>}
                                                    data={users}
                                                    options={{
                                                        title: 'Total Users',
                                                        color: [theme.palette.background.nightRider],
                                                        hAxis: {
                                                            title: 'Month',
                                                            titleTextStyle: {
                                                                color: theme.palette.background.nightRider,
                                                                fontSize: '0.875rem',
                                                                fontWeight: 400
                                                            }
                                                        },
                                                        vAxis: {
                                                            title: 'Amount',
                                                            titleTextStyle: {
                                                                color: theme.palette.background.nightRider,
                                                                fontSize: '0.875rem',
                                                                fontWeight: 400
                                                            },
minValue: 0
                                                        },
                                                        // For the legend to fit, we make the chart area smaller
                                                        chartArea: {width: '400', height: 'auto'}
                                                        // lineWidth: 25
                                                    }}
                                                />
                                            </Paper>
                                        </Grid>
                                        <Grid item style={{marginRight: '3rem'}}>
                                            <Paper className={classes.paper}
                                                   style={{width: 650}}>
                                                <Chart
                                                    width={'auto'}
                                                    height={'400px'}
                                                    chartType="ColumnChart"
                                                    loader={<div>Loading Chart</div>}
                                                    data={stays}
                                                    options={{
                                                        title: 'Stays Listed',
                                                        hAxis: {
                                                            title: 'Month',
                                                            titleTextStyle: {
                                                                color: theme.palette.background.nightRider,
                                                                fontSize: '0.875rem',
                                                                fontWeight: 400
                                                            }
                                                        },
                                                        vAxis: {
                                                            title: 'Amount',
                                                            titleTextStyle: {
                                                                color: theme.palette.background.nightRider,
                                                                fontSize: '0.875rem',
                                                                fontWeight: 400
                                                            },
minValue: 0
                                                        },
                                                        series: [
{
                                                            color: theme.palette.background.irisBlue,
                                                            visibleInLegend: true
                                                        }
],
                                                        // For the legend to fit, we make the chart area smaller
                                                        chartArea: {width: '400', height: 'auto'}
                                                        // lineWidth: 25
                                                    }}
                                                />
                                            </Paper>
                                        </Grid>
                                        <Grid style={{marginRight: '3rem'}}>
                                            <Paper className={classes.paper}
                                                   style={{width: 650}}>
                                                <Chart
                                                    width={'auto'}
                                                    height={'400px'}
                                                    chartType="ColumnChart"
                                                    loader={<div>Loading Chart</div>}
                                                    data={charters}
                                                    options={{
                                                        title: 'Charters Listed',
                                                        hAxis: {
                                                            title: 'Month',
                                                            titleTextStyle: {
                                                                color: theme.palette.background.nightRider,
                                                                fontSize: '0.875rem',
                                                                fontWeight: 400
                                                            }
                                                        },
                                                        vAxis: {
                                                            title: 'Amount',
                                                            titleTextStyle: {
                                                                color: theme.palette.background.nightRider,
                                                                fontSize: '0.875rem',
                                                                fontWeight: 400
                                                            },
minValue: 0
                                                        },
                                                        series: [
{
                                                            color: theme.palette.background.blizzardBlue,
                                                            visibleInLegend: true
                                                        }
],
                                                        // For the legend to fit, we make the chart area smaller
                                                        chartArea: {width: '400', height: 'auto'}
                                                        // lineWidth: 25
                                                    }}
                                                />
                                            </Paper>
                                        </Grid>
                                        <Grid>
                                            <Paper className={classes.paper}
                                                   style={{width: 650}}>
                                                <Chart
                                                    width={'auto'}
                                                    height={'400px'}
                                                    chartType="ColumnChart"
                                                    loader={<div>Loading Chart</div>}
                                                    data={rentals}
                                                    options={{
                                                        title: 'Rentals Listed',

                                                        hAxis: {
                                                            title: 'Month',
                                                            titleTextStyle: {
                                                                color: theme.palette.background.nightRider,
                                                                fontSize: '0.875rem',
                                                                fontWeight: 400
                                                            }
                                                        },
                                                        vAxis: {
                                                            title: 'Amount',
                                                            titleTextStyle: {
                                                                color: theme.palette.background.nightRider,
                                                                fontSize: '0.875rem',
                                                                fontWeight: 400
                                                            },
minValue: 0
                                                        },
                                                        series: [
{
                                                            color: theme.palette.background.cerulean,
                                                            visibleInLegend: true
                                                        }
],
                                                        // For the legend to fit, we make the chart area smaller
                                                        chartArea: {width: '400', height: 'auto'}
                                                        // lineWidth: 25
                                                    }}
                                                />
                                            </Paper>
                                        </Grid>
                                    </div>
                                </div>
                            </>
                        )
                    }}
                />
            </div>
        </>
    )
}
