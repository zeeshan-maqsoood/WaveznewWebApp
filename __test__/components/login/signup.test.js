import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { act } from "react-dom/test-utils"
import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import Signup from "../../../components/login/signUp"
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
  rest.post("*/users/signup", (req, res, ctx) => {
    req.body = {
      firstName: "firstname",
      lastName: "lastname",
      email: "emailtest@com.ca",
      phoneNumber: "1456225123",
      agreementAccepted: true
    }
    return res(ctx.json({ message: "Account is created successfully" }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Sign up component", () => {
  it("render signup correctly", async () => {
    render(
<ThemeProvider theme={theme}>
        <Signup />
     </ThemeProvider>
    )
  })

  it("submit when no field filled", async () => {
    const mockOnClick = jest.fn()
    const { getByTestId, container } = render(
      <ThemeProvider theme={theme}>
        <Signup onClick={mockOnClick()} />
         </ThemeProvider>
    )

    await act(async () => {
      fireEvent.click(getByTestId("submitBtn"))
    })

    expect(mockOnClick).toHaveBeenCalledTimes(1)
    expect(container.innerHTML).toMatch(/First name required/i)
    expect(container.innerHTML).toMatch(/Last name required/i)
    expect(container.innerHTML).toMatch(/Phone Number required/i)
    expect(container.innerHTML).toMatch(/Email required/i)
    expect(container.innerHTML).toMatch(/Please agree to the terms and conditions to proceed further./i)
  })

  it("submit when email in wrong format", async () => {
    const mockOnClick = jest.fn()
    const { getByTestId, container } = render(
     <ThemeProvider theme={theme}>
      <Signup onClick={mockOnClick()} />
         </ThemeProvider>
    )

    await act(async () => {
      fireEvent.change(getByTestId("email"), {
        target: { value: "emailtest.com" }
      })
    })

    await act(async () => {
      fireEvent.click(getByTestId("submitBtn"))
    })

    expect(container.innerHTML).toMatch("Invalid Email Id")
  })

  it("submit when agreement has not been accepted", async () => {
    const mockOnClick = jest.fn()
    const { getByTestId, container } = render(
      <ThemeProvider theme={theme}>
        <Signup onClick={mockOnClick()} />
     </ThemeProvider>
    )

    await act(async () => {
      fireEvent.change(getByTestId("agreementBox"), {
        target: { value: "false" }
      })
    })

    await act(async () => {
      fireEvent.click(getByTestId("submitBtn"))
    })

    expect(container.innerHTML).toMatch("Please agree to the terms and conditions to proceed further")
  })

  it("axios API call", async () => {
    const { getByTestId, container } = render(
    <ThemeProvider theme={theme}>
        <Signup />
     </ThemeProvider>
    )
    await act(async () => {
      fireEvent.change(getByTestId("firstName"), {
        target: { value: "firstname" }
      })
      fireEvent.change(getByTestId("lastName"), {
        target: { value: "lastname" }
      })
      fireEvent.change(getByTestId("email"), {
        target: { value: "emailtest@com.ca" }
      })
      fireEvent.change(getByTestId("phone"), {
        target: { value: "+14562251234" }
      })
      fireEvent.click(getByTestId("agreementBox", { target: { value: true } }))
    })
    await act(async () => {
      fireEvent.click(getByTestId("submitBtn"))
    })

    await waitFor(() => {
      screen.getByText("Please check your inbox")
    })

    expect(screen.getByText("Please check your inbox")).toBeTruthy()
  })
})
