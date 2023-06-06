import React from "react"
import { act } from "react-dom/test-utils"
import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import AddListScreen from "../../../pages/addList/getStarted"
import GlobalStateProvider from "../../../store/globalStateProvider"
import Context from "../../../store/context"
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

describe("Get Started Component", () => {
    it("renders", async () => {
        const { container, getByTestId, getByRole } = render(
            <ThemeProvider theme={theme}>
                <GlobalStateProvider>
                    <AddListScreen />
                </GlobalStateProvider>
            </ThemeProvider>)

        expect(container.innerHTML).toMatch(/Welcome/i)
    })

    it('handles start button click', async () => {
        const mockOnClick = jest.fn()
        // jest.spyOn()
        const { getByTestId, container } = render(
            <ThemeProvider theme={theme}>
                <GlobalStateProvider>
                    <AddListScreen onClick={mockOnClick()} />
                </GlobalStateProvider>
            </ThemeProvider>)
        await act(async () => {
            fireEvent.click(getByTestId("startBtn"))
        })

        expect(mockOnClick).toHaveBeenCalledTimes(1)
    })
})
