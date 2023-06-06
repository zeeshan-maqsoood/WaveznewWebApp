import React from "react"
import {act} from "react-dom/test-utils"
import {render, fireEvent, screen, waitFor, within} from "@testing-library/react"
import {setupServer} from "msw/node"
import {rest} from "msw"
import HeroImage from "../../../../../pages/admin-panel/pages/home/hero-image"
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
        return res(ctx.status(200), ctx.json({
            arrayValue: [],
            _id: "test",
            key: "HOME_HERO_IMAGE",
            stringValue: "new testing data",
            booleanValue: false,
            numberValue: 0
        }))
    }),
    rest.post("*/configuration/uploadImage/:key", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            url: "test url",
            success: true
        }))
    }),
    rest.get("*/configuration/:key", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            arrayValue: [],
            _id: "test",
            key: "HOME_HERO_IMAGE",
            stringValue: "sample url",
            booleanValue: false,
            numberValue: 0
        }))
    }),
    rest.delete("*/configuration/deleteImage", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({success: true}))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Hero Image Component", () => {
    it("renders", async () => {
        const {container, getByTestId} = render(
               <ThemeProvider theme={theme}>
            <HeroImage/>
      </ThemeProvider>
        )

        expect(container.innerHTML).toMatch(/Hero Image/i)

        await waitFor(() => {
            expect(getByTestId("uploadBtn")).toBeDefined()
        })
    })

    it('handles upload button click', async () => {
        const { getByTestId, container, getByDisplayValue } = render(
               <ThemeProvider theme={theme}>
            <HeroImage />
      </ThemeProvider>
        )

        const uploadButton = await waitFor(() => getByTestId("uploadBtn"))
        const file = new File(["test content"], "test.png", { type: "image/png" })

        await act(async () => {
            fireEvent.change(uploadButton, { target: { files: [file] }})
        })

        const applyBtn = await waitFor(() => getByTestId("applyBtn"))

        await act(async () => {
            fireEvent.click(applyBtn)
        })
    })
})