import React, {useState, useEffect} from "react"
import Session from "../../../sessionService"
import {makeStyles} from "@material-ui/core/styles"
import PropTypes from "prop-types"
import {
    AppBar,
    Paper,
    Tabs,
    Tab,
    Grid,
    Select,
    MenuItem,
    FormControl, DialogTitle, DialogContent, DialogActions, Dialog
} from "@material-ui/core"
import {RadioButtonUnchecked, CheckCircle} from '@material-ui/icons'
import API from '../../../pages/api/baseApiIinstance'
import NavBar from "../../../components/navbar/navBar"
import VesselInformation from "../information"
import Photos from "../photos"
import VesselDescription from "../vesselDescription"
import Pricing from "../pricing"
import Verification from "../verification"
import UnsavedChangesWarning from "../../../components/editListing/unsavedChangesWarning"
import {Modal} from "react-responsive-modal"
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
// i18n
import {useRouter} from "next/router"
import en from "../../../locales/en.js"
import fr from "../../../locales/fr.js"
import theme from "../../../src/theme"
import CloseIcon from "@material-ui/icons/Close"
import Divider from "@material-ui/core/Divider"
import Button from "@material-ui/core/Button"

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`
    }
}

const useStyles = makeStyles((theme) => ({
    tabBar: {
        position: "fixed",
        backgroundColor: theme.palette.background.default,
        width: "100%",
        zIndex: 9
    },
    boat_name: {
        fontSize: 24,
        fontWeight: 500,
        font: "Roboto",
        margin: 1,
        padding: 10,
        display: "flex",
        alignItems: "center"
    },
    tab_style: {
        textTransform: "capitalize",
        display: "flex",
        fontSize: 18
    },
    tab_title: {
        paddingLeft: 10
    },
    see_listing: {
        float: "right",
        fontSize: 18,
        color: theme.palette.text.black,
        "&:hover": {
            color: theme.palette.text.black
        }
    },
    publishStatus: {
        height: "40px",
        marginLeft: "15px"
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
        backgroundColor: theme.palette.background.flamingo,
        top: "8%"
    }
}))

const EditListing = (props) => {
    const classes = useStyles()
    const [value, setValue] = useState(0)
    const router = useRouter()
    const {locale} = router
    const t = locale === "en" ? en : fr

    //check submitted or not to change color of checkCircle in top tabs
    const [submitInformation, setSubmitInformation] = useState(false)
    const [submitPhoto, setSubmitPhoto] = useState(false)
    const [submitDescription, setSubmitDescription] = useState(false)
    const [submitPricing, setSubmitPricing] = useState(false)
    const [submitVerification, setSubmitVerification] = useState(false)
    const [verificationColor, setVerificationColor] = useState()
    const [publishStatus, setPublishStatus] = useState("")
    const publishStatusOptions = [
{
        label: t.editListing.statusOptions.publish,
        value: "PUBLISHED"
    }, {label: t.editListing.statusOptions.unpublish, value: "UNPUBLISHED"}
]

    const token = Session.getToken("Wavetoken")
    const [listing, setListing] = useState()

    const [warningOpen, setWarningOpen] = useState(false)
    const [selectedTab, setSelectedTab] = useState(0)
    const [minimumImages, setMinimumImages] = useState(0)
    const [maximumImages, setMaximumImages] = useState(0)
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const mobileBreakpoint = 600
    const [windowSize, setWindowSize] = useState("")
    const [isMobile, setIsMobile] = useState(false)
    const [hintIsOpen, setHintIsOpen] = useState(false)
    //verification tab
    let documents = []
    const [uploadedDocuments, setUploadedDocuments] = useState([])
    const [CRV_GREATER, setCRV_GREATER] = useState()
    const [SVOP_MED_SDV_BS_LESS_EQUAL, setSVOP_MED_SDV_BS_LESS_EQUAL] = useState()
    const [Limited_MASTER_60_MED_SDV_BS_LESS, setLimited_MASTER_60_MED_SDV_BS_LESS] = useState()
    const [MASTER_150_MED_BST_LESS_EQUAL, setMASTER_150_MED_BST_LESS_EQUAL] = useState()
    const [MASTER_500_MED_BST_LESS_EQUAL, setMASTER_500_MED_BST_LESS_EQUAL] = useState()
    const [CRV_GREATER_PASSENGER, setCRV_GREATER_PASSENGER] = useState()
    const [requiredDocuments, setRequiredDocuments] = useState([])
    const [truliooVerification, setTruliooVerification] = useState()
    const [tripsActive, setTripsActive] = useState(true)
    const [openUnPublishWarningDialog, setOpenUnPublishWarningDialog] = useState(false)
    const [unPublishDialogMessage, setUnPublishDialogMessage] = useState("")

    const handleSubmitInformation = (newValueFromChild) => {
        setSubmitInformation(newValueFromChild)
    }

    const handleSubmitPhoto = (newValueFromChild) => {
        setSubmitPhoto(newValueFromChild)
    }

    const handleSubmitDescription = (newValueFromChild) => {
        setSubmitDescription(newValueFromChild)
    }

    const handleSubmitPricing = (newValueFromChild) => {
        setSubmitPricing(newValueFromChild)
    }

    const handleSubmitVerification = (newValueFromChild) => {
        setSubmitVerification(newValueFromChild)
    }

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue)
        unsavedChanges ? setWarningOpen(true) : updateTab(newValue)
    }

    const updateTab = (newTab = selectedTab) => {
        setValue(newTab)
        setWarningOpen(false)
    }

    const updateUnsavedChanges = (newValue) => {
        setUnsavedChanges(newValue)
    }

    const renderTab = () => {
        if (value === 0) {
            return <VesselInformation listingStartValue={listing} getListingInfo={getListingInfo} nextPage={nextPage}
                                      setUnsavedChanges={updateUnsavedChanges} onSubmit={handleSubmitInformation}
                                      hintIsOpen={hintIsOpen} setHintIsOpen={(value) => setHintIsOpen(value)}/>
        } else if (value === 1) {
            return <Photos listingStartValue={listing} getListingInfo={getListingInfo} onSubmit={handleSubmitPhoto}
                           nextPage={nextPage} setUnsavedChanges={updateUnsavedChanges}/>
        } else if (value === 2) {
            return <VesselDescription listingStartValue={listing} getListingInfo={getListingInfo} nextPage={nextPage}
                                      setUnsavedChanges={updateUnsavedChanges} onSubmit={handleSubmitDescription}
                                      isMobile={isMobile} hintIsOpen={hintIsOpen}
                                      setHintIsOpen={(value) => setHintIsOpen(value)}/>
        } else if (value === 3) {
            return <Pricing listingStartValue={listing} getListingInfo={getListingInfo} nextPage={nextPage}
                            onSubmit={handleSubmitPricing} setUnsavedChanges={updateUnsavedChanges} isMobile={isMobile}
                            hintIsOpen={hintIsOpen} setHintIsOpen={(value) => setHintIsOpen(value)}/>
        } else if (value === 4) {
            return <Verification listingStartValue={listing} getListingInfo={getListingInfo}
                                 setUnsavedChanges={updateUnsavedChanges} onSubmit={handleSubmitVerification}
                                 isMobile={isMobile} hintIsOpen={hintIsOpen}
                                 setHintIsOpen={(value) => setHintIsOpen(value)}
                                 documents={requiredDocuments} updateCheckMark={() => checkSubmitVerification()}
                                 getUploadedDocuments={() => getAllDocument()}
                                 startingUploadedDocuments={uploadedDocuments}
                                 trulioo={truliooVerification} getTransactionStatus={() => getTransactionStatus()}/>
        }
    }

    const getAllDocument = () => {
        API()
            .get(`vessel/document/${listing?._id}`, {
                headers: {
                    authorization: `Bearer ${  token}`
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    setUploadedDocuments(response.data)
                }
            })
            .catch((e) => {
                console.log("Error from get all doc files is: ", e)
                // router.push("/somethingWentWrong");
            })
    }

    const nextPage = () => {
        setValue(currValue => currValue + 1)
    }

    const getConditionValue = () => {
        API()
            .get(`configuration`)
            .then((response) => {
                if (response.status === 200) {
                    setCRV_GREATER(response.data.find((item) => item.key === "CRV_GREATER")?.numberValue) // 15GT
                    setSVOP_MED_SDV_BS_LESS_EQUAL(response.data.find((item) => item.key === "SVOP_MED_SDV_BS_LESS_EQUAL")?.numberValue) //32
                    setLimited_MASTER_60_MED_SDV_BS_LESS(response.data.find((item) => item.key === "Limited_MASTER_60_MED_SDV_BS_LESS")?.numberValue) //65
                    setMASTER_150_MED_BST_LESS_EQUAL(response.data.find((item) => item.key === "MASTER_150_MED_BST_LESS_EQUAL")?.numberValue) //160
                    setMASTER_500_MED_BST_LESS_EQUAL(response.data.find((item) => item.key === "MASTER_500_MED_BST_LESS_EQUAL")?.numberValue) //828
                    setCRV_GREATER_PASSENGER(response.data.find((item) => item.key === "CRV_GREATER_PASSENGER")?.numberValue)
                }
            })
            .catch((e) => {
                console.log("Error from getting CONFIGURATION is: ", e)
            })
    }

    const convertGT2Lb = (value) => {
        return value * 2240 // t ton = 2240 lb
    }

    const getRecord = () => {
        API()
            .get(`/docv/getVRecordByUserId`, {
                headers: {
                    authorization: `Bearer ${  token}`
                }
            })
            .then((response) => {
                if (response?.data?.verifiedRecord[0]?.CountryCode === "CA") {
                    const record = response.data
                    if (record?.verifiedRecord && record.verifiedRecord.length > 0) {
                        switch (record.verifiedRecord[0].Record.RecordStatus) {
                            case "match":
                                setTruliooVerification({isProvided: true, status: "APPROVED"})
                                break
                            case "nomatch":
                                setTruliooVerification({
                                    isProvided: true,
                                    status: "REJECTION",
                                    reason: "Record not match. Please reupload."
                                })
                                break
                            default:
                                break
                        }
                    }
                } else {
                    setTruliooVerification({isProvided: false})
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
    }

    const getTransactionStatus = () => {
        API()
            .get(`/docv/transaction`, {
                headers: {
                    authorization: `Bearer ${  token}`
                }
            })
            .then((response) => {
                if (response.data) {
                    if (response.data.success === false) {
                        //not provided document yet
                        setTruliooVerification({isProvided: false})
                        
                    } else if (response.data.Status !== "Completed") {
                        setTruliooVerification({isProvided: true, status: "PENDING"})
                    } else {
                        getRecord()
                    }
                }
            })
            .catch((e) => {
                console.log("Configuration Not found: ", e)
            })
    }

    const findDoc = (object) => {
        const returnArray = []

        if (object.proofOfId.required) {
            returnArray.push({name: t.editListing.verification.proofOfID, shortForm: "ProofOfId", isRequired: true})
        } else if (object.proofOfId.optional) {
            returnArray.push({name: t.editListing.verification.proofOfID, shortForm: "ProofOfId", isRequired: false})
        }

        if (object.vesselDriversLicense.required) {
            returnArray.push({
                name: t.editListing.verification.pcocFront,
                shortForm: "VesselDriversLicense_front",
                isRequired: true
            })
            returnArray.push({
                name: t.editListing.verification.pcocBack,
                shortForm: "VesselDriversLicense_back",
                isRequired: true
            })
        } else if (object.vesselDriversLicense.optional) {
            returnArray.push({
                name: t.editListing.verification.pcocFront,
                shortForm: "VesselDriversLicense_front",
                isRequired: false
            })
            returnArray.push({
                name: t.editListing.verification.pcocBack,
                shortForm: "VesselDriversLicense_back",
                isRequired: false
            })
        }

        if (object.vesselLicense.required) {
            returnArray.push({name: t.editListing.verification.pcl, shortForm: "VesselLicense", isRequired: true})
        } else if (object.vesselLicense.optional) {
            returnArray.push({name: t.editListing.verification.pcl, shortForm: "VesselLicense", isRequired: false})
        }

        if (object.vesselSafety.required) {
            returnArray.push({name: t.editListing.verification.pccp, shortForm: "VesselSafety", isRequired: true})
        } else if (object.vesselSafety.optional) {
            returnArray.push({name: t.editListing.verification.pccp, shortForm: "VesselSafety", isRequired: false})
        }

        if (object.serialNumber.required) {
            returnArray.push({
                name: t.editListing.verification.serialNumer,
                shortForm: "SerialNumber",
                isRequired: true
            })
        } else if (object.serialNumber.optional) {
            returnArray.push({
                name: t.editListing.verification.serialNumer,
                shortForm: "SerialNumber",
                isRequired: false
            })
        }

        return returnArray
    }

    const determineDocuments = () => {
        const vesselType = listing?.vesselType
        const weight = listing?.vesselWeight?.weight
        const unit = listing?.vesselWeight?.unit
        const numberOfPassengers = listing?.numberOfPassengers
        if (listing?.vesselCategory && listing?.vesselCategory?.length !== 0) {
        listing?.vesselCategory?.map((item) => {
            //rental
            if (item?.isRental && vesselType === "RENTAL") {
                const rentalFiles = findDoc(item.rental)
                documents = documents.concat(rentalFiles)
            }
            //stay
            if (item?.isStay && vesselType === "STAY") {
                const stayFiles = findDoc(item.stay)
                documents = documents.concat(stayFiles)
            }
            //charter
            if (item?.isCharter && vesselType === "CHARTER") {
                const charterOBject = item?.charter
                //serial number
                if (charterOBject?.serialNumber?.required) {
                    documents.push({
                        name: t.editListing.verification.serialNumer,
                        shortForm: "SerialNumber",
                        isRequired: true
                    })
                } else if (charterOBject?.serialNumber?.optional) {
                    documents.push({
                        name: t.editListing.verification.serialNumer,
                        shortForm: "SerialNumber",
                        isRequired: false
                    })
                }

                //proof of id
                if (charterOBject?.proofOfId?.required) {
                    documents.push({
                        name: t.editListing.verification.proofOfID,
                        shortForm: "ProofOfId",
                        isRequired: true
                    })
                } else if (charterOBject?.proofOfId?.optional) {
                    documents.push({
                        name: t.editListing.verification.proofOfID,
                        shortForm: "ProofOfId",
                        isRequired: false
                    })
                }

                //proof for Criminal Background Check
                documents.push({
                    name: t.editListing.verification.vss,
                    shortForm: "CriminalBackgroundCheck",
                    isRequired: true
                })
                //vessel driver license
                if (charterOBject?.vesselDriversLicense?.required) {
                    if ((weight <= SVOP_MED_SDV_BS_LESS_EQUAL && unit === "GT") || (weight <= convertGT2Lb(SVOP_MED_SDV_BS_LESS_EQUAL) && unit === "lbs")) {
                        documents.push({
                            name: t.editListing.verification.svop,
                            shortForm: "VesselDriversLicense_svop",
                            isRequired: true
                        })
                        documents.push({
                            name: t.editListing.verification.med_sdv_bs,
                            shortForm: "VesselDriversLicense_med_sdv_bs",
                            isRequired: true
                        })
                    } else if ((weight > SVOP_MED_SDV_BS_LESS_EQUAL && weight <= Limited_MASTER_60_MED_SDV_BS_LESS && unit === "GT") || (weight > convertGT2Lb(SVOP_MED_SDV_BS_LESS_EQUAL) && weight <= convertGT2Lb(Limited_MASTER_60_MED_SDV_BS_LESS) && unit === "lbs")) {
                        documents.push({
                            name: t.editListing.verification.limited_master_60,
                            shortForm: "VesselDriversLicense_limited60",
                            isRequired: true
                        })
                        documents.push({
                            name: t.editListing.verification.med_sdv_bs,
                            shortForm: "VesselDriversLicense_med_sdv_bs",
                            isRequired: true
                        })
                    } else if ((weight > Limited_MASTER_60_MED_SDV_BS_LESS && weight <= MASTER_150_MED_BST_LESS_EQUAL && unit === "GT") || (weight > convertGT2Lb(Limited_MASTER_60_MED_SDV_BS_LESS) && weight <= convertGT2Lb(MASTER_150_MED_BST_LESS_EQUAL) && unit === "lbs")) {
                        documents.push({
                            name: t.editListing.verification.master_150_gt,
                            shortForm: "VesselDriversLicense_master150",
                            isRequired: true
                        })
                        documents.push({
                            name: t.editListing.verification.med_bst,
                            shortForm: "VesselDriversLicense_med_bst",
                            isRequired: true
                        })
                    } else if ((weight > MASTER_150_MED_BST_LESS_EQUAL && weight <= MASTER_500_MED_BST_LESS_EQUAL && unit === "GT") || (weight > convertGT2Lb(MASTER_150_MED_BST_LESS_EQUAL) && weight <= convertGT2Lb(MASTER_500_MED_BST_LESS_EQUAL) && unit === "lbs")) {
                        documents.push({
                            name: t.editListing.verification.master_500_gt,
                            shortForm: "VesselDriversLicense_master500",
                            isRequired: true
                        })
                        documents.push({
                            name: t.editListing.verification.med_bst,
                            shortForm: "VesselDriversLicense_med_bst",
                            isRequired: true
                        })
                    }
                } else if (charterOBject?.vesselDriversLicense?.optional) {
                    if ((weight <= SVOP_MED_SDV_BS_LESS_EQUAL && unit === "GT") || (weight <= convertGT2Lb(SVOP_MED_SDV_BS_LESS_EQUAL) && unit === "lbs")) {
                        documents.push({
                            name: t.editListing.verification.svop,
                            shortForm: "VesselDriversLicense_svop",
                            isRequired: false
                        })
                        documents.push({
                            name: t.editListing.verification.med_sdv_bs,
                            shortForm: "VesselDriversLicense_med_sdv_bs",
                            isRequired: false
                        })
                    } else if ((weight > SVOP_MED_SDV_BS_LESS_EQUAL && weight <= Limited_MASTER_60_MED_SDV_BS_LESS && unit === "GT") || (weight > convertGT2Lb(SVOP_MED_SDV_BS_LESS_EQUAL) && weight <= convertGT2Lb(Limited_MASTER_60_MED_SDV_BS_LESS) && unit === "lbs")) {
                        documents.push({
                            name: t.editListing.verification.limited_master_60,
                            shortForm: "VesselDriversLicense_limited60",
                            isRequired: false
                        })
                        documents.push({
                            name: t.editListing.verification.med_sdv_bs,
                            shortForm: "VesselDriversLicense_med_sdv_bs",
                            isRequired: false
                        })
                    } else if ((weight > Limited_MASTER_60_MED_SDV_BS_LESS && weight <= MASTER_150_MED_BST_LESS_EQUAL && unit === "GT") || (weight > convertGT2Lb(Limited_MASTER_60_MED_SDV_BS_LESS) && weight <= convertGT2Lb(MASTER_150_MED_BST_LESS_EQUAL) && unit === "lbs")) {
                        documents.push({
                            name: t.editListing.verification.master_150_gt,
                            shortForm: "VesselDriversLicense_master150",
                            isRequired: false
                        })
                        documents.push({
                            name: t.editListing.verification.med_bst,
                            shortForm: "VesselDriversLicense_med_bst",
                            isRequired: false
                        })
                    } else if ((weight > MASTER_150_MED_BST_LESS_EQUAL && weight <= MASTER_500_MED_BST_LESS_EQUAL && unit === "GT") || (weight > convertGT2Lb(MASTER_150_MED_BST_LESS_EQUAL) && weight <= convertGT2Lb(MASTER_500_MED_BST_LESS_EQUAL) && unit === "lbs")) {
                        documents.push({
                            name: t.editListing.verification.master_500_gt,
                            shortForm: "VesselDriversLicense_master500",
                            isRequired: false
                        })
                        documents.push({
                            name: t.editListing.verification.med_bst,
                            shortForm: "VesselDriversLicense_med_bst",
                            isRequired: false
                        })
                    }
                }
                //vessel license
                if (charterOBject?.vesselLicense?.required) {
                    if (((weight <= CRV_GREATER && unit === "GT") || (weight <= convertGT2Lb(CRV_GREATER) && unit === "lbs")) && numberOfPassengers <= CRV_GREATER_PASSENGER) {
                        documents.push({
                            name: t.editListing.verification.svr,
                            shortForm: "VesselLicense_svr",
                            isRequired: true
                        })
                    } else if (((weight > CRV_GREATER && unit === "GT") || (weight > convertGT2Lb(CRV_GREATER) && unit === "lbs")) || numberOfPassengers > CRV_GREATER_PASSENGER) {
                        documents.push({
                            name: t.editListing.verification.crv,
                            shortForm: "VesselLicense_crv",
                            isRequired: true
                        })
                    }
                } else if (charterOBject?.vesselLicense?.optional) {
                    if (((weight <= CRV_GREATER && unit === "GT") || (weight <= convertGT2Lb(CRV_GREATER) && unit === "lbs")) && numberOfPassengers <= CRV_GREATER_PASSENGER) {
                        documents.push({
                            name: t.editListing.verification.svr,
                            shortForm: "VesselLicense_svr",
                            isRequired: false
                        })
                    } else if (((weight > CRV_GREATER && unit === "GT") || (weight > convertGT2Lb(CRV_GREATER) && unit === "lbs")) || numberOfPassengers > CRV_GREATER_PASSENGER) {
                        documents.push({
                            name: t.editListing.verification.crv,
                            shortForm: "VesselLicense_crv",
                            isRequired: false
                        })
                    }
                }
                //vessel safety
                if (charterOBject?.vesselSafety?.required) {
                    if (((weight <= CRV_GREATER && unit === "GT") || (weight <= convertGT2Lb(CRV_GREATER) && unit === "lbs")) && numberOfPassengers <= CRV_GREATER_PASSENGER) {
                        documents.push({
                            name: t.editListing.verification.svcp,
                            shortForm: "VesselSafety_svcp",
                            isRequired: true
                        })
                    } else if (((weight > CRV_GREATER && unit === "GT") || (weight > convertGT2Lb(CRV_GREATER) && unit === "lbs")) || numberOfPassengers > CRV_GREATER_PASSENGER) {
                        documents.push({
                            name: t.editListing.verification.transportCanada,
                            shortForm: "VesselSafety_transport",
                            isRequired: true
                        })
                    }
                } else if (charterOBject?.vesselSafety?.optional) {
                    if (((weight <= CRV_GREATER && unit === "GT") || (weight <= convertGT2Lb(CRV_GREATER) && unit === "lbs")) && numberOfPassengers <= CRV_GREATER_PASSENGER) {
                        documents.push({
                            name: t.editListing.verification.svcp,
                            shortForm: "VesselSafety_svcp",
                            isRequired: false
                        })
                    } else if (((weight > CRV_GREATER && unit === "GT") || (weight > convertGT2Lb(CRV_GREATER) && unit === "lbs")) || numberOfPassengers > CRV_GREATER_PASSENGER) {
                        documents.push({
                            name: t.editListing.verification.transportCanada,
                            shortForm: "VesselSafety_transport",
                            isRequired: false
                        })
                    }
                }
            }
        })
        }
        //handle duplications
        const documentShortForms = []
        documents.map(item => {
            documentShortForms.push(item.shortForm)
        })
        const uniqueShortForms = [...new Set(documentShortForms)]
        const unique = []
        uniqueShortForms.map(item => {
            const arr = documents.filter(doc => doc.shortForm === item)
            // more than 1 document with the shortForm
            if (arr.length > 1) {
                const firstIsRequired = arr[0].isRequired
                if (arr.filter(item => item.isRequired === firstIsRequired).length !== arr.length) {
                    unique.push(documents.find(i => i.shortForm === item && i.isRequired === true))
                } else {
                    //all documents have same shortForm and isREquired
                    unique.push(documents.find(i => i.shortForm === item))
                }
            } else {
                //only 1 unique document with the current shortform
                unique.push(documents.find(i => i.shortForm === item))
            }
        })
        setRequiredDocuments(unique)
    }

    const checkSubmitVerification = () => {
        let submit = true
        if (requiredDocuments?.length === 0 || requiredDocuments?.length === undefined || uploadedDocuments?.length === 0 || uploadedDocuments?.length === undefined) {
            submit = false
        } else {
            requiredDocuments.map((item) => {
                if (item.shortForm !== "SerialNumber" && item.shortForm !== "ProofOfId" && item.isRequired && uploadedDocuments?.find((doc) => item.shortForm === doc.fileType) === undefined) {
                    submit = false
                    
                } else if (item.shortForm === "SerialNumber" && item.isRequired && (listing?.serialNumber === undefined || listing?.serialNumber?.length === 0)) {
                    submit = false
                    
                } else if (item.shortForm === "ProofOfId" && truliooVerification?.isProvided === false) {
                    submit = false
                    
                }
            })

            setSubmitVerification(submit)

            if (submit === true && uploadedDocuments?.length > 0) {
                if (uploadedDocuments.filter(item => item.status === "REJECTION").length > 0 || truliooVerification?.status === "REJECTION") {
                    setVerificationColor(theme.palette.background.flamingo)
                    
                } else if (uploadedDocuments.filter(item => item.status === "PENDING").length > 0 || truliooVerification?.status === "PENDING") {
                    setVerificationColor(theme.palette.text.amber)
                    
                } else {
                    setVerificationColor(theme.palette.background.eucalyptus)
                    
                }
            }
        }
    }

    useEffect(() => {
        if (listing?._id) {
            API()
                .put(`${listing?.vesselType.toLowerCase()  }s/${  listing?._id}`, {allDocumentsCat: requiredDocuments}, {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                })
                .then((response) => {
                    if (response.status = 200) {
                    }
                })
                .catch((e) => {
                    console.log(e)
                    // router.push("/somethingWentWrong");
                })
        }

    }, [listing?.vesselCategory, listing?.numberOfPassengers, listing?.vesselWeight?.weight, listing?.vesselWeight?.unit])

    useEffect(() => {
        checkSubmitVerification()
    }, [uploadedDocuments, requiredDocuments, truliooVerification])

    useEffect(() => {
        determineDocuments()
    }, [listing, CRV_GREATER_PASSENGER])

    useEffect(() => {
        // only execute all the code below in client side
        if (typeof window !== "undefined") {
            // Handler to call on window resize
            function handleResize() {
                // Set window width/height to state
                setWindowSize(window.innerWidth)
                window.innerWidth <= mobileBreakpoint ? setIsMobile(true) : setIsMobile(false)
            }

            // Add event listener
            window.addEventListener("resize", handleResize)

            // Call handler right away so state gets updated with initial window size
            handleResize()

            // Remove event listener on cleanup
            return () => window.removeEventListener("resize", handleResize)
        }
    }, []) // Empty array ensures that effect is only run on mount

    useEffect(() => {
        getMinPhotoNum()
        getMaxPhotoNum()
        getListingInfo()
        getConditionValue()
        setTruliooVerification()
        getTransactionStatus()
    }, [router])

    const getMinPhotoNum = () => {
        API()
            .get(`configuration/PHOTO_MINIMUM_NUMBER`)
            .then((response) => {
                console.log("PHOTO_MINIMUM_NUMBER: ", response.data)
                setMinimumImages(response.data.numberValue)
            })
            .catch((e) => {
                console.log("Error from getting PHOTO_MINIMUM_NUMBER: ", e)
            })
    }
    const getMaxPhotoNum = () => {
        API()
            .get(`configuration/PHOTO_MAXIMUM_NUMBER`)
            .then((response) => {
                console.log("PHOTO_MAXIMUM_NUMBER: ", response.data)
                setMaximumImages(response.data.numberValue)
            })
            .catch((e) => {
                console.log("Error from getting PHOTO_MAXIMUM_NUMBER: ", e)
            })
    }

    useEffect(() => {
        if (listing?.description && (listing?.type !== "RENTAL" || listing?.vesselPlacement)) { // set vessel information tab checkmark
            setSubmitInformation(true)
        }
        if (listing?.vesselBrand && listing?.vesselModelInfo && listing?.vesselLength && listing?.vesselWeight?.weight && listing?.vesselWeight?.unit
            && listing?.vesselMaxSpeed && listing?.vesselHorsePower && listing?.vesselFuelType) { // set vessel description tab checkmark
            setSubmitDescription(true)
        }
        if (listing?.images?.length >= minimumImages && listing?.images?.length <= maximumImages) { // set vessel description tab checkmark
            setSubmitPhoto(true)
        }
        if (listing?.vesselPricing) {
            setSubmitPricing(true)
        }
        if (listing) {
            getAllDocument()
        }
    }, [listing])

    const getListingInfo = () => {
        if (router.asPath !== router.route) {
            const vesselType = router.query.type
            const vesselId = router.query.id
            //GET API based on vessel Type
            let getListingById = () => {
            }
            getListingById = () => {
                API()
                    .get(`${vesselType.toLowerCase()}s/${vesselId}`, {
                        headers: {
                            authorization: `Bearer ${  token}`
                        }
                    })
                    .then((response) => {
                        setListing(response.data)
                        console.log("Listng in general : ", response.data)
                        setPublishStatus(response.data?.vesselStatus)
                    })
            }
            try {
                getListingById() // call GET by ID based on vessel type
            } catch (err) {
                console.log("Error: ", err)
                // router.push("/somethingWentWrong");
            }
        }
    }

    const updatePublishStatus = async (value) => {
        if (value === "UNPUBLISHED") {
            try {
                const response = await API().get(`trip/checkIfVesselHasPendingTrips/${listing._id}`, {
                    headers: {
                        authorization: `Bearer ${  token}`
                    }
                })
                const tripsActiveForVessel = !!response?.data?.tripsActive
                if (!tripsActiveForVessel) {
                    requestUpdateVesselPublishStatus(value)
                } else {
                    setOpenUnPublishWarningDialog(true)
                    setUnPublishDialogMessage("Cannot Unpublish this Vessel as it has some Ongoing or Upcoming Trips")
                }
            } catch (er) {
                console.log("error getting the trips for the vessel")
                setOpenUnPublishWarningDialog(true)
                setUnPublishDialogMessage("Error checking if there are any existing trips for unpublishing the vessel")
            }
        } else if (value === "PUBLISHED") {
            requestUpdateVesselPublishStatus(value)
        }
    }

    const requestUpdateVesselPublishStatus = (val) => {
        setPublishStatus(val)
        const body = {
            vesselStatus: val
        }
        API()
            .put(`${listing.vesselType.toLowerCase()  }s/${  listing._id}`, body, {
                headers: {
                    authorization: `Bearer ${  token}`
                }
            })
            .then((response) => {
                console.log("publish status update response: ", response)
            })
            .catch((e) => {
                console.log("error while updating vessel status", e)
            })
    }

    const handleUnPublishDialogClose = () => {
        setOpenUnPublishWarningDialog(false)
        setUnPublishDialogMessage("")
    }

    return (
        <>
            <NavBar/>
            <div className={classes.tabBar}>
                <Paper className={classes.boat_name}>
                    <Grid container>
                        <Grid item xs={10} sm={8} style={{display: "flex", alignItems: "center"}}>
                            {listing?.title}{isMobile && value !== 1 &&
                            <HelpOutlineIcon onClick={() => setHintIsOpen(true)} style={{marginLeft: 5}}/>}
                            <FormControl>
                                <Select
                                    variant="outlined"
                                    className={classes.publishStatus}
                                    value={publishStatus || ""}
                                    renderValue={() => {
                                        return publishStatus
                                    }} // shows the selected value if it is not in the options or is not visible
                                    displayEmpty
                                    onChange={(event) => updatePublishStatus(event?.target?.value)}
                                    // onChange={(event) => { setVesselFuelType(event?.target?.value), setUnsavedChanges(true), setFuelTypeIsValid(true) }}
                                >
                                    {/* {publishStatusOptions.map((statusItem) => (
                    <MenuItem key={statusItem.value} value={statusItem.value}>{statusItem.label}</MenuItem>
                  ))} */}
                                    {submitInformation && submitPhoto && submitDescription && submitPricing && submitVerification && verificationColor === "#27AE60" &&
                                        <MenuItem key={"PUBLISHED"}
                                                  value={"PUBLISHED"}>{t.editListing.statusOptions.publish}</MenuItem>}
                                    <MenuItem key={"UNPUBLISHED"}
                                              value={"UNPUBLISHED"}>{t.editListing.statusOptions.unpublish}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} sm={4}>
                            <a href="/yourListings" className={classes.see_listing}>{t.yourListingsPage.seeAll}</a>
                        </Grid>
                    </Grid>
                </Paper>
                <Paper>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="on"
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            <Tab label={<>
                                <div className={classes.tab_style}>{submitInformation ?
                                    <CheckCircle style={{color: theme.palette.background.eucalyptus}}/> :
                                    <RadioButtonUnchecked/>}<span
                                    className={classes.tab_title}>{t.editListing.vesselInformation.header}</span></div>
                            </>} {...a11yProps(0)} />
                            <Tab label={<>
                                <div className={classes.tab_style}>{submitPhoto ?
                                    <CheckCircle style={{color: theme.palette.background.eucalyptus}}/> :
                                    <RadioButtonUnchecked/>}<span
                                    className={classes.tab_title}>{t.editListing.photo.header}</span>
                                </div>
                            </>}  {...a11yProps(1)} />
                            <Tab label={<>
                                <div className={classes.tab_style}>{submitDescription ?
                                    <CheckCircle style={{color: theme.palette.background.eucalyptus}}/> :
                                    <RadioButtonUnchecked/>}<span
                                    className={classes.tab_title}>{t.editListing.vesselDescription.header}</span></div>
                            </>} {...a11yProps(2)} />
                            <Tab label={<>
                                <div className={classes.tab_style}>{submitPricing ?
                                    <CheckCircle style={{color: theme.palette.background.eucalyptus}}/> :
                                    <RadioButtonUnchecked/>}<span
                                    className={classes.tab_title}>{t.editListing.pricing.header}</span>
                                </div>
                            </>} {...a11yProps(3)} />
                            <Tab label={<>
                                <div className={classes.tab_style}>{submitVerification ?
                                    <CheckCircle style={{color: verificationColor}}/> : <RadioButtonUnchecked/>}<span
                                    className={classes.tab_title}>{t.editListing.verification.header}</span></div>
                            </>} {...a11yProps(4)} />
                        </Tabs>
                    </AppBar>
                </Paper>
            </div>
            < Modal
                open={warningOpen}
                onClose={() => setWarningOpen(false)}
                classNames={{
                    modal: classes.customModal
                }}
                center
            >
                <UnsavedChangesWarning closeModal={() => setWarningOpen(false)} leavePage={() => updateTab()}/>
            </Modal>
            <Dialog
                open={openUnPublishWarningDialog}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleUnPublishDialogClose()
                    }
                }}
                fullWidth
                maxWidth="sm"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div style={{padding: '2rem'}}>
                    <CloseIcon
                        onClick={handleUnPublishDialogClose}
                        style={{fontSize: "2rem", cursor: "pointer", float: 'right', top: "5%", position: "relative"}}
                    />
                    <DialogTitle style={{textAlign: 'center'}} id="alert-dialog-title">
                        <div style={{display: "inline-grid"}}>
                            ERROR
                            <Divider className={classes.titleDivider}/>
                        </div>
                    </DialogTitle>
                    <DialogContent className={classes.contentContainer}>
                        <div style={{textAlign: "center"}}>
                            {unPublishDialogMessage}
                        </div>
                    </DialogContent>
                    <DialogActions style={{justifyContent: 'center'}}>
                        <Button onClick={handleUnPublishDialogClose} variant="outlined" style={{
                            color: theme.palette.buttonPrimary.main,
                            border: "none"
                        }}>Close</Button>
                    </DialogActions>
                </div>
            </Dialog>
            <Grid item xs={12}>{renderTab()}</Grid>
        </>
    )
}
export default EditListing
