import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { act } from "react-dom/test-utils"
import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import VesselInformation from "../../../pages/editListing/information"
import theme from "../../../src/theme"
import { ThemeProvider } from "@material-ui/core/styles"
jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            locale: "en",
            push: jest.fn()
        }
    }
}))

const fakeListing = {
    createdAt: "2021-05-20T19:39:50.864Z",
    destinationAddress: [
        {
            city: "Toronto",
            country: "Canada",
            countryCode: "CA",
            postalCode: "M1N 3G8",
            province: "Ontario",
            rawAddress: "4 Eastwood Ave, Scarborough, ON, Canada",
            street: "4 Eastwood Ave",
            _id: "60b63b22bc422a001380e60b"
        },
        {
            city: "Toronto",
            country: "Canada",
            countryCode: "CA",
            postalCode: "M1N 1X7",
            province: "Ontario",
            rawAddress: "5 Clonmore Drive, Scarborough, ON, Canada",
            street: "5 Clonmore Dr",
            _id: "60b63b22bc422a001380e60c"
        }
    ],
    destinationLocation: [
        {
            latitude: "43.6906112",
            longitude: "-79.26749800000002",
            _id: "60b63b22bc422a001380e609"
        },
        {
            latitude: "43.6857881",
            longitude: "-79.2796145",
            _id: "60b63b22bc422a001380e60a"
        }
    ],
    rawAddress: "51 Jefferson Ave, Toronto, ON, Canada",
    updatedAt: "2021-06-01T13:50:26.182Z",
    userId: "609c1aeb25f7d100131b3950",
    vesselAddress: {
        city: "Toronto",
        country: "Canada",
        countryCode: "CA",
        postalCode: "M6K 1Y3",
        province: "Ontario",
        street: "51 Jefferson Ave"
    },
    vesselCategory: [
        {
            _id: "60c24fc7c1e648e46c16fb6d",
            name: "Yacht & Cabin Cruiser",
            isRental: true,
            isCharter: true,
            isStay: true,
            isProofOfId: true,
            isVesselDriversLicense: true,
            isVesselLicense: true,
            isVesselSafety: true,
            isInsurance: true,
            __v: 0
        }
    ],
    vesselLocation: {
        latitude: "43.6377737",
        longitude: "-79.4210248"
    },
    vesselStatus: "UNPUBLISHED",
    vesselType: "CHARTER",
    vesselYear: 2018,
    __v: 0,
    _id: "60a6bb0622e4000013474e82"
}

const fakeListingNoCategory = {
    createdAt: "2021-05-20T19:39:50.864Z",
    destinationAddress: [
        {
            city: "Toronto",
            country: "Canada",
            countryCode: "CA",
            postalCode: "M1N 3G8",
            province: "Ontario",
            rawAddress: "4 Eastwood Ave, Scarborough, ON, Canada",
            street: "4 Eastwood Ave",
            _id: "60b63b22bc422a001380e60b"
        },
        {
            city: "Toronto",
            country: "Canada",
            countryCode: "CA",
            postalCode: "M1N 1X7",
            province: "Ontario",
            rawAddress: "5 Clonmore Drive, Scarborough, ON, Canada",
            street: "5 Clonmore Dr",
            _id: "60b63b22bc422a001380e60c"
        }
    ],
    destinationLocation: [
        {
            latitude: "43.6906112",
            longitude: "-79.26749800000002",
            _id: "60b63b22bc422a001380e609"
        },
        {
            latitude: "43.6857881",
            longitude: "-79.2796145",
            _id: "60b63b22bc422a001380e60a"
        }
    ],
    rawAddress: "51 Jefferson Ave, Toronto, ON, Canada",
    updatedAt: "2021-06-01T13:50:26.182Z",
    userId: "609c1aeb25f7d100131b3950",
    vesselAddress: {
        city: "Toronto",
        country: "Canada",
        countryCode: "CA",
        postalCode: "M6K 1Y3",
        province: "Ontario",
        street: "51 Jefferson Ave"
    },
    vesselCategory: [],
    vesselLocation: {
        latitude: undefined,
        longitude: undefined
    },
    vesselStatus: "UNPUBLISHED",
    vesselType: "CHARTER",
    vesselYear: 2018,
    __v: 0,
    _id: "60a6bb0622e4000013474e82"
}

const fakeListingNoLocation = {
    createdAt: "2021-05-20T19:39:50.864Z",
    destinationAddress: [],
    destinationLocation: [
        {
            latitude: "43.6906112",
            longitude: "-79.26749800000002",
            _id: "60b63b22bc422a001380e609"
        },
        {
            latitude: "43.6857881",
            longitude: "-79.2796145",
            _id: "60b63b22bc422a001380e60a"
        }
    ],
    rawAddress: undefined,
    updatedAt: "2021-06-01T13:50:26.182Z",
    userId: "609c1aeb25f7d100131b3950",
    vesselAddress: { undefined },
    vesselCategory: [
        {
            _id: "60c24fc7c1e648e46c16fb6d",
            name: "Yacht & Cabin Cruiser",
            isRental: true,
            isCharter: true,
            isStay: true,
            isProofOfId: true,
            isVesselDriversLicense: true,
            isVesselLicense: true,
            isVesselSafety: true,
            isInsurance: true,
            __v: 0
        }
    ],
    vesselLocation: {
        latitude: undefined,
        longitude: undefined
    },
    vesselStatus: "UNPUBLISHED",
    vesselType: "CHARTER",
    vesselYear: 2018,
    __v: 0,
    _id: "60a6bb0622e4000013474e82"
}

const fakeListingNoDestination = {
    createdAt: "2021-05-20T19:39:50.864Z",
    destinationAddress: [undefined],
    destinationLocation: [undefined],
    rawAddress: "51 Jefferson Ave, Toronto, ON, Canada",
    updatedAt: "2021-06-01T13:50:26.182Z",
    userId: "609c1aeb25f7d100131b3950",
    vesselAddress: {
        city: "Toronto",
        country: "Canada",
        countryCode: "CA",
        postalCode: "M6K 1Y3",
        province: "Ontario",
        street: "51 Jefferson Ave"
    },
    vesselCategory: [
        {
            _id: "60c24fc7c1e648e46c16fb6d",
            name: "Yacht & Cabin Cruiser",
            isRental: true,
            isCharter: true,
            isStay: true,
            isProofOfId: true,
            isVesselDriversLicense: true,
            isVesselLicense: true,
            isVesselSafety: true,
            isInsurance: true,
            __v: 0
        }
    ],
    vesselLocation: {
        latitude: "43.6377737",
        longitude: "-79.4210248"
    },
    vesselStatus: "UNPUBLISHED",
    vesselType: "CHARTER",
    vesselYear: 2018,
    __v: 0,
    _id: "60a6bb0622e4000013474e82"
}

const server = setupServer(
    rest.put("*/charters*", (req, res, ctx) => {

        return res(ctx.json({ message: "Submit successful" }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


describe("Edit vesselInformation Component", () => {
    it("renders correctly", async () => {
        render(
            <ThemeProvider theme={theme}>
                <VesselInformation getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )
    })

    // it("dummy test", async () => {
    // })

    it('handles save button click', async () => {
        const mockOnClick = jest.fn()

        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <VesselInformation onClick={mockOnClick()} getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )
        await act(async () => {
            fireEvent.click(getByTestId("saveBtn"))
        })

        expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('tests validation success', async () => {
        const mockOnClick = jest.fn()

        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <VesselInformation onClick={mockOnClick()} listingStartValue={fakeListing} getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )

        await act(async () => {
            fireEvent.change(getByTestId("title"), { target: { value: "test title" } })
            fireEvent.change(getByTestId("description"), { target: { value: "test description" } })
            // fireEvent.change(getByTestId("placement"), { target: { value: "Water" } })
        })

        await act(async () => {
            fireEvent.click(getByTestId("saveBtn"))
        })

        expect(mockOnClick).toHaveBeenCalledTimes(1)
        expect(container.innerHTML).not.toMatch(/enter a title/i)
        expect(container.innerHTML).not.toMatch(/enter a description/i)
        // expect(container.innerHTML).not.toMatch(/select the placement/i);
        expect(container.innerHTML).not.toMatch(/enter a trailer plate/i)
        expect(container.innerHTML).not.toMatch(/select a category/i)
        expect(container.innerHTML).not.toMatch(/select a location/i)
    })

    it('tests validation missing category', async () => {
        const mockOnClick = jest.fn()

        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <VesselInformation onClick={mockOnClick()} listingStartValue={fakeListingNoCategory} getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )

        await act(async () => {
            fireEvent.change(getByTestId("title"), { target: { value: "test title" } })
            fireEvent.change(getByTestId("description"), { target: { value: "test description" } })
            // fireEvent.change(getByTestId("placement"), { target: { value: "Water" } })
        })

        await act(async () => {
            fireEvent.click(getByTestId("saveBtn"))
        })

        expect(mockOnClick).toHaveBeenCalledTimes(1)
        expect(container.innerHTML).toMatch(/select a category/i)
    })

    it('tests validation missing location', async () => {
        const mockOnClick = jest.fn()

        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <VesselInformation onClick={mockOnClick()} listingStartValue={fakeListingNoLocation} getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )

        await act(async () => {
            fireEvent.change(getByTestId("title"), { target: { value: "test title" } })
            fireEvent.change(getByTestId("description"), { target: { value: "test description" } })
            // fireEvent.change(getByTestId("placement"), { target: { value: "Water" } })
        })

        await act(async () => {
            fireEvent.click(getByTestId("saveBtn"))
        })

        expect(mockOnClick).toHaveBeenCalledTimes(1)
        expect(container.innerHTML).toMatch(/select a location/i)
    })

    it('tests validation missing destination', async () => {
        const mockOnClick = jest.fn()

        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <VesselInformation onClick={mockOnClick()} listingStartValue={fakeListingNoDestination} getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )

        await act(async () => {
            fireEvent.change(getByTestId("title"), { target: { value: "test title" } })
            fireEvent.change(getByTestId("description"), { target: { value: "test description" } })
            // fireEvent.change(getByTestId("placement"), { target: { value: "Water" } })
        })

        await act(async () => {
            fireEvent.click(getByTestId("saveBtn"))
        })

        expect(mockOnClick).toHaveBeenCalledTimes(1)
        expect(container.innerHTML).toMatch(/select a location/i)
    })


})
