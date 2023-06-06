import React from "react"
import { act } from "react-dom/test-utils"
import {render, fireEvent, screen, waitFor, within} from "@testing-library/react"
import {setupServer} from "msw/node"
import {rest} from "msw"
import Payments from "../../../../pages/accountInfo/payments/index"
import GlobalStateProvider from "../../../../store/globalStateProvider"
import {ThemeProvider} from "@material-ui/core/styles"
import theme from "../../../../src/theme"

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
    rest.get("*", (req, res, ctx) => {
        return res(ctx.json({success: true}))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Admin Panel - Payments Component", () => {
    it("renders", async () => {
        const { container, getByTestId, getByDisplayValue } = render(
            <ThemeProvider theme={theme}>
                <Payments />
            </ThemeProvider>)
        expect(container.innerHTML).toMatch(/Payment methods/i)

    })
})

it('Add Payment button click', async () => {
    const mockOnClick = jest.fn()

    const {getByTestId, container} = render(
           <ThemeProvider theme={theme}>
               <GlobalStateProvider>
                   <Payments onClick={mockOnClick()}/>
               </GlobalStateProvider>
           </ThemeProvider>)
    await act(async () => {
        fireEvent.click(getByTestId("addPaymentBtn"))
    })

    expect(mockOnClick).toHaveBeenCalledTimes(1)
})

it('Add Payout button click', async () => {
    const mockOnClick = jest.fn()

    const {getByTestId, container} = render(
     <ThemeProvider theme={theme}>
        <GlobalStateProvider>
            <Payments onClick={mockOnClick()}/>
        </GlobalStateProvider>
     </ThemeProvider>)
    await act(async () => {
        fireEvent.click(getByTestId("addPayoutBtn"))
    })

    expect(mockOnClick).toHaveBeenCalledTimes(1)
})