import React from "react"
import {act} from "react-dom/test-utils"
import {render, fireEvent, screen, waitFor, within} from "@testing-library/react"
import {setupServer} from "msw/node"
import {rest} from "msw"
import FeaturedListings from "../../../../../pages/admin-panel/pages/home/featured-listings"
import theme from "../../../../../src/theme"
import {ThemeProvider} from "@material-ui/core/styles"

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            locale: "en"
        }
    }
}))

const server = setupServer(
    rest.put("*/vessel/updateVesselSequence/:vesselType", (req, res, ctx) => {
        return res(ctx.json({
            arrayValue: [],
            _id: "test",
            key: "INFORMATION_BANNER_PAGE_CONTENT",
            stringValue: "<p>Test</p>",
            booleanValue: false,
            numberValue: 0
        }))
    }),
    rest.get("*/rentals", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([
{
            vesselLocation: {longitude: "-79.4210248", latitude: "43.6377737"},
            vesselAddress: {
                street: "51 Jefferson Ave",
                postalCode: "M6K 1Y3",
                city: "Toronto",
                countryCode: "CA",
                country: "Canada",
                province: "Ontario"
            },
            vesselWeight: {weight: 123, unit: "GT"},
            vesselCategory: ["60c24f92c1e648e46c16fb6c"],
            vesselStatus: "UNPUBLISHED",
            vesselFeatures: ["60a58475d006110013b439ae"],
            documentsIds: ["60bf875c01b45c0013e9f023", "60bf876601b45c0013e9f026", "60bf876901b45c0013e9f027", "60bf876d01b45c0013e9f028"],
            sequence: 1,
            _id: "60bf86f201b45c0013e9f010",
            numberOfPassengers: 1,
            vesselYear: 2018,
            rawAddress: "51 Jefferson Ave, Toronto, ON, Canada",
            title: "Demonstration",
            vesselType: "RENTAL",
            userId: "609c1aeb25f7d100131b3950",
            images: [
{
                _id: "60bf873901b45c0013e9f016",
                imageURL: "https://wavezstorage.blob.core.windows.net/images/image-vesselType-RENTAL-vesselId-60bf86f201b45c0013e9f010-dc0d472e-6b28-4e25-9981-6633eb280f3b.jpg",
                caption: "",
                sequence: 1
            }
],
            createdAt: "2021-06-08T15:04:18.021Z",
            updatedAt: "2021-06-14T16:53:58.288Z",
            __v: 0,
            description: "Descriptions",
            trailerPlateNumber: "",
            vesselPlacement: "Water",
            vesselBrand: "123456",
            vesselFuelType: "Diesel",
            vesselHorsePower: 123,
            vesselLength: 123,
            vesselMaxSpeed: 123,
            vesselModelInfo: "123"
        }
]))
    }),
    rest.get("*/stays", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([
{
            vesselLocation: {longitude: "-79.4210248", latitude: "43.6377737"},
            vesselAddress: {
                street: "51 Jefferson Ave",
                postalCode: "M6K 1Y3",
                city: "Toronto",
                countryCode: "CA",
                country: "Canada",
                province: "Ontario"
            },
            vesselWeight: {weight: 123, unit: "GT"},
            vesselCategory: ["60c24f92c1e648e46c16fb6c"],
            vesselStatus: "UNPUBLISHED",
            vesselFeatures: ["60a58475d006110013b439ae"],
            documentsIds: ["60bf875c01b45c0013e9f023", "60bf876601b45c0013e9f026", "60bf876901b45c0013e9f027", "60bf876d01b45c0013e9f028"],
            sequence: 1,
            _id: "60bf86f201b45c0013e9f010",
            numberOfPassengers: 1,
            vesselYear: 2018,
            rawAddress: "51 Jefferson Ave, Toronto, ON, Canada",
            title: "Demonstration",
            vesselType: "STAY",
            userId: "609c1aeb25f7d100131b3950",
            images: [
{
                _id: "60bf873901b45c0013e9f016",
                imageURL: "https://wavezstorage.blob.core.windows.net/images/image-vesselType-RENTAL-vesselId-60bf86f201b45c0013e9f010-dc0d472e-6b28-4e25-9981-6633eb280f3b.jpg",
                caption: "",
                sequence: 1
            }
],
            createdAt: "2021-06-08T15:04:18.021Z",
            updatedAt: "2021-06-14T16:53:58.288Z",
            __v: 0,
            description: "Descriptions",
            trailerPlateNumber: "",
            vesselPlacement: "Water",
            vesselBrand: "123456",
            vesselFuelType: "Diesel",
            vesselHorsePower: 123,
            vesselLength: 123,
            vesselMaxSpeed: 123,
            vesselModelInfo: "123"
        }
]))
    }),
    rest.get("*/charters", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([
{
            vesselLocation: {longitude: "-79.4210248", latitude: "43.6377737"},
            vesselAddress: {
                street: "51 Jefferson Ave",
                postalCode: "M6K 1Y3",
                city: "Toronto",
                countryCode: "CA",
                country: "Canada",
                province: "Ontario"
            },
            vesselWeight: {weight: 123, unit: "GT"},
            vesselCategory: ["60c24f92c1e648e46c16fb6c"],
            vesselStatus: "UNPUBLISHED",
            vesselFeatures: ["60a58475d006110013b439ae"],
            documentsIds: ["60bf875c01b45c0013e9f023", "60bf876601b45c0013e9f026", "60bf876901b45c0013e9f027", "60bf876d01b45c0013e9f028"],
            sequence: 1,
            _id: "60bf86f201b45c0013e9f010",
            numberOfPassengers: 1,
            vesselYear: 2018,
            rawAddress: "51 Jefferson Ave, Toronto, ON, Canada",
            title: "Demonstration",
            vesselType: "CHARTER",
            userId: "609c1aeb25f7d100131b3950",
            images: [
{
                _id: "60bf873901b45c0013e9f016",
                imageURL: "https://wavezstorage.blob.core.windows.net/images/image-vesselType-RENTAL-vesselId-60bf86f201b45c0013e9f010-dc0d472e-6b28-4e25-9981-6633eb280f3b.jpg",
                caption: "",
                sequence: 1
            }
],
            createdAt: "2021-06-08T15:04:18.021Z",
            updatedAt: "2021-06-14T16:53:58.288Z",
            __v: 0,
            description: "Descriptions",
            trailerPlateNumber: "",
            vesselPlacement: "Water",
            vesselBrand: "123456",
            vesselFuelType: "Diesel",
            vesselHorsePower: 123,
            vesselLength: 123,
            vesselMaxSpeed: 123,
            vesselModelInfo: "123"
        }
]))
    }),
    rest.get("*/vessel/getFeaturedListings", (req, res, ctx) => {
        return res(ctx.json({
            rentals: [
{
                vesselLocation: {longitude: "-79.4210248", latitude: "43.6377737"},
                vesselAddress: {
                    street: "51 Jefferson Ave",
                    postalCode: "M6K 1Y3",
                    city: "Toronto",
                    countryCode: "CA",
                    country: "Canada",
                    province: "Ontario"
                },
                vesselWeight: {weight: 123, unit: "GT"},
                vesselCategory: ["60c24f92c1e648e46c16fb6c"],
                vesselStatus: "UNPUBLISHED",
                vesselFeatures: ["60a58475d006110013b439ae"],
                documentsIds: ["60bf875c01b45c0013e9f023", "60bf876601b45c0013e9f026", "60bf876901b45c0013e9f027", "60bf876d01b45c0013e9f028"],
                sequence: 1,
                _id: "60bf86f201b45c0013e9f010",
                numberOfPassengers: 1,
                vesselYear: 2018,
                rawAddress: "51 Jefferson Ave, Toronto, ON, Canada",
                title: "Demonstration",
                vesselType: "RENTAL",
                userId: "609c1aeb25f7d100131b3950",
                images: [
{
                    _id: "60bf873901b45c0013e9f016",
                    imageURL: "https://wavezstorage.blob.core.windows.net/images/image-vesselType-RENTAL-vesselId-60bf86f201b45c0013e9f010-dc0d472e-6b28-4e25-9981-6633eb280f3b.jpg",
                    caption: "",
                    sequence: 1
                }
],
                createdAt: "2021-06-08T15:04:18.021Z",
                updatedAt: "2021-06-14T16:53:58.288Z",
                __v: 0,
                description: "Descriptions",
                trailerPlateNumber: "",
                vesselPlacement: "Water",
                vesselBrand: "123456",
                vesselFuelType: "Diesel",
                vesselHorsePower: 123,
                vesselLength: 123,
                vesselMaxSpeed: 123,
                vesselModelInfo: "123"
            }, {
                vesselLocation: {longitude: "443.23", latitude: "42.23"},
                vesselAddress: {
                    street: "231 fake street",
                    postalCode: "A9A 9A9",
                    city: "Toronto",
                    countryCode: "CA",
                    country: "Canada",
                    province: "Ontario"
                },
                vesselCategory: ["6094281b0103971836d61422"],
                vesselStatus: "UNPUBLISHED",
                vesselFeatures: [],
                documentsIds: [],
                sequence: 2,
                _id: "609580b32d9e6347b40d2452",
                images: [],
                numberOfPassengers: 8,
                title: "Charter Boatt",
                description: "This is a descrription",
                cost: 900,
                vesselYear: 1990,
                vesselType: "RENTAL",
                userId: "608194168e574e00133bf84a",
                createdAt: "2021-05-07T18:02:27.779Z",
                updatedAt: "2021-06-14T16:43:00.777Z",
                __v: 0
            }, {
                vesselLocation: {longitude: "66.85882219999999", latitude: "29.8771465"},
                vesselAddress: {
                    street: null,
                    postalCode: null,
                    city: "Pringabad",
                    countryCode: "PK",
                    country: "Pakistan",
                    province: "Balochistan"
                },
                vesselCategory: ["609428050103971836d6141f"],
                vesselStatus: "UNPUBLISHED",
                vesselFeatures: [],
                documentsIds: [],
                sequence: 3,
                _id: "609851ef11a97b0013b580c2",
                images: [],
                numberOfPassengers: 2,
                vesselYear: 2017,
                title: "Foreign Province Test",
                vesselType: "RENTAL",
                userId: "6092b0b95ac64b00139c0345",
                createdAt: "2021-05-09T21:19:43.976Z",
                updatedAt: "2021-06-15T14:43:37.440Z",
                __v: 0
            }
],
            charters: [
{
                vesselLocation: {longitude: "443.23", latitude: "42.23"},
                vesselAddress: {
                    street: "231 fake street",
                    postalCode: "A9A 9A9",
                    city: "Toronto",
                    countryCode: "CA",
                    country: "Canada",
                    province: "Ontario"
                },
                vesselCategory: ["6094281b0103971836d61422"],
                vesselStatus: "UNPUBLISHED",
                vesselFeatures: [],
                documentsIds: [],
                _id: "60955283e0b5530013589580",
                images: [],
                numberOfPassengers: 8,
                destinationLocation: [{_id: "60955283e0b5530013589581", longitude: "982.23", latitude: "933.11"}],
                destinationAddress: [
{
                    _id: "60955283e0b5530013589582",
                    street: "231 fake street",
                    postalCode: "A9A 9A9",
                    city: "Toronto",
                    countryCode: "CA",
                    country: "Canada",
                    province: "Ontario"
                }, {
                    _id: "60955283e0b5530013589583",
                    street: "231 fake street",
                    postalCode: "A9A 9A9",
                    city: "Toronto",
                    countryCode: "CA",
                    country: "Canada",
                    province: "Ontario"
                }, {
                    _id: "60955283e0b5530013589584",
                    street: "231 fake street",
                    postalCode: "A9A 9A9",
                    city: "Toronto",
                    countryCode: "CA",
                    country: "Canada",
                    province: "Ontario"
                }
],
                title: "Charter Boatt",
                description: "This is a descrription",
                cost: 900,
                vesselYear: 1990,
                vesselType: "CHARTERS",
                userId: "6080f88922224a40890c3ae4",
                createdAt: "2021-05-07T14:45:23.733Z",
                updatedAt: "2021-06-11T21:45:09.742Z",
                __v: 0,
                sequence: 1
            }, {
                vesselLocation: {longitude: "-79.3440914", latitude: "43.6369864"},
                vesselAddress: {
                    street: null,
                    postalCode: null,
                    city: null,
                    countryCode: "CA",
                    country: "Canada",
                    province: "Ontario"
                },
                vesselCategory: ["6094281b0103971836d61422"],
                vesselStatus: "UNPUBLISHED",
                vesselFeatures: [],
                documentsIds: [],
                _id: "609ab5b92d05f90013a98a8a",
                images: [],
                numberOfPassengers: 1,
                destinationLocation: [
{
                    _id: "609ab5b92d05f90013a98a8b",
                    latitude: "43.64383720000001",
                    longitude: "-79.3682664"
                }
],
                destinationAddress: [
{
                    _id: "609ab5b92d05f90013a98a8c",
                    street: null,
                    postalCode: null,
                    city: null,
                    countryCode: "CA",
                    country: "Canada",
                    province: "Ontario"
                }
],
                title: "Cruisers",
                vesselYear: 2018,
                vesselType: "CHARTER",
                userId: "6092b0b95ac64b00139c0345",
                createdAt: "2021-05-11T16:50:01.644Z",
                updatedAt: "2021-06-11T21:45:09.742Z",
                __v: 0,
                sequence: 2
            }, {
                vesselLocation: {longitude: "-79.2796145", latitude: "43.6857881"},
                vesselAddress: {
                    street: "5 Clonmore Dr",
                    postalCode: "M1N 1X7",
                    city: "Toronto",
                    countryCode: "CA",
                    country: "Canada",
                    province: "Ontario"
                },
                vesselWeight: {weight: 123, unit: "GT"},
                vesselPricing: {
                    perHour: {checked: true, amount: 123, minimumTime: 1},
                    currency: "CAD",
                    minimumDeposit: 3000
                },
                vesselCategory: ["60b968e18e7a1b03718d529d", "60b967f544800b034fa685b9", "609428340103971836d61426", "6094282d0103971836d61425"],
                vesselStatus: "UNPUBLISHED",
                vesselFeatures: [],
                documentsIds: [],
                _id: "60ba477f7cea190013513b8b",
                numberOfPassengers: 1,
                destinationLocation: [
{
                    _id: "60ba484a7cea190013513b8e",
                    latitude: "43.6906112",
                    longitude: "-79.26749800000002"
                }
],
                rawAddress: "5 Clonmore Drive, Scarborough, ON, Canada",
                destinationAddress: [
{
                    _id: "60ba477f7cea190013513b8d",
                    street: "4 Eastwood Ave",
                    postalCode: "M1N 3G8",
                    city: "Toronto",
                    countryCode: "CA",
                    country: "Canada",
                    province: "Ontario",
                    rawAddress: "4 Eastwood Ave, Scarborough, ON, Canada"
                }
],
                title: "cfvghjnmkl",
                vesselYear: 2016,
                vesselType: "CHARTER",
                userId: "60ba45f8b510ca001380810c",
                images: [
{
                    _id: "60ba485e7cea190013513b92",
                    imageURL: "https://wavezstorage.blob.core.windows.net/images/image-vesselType-CHARTER-vesselId-60ba477f7cea190013513b8b-d3a37482-2ea3-441f-b7ee-2524ba96a9fc.jpg",
                    caption: "",
                    sequence: 1
                }
],
                createdAt: "2021-06-04T15:32:15.639Z",
                updatedAt: "2021-06-11T21:45:22.995Z",
                __v: 0,
                description: "fyguhnijmok,l",
                vesselPlacement: "Trailer",
                vesselBrand: "dtfvygbhunj",
                vesselFuelType: "Electric",
                vesselHorsePower: 123,
                vesselLength: 123,
                vesselMaxSpeed: 123,
                vesselModelInfo: "vgbhnjkm",
                sequence: 3
            }
],
            stays: [
{
                vesselLocation: {longitude: "-79.4210248", latitude: "43.6377737"},
                vesselAddress: {
                    street: "51 Jefferson Ave",
                    postalCode: "M6K 1Y3",
                    city: "Toronto",
                    countryCode: "CA",
                    country: "Canada",
                    province: "Ontario"
                },
                vesselCategory: ["609427fa0103971836d6141e", "6094280d0103971836d61420"],
                vesselStatus: "UNPUBLISHED",
                vesselFeatures: [],
                documentsIds: [],
                _id: "609c0d8c25f7d100131b3948",
                numberOfPassengers: 1,
                title: "My Stay Make",
                vesselType: "STAY",
                numberOfBathrooms: 1,
                numberOfKitchens: 1,
                numberOfBeds: 1,
                userId: "6092b0b95ac64b00139c0345",
                images: [],
                createdAt: "2021-05-12T17:17:00.029Z",
                updatedAt: "2021-06-11T18:42:39.222Z",
                __v: 0,
                sequence: 1
            }, {
                vesselLocation: {longitude: "-79.4210248", latitude: "43.6377737"},
                vesselAddress: {
                    street: "51 Jefferson Ave",
                    postalCode: "M6K 1Y3",
                    city: "Toronto",
                    countryCode: "CA",
                    country: "Canada",
                    province: "Ontario"
                },
                vesselCategory: ["609428050103971836d6141f"],
                vesselStatus: "UNPUBLISHED",
                vesselFeatures: [],
                documentsIds: [],
                _id: "609c1a9c25f7d100131b394f",
                numberOfPassengers: 1,
                title: "Deployed test",
                vesselType: "STAY",
                numberOfBathrooms: 1,
                numberOfKitchens: 1,
                numberOfBeds: 1,
                userId: "6092b0b95ac64b00139c0345",
                images: [],
                createdAt: "2021-05-12T18:12:44.465Z",
                updatedAt: "2021-06-11T18:42:39.222Z",
                __v: 0,
                sequence: 2
            }
]
        }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Featured Listings Component", () => {
    it("renders", async () => {
        const {container} = render(
           <ThemeProvider theme={theme}>
                <FeaturedListings/>
            </ThemeProvider>
            )

        expect(container.innerHTML).toMatch(/Featured Listings/i)

        await waitFor(() => {
            expect(container.innerHTML).toMatch(/Demonstration/i)
            expect(container.innerHTML).toMatch(/My Stay Make/i)
            expect(container.innerHTML).toMatch(/Cruisers/i)
        })
    })
})