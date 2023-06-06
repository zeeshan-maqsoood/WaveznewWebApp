import React from "react"
import {response, rest} from "msw"
import {setupServer} from "msw/node"
import {act} from "react-dom/test-utils"
import {render, fireEvent, screen, waitFor, getByAltText, findAllByAltText} from "@testing-library/react"
import YourListings from "../../../pages/yourListings"
import GlobalStateProvider from "../../../store/globalStateProvider"

import Footer from "../../../components/footer"
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
    rest.delete("*/vesselType*", (req, res, ctx) => {
        return res(ctx.json({message: "Vessel deleted"}))
    }),
    rest.get("*users/getListings", (req, res, ctx) => {

        return res(
            ctx.json({
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
    })
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
describe("Rendering listings page", () => {
    it("Renders user data", async () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <GlobalStateProvider>
                    <YourListings />
                </GlobalStateProvider>
            </ThemeProvider>)

        setTimeout(() => {
            expect(container.innerHTML).toMatch(/ever green/i)
        }, 5000)


    })
})

describe("Get footer Component", () => {
    it("renders", async () => {
        const { container, getByTestId, getByRole } = render(
                <Footer />
        )
        expect(container.innerHTML).toMatch(/Support/i)
    })


})