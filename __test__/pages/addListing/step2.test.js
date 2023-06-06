import React, { useContext } from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { act } from "react-dom/test-utils"
import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import Step2 from "../../../pages/addList/step2"
import Context from "../../../store/context"
import GlobalStateProvider from "../../../store/globalStateProvider"
import theme from "../../../src/theme"
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
    rest.post("*", (req, res, ctx) => {
        req.body = {

        }
        return res(ctx.json({ message: "Success" }))
    }),
    rest.get("*", (req, res, ctx) => {
        req.body = {

        }
        return res(ctx.json({ message: "Success" }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Step 2 Component", () => {
    it("renders correctly", async () => {
        render(
   <ThemeProvider theme={theme}>
            <GlobalStateProvider>
            <Step2 />
        </GlobalStateProvider>
             </ThemeProvider>
        )
    })

    it('handles next button click', async () => {
        const mockOnClick = jest.fn()
        const { getByTestId, container } = render(
              <ThemeProvider theme={theme}>
            <Context.Provider value={{ globalState: { addListPassengers: 2 } }}>
            <Step2 onClick={mockOnClick()} />
        </Context.Provider>
              </ThemeProvider>
        )
        await act(async () => {
            fireEvent.click(getByTestId("nextBtn"))
        })

        expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('handles undefined location', async () => {
        const mockOnClick = jest.fn()
        const { getByTestId, container } = render(
               <ThemeProvider theme={theme}>
            <Context.Provider value={{ globalState: { addListStep: 2, addListPassengers: 3, addListLocation: undefined, addListService: "Rental" } }}>
            <Step2 onClick={mockOnClick()} />
        </Context.Provider>
              </ThemeProvider>
        )

        await act(async () => {
            fireEvent.click(getByTestId("nextBtn"))
        })

        expect(mockOnClick).toHaveBeenCalledTimes(1)
        expect(container.innerHTML).toMatch(/select a location/i)
    })

    it('handles undefined destination', async () => {
        const mockOnClick = jest.fn()
        const { getByTestId, container } = render(
               <ThemeProvider theme={theme}>
            <Context.Provider value={{ globalState: { addListStep: 2, addListPassengers: 3, addListLocation: "Some Location", addListDestination: [undefined], addListDestinationDisplay: [undefined], addListDestinationLatLng: [undefined], addListService: "Charter" } }}>
            <Step2 onClick={mockOnClick()} />
        </Context.Provider>
              </ThemeProvider>
        )

        await act(async () => {
            fireEvent.click(getByTestId("nextBtn"))
        })

        expect(mockOnClick).toHaveBeenCalledTimes(1)
        expect(container.innerHTML).toMatch(/select a location/i)
    })

    it('handles valid location and destination', async () => {
        const mockOnClick = jest.fn()
        const mockGlobalDispatch = jest.fn()
        const { getByTestId, container } = render(
               <ThemeProvider theme={theme}>
            <Context.Provider value={{ globalState: { addListStep: 2, addListPassengers: 3, addListLocation: "Some Location", addListDestination: ["Some Destination"], addListDestinationDisplay: ["Some Destination"], addListDestinationLatLng: [{ latitude: 70, longitude: 70 }], addListService: "Charter" }, globalDispatch: mockGlobalDispatch }}>
            <Step2 onClick={mockOnClick()} />
        </Context.Provider>
              </ThemeProvider>
        )

        await act(async () => {
            fireEvent.click(getByTestId("nextBtn"))
        })

        expect(mockOnClick).toHaveBeenCalledTimes(1)
        expect(container.innerHTML).not.toMatch(/select a location/i)
        expect(mockGlobalDispatch).toHaveBeenCalledTimes(1)
    })
})
