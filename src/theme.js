import { createTheme } from "@material-ui/core/styles"
import { red } from "@material-ui/core/colors"

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: "#556cd6"
        },
        secondary: {
            main: "#19857b"
        },
        error: {
            main: red.A400
        },
        background: {
            default: "#FFFFFF",
            lightBlue: "#DEECF9",
            aliceBlue: "#fbfcfd",
            flamingo: "#EB5757",
            silver: "#bfbfbf",
            pattensBlue: "#cfe8fc",
            deepSkyBlue: "#00B0FF",
            eucalyptus: "#27AE60",
            green: "#008000",
            whisper: "#E5E5E5",
            festival: "#fced67",
            paleCornflowerBlue: "#6495ed",
            lightGrey: "#D3D3D3",
            seaGreen: "#219653",
            scampi: '#696991',
            nightRider: '#323232',
            roman: '#df6157',
            cerulean: '#0077b6',
            irisBlue: '#00b4d8',
            blizzardBlue: '#ade8f4',
            orange: '#ffa500',
            grayish: "#e9ecef",
            bookingBackground: '#eefaff',
            whiteSmoke: '#F2F2F2'
        },
        buttonPrimary: {
            main: "#4d96fb"
        },
        //Navbar
        navBar: {
            background: '#00488e',
            darkerGrey: "#BDBDBD"
        },
        covidResponse: {
            background: '#333333'
        },
        search: {
            placeholder: '#A1BAC9',
            outline: '#e0e0e0',
            option: '#212121'
        },
        wavezHome: {
            backgroundColorSearch: '#eefaff',
            reviewsText: '#6e7491'
        },
        recommendationImageContainer: {
            backgroundColor: "#f1f1f1"
        },
        recommendationTopTex: {
            aColor: "#a1b0cc"
        },
        boatCard: {
            description: "#7C8DB0"
        },
        userReview: {
            iconFilled: "#007bff",
            iconHover: "#87CEFA"
        },
        addPayment: {
            borderBottom: '#F2F2F2'
        },
        paymentInfo: {
            optionBase: "#424770",
            placeHolder: "#aab7c4",
            optionInvalid: "#9e2146"
        },
        button: {
            red: "#FF0000"
        },
        title: {
            matterhorn: "#4F4F4F"
        },
        text: {
            grey: "#828282",
            black: "#000000",
            amber: "#FFBF00",
            greyTransparent: "rgba(0, 0, 0, 0.26)",
            dimGray: "#747474",
            darkCerulean: "#00488E",
            cello: "#334D6E",
            stormGrey: "#6E7491"
        },
        border: {
            grey: '#808080',
            dimGray: '#747474',
            turquoiseBlue: '#56CCF2',
            dodgerBlue: "#2F80ED",
            heather: "#A1BAC9"

        },
        favorite: {
            addshortListTxt: "#B4D3FF",
            shortList: "#F2C94C"
        }
    }
})

export default theme
