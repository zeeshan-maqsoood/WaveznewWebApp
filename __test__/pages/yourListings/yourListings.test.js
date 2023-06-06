import React from "react"
import {response, rest} from "msw"
import {setupServer} from "msw/node"
import {act} from "react-dom/test-utils"
import {
    render,
    fireEvent,
    screen,
    waitFor,
    getByAltText,
    findAllByAltText,
    getByTestId,
    getByDisplayValue,
    getByText
} from "@testing-library/react"
import YourListings from "../../../pages/yourListings"
import GlobalStateProvider from "../../../store/globalStateProvider"
import AddListScreen from "../../../pages/addList/getStarted"
import Footer from "../../../components/footer"
import Hint from "../../../pages/addList/hint"
import SearchBar from "material-ui-search-bar"
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
    rest.delete("*/vesselType, _id, title*", (req, res, ctx) => {
        return res(ctx.json)([
            {
                _id: "001",
                vesselType: "RENTAL",
                title: "ever green"

            }
        ])
    }),

    rest.get("*users/getListings", (req, res, ctx) => {
        return res(ctx.json({
                listings: [
                    {
                        images: [],
                        title: "ever green",
                        updatedAt: "2021-06-16T14:38:57.374Z",
                        vesselType: "RENTAL",
                        vesselStatus: "UNPUBLISHED"
                    },

                    {
                        images: [],
                        title: "demo ever green 2",
                        updatedAt: "2021-06-16T14:38:57.374Z",
                        vesselType: "CHARTER",
                        vesselStatus: "UNPUBLISHED"
                    }
                ]
            })
        )
    }))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Rendering listings page", () => {
    it("Renders user data", async () => {
        const {container} = render(
            <ThemeProvider theme={theme}>
                <GlobalStateProvider>
                    <YourListings/>
                </GlobalStateProvider>
            </ThemeProvider>
        )

        setTimeout(() => {
            expect(container.innerHTML).toMatch(/ever green/i)
        }, 5000)
    })
    it("handles delete listing", async () => {
        const mockGetListingInfo = jest.fn()
        const {getByTestId, getByText, container} = render(
            <ThemeProvider theme={theme}>
                <GlobalStateProvider>
                    <YourListings/>
                </GlobalStateProvider>
            </ThemeProvider>
        )

        setTimeout(() => {
            expect(container.innerHTML).toMatch(/ever green/i)
        }, 5000)

        //  await act(async () =>
        //  {

        // fireEvent.mouseDown(getByTestId("Delete"));

        // });


        const option = await waitFor(() => getByText("Calendar"))
        fireEvent.click(option)

        // Close the select using Escape or Tab or clicking away
        fireEvent.keyDown(document.activeElement, {
            key: "Escape",
            code: "Escape"
        })
    })

    it('Handles Search Bar', async () => {

        const {container, getByTestId, getByDisplayValue} = render(
            <ThemeProvider theme={theme}>
                <GlobalStateProvider>
                    <YourListings/>
                </GlobalStateProvider>
            </ThemeProvider>
        )

        await waitFor(() => {

            expect(getByTestId("searchValue")).toBeInTheDocument()

            // fireEvent.click(<YourListings content="id"/>, container);
        })
    })
})

