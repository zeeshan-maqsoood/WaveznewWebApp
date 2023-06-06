import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { act } from "react-dom/test-utils"
import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import VesselDescription from "../../../pages/editListing/vesselDescription"
import theme from "../../../src/theme"
import { ThemeProvider } from "@material-ui/core/styles"
import * as nextRouter from 'next/router'

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

const server = setupServer(
    rest.get("*rentals*", (req, res, ctx) => {
        return res(ctx.json({ message: "Valid token" }))
    }),
    rest.get("*", (req, res, ctx) => {
        return res(ctx.json({ message: "Valid token" }))
    }),

    rest.put("*/rentals*", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ message: "Successful" }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Edit vesselDescription component", () => {

    // it("dummy test", async () => {
    // });

    it("renders correctly", async () => {
        render(
            <ThemeProvider theme={theme}>
                <VesselDescription getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )
    })

    it('tests validation all fields entered', async () => {
        const mockOnClick = jest.fn()
        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <VesselDescription onClick={mockOnClick()} listingStartValue={{ vesselType: "RENTAL", vesselYear: 2000, vesselFuelType: { _id: "60dcb1134413490013b36e97", fuel: "Gas", isVisible: true, __v: 0  }, hasLifeJackets: true, hasFirstAidKit: true, hasFlashlight: true, hasRope: true }} getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )

        await act(async () => {
            fireEvent.change(getByTestId("make"), { target: { value: "test make" } })
            fireEvent.change(getByTestId("model"), { target: { value: "test model" } })
            fireEvent.change(getByTestId("length"), { target: { value: "123" } })
            fireEvent.click(getByTestId("btnLbs"))
            fireEvent.change(getByTestId("weight"), { target: { value: "123" } })
            fireEvent.change(getByTestId("maxSpeed"), { target: { value: "123" } })
            fireEvent.change(getByTestId("horsePower"), { target: { value: "123" } })
        })

        await act(async () => {
            fireEvent.click(getByTestId("saveBtn"))
        })

        expect(container.innerHTML).not.toMatch(/Required/i)
        expect(container.innerHTML).not.toMatch(/enter the make/i)
        expect(container.innerHTML).not.toMatch(/enter the model/i)
        expect(container.innerHTML).not.toMatch(/enter the length/i)
        expect(container.innerHTML).not.toMatch(/enter the weight/i)
        expect(container.innerHTML).not.toMatch(/enter the max speed/i)
        expect(container.innerHTML).not.toMatch(/enter the horse power/i)
        expect(container.innerHTML).not.toMatch(/select a year/i)
        expect(container.innerHTML).not.toMatch(/enter the fuel type/i)
    })

    it('tests validation missing make', async () => {
        const mockOnClick = jest.fn()

        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <VesselDescription onClick={mockOnClick()} listingStartValue={{ vesselType: "RENTAL", vesselYear: 2000, vesselFuelType: { _id: "60dcb1134413490013b36e97", fuel: "Gas", isVisible: true, __v: 0  }, hasLifeJackets: true, hasFirstAidKit: true, hasFlashlight: true, hasRope: true }} getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )

        await act(async () => {
            fireEvent.change(getByTestId("model"), { target: { value: "test model" } })
            fireEvent.change(getByTestId("length"), { target: { value: "123" } })
            fireEvent.click(getByTestId("btnLbs"))
            fireEvent.change(getByTestId("weight"), { target: { value: "123" } })
            fireEvent.change(getByTestId("maxSpeed"), { target: { value: "123" } })
            fireEvent.change(getByTestId("horsePower"), { target: { value: "123" } })
        })

        await act(async () => {
            fireEvent.click(getByTestId("saveBtn"))
        })

        expect(container.innerHTML).toMatch(/enter the make/i)
    })

    it('tests validation missing model', async () => {
        const mockOnClick = jest.fn()

        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <VesselDescription onClick={mockOnClick()} listingStartValue={{ vesselType: "RENTAL", vesselYear: 2000, vesselFuelType: { _id: "60dcb1134413490013b36e97", fuel: "Gas", isVisible: true, __v: 0  }, hasLifeJackets: true, hasFirstAidKit: true, hasFlashlight: true, hasRope: true }} getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )

        await act(async () => {
            fireEvent.change(getByTestId("make"), { target: { value: "test make" } })
            fireEvent.change(getByTestId("length"), { target: { value: "123" } })
            fireEvent.click(getByTestId("btnLbs"))
            fireEvent.change(getByTestId("weight"), { target: { value: "123" } })
            fireEvent.change(getByTestId("maxSpeed"), { target: { value: "123" } })
            fireEvent.change(getByTestId("horsePower"), { target: { value: "123" } })
        })

        await act(async () => {
            fireEvent.click(getByTestId("saveBtn"))
        })

        expect(container.innerHTML).toMatch(/enter the model/i)
    })

    it('tests validation missing length', async () => {
        const mockOnClick = jest.fn()

        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <VesselDescription onClick={mockOnClick()} listingStartValue={{ vesselType: "RENTAL", vesselYear: 2000, vesselFuelType: { _id: "60dcb1134413490013b36e97", fuel: "Gas", isVisible: true, __v: 0  }, hasLifeJackets: true, hasFirstAidKit: true, hasFlashlight: true, hasRope: true }} getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )

        await act(async () => {
            fireEvent.change(getByTestId("make"), { target: { value: "test make" } })
            fireEvent.change(getByTestId("model"), { target: { value: "test model" } })
            fireEvent.click(getByTestId("btnLbs"))
            fireEvent.change(getByTestId("weight"), { target: { value: "123" } })
            fireEvent.change(getByTestId("maxSpeed"), { target: { value: "123" } })
            fireEvent.change(getByTestId("horsePower"), { target: { value: "123" } })
        })

        await act(async () => {
            fireEvent.click(getByTestId("saveBtn"))
        })

        expect(container.innerHTML).toMatch(/enter the length/i)
    })

    it('tests validation missing weight', async () => {
        const mockOnClick = jest.fn()

        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <VesselDescription onClick={mockOnClick()} listingStartValue={{ vesselType: "RENTAL", vesselYear: 2000, vesselFuelType: { _id: "60dcb1134413490013b36e97", fuel: "Gas", isVisible: true, __v: 0  }, hasLifeJackets: true, hasFirstAidKit: true, hasFlashlight: true, hasRope: true }} getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )

        await act(async () => {
            fireEvent.change(getByTestId("make"), { target: { value: "test make" } })
            fireEvent.change(getByTestId("model"), { target: { value: "test model" } })
            fireEvent.change(getByTestId("length"), { target: { value: "123" } })
            fireEvent.click(getByTestId("btnLbs"))
            fireEvent.change(getByTestId("maxSpeed"), { target: { value: "123" } })
            fireEvent.change(getByTestId("horsePower"), { target: { value: "123" } })
        })

        await act(async () => {
            fireEvent.click(getByTestId("saveBtn"))
        })

        expect(container.innerHTML).toMatch(/enter the weight/i)
    })

    it('tests validation missing maxSpeed', async () => {
        const mockOnClick = jest.fn()

        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <VesselDescription onClick={mockOnClick()} listingStartValue={{ vesselType: "RENTAL", vesselYear: 2000, vesselFuelType: { _id: "60dcb1134413490013b36e97", fuel: "Gas", isVisible: true, __v: 0  }, hasLifeJackets: true, hasFirstAidKit: true, hasFlashlight: true, hasRope: true }} getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )

        await act(async () => {
            fireEvent.change(getByTestId("make"), { target: { value: "test make" } })
            fireEvent.change(getByTestId("model"), { target: { value: "test model" } })
            fireEvent.change(getByTestId("length"), { target: { value: "123" } })
            fireEvent.click(getByTestId("btnLbs"))
            fireEvent.change(getByTestId("weight"), { target: { value: "123" } })
            fireEvent.change(getByTestId("horsePower"), { target: { value: "123" } })
        })

        await act(async () => {
            fireEvent.click(getByTestId("saveBtn"))
        })

        expect(container.innerHTML).toMatch(/enter the max speed/i)
    })

    it('tests validation missing horse power', async () => {
        const mockOnClick = jest.fn()

        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <VesselDescription onClick={mockOnClick()} listingStartValue={{ vesselType: "RENTAL", vesselYear: 2000, vesselFuelType: { _id: "60dcb1134413490013b36e97", fuel: "Gas", isVisible: true, __v: 0  }, hasLifeJackets: true, hasFirstAidKit: true, hasFlashlight: true, hasRope: true }} getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )

        await act(async () => {
            fireEvent.change(getByTestId("make"), { target: { value: "test make" } })
            fireEvent.change(getByTestId("model"), { target: { value: "test model" } })
            fireEvent.change(getByTestId("length"), { target: { value: "123" } })
            fireEvent.click(getByTestId("btnLbs"))
            fireEvent.change(getByTestId("weight"), { target: { value: "123" } })
            fireEvent.change(getByTestId("maxSpeed"), { target: { value: "123" } })
        })

        await act(async () => {
            fireEvent.click(getByTestId("saveBtn"))
        })

        expect(container.innerHTML).toMatch(/enter the horse power/i)
    })

    it('tests validation missing year', async () => {
        const mockOnClick = jest.fn()

        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <VesselDescription onClick={mockOnClick()} listingStartValue={{ vesselType: "RENTAL", vesselFuelType: { _id: "60dcb1134413490013b36e97", fuel: "Gas", isVisible: true, __v: 0  }, hasLifeJackets: true, hasFirstAidKit: true, hasFlashlight: true, hasRope: true }} getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )

        await act(async () => {
            fireEvent.change(getByTestId("make"), { target: { value: "test make" } })
            fireEvent.change(getByTestId("model"), { target: { value: "test model" } })
            fireEvent.change(getByTestId("length"), { target: { value: "123" } })
            fireEvent.click(getByTestId("btnLbs"))
            fireEvent.change(getByTestId("weight"), { target: { value: "123" } })
            fireEvent.change(getByTestId("maxSpeed"), { target: { value: "123" } })
            fireEvent.change(getByTestId("horsePower"), { target: { value: "123" } })
        })

        await act(async () => {
            fireEvent.click(getByTestId("saveBtn"))
        })

        expect(container.innerHTML).toMatch(/select a year/i)
    })

    it('tests validation missing fuel type', async () => {
        const mockOnClick = jest.fn()

        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <VesselDescription onClick={mockOnClick()} listingStartValue={{ vesselType: "RENTAL", vesselYear: 2000, hasLifeJackets: true, hasFirstAidKit: true, hasFlashlight: true, hasRope: true }} getListingInfo={() => { }} setUnsavedChanges={() => { }} />
            </ThemeProvider>
        )

        await act(async () => {
            fireEvent.change(getByTestId("make"), { target: { value: "test make" } })
            fireEvent.change(getByTestId("model"), { target: { value: "test model" } })
            fireEvent.change(getByTestId("length"), { target: { value: "123" } })
            fireEvent.click(getByTestId("btnLbs"))
            fireEvent.change(getByTestId("weight"), { target: { value: "123" } })
            fireEvent.change(getByTestId("maxSpeed"), { target: { value: "123" } })
            fireEvent.change(getByTestId("horsePower"), { target: { value: "123" } })
        })

        await act(async () => {
            fireEvent.click(getByTestId("saveBtn"))
        })


        setTimeout(() => {
            expect(container.innerHTML).toMatch(/enter the fuel type/i)
        }, 200)
    })
})
