import React from "react"
import {act} from "react-dom/test-utils"
import {fireEvent, render, screen, waitFor, within} from "@testing-library/react"
import GetStarted from "../../../../../pages/admin-panel/pages/add-listing/get-started/index"
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
    rest.put("*/configuration/GET_STARTED_TITLE", (req, res, ctx) => {
        return res(ctx.json({
            arrayValue: [],
            _id: "test",
            key: "GET_STARTED_TITLE",
            stringValue: "new testing data",
            booleanValue: false,
            numberValue: 0
        }))
    }),
    rest.get("*/configuration/GET_STARTED_TITLE", (req, res, ctx) => {
        return res(ctx.json({
            arrayValue: [],
            _id: "test",
            key: "GET_STARTED_TITLE",
            stringValue: "old testing data",
            booleanValue: false,
            numberValue: 0
        }))
    }),
    rest.put("*/configuration/GET_STARTED_DESCRIPTION", (req, res, ctx) => {
        return res(ctx.json({
            arrayValue: [],
            _id: "test",
            key: "GET_STARTED_DESCRIPTION",
            stringValue: "new testing description data",
            booleanValue: false,
            numberValue: 0
        }))
    }),
    rest.get("*/configuration/GET_STARTED_DESCRIPTION", (req, res, ctx) => {
        return res(ctx.json({
            arrayValue: [],
            _id: "test",
            key: "GET_STARTED_DESCRIPTION",
            stringValue: "description",
            booleanValue: false,
            numberValue: 0
        }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Get Started Component", () => {
    it("renders", async () => {
        const {container, getByTestId, getByDisplayValue} = render(
               <ThemeProvider theme={theme}>
                   <GetStarted/>
               </ThemeProvider>
        )

        expect(container.innerHTML).toMatch(/Get Started Page/i)

        await waitFor(() => {
            expect(getByDisplayValue("old testing data")).toBeInTheDocument()
            expect(getByDisplayValue("description")).toBeInTheDocument()
            const {getByText} = within(getByTestId("counterContainer"))
            // testing if the number counter is working
            expect(getByText(/11/i)).toBeInTheDocument()
        })

        // checking if the button id disabled when the component renders
         expect(getByTestId("textSaveBtn").closest('button').disabled).toBeTruthy()
   
         // expect(getByTestId("textSaveBtn").closest('button')).toBeDisabled();
    })

    it('handles save button click', async () => {
        const {getByTestId, container, getByDisplayValue} = render(
              <ThemeProvider theme={theme}>
                  <GetStarted/>
              </ThemeProvider>
        )

        await waitFor(() => {
            expect(getByDisplayValue("old testing data")).toBeInTheDocument()
            expect(getByDisplayValue("description")).toBeInTheDocument()
        })

        const saveButton = getByTestId("textSaveBtn")

        await act(async () => {
            fireEvent.change(getByTestId("titleTextField"), {
                target: {value: "new testing"}
            })
            fireEvent.change(getByTestId("descriptionTextField"), {
                target: {value: "new testing description data"}
            })
        })

        await act(async () => {
            fireEvent.click(saveButton)
        })

        await waitFor(() => {
            expect(getByDisplayValue("new testing data")).toBeInTheDocument()
            expect(getByDisplayValue("new testing description data")).toBeInTheDocument()
            const {getByText} = within(getByTestId("counterContainer"))
            // testing if the number counter is working
            expect(getByText(/28/i)).toBeInTheDocument()
        })

        // checking if the button id disabled when the data is saved
       expect(getByTestId("textSaveBtn").closest('button').disabled)
    })

    //3
    it('handles reset button click', async () => {
        const {getByTestId, container, getByDisplayValue} = render(
              <ThemeProvider theme={theme}>
            <GetStarted/>
              </ThemeProvider>
        )

        await waitFor(() => {
            expect(getByDisplayValue("old testing data")).toBeInTheDocument()
            expect(getByDisplayValue("description")).toBeInTheDocument()
        })

        const resetButton = getByTestId("textResetBtn")

        await act(async () => {
            fireEvent.change(getByTestId("titleTextField"), {
                target: {value: "new reset testing"}
            })
            fireEvent.change(getByTestId("descriptionTextField"), {
                target: {value: "new reset description data"}
            })
        })

        await waitFor(() => {
            expect(getByDisplayValue("new reset testing")).toBeInTheDocument()
            expect(getByDisplayValue("new reset description data")).toBeInTheDocument()
            const {getByText} = within(getByTestId("counterContainer"))
            // testing if the number counter is working
            expect(getByText(/26/i)).toBeInTheDocument()
        })

        await act(async () => {
            fireEvent.click(resetButton)
        })

        expect(getByDisplayValue("old testing data")).toBeInTheDocument()
        expect(getByDisplayValue("description")).toBeInTheDocument()
    })
})
