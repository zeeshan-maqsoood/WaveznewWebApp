import React, {useEffect, useState} from "react"
import {makeStyles} from "@material-ui/core/styles"
// i18n
import {useRouter} from "next/router"
import {
    Backdrop,
    Button,
    Card,
    CardContent, CircularProgress,
    CardMedia,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    FormHelperText
} from "@material-ui/core"
import ControlPointIcon from "@material-ui/icons/ControlPoint"
import DateFnsUtils from "@date-io/date-fns"
import {KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"
import ProofFormBanner from "./proofFormBanner.js"
import {Autocomplete} from "@material-ui/lab"
import API from "../../pages/api/baseApiIinstance"
import Session from "../../sessionService"
import MapAutocomplete from "../../components/editListing/mapAutocomplete"
import moment from "moment"
import QRCode from "qrcode.react"
import en from "../../locales/en"
import fr from "../../locales/fr"
import {io} from "socket.io-client"
import theme from "../../src/theme"
import CryptoJS from "crypto-js"
import {Modal} from "react-responsive-modal"
import Image from "next/image"
import clearForm from "../addList/api/clearForm"

const captureTypeOption = [
    {value: 'DocumentFront', label: 'ID Document Front'},
    {value: 'DocumentBack', label: 'ID Document Back'},
    {value: 'LivePhoto', label: 'Live Photo'},
    {value: 'Passport', label: 'Passport'},
    {value: 'GenericDocument', label: 'Generic Document'}
]

const startMessage = 'Starting GlobalGateway Capture'
const defaultTimeout = 15 * 1000
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        fontFamily: "Roboto",
        color: "#4F4F4F"
    },
    bottomNav: {
        position: "fixed",
        bottom: 0,
        left: 0,
        backgroundColor: theme.palette.background.default,
        height: 70,
        width: "100%"
    },
    submitButton: {
        backgroundColor: theme.palette.buttonPrimary.main,
        color: theme.palette.background.default,
        justifyContent: "center",
        "&:hover": {
            backgroundColor: theme.palette.buttonPrimary.main
        }
    },
    navbtn: {
        backgroundColor: theme.palette.background.default,
        display: "flex",
        width: "100%",
        alignItems: "center"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    },
    topPadding: {
        paddingTop: 30
    },
    inputField: {
        width: "-webkit-fill-available"
    },
    centerInput: {
        textAlign: "center",
        margin: "auto"
    },
    centerInstruction: {
        textAlign: "center"
    },
    paper: {
        margin: 50,
        paddingBottom: 50
    },
    photoCard: {
        height: 350,
        width: 370,
        [theme.breakpoints.down("sm")]: {
            height: 220,
            width: 240
        }
    },
    hideInput: {
        width: "0.1px",
        height: "2.1px",
        opacity: 0,
        overflow: "hidden",
        position: "absolute",
        zIndex: "-1"
    },
    option: {
        fontSize: 15,
        '& > span': {
            marginRight: 10,
            fontSize: 18
        }
    },
    customModal: {
        height: 520,
        width: 500
    },
    textMargin: {
        lineHeight: 1.5
    }
}))

const ProofForm = ({close, isOwner}) => {
    console.log('isOwner: ', isOwner)
    const classes = useStyles()
    const router = useRouter()
    const {locale} = router
    const t = locale === 'en' ? en : fr
    const socket = io(process.env.socketBackendUrl)
    const genderList = [t.truliooVerification.male, t.truliooVerification.female, t.truliooVerification.other]
    const mobileBreakpoint = 600
    let countries = [
        {label: "Afghanistan", code: "AF"},
        {label: "Albania", code: "AL"},
        {label: "Netherland Antilles", code: "AN"},
        {label: "Czechoslovakia", code: "CS"},
        {label: "Kosovo", code: "XK"},
        {label: "Åland Islands", code: "AX"},
        {label: "Algeria", code: "DZ"},
        {label: "American Samoa", code: "AS"},
        {label: "Andorra", code: "AD"},
        {label: "Angola", code: "AO"},
        {label: "Anguilla", code: "AI"},
        {label: "Antarctica", code: "AQ"},
        {label: "Antigua and Barbuda", code: "AG"},
        {label: "Argentina", code: "AR"},
        {label: "Armenia", code: "AM"},
        {label: "Aruba", code: "AW"},
        {label: "Australia", code: "AU"},
        {label: "Austria", code: "AT"},
        {label: "Azerbaijan", code: "AZ"},
        {label: "Bahamas (the)", code: "BS"},
        {label: "Bahrain", code: "BH"},
        {label: "Bangladesh", code: "BD"},
        {label: "Barbados", code: "BB"},
        {label: "Belarus", code: "BY"},
        {label: "Belgium", code: "BE"},
        {label: "Belize", code: "BZ"},
        {label: "Benin", code: "BJ"},
        {label: "Bermuda", code: "BM"},
        {label: "Bhutan", code: "BT"},
        {label: "Bolivia (Plurinational State of)", code: "BO"},
        {label: "Bonaire, Sint Eustatius and Saba", code: "BQ"},
        {label: "Bosnia and Herzegovina", code: "BA"},
        {label: "Botswana", code: "BW"},
        {label: "Bouvet Island", code: "BV"},
        {label: "Brazil", code: "BR"},
        {label: "British Indian Ocean Territory (the)", code: "IO"},
        {label: "Brunei Darussalam", code: "BN"},
        {label: "Bulgaria", code: "BG"},
        {label: "Burkina Faso", code: "BF"},
        {label: "Burundi", code: "BI"},
        {label: "Cabo Verde", code: "CV"},
        {label: "Cambodia", code: "KH"},
        {label: "Cameroon", code: "CM"},
        {label: "Canada", code: "CA"},
        {label: "Cayman Islands (the)", code: "KY"},
        {label: "Central African Republic (the)", code: "CF"},
        {label: "Chad", code: "TD"},
        {label: "Chile", code: "CL"},
        {label: "China", code: "CN"},
        {label: "Christmas Island", code: "CX"},
        {label: "Cocos (Keeling) Islands (the)", code: "CC"},
        {label: "Colombia", code: "CO"},
        {label: "Comoros (the)", code: "KM"},
        {label: "Congo (the Democratic Republic of the)", code: "CD"},
        {label: "Congo (the)", code: "CG"},
        {label: "Cook Islands (the)", code: "CK"},
        {label: "Costa Rica", code: "CR"},
        {label: "Croatia", code: "HR"},
        {label: "Cuba", code: "CU"},
        {label: "Curaçao", code: "CW"},
        {label: "Cyprus", code: "CY"},
        {label: "Czechia", code: "CZ"},
        {label: "Côte d'Ivoire", code: "CI"},
        {label: "Denmark", code: "DK"},
        {label: "Djibouti", code: "DJ"},
        {label: "Dominica", code: "DM"},
        {label: "Dominican Republic (the)", code: "DO"},
        {label: "Ecuador", code: "EC"},
        {label: "Egypt", code: "EG"},
        {label: "El Salvador", code: "SV"},
        {label: "Equatorial Guinea", code: "GQ"},
        {label: "Eritrea", code: "ER"},
        {label: "Estonia", code: "EE"},
        {label: "Eswatini", code: "SZ"},
        {label: "Ethiopia", code: "ET"},
        {label: "Falkland Islands (the) [Malvinas]", code: "FK"},
        {label: "Faroe Islands (the)", code: "FO"},
        {label: "Fiji", code: "FJ"},
        {label: "Finland", code: "FI"},
        {label: "France", code: "FR"},
        {label: "French Guiana", code: "GF"},
        {label: "French Polynesia", code: "PF"},
        {label: "French Southern Territories (the)", code: "TF"},
        {label: "Gabon", code: "GA"},
        {label: "Gambia (the)", code: "GM"},
        {label: "Georgia", code: "GE"},
        {label: "Germany", code: "DE"},
        {label: "Ghana", code: "GH"},
        {label: "Gibraltar", code: "GI"},
        {label: "Greece", code: "GR"},
        {label: "Greenland", code: "GL"},
        {label: "Grenada", code: "GD"},
        {label: "Guadeloupe", code: "GP"},
        {label: "Guam", code: "GU"},
        {label: "Guatemala", code: "GT"},
        {label: "Guernsey", code: "GG"},
        {label: "Guinea", code: "GN"},
        {label: "Guinea-Bissau", code: "GW"},
        {label: "Guyana", code: "GY"},
        {label: "Haiti", code: "HT"},
        {label: "Heard Island and McDonald Islands", code: "HM"},
        {label: "Holy See (the)", code: "VA"},
        {label: "Honduras", code: "HN"},
        {label: "Hong Kong", code: "HK"},
        {label: "Hungary", code: "HU"},
        {label: "Iceland", code: "IS"},
        {label: "India", code: "IN"},
        {label: "Indonesia", code: "ID"},
        {label: "Iran (Islamic Republic of)", code: "IR"},
        {label: "Iraq", code: "IQ"},
        {label: "Ireland", code: "IE"},
        {label: "Isle of Man", code: "IM"},
        {label: "Israel", code: "IL"},
        {label: "Italy", code: "IT"},
        {label: "Jamaica", code: "JM"},
        {label: "Japan", code: "JP"},
        {label: "Jersey", code: "JE"},
        {label: "Jordan", code: "JO"},
        {label: "Kazakhstan", code: "KZ"},
        {label: "Kenya", code: "KE"},
        {label: "Kiribati", code: "KI"},
        {label: "Korea (the Democratic People's Republic of)", code: "KP"},
        {label: "Korea (the Republic of)", code: "KR"},
        {label: "Kuwait", code: "KW"},
        {label: "Kyrgyzstan", code: "KG"},
        {label: "Lao People's Democratic Republic (the)", code: "LA"},
        {label: "Latvia", code: "LV"},
        {label: "Lebanon", code: "LB"},
        {label: "Lesotho", code: "LS"},
        {label: "Liberia", code: "LR"},
        {label: "Libya", code: "LY"},
        {label: "Liechtenstein", code: "LI"},
        {label: "Lithuania", code: "LT"},
        {label: "Luxembourg", code: "LU"},
        {label: "Macao", code: "MO"},
        {label: "Madagascar", code: "MG"},
        {label: "Malawi", code: "MW"},
        {label: "Malaysia", code: "MY"},
        {label: "Maldives", code: "MV"},
        {label: "Mali", code: "ML"},
        {label: "Malta", code: "MT"},
        {label: "Marshall Islands (the)", code: "MH"},
        {label: "Martinique", code: "MQ"},
        {label: "Mauritania", code: "MR"},
        {label: "Mauritius", code: "MU"},
        {label: "Mayotte", code: "YT"},
        {label: "Mexico", code: "MX"},
        {label: "Micronesia (Federated States of)", code: "FM"},
        {label: "Moldova (the Republic of)", code: "MD"},
        {label: "Monaco", code: "MC"},
        {label: "Mongolia", code: "MN"},
        {label: "Montenegro", code: "ME"},
        {label: "Montserrat", code: "MS"},
        {label: "Morocco", code: "MA"},
        {label: "Mozambique", code: "MZ"},
        {label: "Myanmar", code: "MM"},
        {label: "Namibia", code: "NA"},
        {label: "Nauru", code: "NR"},
        {label: "Nepal", code: "NP"},
        {label: "Netherlands (the)", code: "NL"},
        {label: "New Caledonia", code: "NC"},
        {label: "New Zealand", code: "NZ"},
        {label: "Nicaragua", code: "NI"},
        {label: "Niger (the)", code: "NE"},
        {label: "Nigeria", code: "NG"},
        {label: "Niue", code: "NU"},
        {label: "Norfolk Island", code: "NF"},
        {label: "Northern Mariana Islands (the)", code: "MP"},
        {label: "Norway", code: "NO"},
        {label: "Oman", code: "OM"},
        {label: "Pakistan", code: "PK"},
        {label: "Palau", code: "PW"},
        {label: "Palestine, State of", code: "PS"},
        {label: "Panama", code: "PA"},
        {label: "Papua New Guinea", code: "PG"},
        {label: "Paraguay", code: "PY"},
        {label: "Peru", code: "PE"},
        {label: "Philippines (the)", code: "PH"},
        {label: "Pitcairn", code: "PN"},
        {label: "Poland", code: "PL"},
        {label: "Portugal", code: "PT"},
        {label: "Puerto Rico", code: "PR"},
        {label: "Qatar", code: "QA"},
        {label: "Republic of North Macedonia", code: "MK"},
        {label: "Romania", code: "RO"},
        {label: "Russian Federation (the)", code: "RU"},
        {label: "Rwanda", code: "RW"},
        {label: "Réunion", code: "RE"},
        {label: "Saint Barthélemy", code: "BL"},
        {label: "Saint Helena, Ascension and Tristan da Cunha", code: "SH"},
        {label: "Saint Kitts and Nevis", code: "KN"},
        {label: "Saint Lucia", code: "LC"},
        {label: "Saint Martin (French part)", code: "MF"},
        {label: "Saint Pierre and Miquelon", code: "PM"},
        {label: "Saint Vincent and the Grenadines", code: "VC"},
        {label: "Samoa", code: "WS"},
        {label: "San Marino", code: "SM"},
        {label: "Sao Tome and Principe", code: "ST"},
        {label: "Saudi Arabia", code: "SA"},
        {label: "Senegal", code: "SN"},
        {label: "Serbia", code: "RS"},
        {label: "Seychelles", code: "SC"},
        {label: "Sierra Leone", code: "SL"},
        {label: "Singapore", code: "SG"},
        {label: "Sint Maarten (Dutch part)", code: "SX"},
        {label: "Slovakia", code: "SK"},
        {label: "Slovenia", code: "SI"},
        {label: "Solomon Islands", code: "SB"},
        {label: "Somalia", code: "SO"},
        {label: "South Africa", code: "ZA"},
        {label: "South Georgia and the South Sandwich Islands", code: "GS"},
        {label: "South Sudan", code: "SS"},
        {label: "Spain", code: "ES"},
        {label: "Sri Lanka", code: "LK"},
        {label: "Sudan (the)", code: "SD"},
        {label: "Suriname", code: "SR"},
        {label: "Svalbard and Jan Mayen", code: "SJ"},
        {label: "Sweden", code: "SE"},
        {label: "Switzerland", code: "CH"},
        {label: "Syrian Arab Republic", code: "SY"},
        {label: "Taiwan (Province of China)", code: "TW"},
        {label: "Tajikistan", code: "TJ"},
        {label: "Tanzania, United Republic of", code: "TZ"},
        {label: "Thailand", code: "TH"},
        {label: "Timor-Leste", code: "TL"},
        {label: "Togo", code: "TG"},
        {label: "Tokelau", code: "TK"},
        {label: "Tonga", code: "TO"},
        {label: "Trinidad and Tobago", code: "TT"},
        {label: "Tunisia", code: "TN"},
        {label: "Turkey", code: "TR"},
        {label: "Turkmenistan", code: "TM"},
        {label: "Turks and Caicos Islands (the)", code: "TC"},
        {label: "Tuvalu", code: "TV"},
        {label: "Uganda", code: "UG"},
        {label: "Ukraine", code: "UA"},
        {label: "United Arab Emirates (the)", code: "AE"},
        {label: "United Kingdom of Great Britain and Northern Ireland (the)", code: "GB"},
        {label: "United States Minor Outlying Islands (the)", code: "UM"},
        {label: "United States of America (the)", code: "US"},
        {label: "Uruguay", code: "UY"},
        {label: "Uzbekistan", code: "UZ"},
        {label: "Vanuatu", code: "VU"},
        {label: "Venezuela (Bolivarian Republic of)", code: "VE"},
        {label: "Viet Nam", code: "VN"},
        {label: "Virgin Islands (British)", code: "VG"},
        {label: "Virgin Islands (U.S.)", code: "VI"},
        {label: "Wallis and Futuna", code: "WF"},
        {label: "Western Sahara", code: "EH"},
        {label: "Yemen", code: "YE"},
        {label: "Zambia", code: "ZM"},
        {label: "Zimbabwe", code: "ZW"}
    ]
    const [windowSize, setWindowSize] = useState(null)
    const [loading, setLoading] = useState(false)
    const [urlV, setUrlV] = useState(null)
    const [ciphertext, setCiphertext] = useState(null)
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [isMobile, setIsMobile] = useState(false)
    const [selectedBirthDate, setSelectedBirthDate] = useState(null)
    const [selectedExpireDate, setSelectedExpireDate] = useState(null)
    const [idType, setIdType] = useState(null)
    const [idTypeArr, setIdTypeArr] = useState(isOwner ? ["DrivingLicence", "IdentityCard", "Passport", "ResidencePermit"] : null)
    const [userDetails, setUserDetails] = useState(null)
    const [selectedDocUpload, setSelectedDocUpload] = useState()
    const [sessionId, setSessionId] = useState("")
    const [documents, setDocuments] = useState([])
    const [gender, setGender] = useState(null)
    const [firstName, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [middleName, setMiddleName] = useState(null)
    const [idNumber, setIdNumber] = useState(null)
    const [authCountries, setAuthCountries] = useState("")
    const token = Session.getToken("Wavetoken")
    const [qrModal, setQrModal] = useState()
    const [error, setError] = useState([])
    const [ignored, setRefreshRender] = useState(new Date())

    const userLoggedData = Session.getUserLoggedInData("UserLoggedData")
    useEffect(() => {
        setSessionId(uuidv4)
        if (isOwner) {
            countries = [
{
                code: "CA",
                label: "Canada"
            }
]
            setSelectedCountry({
                code: "CA",
                label: "Canada"
            })
        }
        if (typeof window !== "undefined") {
            // Handler to call on window resize
            function handleResize() {
                // Set window width/height to state
                setWindowSize(window.innerWidth)
                window.innerWidth <= mobileBreakpoint
                    ? setIsMobile(true)
                    : setIsMobile(false)
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
        console.log('userLoggedData: ', userLoggedData)
        console.log(documents)
        if (sessionId && sessionId !== '' && documents.length > 0) {
            console.log(sessionId)
            socket.on("connect", () => {
                console.log("socket connected: ", socket.connected)
                console.log(socket.connected) // true

                socket.on('connected', (onClientConnected) => {
                    console.log(onClientConnected)
                })

                socket.on('imageDownload', (data) => {
                    if (data) {
                        console.log(documents)
                        const docs = documents
                        console.log('docs: ', docs)
                        const index = docs.findIndex(doc => doc.type === data.imageType)
                        console.log('index: ', index)
                        if (index > -1) docs[index].image = data.image
                        console.log('after docs: ', docs)
                        setQrModal(false)
                        setRefreshRender(new Date())
                    }
                    console.log(data)
                })
            })
            socket.emit('join', sessionId) // Emit a join request that will join/create a room with the generated unique sessionID
            // only execute all the code below in client side
        }
    }, [sessionId, documents])

    useEffect(() => {
        if (ciphertext) {
            setUrlV(`${process.env.verificationUrl}?cipher=${ciphertext}`)
            setLoading(false)
        }
    }, [ciphertext])
    useEffect(() => {
        let isMounted = true
        const arr = []
        const callApi = () => {
            setLoading(true)
            API()
                .get(
                    `/docv/countrycodes/IdentityVerification`,
                    {
                        headers: {
                            authorization: `Bearer ${  token}`
                        }
                    }
                )
                .then((response) => {
                    console.log("response is ", response)
                    if ((response.status = 200)) {
                        console.log(response.data)
                        setLoading(false)
                        response.data.forEach(c => {
                                const filtered = countries.filter(obj => obj.code === c && true)
                                arr.push(filtered[0])
                            }
                        )
                        const sortedArr = arr.sort(((a, b) => a.label - b.label))
                        setAuthCountries(sortedArr)
                    }
                })
                .catch((e) => {
                    console.log("Not found: ", e)
                })
        }
        callApi()
        return () => {
            isMounted = false
        }
    }, [])
    useEffect(() => {
        console.log('documents Use EFFECTS: ', documents)
    }, [documents])
    const uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }

    const validate = (str) => {
        const errors = []
        if (selectedCountry === null || selectedCountry === "") {
            errors.push({name: "selectedCountry", message: "Please select country"})
        }
        if (idType === null || idType === "") {
            errors.push({name: "idType", message: "Please select ID Type"})
        }
        if (gender === null || gender === "") {
            errors.push({name: "gender", message: "Please select gender"})
        }
        if (firstName === null || firstName === "") {
            errors.push({name: "firstName", message: "Please input first name"})
        }
        if (lastName === null || lastName === "") {
            errors.push({name: "lastName", message: "Please input last name"})
        }
        if (idNumber === null || idNumber === "") {
            errors.push({name: "idNumber", message: "Please input ID number"})
        }
        if (selectedBirthDate === null || selectedBirthDate === "") {
            errors.push({name: "selectedBirthDate", message: "Please select birthday"})
        }
        if (selectedExpireDate === null || selectedExpireDate === "") {
            errors.push({name: "selectedExpireDate", message: "Please select expire date"})
        }
        if (documents.filter(item => item.image === null).length > 0) {
            errors.push({name: "images", message: "Please upload required photos"})
        }
        setError(errors)
        const fields = [selectedCountry, idType, gender, firstName, lastName, idNumber, selectedBirthDate, selectedExpireDate]
        return fields.filter(item => item === null).length > 0 ? false : true
    }
    const handleSubmit = () => {
        if (!validate()) {
            console.log("Can not submit")
            return
        }
        try {
            const extractedDate = moment(selectedBirthDate).format("DD")
            const extractedMonth = moment(selectedBirthDate).format("MM")
            const extractedYear = moment(selectedBirthDate).format("YYYY")

            console.log('extractedDate', parseInt(extractedDate))
            console.log('extractedMonth', extractedMonth)
            console.log('extractedYear', extractedYear)
            console.log('DocumentFrontImage', documents.find(doc => doc.type === 'DocumentFront' || doc.type === 'Passport').image)
            console.log('DocumentBackImage', documents.find(doc => doc.type === 'DocumentBack')?.image)
            console.log('LivePhoto', documents.find(doc => doc.type === 'LivePhoto').image)
            console.log('idType', idType)

            const reqBody = {
                AcceptTruliooTermsAndConditions: true,
                VerboseMode: true,
                CustomerReferenceID: userLoggedData.userId,
                CountryCode: selectedCountry.code,
                CallBackUrl: `${process.env.apiBaseUrl}docv/save`,
                DataFields: {
                    PersonInfo: {
                        FirstGivenName: firstName,
                        FirstSurName: lastName,
                        DayOfBirth: parseInt(extractedDate),
                        MonthOfBirth: parseInt(extractedMonth),
                        YearOfBirth: parseInt(extractedYear),
                        Gender: gender.charAt(0)
                    },
                    Document: {
                        DocumentFrontImage: documents.find(doc => doc.type === 'DocumentFront' || doc.type === 'Passport').image.replace('data:image/jpeg;base64,', ''),
                        DocumentBackImage: documents.find(doc => doc.type === 'DocumentBack')?.image?.replace('data:image/jpeg;base64,', ''),
                        LivePhoto: documents.find(doc => doc.type === 'LivePhoto').image.replace('data:image/jpeg;base64,', ''),
                        DocumentType: idType,
                        AcceptIncompleteDocument: false,
                        ValidateDocumentImageQuality: true
                    }
                }
            }
            setLoading(true)
            API()
                .post(`/docv/verify`,
                    reqBody,
                    {
                        headers: {
                            authorization: `Bearer ${  token}`
                        }
                    })
                .then((response) => {
                    console.log("response is ", response)
                    //forward to user listings page
                    if (response.status === 200) {
                        setLoading(false)
                        close()
                    }
                })
                .catch((e) => {
                    setError(e)
                })
        } catch (e) {
            console.log(e)
        }
    }
    const clearError = (field) => {
        console.log("clear Eror ", error?.filter(item => item.name === field))
        setError(error?.filter(item => item.name !== field))
    }
    const countryToFlag = (isoCode) => {
        return typeof String.fromCodePoint !== 'undefined'
            ? isoCode
                .toUpperCase()
                .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
            : isoCode
    }
    const getDocumentsByCountry = (value) => {
        console.log(value)
        if (value) {
            const passportArrNotCA = []
            setLoading(true)
            API()
                .get(
                    `/docv/documentTypes/${value.code}`,
                    {
                        headers: {
                            authorization: `Bearer ${  token}`
                        }
                    }
                )
                .then((response) => {
                    console.log("response is ", response)
                    if ((response.status = 200)) {
                        setLoading(false)
                        console.log(response.data)
                        console.log(response.data[value.code])
                        setIdTypeArr(value.code !== 'CA' ? response.data[value.code].filter(c => c === 'Passport') : response.data[value.code])
                    }
                })
                .catch((e) => {
                    console.log("Not found: ", e)
                })
        }
    }
    const convertFromCamelCaseWithSpace = (str) => {
        return str?.replace(/([a-z])([A-Z])/g, '$1 $2')
    }

    const handleUploadDocument = (type) => {
        clearError("images")
        setLoading(true)
        setQrModal(true)
        setCiphertext(CryptoJS.AES.encrypt(JSON.stringify({
            sessionId,
            idType,
            imageType: type
        }), process.env.cryptoCipher).toString())
        setSelectedDocUpload(type)
    }

    return (
        <>
            <ProofFormBanner/>
            <Grid container style={{height: "100%"}}>
                <Grid item xs={false} lg={2} style={{backgroundColor: "#F2F2F2"}}/>
                <Grid item xs={12} lg={8} className={classes.topPadding}>
                    <Typography className={classes.centerInput}>
                        {convertFromCamelCaseWithSpace(idType) ? `${convertFromCamelCaseWithSpace(idType)  } Verification` : ''}
                    </Typography>
                    <form>
                        <Paper variant='outlined' className={classes.paper}>
                            <Grid item xs={12} className={classes.centerInstruction}>
                                <p>
                                    {t.truliooVerification.enterYourInfoExactly}
                                </p>
                                <p>
                                    {t.truliooVerification.hostsSeeYourName}
                                </p>
                            </Grid>
                            <Grid item container xs={12} spacing={3} className={classes.centerInput}>
                                <Grid item xs={6} sm={4}>
                                    <FormControl variant='outlined' fullWidth={true}>
                                        <Autocomplete
                                            disabled={isOwner}
                                            defaultValue={isOwner ? {
                                                code: "CA",
                                                label: "Canada"
                                            } : null}
                                            onFocus={() => clearError("selectedCountry")}
                                            error={error?.filter(item => item.name === "selectedCountry")?.length > 0}
                                            id="country-select-demo"
                                            options={authCountries}
                                            classes={{
                                                option: classes.option
                                            }}
                                            className={classes.inputField}
                                            autoHighlight
                                            onChange={(event, value) => {
                                                setSelectedCountry(value)
                                                getDocumentsByCountry(value)
                                            }}
                                            getOptionLabel={(option) => option.label}
                                            renderOption={(option) => (
                                                <React.Fragment>
                                                    <span>{countryToFlag(option.code)}</span>
                                                    {option.label} ({option.code})
                                                </React.Fragment>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Country"
                                                    variant="outlined"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: 'new-password' // disable autocomplete and autofill
                                                    }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    {error?.filter(item => item.name === "selectedCountry")?.length > 0 && (
                                        <FormHelperText
                                            error>{error?.find(item => item.name === "selectedCountry")?.message}</FormHelperText>)}
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <FormControl variant='outlined' fullWidth={true} style={{textAlign: 'left'}}>
                                        <InputLabel>{t.truliooVerification.idType}</InputLabel>
                                        <Select
                                            className={classes.inputField}
                                            value={idType}
                                            disabled={!selectedCountry && !isOwner}
                                            onFocus={() => clearError("idType")}
                                            error={error?.filter(item => item.name === "idType")?.length > 0}
                                            onChange={(event, value) => {
                                                setIdType(event.target.value)
                                                const doc = []
                                                switch (event.target.value) {
                                                    case 'Passport':
                                                        doc.push(
                                                            {type: 'Passport', image: null},
                                                            {type: 'LivePhoto', image: null})
                                                        setDocuments(doc)
                                                        break
                                                    default:
                                                        doc.push(
                                                            {type: 'DocumentFront', image: null},
                                                            {type: 'DocumentBack', image: null},
                                                            {type: 'LivePhoto', image: null})
                                                        setDocuments(doc)
                                                        break
                                                }
                                            }}
                                            label={t.truliooVerification.idType}
                                        >
                                            {idTypeArr?.map((id) => (
                                                <MenuItem value={id}>{convertFromCamelCaseWithSpace(id)}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {error?.filter(item => item.name === "idType")?.length > 0 && (<FormHelperText
                                        error>{error?.find(item => item.name === "idType")?.message}</FormHelperText>)}
                                </Grid>
                                <Grid item xs={6} sm={4} style={{textAlign: 'left'}}>
                                    <FormControl variant='outlined' fullWidth={true}>
                                        <InputLabel>{t.truliooVerification.gender}</InputLabel>
                                        <Select
                                            value={gender}
                                            className={classes.inputField}
                                            onChange={(event) => setGender(event.target.value)}
                                            label={t.truliooVerification.gender}
                                            onFocus={() => clearError("gender")}
                                            error={error?.filter(item => item.name === "gender")?.length > 0}
                                        >
                                            {genderList.map((gen) => (
                                                <MenuItem value={gen}>{gen}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {error?.filter(item => item.name === "gender")?.length > 0 && (<FormHelperText
                                        error>{error?.find(item => item.name === "gender")?.message}</FormHelperText>)}
                                </Grid>
                            </Grid>
                            {/* name */}
                            <Grid item container xs={12} className={classes.centerInput} spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label={t.truliooVerification.firstName}
                                        type='text'
                                        variant='outlined'
                                        name='firstName'
                                        value={firstName}
                                        onFocus={() => clearError("firstName")}
                                        error={error?.filter(item => item.name === "firstName")?.length > 0}
                                        onChange={(event) => setFirstName(event.target.value)}
                                        classes={{root: classes.inputField}}
                                    />
                                    {error?.filter(item => item.name === "firstName")?.length > 0 && (<FormHelperText
                                        error>{error?.find(item => item.name === "firstName")?.message}</FormHelperText>)}
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label={t.truliooVerification.middleName}
                                        type='text'
                                        variant='outlined'
                                        name='middleName'
                                        value={middleName}
                                        onChange={(event) => setMiddleName(event.target.value)}
                                        className={classes.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label={t.truliooVerification.lastName}
                                        type='text'
                                        variant='outlined'
                                        name='lastName'
                                        value={lastName}
                                        onFocus={() => clearError("lastName")}
                                        error={error?.filter(item => item.name === "lastName")?.length > 0}
                                        onChange={(event) => setLastName(event.target.value)}
                                        className={classes.inputField}
                                    />
                                    {error?.filter(item => item.name === "lastName")?.length > 0 && (<FormHelperText
                                        error>{error?.find(item => item.name === "lastName")?.message}</FormHelperText>)}
                                </Grid>
                            </Grid>
                            {/*/!* address *!/*/}
                            <Grid item container xs={12} className={classes.centerInput} spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        label={t.truliooVerification.idNumber}
                                        type='text'
                                        variant='outlined'
                                        name='idNumber'
                                        value={idNumber}
                                        onFocus={() => clearError("idNumber")}
                                        error={error?.filter(item => item.name === "idNumber")?.length > 0}
                                        onChange={(event) => setIdNumber(event.target.value)}
                                        classes={{root: classes.inputField}}
                                    />
                                    {error?.filter(item => item.name === "idNumber")?.length > 0 && (<FormHelperText
                                        error>{error?.find(item => item.name === "idNumber")?.message}</FormHelperText>)}
                                </Grid>
                            </Grid>
                            {/*date*/}
                            <Grid item container xs={12} className={classes.centerInput} spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <div style={{display: "grid"}}>
                                            <KeyboardDatePicker
                                                margin="normal"
                                                id="date-picker-dialog"
                                                format="MM/dd/yyyy"
                                                KeyboardDatePicker
                                                label={t.truliooVerification.expirationDate}
                                                value={selectedExpireDate}
                                                error={error?.filter(item => item.name === "selectedExpireDate")?.length > 0}
                                                onFocus={() => clearError("selectedExpireDate")}
                                                onChange={(date) => setSelectedExpireDate(date)}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date'
                                                }}
                                            />
                                            {error?.filter(item => item.name === "selectedExpireDate")?.length > 0 && (
                                                <FormHelperText
                                                    error>{error?.find(item => item.name === "selectedExpireDate")?.message}</FormHelperText>)}
                                        </div>
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <div style={{display: "grid"}}>
                                            <KeyboardDatePicker
                                                margin="normal"
                                                id="date-picker-dialog"
                                                format="MM/dd/yyyy"
                                                maxDate={moment().subtract(18, 'years')}
                                                label={t.truliooVerification.dateOfBirth}
                                                value={selectedBirthDate}
                                                error={error?.filter(item => item.name === "selectedBirthDate")?.length > 0}
                                                onFocus={() => clearError("selectedBirthDate")}
                                                onChange={(date) => setSelectedBirthDate(date)}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date'
                                                }}
                                            />
                                            {error?.filter(item => item.name === "selectedBirthDate")?.length > 0 && (
                                                <FormHelperText
                                                    error>{error?.find(item => item.name === "selectedBirthDate")?.message}</FormHelperText>)}
                                        </div>
                                    </MuiPickersUtilsProvider>
                                </Grid>
                            </Grid>
                        </Paper>
                        {/* upload */}
                        {idType && <Paper variant='outlined' className={classes.paper}>
                            <Grid
                                item
                                container
                                xs={12}
                                className={classes.centerInstruction}
                                spacing={2}
                            >
                                <Grid item xs={12}>
                                    <h2>{t.truliooVerification.uploadImagesOfYOur} {convertFromCamelCaseWithSpace(idType)}</h2>
                                    <p>
                                        {t.truliooVerification.makeSurePictureAndText} {convertFromCamelCaseWithSpace(idType)} {t.truliooVerification.areClearlyVisible}
                                    </p>
                                    {error?.filter(item => item.name === "images")?.length > 0 && (<FormHelperText error
                                                                                                                   style={{textAlign: "center"}}>{error?.find(item => item.name === "images")?.message}</FormHelperText>)}
                                </Grid>
                                <Grid container item xs={12}>
                                    {documents.map(doc => <Grid key={doc.type} item xs={12} sm={6}
                                                                style={{textAlign: "-webkit-center", padding: 10}}>
                                        <Card className={classes.photoCard} variant="outlined">
                                            {doc.image && <img style={{height: '265px'}} src={doc.image}
                                                               alt='Imag Document'/>}
                                            <CardContent>
                                                <ControlPointIcon style={{cursor: "pointer", fontSize: 30}}
                                                                  onClick={() => handleUploadDocument(doc.type)}/>
                                                <Typography>{convertFromCamelCaseWithSpace(doc.type)}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>)}
                                    <Modal open={qrModal} onClose={() => setQrModal(false)}
                                           classNames={{modal: classes.customModal}}>
                                        <div className={classes.centerInstruction} style={{position: "relative"}}><Image
                                            src="/assets/images/qr-code-image.png" alt="qr-code" width="200px"
                                            height="200px"/>
                                            <div style={{position: "absolute", right: 150, top: 50}}>{urlV &&
                                                <QRCode value={urlV}/>}</div>
                                        </div>
                                        <h2 className={classes.centerInstruction}>Scan QR code to perform verification
                                            on your mobile phone</h2>
                                        <ol>
                                            <li className={classes.textMargin}>Scan the QR
                                                code:<br/><span><b>On iPhone:</b> Open your Camera app and point at the QR code.</span><br/><span><b>On Android:</b> Open QR scanning app or Google Lens, and point at the QR code</span>
                                            </li>
                                            <br/>
                                            <li className={classes.textMargin}>Click the link</li>
                                        </ol>
                                    </Modal>
                                </Grid>
                            </Grid>
                        </Paper>}
                    </form>
                </Grid>
                <div className={classes.root}>
                    <Backdrop className={classes.backdrop} open={loading}>
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                </div>
                <Grid item xs={false} lg={2} style={{backgroundColor: "#F2F2F2"}}/>
            </Grid>
            <Grid item container xs={12} className={classes.bottomNav}>
                <Grid item xs={5}/>
                <Grid className={classes.navbtn} style={{justifyContent: "center"}}>
                    <Button className={classes.submitButton}
                            onClick={handleSubmit}>{t.truliooVerification.submit}</Button>
                </Grid>
                <Grid item xs={5}/>
            </Grid>
        </>
    )
}


export default ProofForm
