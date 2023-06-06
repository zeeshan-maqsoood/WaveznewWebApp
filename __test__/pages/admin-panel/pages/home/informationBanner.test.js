import React from "react"
import { act } from "react-dom/test-utils"
import {render, fireEvent, screen, waitFor, within} from "@testing-library/react"
import {setupServer} from "msw/node"
import {rest} from "msw"
import InformationBanner from "../../../../../pages/admin-panel/pages/home/information-banner"
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
        if (req.params.key === 'INFORMATION_BANNER_PAGE_CONTENT') {
            return res(ctx.json({
                arrayValue:[],
                _id:"test",
                key:"INFORMATION_BANNER_PAGE_CONTENT",
                stringValue:"<p>Test</p>",
                booleanValue:false,
                numberValue:0}))
        } else {
            return res(ctx.json({
                arrayValue:[],
                _id:"test",
                key:"INFORMATION_BANNER_TITLE",
                stringValue:"new testing data",
                booleanValue:true,
                numberValue:0}))
        }
    }),
    rest.get("*/configuration/:key", (req, res, ctx) => {
        if (req.params.key === 'INFORMATION_BANNER_PAGE_CONTENT') {
            return res(ctx.json({
                arrayValue:[],
                _id:"test",
                key:"INFORMATION_BANNER_PAGE_CONTENT",
                stringValue:"<p>Test New</p>",
                booleanValue:false,
                numberValue:0}))
        } else {
            return res(ctx.json({
                arrayValue:[],
                _id:"test",
                key:"INFORMATION_BANNER_TITLE",
                stringValue:"old testing data",
                booleanValue:true,
                numberValue:0}))
        }
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Information Banner Component", () => {
    it("renders", async () => {
        const { container, getByTestId, getByDisplayValue } = render(
              <ThemeProvider theme={theme}>
                  <InformationBanner />
              </ThemeProvider>
        )

        expect(container.innerHTML).toMatch(/Information Banner/i)

        await waitFor(() => {
            expect(getByDisplayValue("old testing data")).toBeInTheDocument()
        })

        expect(getByTestId("saveBtn")).toBeDefined()
    })

    it('handles save button click', async () => {
        const { getByTestId, container, getByDisplayValue } = render(
            <ThemeProvider theme={theme}>
                <InformationBanner />
            </ThemeProvider>
        )

        await waitFor(() => {
            expect(getByDisplayValue("old testing data")).toBeInTheDocument()
        })

        const saveButton = getByTestId("saveBtn")

        await act(async () => {
            fireEvent.change(getByTestId("titleTestBox"), {
                target: { value: "new testing data" }
            })
            fireEvent.click(saveButton)
        })

        await waitFor(() => {
            expect(getByDisplayValue("new testing data")).toBeInTheDocument()
        })

    })

    it('handles reset button click', async () => {
        const { getByTestId, container, getByDisplayValue } = render(
               <ThemeProvider theme={theme}>
                   <InformationBanner />
              </ThemeProvider>
        )

        await waitFor(() => {
            expect(getByDisplayValue("old testing data")).toBeInTheDocument()
        })

        const resetButton = getByTestId("resetBtn")

        await act(async () => {
            fireEvent.change(getByTestId("titleTestBox"), {
                target: { value: "new reset testing" }
            })
        })

        await waitFor(() => {
            expect(screen.getByDisplayValue("new reset testing")).toBeInTheDocument()
        })

        await act(async () => {
            fireEvent.click(resetButton)
        })

        expect(getByDisplayValue("old testing data")).toBeInTheDocument()
    })
})