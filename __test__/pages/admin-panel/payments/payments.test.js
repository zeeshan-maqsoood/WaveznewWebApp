import React from "react"
import { act } from "react-dom/test-utils"
import { render, fireEvent, screen, waitFor, within } from "@testing-library/react"
import { setupServer } from "msw/node"
import { rest } from "msw"
import Payments from "../../../../pages/admin-panel/payments"
import theme from "../../../../src/theme"
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
    rest.get("*", (req, res, ctx) => {
        return res(ctx.json({ success: true }))
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
               </ThemeProvider>
        )

        expect(container.innerHTML).toMatch(/Payments/i)

    })
})
