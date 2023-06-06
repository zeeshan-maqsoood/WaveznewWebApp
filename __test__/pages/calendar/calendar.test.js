import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { act } from "react-dom/test-utils"
import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import Calendar from "../../../pages/calendar"
import {ThemeProvider} from "@material-ui/core/styles"
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
    rest.put("*", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ message: "Successful" }))
    }),
    rest.get("users/getListings", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([
            {
                blockedEvents: ["60db9b4f82c1900013d17153"],
                bookedEvents: (2)["60db57099376c6aca4d5d58e", "60db58229376c6aca4d5d590"],
                createdAt: "2021-06-14T13:50:07.515Z",
                description: "description of watercraft",
                destinationAddress: [],
                destinationLocation: [],
                documentsIds: ["60d0f3b21ac4240013aacf3f", "60d0f3b51ac4240013aacf45", "60d0f3b91ac4240013aacf4b"],
                images: [],
                numberOfPassengers: 1,
                rawAddress: "51 Jefferson Ave, Toronto, ON, Canada",
                sequence: -1,
                title: "Old Sail Boat",
                trailerPlateNumber: "Plate number",
                updatedAt: "2021-06-29T22:22:08.379Z",
                userId: "609c1aeb25f7d100131b3950",
                vesselAddress: { street: "51 Jefferson Ave", postalCode: "M6K 1Y3", city: "Toronto", countryCode: "CA", country: "Canada", province: "Ontario" },
                vesselBrand: "123",
                vesselCategory: ["60c24fc7c1e648e46c16fb6d"],
                vesselFeatures: [],
                vesselFuelType: "Diesel",
                vesselHorsePower: 123,
                vesselLength: 123,
                vesselLocation: { longitude: "-79.4210248", latitude: "43.6377737" },
                vesselMaxSpeed: 123,
                vesselModelInfo: "123",
                vesselPlacement: "Trailer",
                vesselStatus: "UNPUBLISHED",
                vesselType: "RENTAL",
                vesselWeight: { weight: 123, unit: "GT" },
                vesselYear: 2019,
                __v: 0,
                _id: "60c75e8f1700bb001335065e"
            }
        ]))
    }),
    rest.post("event/blockTimeslot/", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ message: "Successful" }))
    }),
    rest.post("event/search", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([
            {
                bookingDetails: { numberOfPassengers: 2, notes: "Test Notes" },
                createdAt: "2021-06-21T15:34:29.730Z",
                createdBy: "609c1aeb25f7d100131b3950",
                end: new Date("Mon Jun 21 2021 10: 00: 16 GMT - 0400(Eastern Daylight Time)"),
                eventType: "BOOKED",
                modifiedBy: "609c1aeb25f7d100131b3950",
                start: new Date("Mon Jun 21 2021 09: 00: 16 GMT - 0400(Eastern Daylight Time)"),
                title: "harry styles",
                updatedAt: "2021-06-21T15:34:29.730Z",
                userDetails: { _id: "60d2130b2994e6001331a06e", firstName: "harry", lastName: "styles" },
                vessel: { _id: "60c75e8f1700bb001335065e", vesselYear: 2019, title: "Old Sail Boat" },
                _id: "60db57099376c6aca4d5d58e"
            },
            {
                bookingDetails: { numberOfPassengers: 5, notes: "Test new Notes" },
                createdAt: "2021-06-21T15:34:29.730Z",
                createdBy: "609c1aeb25f7d100131b3950",
                end: new Date("Mon Jun 21 2021 07:00:16 GMT-0400 (Eastern Daylight Time)"),
                eventType: "BOOKED",
                modifiedBy: "609c1aeb25f7d100131b3950",
                start: new Date("Mon Jun 21 2021 05:00:16 GMT-0400 (Eastern Daylight Time)"),
                title: "Oscar Wilde",
                updatedAt: "2021-06-21T15:34:29.730Z",
                userDetails: { _id: "60db36ba4de0dc00131dd0a3", firstName: "Oscar", lastName: "Wilde" },
                vessel: { _id: "60c75e8f1700bb001335065e", vesselYear: 2019, title: "Old Sail Boat" },
                _id: "60db58229376c6aca4d5d590"
            },
            {
                createdAt: "2021-06-29T22:14:39.264Z",
                createdBy: "609c1aeb25f7d100131b3950",
                end: new Date("Thu Jun 10 2021 23:59:00 GMT-0400 (Eastern Daylight Time)"),
                eventType: "BLOCKED",
                modifiedBy: "609c1aeb25f7d100131b3950",
                start: new Date("Wed Jun 09 2021 00:00:00 GMT-0400 (Eastern Daylight Time)"),
                title: "BLOCKED",
                updatedAt: "2021-06-29T22:14:39.264Z",
                vessel: { _id: "60c75e8f1700bb001335065e", vesselYear: 2019, title: "Old Sail Boat" },
                __v: 0,
                _id: "60db9b4f82c1900013d17153"
            }
        ]))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


describe("Calendar Component", () => {
    it("renders correctly", async () => {
        render(
            <ThemeProvider theme={theme}>
            <Calendar />
            </ThemeProvider>
        )
    })

    it('expect events not rendered', async () => {
        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <Calendar />
            </ThemeProvider>
        )

        expect(container.innerHTML).not.toMatch(/BLOCKED/i)
        expect(container.innerHTML).not.toMatch(/Oscar Wilde/i)
        expect(container.innerHTML).not.toMatch(/harry styles/i)
    })

    it('expect events rendered successfully', async () => {
        const { getByTestId, container } = render(
           <ThemeProvider theme={theme}>
            <Calendar />
           </ThemeProvider>
        )

        await act(async () => {
            setTimeout(() => {
                fireEvent.click(getByTestId("checkbox_60c75e8f1700bb001335065e"))
            }, 2000)
        })

        setTimeout(() => {
            expect(container.innerHTML).toMatch(/BLOCKED/i)
            expect(container.innerHTML).toMatch(/Oscar Wilde/i)
            expect(container.innerHTML).toMatch(/harry styles/i)
        }, 2000)
    })
})
