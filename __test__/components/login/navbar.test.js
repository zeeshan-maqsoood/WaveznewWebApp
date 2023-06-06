import React from "react"
import { response, rest } from "msw"
import { setupServer } from "msw/node"
import { act } from "react-dom/test-utils"
import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import NavBar from "../../../components/navbar/navBar"
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

describe("NavBar component", () => {
  it("render navbar correctly?!", async () => {
    render(<ThemeProvider theme={theme}>
      <NavBar />
    </ThemeProvider>)
  })

  it("Add a listing without login", async () => {
    const { getByRole, getByTestId, container } = render(
        <ThemeProvider theme={theme}>
      <NavBar />
    </ThemeProvider>)

    await act(async () => {
      fireEvent.click(getByTestId("addListButton"))
    })
    expect(screen.queryByText("Not logged in")).toBeInTheDocument()
  })

  it("Change locale correctly?!", async () => {
    const { getByTestId, container } = render(
        <ThemeProvider theme={theme}>
          <NavBar />
        </ThemeProvider>)
    await act(async () => {
      fireEvent.click(getByTestId("localeButton"))
      //fireEvent.click(getByText("FR"));
      fireEvent.mouseDown(getByTestId("frenchBtn"))
    })
    expect(screen.queryByText("Add a listing")).not.toBeInTheDocument()
  })
})
