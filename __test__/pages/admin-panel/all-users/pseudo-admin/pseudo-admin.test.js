/* eslint-disable func-call-spacing */
import React from "react"
import {act} from "react-dom/test-utils"
import {fireEvent, render, screen, waitFor, within} from "@testing-library/react"
import PseudoAdmin from "../../../../../pages/admin-panel/all-users/pseudo-admin/index.js"
import {setupServer} from "msw/node"
import {rest} from "msw"
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
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Pseudo Admin Component", () => {
    // 1
    it("renders", async () => {
        const {container, getByTestId, getByDisplayValue, getByText} = render(
              <ThemeProvider theme={theme}>
                  <PseudoAdmin/>
              </ThemeProvider>
        )

        expect(container.innerHTML).toMatch(/Name/i)
    })

    // 2
    it('handles save button click', async () => {
        const mockOnClick = jest.fn()

        const { getByTestId, container, getByText } = render

        (
            <ThemeProvider theme={theme}>
            <PseudoAdmin onClick={mockOnClick()}
                                handleSave={() => { }}
                                setUnsavedChanges={() => { }} />
              </ThemeProvider>
        )

        await act(async () => {
            fireEvent.click(getByTestId("textSaveBtn"))
        })

        expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    // 3
    it('handles delete button click', async () => {
        const {getByTestId, container, getByDisplayValue} = render(
               <ThemeProvider theme={theme}>
                   <PseudoAdmin />
              </ThemeProvider>
        )

        const Button = ({ onClick, children }) => (
            <button onClick={onClick}>{children}</button>
        )

        const handleDelete = jest.fn()
        render(<Button onClick={handleDelete}>Delete</Button>)
        fireEvent.click(screen.getByText(/Delete/i))
        expect(handleDelete).toHaveBeenCalledTimes(1)
    })
})
