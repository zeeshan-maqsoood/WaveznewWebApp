import { useReducer } from "react"

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_LANGUAGE":
            return {
                ...state,
                language: action.payload
            }
        case "SET_MAKE":
            return {
                ...state,
                addListVesselMake: action.payload
            }
        case "SET_YEAR":
            return {
                ...state,
                addListVesselYear: action.payload
            }
        case "SET_ADDLIST_STEP":
            return {
                ...state,
                addListStep: action.payload
            }
        case "GET_STARTED":
            return {
                ...state,
                getStarted: action.payload
            }
        case "SET_ADDLIST_SERVICE":
            return {
                ...state,
                addListService: action.payload
            }
        case "SET_ADDLIST_CATEGORIES":
            return {
                ...state,
                addListCategories: action.payload
            }
        case "SET_ADDLIST_PASSENGERS":
            return {
                ...state,
                addListPassengers: action.payload
            }
        case "SET_ADDLIST_LOCATION":
            return {
                ...state,
                addListLocation: action.payload,
                addListLocationDisplay: action.displayPayload
            }
        case "SET_ADDLIST_DESTINATION":
            return {
                ...state,
                addListDestination: action.payload,
                addListDestinationDisplay: action.displayPayload
            }
        case "SET_ADDLIST_LATLNG":
            return {
                ...state,
                addListLatLng: action.payload
            }
        case "SET_ADDLIST_DESTINATION_LATLNG":
            return {
                ...state,
                addListDestinationLatLng: action.payload
            }
        case "SET_ADDLIST_WASHROOMS":
            return {
                ...state,
                addListWashrooms: action.payload
            }
        case "SET_ADDLIST_BEDS":
            return {
                ...state,
                addListBeds: action.payload
            }
        case "SET_ADDLIST_KITCHENETTES":
            return {
                ...state,
                addListKitchenettes: action.payload
            }
        case "SET_SEARCH_TERM":
            return {
                ...state,
                addSearchTerm: action.payload
            }
        case "SET_CHARTER_FROM":
            return {
                ...state,
                addCharterFrom: action.payload
            }
        case "SET_CHARTER_TO":
            return {
                ...state,
                addCharterTo: action.payload
            }
        case "SET_SLIDER_PRICE":
            return {
                ...state,
                addSliderPrice: action.payload
            }
        case "SET_FAVOURITE":
            return {
                ...state,
                favourite: action.payload
            }

        case "SET_FAVOURITE_DATA":
            return {
                ...state,
                favouriteData: action.payload
            }
        case "SET_VESSEL_TYPE":
            return {
                ...state,
                vesselType: action.payload
            }
        case "SET_DURATION":
            return {
                ...state,
                durationFilter: action.payload
            }
        case "SET_DURATION_TYPE":
            return {
                ...state,
                durationType: action.payload
            }
        case "SET_ADDRESS_DETAILS":
            return {
                ...state,
                addressDetails: action.payload
            }
        case "SET_CARD_NUMBER_ELEMENT":
            return {
                ...state,
                cardNumberElement: action.payload
            }
        case "SET_NAME_ON_CARD":
            return {
                ...state,
                nameOnCard: action.payload
            }
        case "SET_PAY_OUT_BANK":
            return {
                ...state,
                payOutBankDetails: action.payload
            }
        case "SET_CALENDAR_LISTING":
            return {
                ...state,
                calendarListingSelected: action.payload
            }
        case "SET_CONTACT_SELECTED":
            return {
                ...state,
                contactSelectedId: action.payload
            }
        case "SET_SLIDER_PRICE_TYPE":
            return {
                ...state,
                searchSliderPriceType: action.payload
            }
        case "SET_MOBILE_OUTGOING_CALL_INFO":
            return {
                ...state,
                mobileOutgoingCallInfo: action.payload
            }
        case "SET_MOBILE_INCOMING_CALL_INFO":
            return {
                ...state,
                mobileIncomingCallInfo: action.payload
            }
        case "SET_PSEUDO_LOGIN":
            return {
                ...state,
                pseudoLogin: action.payload
            }
        case "SET_ADMIN_USER_EMAILS":
            return {
                ...state,
                adminSelectedUserEmails: action.payload
            }
        default:
            return state
    }
}

const useGlobalState = () => {
    const [globalState, globalDispatch] = useReducer(reducer, {
        language: "en",
        addListStep: 1,
        getStarted: false,
        addListService: "",
        addListCategories: [],
        addListPassengers: 1,
        addListLocation: undefined,
        addListLocationDisplay: undefined,
        addListDestination: [undefined],
        addListDestinationDisplay: [undefined],
        addListLatLng: undefined,
        addListDestinationLatLng: [undefined],
        addListVesselMake: "",
        addListVesselYear: "",
        addListWashrooms: 1,
        addListBeds: 1,
        addListKitchenettes: 1,
        addSearchTerm: "",
        addCharterFrom: "",
        addCharterTo: "",
        addSliderPrice: [10, 1000],
        favourite: "",
        favouriteData: "",
        vesselType: "RENTAL",
        durationFilter: [],
        durationType: "CALENDAR",
        addressDetails: [],
        cardNumberElement: [],
        nameOnCard: "",
        payOutBankDetails: "",
        calendarListingSelected: "",
        contactSelectedId: "",
        searchSliderPriceType: "HOUR",
        mobileOutgoingCallInfo: null,
        mobileIncomingCallInfo: null,
        pseudoLogin: false,
        adminSelectedUserEmails: []
    })

    return { globalState, globalDispatch }
}

export default useGlobalState
