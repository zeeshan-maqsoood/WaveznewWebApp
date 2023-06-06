import React from "react"
import { act } from "react-dom/test-utils"
import {render, fireEvent, screen, waitFor, within} from "@testing-library/react"
import HeroText from "../../../../../pages/admin-panel/pages/home/hero-text"
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
    rest.put("*/configuration/:key", (req, res, ctx) => {
        return res(ctx.json({
            arrayValue:[],
            _id:"test",
            key:"HOME_HERO_TEXT",
            stringValue:"new testing data",
            booleanValue:false,
            numberValue:0 }))
    }),
    rest.get("*/configuration/:key", (req, res, ctx) => {
        return res(ctx.json({
            arrayValue:[],
            _id:"test",
            key:"HOME_HERO_TEXT",
            stringValue:"old testing data",
            booleanValue:false,
            numberValue:0 }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Hero Text Component", () => {
    it("renders", async () => {
        const { container, getByTestId, getByDisplayValue } = render(
               <ThemeProvider theme={theme}>
                   <HeroText />
               </ThemeProvider>
        )

        expect(container.innerHTML).toMatch(/Hero Text/i)

        await waitFor(() => {
            expect(getByDisplayValue("old testing data")).toBeInTheDocument()
            const { getByText } = within(getByTestId("counterContainer"))
            // testing if the number counter is working
            expect(getByText(/16/i)).toBeInTheDocument()
        })

        // checking if the button id disabled when the component renders
        expect(getByTestId("heroTextSaveBtn").closest('button')).toBeDisabled()
    })

    it('handles save button click', async () => {
        const { getByTestId, container, getByDisplayValue } = render(
             <ThemeProvider theme={theme}>
                 <HeroText />
              </ThemeProvider>
        )

        await waitFor(() => {
            expect(getByDisplayValue("old testing data")).toBeInTheDocument()
        })

        const saveButton = getByTestId("heroTextSaveBtn")

        await act(async () => {
            fireEvent.change(getByTestId("heroTextField"), {
                target: { value: "new testing" }
            })
        })

        await act(async () => {
            fireEvent.change(getByTestId("heroTextField"), {
                target: { value: "new testing data" }
            })
        })

        await act(async () => {
            fireEvent.click(saveButton)
        })

        await waitFor(() => {
            expect(getByDisplayValue("new testing data")).toBeInTheDocument()
            const { getByText } = within(getByTestId("counterContainer"))
            // testing if the number counter is working
            expect(getByText(/16/i)).toBeInTheDocument()
        })

        // checking if the button id disabled when the data is saved
        expect(getByTestId("heroTextSaveBtn").closest('button')).toBeDisabled()
    })

    it('handles reset button click', async () => {
        const { getByTestId, container, getByDisplayValue } = render(
               <ThemeProvider theme={theme}>
            <HeroText />
              </ThemeProvider>
        )

        await waitFor(() => {
            expect(getByDisplayValue("old testing data")).toBeInTheDocument()
        })

        const resetButton = getByTestId("heroTextResetBtn")

        await act(async () => {
            fireEvent.change(getByTestId("heroTextField"), {
                target: { value: "new reset testing" }
            })
        })

        await waitFor(() => {
            expect(screen.getByDisplayValue("new reset testing")).toBeInTheDocument()
            const { getByText } = within(getByTestId("counterContainer"))
            // testing if the number counter is working
            expect(getByText(/17/i)).toBeInTheDocument()
        })

        await act(async () => {
            fireEvent.click(resetButton)
        })

        expect(getByDisplayValue("old testing data")).toBeInTheDocument()
    })
})