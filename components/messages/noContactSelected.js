import { Avatar, makeStyles, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { HEIGHT, IMAGE_HEIGHT } from '../navbar/navBar'


function NoContactSelected(props) {
    const [windowHeight, setWindowHeight] = useState(null)

    const useStyles = makeStyles((theme) => ({
        container: {
            height: "100%",
            height: `calc(100vh - 80px - ${  HEIGHT  } - ${  IMAGE_HEIGHT  })`, // 100vh - banner(80) - navbar height - navbar image height
            minHeight: "400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            paddingLeft: 120,
            paddingRight: 120,
            [theme.breakpoints.down("xs")]: {
                paddingLeft: 20,
                paddingRight: 20
            }
        },
        badge: {
            width: windowHeight > 630 ? theme.spacing(40) : theme.spacing(30),
            height: windowHeight > 630 ? theme.spacing(40) : theme.spacing(30),
            fontFamily: "Roboto",
            fontSize: "2.5em",
            margin: 20,
            [theme.breakpoints.down("xs")]: {
                width: theme.spacing(20),
                height: theme.spacing(20)
            }
        },
        subHeader: {
            fontSize: "26px",
            fontWeight: "400",
            textAlign: "center",
            margin: 10,
            [theme.breakpoints.down("xs")]: {
                fontSize: "20px",
                fontWeight: "500"
            }
        },
        text: {
            fontSize: "18px",
            fontWeight: "400",
            textAlign: "center",
            margin: 10,
            [theme.breakpoints.down("xs")]: {
                fontSize: "16px"
            }
        }
    }))
    const classes = useStyles()

    useEffect(() => {
        // only execute all the code below in client side
        if (typeof window !== 'undefined') {
            // Handler to call on window resize
            function handleResize() {
                // Set window width/height to state
                setWindowHeight(window.innerHeight)
            }

            // Add event listener
            window.addEventListener('resize', handleResize)

            // Call handler right away so state gets updated with initial window size
            handleResize()

            // Remove event listener on cleanup
            return () => window.removeEventListener('resize', handleResize)
        }
    }, []) // Empty array ensures that effect is only run on mount

    return (
        <div className={classes.container}>
            <Avatar
                alt="Remy Sharp Avatar"
                src={"/assets/images/mapLogo.png"}
                className={classes.badge}
            >
            </Avatar>
            <Typography className={classes.subHeader}>
                Select a contact
            </Typography>
            <Typography className={classes.text}>
                Your previous message history will be displayed here. To send a message to someone outside of this list, navigate to the "Trips" page.
            </Typography>
        </div>
    )
}

export default NoContactSelected
