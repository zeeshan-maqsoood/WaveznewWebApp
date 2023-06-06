import React from "react"
import { render } from "@testing-library/react"
import { setupServer } from "msw/node"
import { rest } from "msw"
import Footer from "../../../../pages/admin-panel/footer"

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

describe("Admin Panel - Footer Component", () => {
    it("renders", async () => {
        const { container } = render(
            <Footer />
        )

        expect(container.innerHTML).toMatch(/Footer/i)

    })
})
