import React from "react"
import { response, rest } from "msw"
import { setupServer } from "msw/node"
import { act } from "react-dom/test-utils"
import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import Login from "../../../components/login/login"
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
  rest.post("*/signin", (req, res, ctx) => {
    req.body = {
      email: "emailtest@com.ca",
      password: "P@ssword123"
    }
    return res(ctx.status(200), ctx.json({ message: "Login Success" }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Login Component", () => {
  it("render login correctly", async () => {
    render(
        <ThemeProvider theme={theme}>
        <Login />
         </ThemeProvider>
    )
  })

 it("login with correct credential", async () => {
    const { getByTestId, container } = render(
    <ThemeProvider theme={theme}>
        <Login />
     </ThemeProvider>
    )

    await act(async () => {
      fireEvent.change(getByTestId("email"), {
        target: { value: "emailtest@com.ca" }
      })
      fireEvent.change(getByTestId("password"), {
        target: { value: "P@ssword123" }
      })
    })
    await act(async () => {
      fireEvent.click(getByTestId("submitBtn"))
    })

   expect(screen.queryByLabelText("errorMessage")).not.toBeInTheDocument()
  })
})
