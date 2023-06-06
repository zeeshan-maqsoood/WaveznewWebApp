import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { act } from "react-dom/test-utils"
import { render, fireEvent } from "@testing-library/react"
import Search from "../../../pages/search/[vesselType]"
import GlobalStateProvider from "../../../store/globalStateProvider"

import Footer from "../../../components/footer"
import { ThemeProvider } from "@material-ui/core/styles"
import theme from "../../../src/theme"


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
    rest.post("vessel/search", (req, res, ctx) => {

        return res(ctx.status(200), ctx.json([
            {
                vesselLocation: {
                    longitude: "-79.4210248",
                    latitude: "43.6377737"
                },
                vesselAddress: {
                    street: "51 Jefferson Ave",
                    postalCode: "M6K 1Y3",
                    city: "Toronto",
                    countryCode: "CA",
                    country: "Canada",
                    province: "Ontario"
                },
                vesselPricing: {
                    perDay: {
                        amount: 10,
                        minimumTime: 2,
                        checked: true
                    },
                    perNight: {
                        amount: 50,
                        minimumTime: 0,
                        checked: true
                    },
                    currency: "CAD",
                    minimumDeposit: 1000
                },
                description: "",
                vesselCategory: [
                    "609428050103971836d6141f",
                    "609428140103971836d61421"
                ],
                vesselStatus: "UNPUBLISHED",
                vesselFeatures: [],
                documentsIds: [],
                blockedEvents: [],
                bookedEvents: [],
                _id: "60983fa911a97b0013b580be",
                images: [],
                numberOfPassengers: 3,
                vesselYear: 2020,
                title: "Rental 1",
                vesselType: "RENTAL",
                userId: "607f288d75bd091aec665e97",
                createdAt: "2021-05-09T20:01:45.438Z",
                updatedAt: "2021-06-22T15:20:45.303Z",
                __v: 0,
                sequence: -1,
                destinationLocation: [],
                destinationAddress: []
            }
        ]))

    }))
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Rendering search page", () => {
    it("Renders location data", async () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GlobalStateProvider>
                    <Search />
                </GlobalStateProvider>
            </ThemeProvider>
        )

        setTimeout(() => {
            expect(container.innerHTML).toMatch(/Rental 1/i)
        }, 2000)

    })
})

describe("Get footer Component", () => {
    it("renders", async () => {
        const { container, getByTestId, getByRole } = render(
            <Footer />
        )
        expect(container.innerHTML).toMatch(/FAQ/i)
    })
})