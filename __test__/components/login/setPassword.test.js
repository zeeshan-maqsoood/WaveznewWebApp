import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { act } from "react-dom/test-utils"
import {
  render,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from "@testing-library/react"
import SetPassword from "../../../components/login/setPassword"
import theme from "../../../src/theme"
import {ThemeProvider} from "@material-ui/core/styles"
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      locale: "en",
      query: "fake_token"
    }
  }
}))

const server = setupServer(
  rest.get("*validatePasswordToken/:fake_token", (req, res, ctx) => {
    return res(ctx.json({ message: "Valid token" }))
  }),

  rest.post("*setpassword", (req, res, ctx) => {
    req.body = {
      password: "P@ssword123",
      confirmPassword: "P@ssword123"
    }
    return res(ctx.json({ message: "Password is created" }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("SetPassword Component", () => {
  it("render setpassword correctly", async () => {
    const { getByTestId, container } = render(
             <ThemeProvider theme={theme}>
        <SetPassword />
    </ThemeProvider>)
    await waitFor(() => screen.getByText(/Confirm Password/i))
    expect(container.innerHTML).toMatch(/Upper Case/i)
    expect(container.innerHTML).toMatch(/Lower Case/i)
    expect(container.innerHTML).toMatch(/Number/i)
    expect(container.innerHTML).toMatch(/Password is 8-16 characters/i)
    expect(container.innerHTML).toMatch(/Confirmed Password matched/i)
  })

  it("submit when both password are blank", async () => {
    const { getByTestId, container } = render(
        <ThemeProvider theme={theme}>
          <SetPassword />
        </ThemeProvider>)
    await waitFor(() => screen.getByText(/Confirm Password/i))
    await act(async () => {
      fireEvent.click(getByTestId("submitBtn"))
    })
   expect(container.innerHTML).toMatch(/Password is 8-16 characters/i)
  })

  it("setPassword when password and confirm password are not matched", async () => {
    const { getByTestId, container } = render(
        <ThemeProvider theme={theme}>
          <SetPassword />
        </ThemeProvider>)
    await waitFor(() => screen.getAllByText(/confirm/i))
    await act(async () => {
      fireEvent.change(getByTestId("password"), {
        target: { value: "P@word123" }
      })
      fireEvent.change(getByTestId("confirmPassword"), {
        target: { value: "P@word12345" }
      })
    })
    await act(async () => {
      fireEvent.click(getByTestId("submitBtn"))
    })
    expect(container.innerHTML).toMatch(
      /Confirmed Password matched/i
    )
  })

  it("successfully submit", async () => {
    const { getByTestId, container } = render(
        <ThemeProvider theme={theme}>
          <SetPassword />
        </ThemeProvider>)
    await waitFor(() => screen.getAllByText(/confirm/i))
    await act(async () => {
      fireEvent.change(getByTestId("password"), {
        target: { value: "P@ssword123" }
      })
      fireEvent.change(getByTestId("confirmPassword"), {
        target: { value: "P@ssword123" }
      })
    })
    fireEvent.click(getByTestId("submitBtn"))
    //await waitForElementToBeRemoved(() => screen.getAllByText(/Confirm Password matched/i));
    expect(container.innerHTML).not.toMatch(/Confirm Password matched/i)
  })
})
