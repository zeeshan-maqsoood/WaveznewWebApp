import React from "react"
import Button from "@material-ui/core/Button"
// i18n
import { useRouter } from "next/router"
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import {makeStyles} from "@material-ui/core/styles"
import Divider from "@material-ui/core/Divider"
import theme from "../../src/theme"

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper
    },
    contentContainer: {
        justifyContent: "center",
        display: "flex",
        alignContent: "inherit",
        alignItems: "center",
        color: theme.palette.title.matterhorn,
        fontSize: "18px"
    },
    titleDivider: {
        width: "50%",
        position: "relative",
        left: "27%",
        height: "4px",
        backgroundColor: theme.palette.buttonPrimary.main,
        top: "8%"
    }
}))

const GenericDialogDialog = (props) => {
    const { open, setOpen, title, message, onConfirm, height, width } = props
    const router = useRouter()
    const classes = useStyles()

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleClose()
                    }
                }}
                fullWidth
                maxWidth="sm"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div style={{padding: '2rem'}}>
                    <CloseIcon
                        onClick={handleClose}
                        style={{fontSize: "2rem", cursor: "pointer", float: 'right', top: "5%", position: "relative"}}
                    />
                    <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">
                        <div style={{display: "inline-grid"}}>
                            {title}
                            <Divider className={classes.titleDivider}/>
                        </div>
                    </DialogTitle>
                    <DialogContent style={{width, height}} className={classes.contentContainer}>
                        <div style={{textAlign: "center"}}>
                            {message}
                        </div>
                    </DialogContent>
                    <DialogActions style={{justifyContent: 'center'}}>
                        <Button
                            style={{marginRight: "1rem", color: theme.palette.background.default, backgroundColor: theme.palette.background.flamingo}}
                            variant="contained"
                            onClick={onConfirm}
                        >
                            Delete
                        </Button>
                        <Button onClick={handleClose} variant="outlined" style={{
                            color: theme.palette.buttonPrimary.main,
                            border: "none"
                        }}>Cancel</Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    )
}

export default GenericDialogDialog
