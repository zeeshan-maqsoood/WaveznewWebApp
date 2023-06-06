import React, {Component, useState, useEffect, useContext} from "react"
import {makeStyles} from "@material-ui/core/styles"

// i18n
import {useRouter} from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"

const useStyles = makeStyles({})

export default function TruliooStatus({record, transaction}) {

    const [status, setStatus] = useState({message: "", imageSrc1: "", imageSrc2: ""})

    useEffect(() => {
        console.log('record: ', record)
        console.log('transaction: ', transaction)
        if (transaction) {
            if (transaction.Status !== 'Completed') {
                setStatus({
                    message: "Pending",
                    imageSrc1: "/assets/images/document-verified-pending.png",
                    imageSrc2: "/assets/images/identity-verified-pending.png"
                })
            } else {
                if (record.verifiedRecord && record.verifiedRecord.length > 0) {
                    switch (record.verifiedRecord[0].Record.RecordStatus) {
                        case "match":
                            setStatus({
                                message: "Successfully Verified",
                                imageSrc1: "/assets/images/document-verified-successful.png",
                                imageSrc2: "/assets/images/identity-verified-successful.png"
                            })
                            break
                        case "nomatch":
                            setStatus({
                                message: "Verification Failed",
                                imageSrc1: "/assets/images/document-verified-unsuccessful.png",
                                imageSrc2: "/assets/images/identity-verified-unsuccessful.png"
                            })
                            break
                        default:
                            break
                    }
                }
            }
        }

    }, [])

    useEffect(() => {
    }, [status])

    return (
        <>
            <img src={status.imageSrc1} alt={status.message} height="300px" width="350px"/>
            <h3 style={{textAlign: "center"}}>{status.message}</h3>
            {record.verifiedRecord && record.verifiedRecord[0].Record.RecordStatus === 'nomatch' &&
                <h4>Document has been rejected for the following
                    reasons</h4>} {record.verifiedRecord && record.verifiedRecord[0].Record.RecordStatus === 'nomatch' &&
            <li>Please try again by uploading a clear picture of your ID and a selfie.</li>
        }
        </>
    )
}
