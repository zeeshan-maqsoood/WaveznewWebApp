import React from "react"
import { act } from "react-dom/test-utils"
import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import Step1 from "../../../pages/addList/step1"
import GlobalStateProvider from "../../../store/globalStateProvider"
import Context from "../../../store/context"
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
  rest.post("*", (req, res, ctx) => {
    req.body = {

    }
    return res(ctx.json({ message: "Success" }))
  }),
  rest.get("*", (req, res, ctx) => {
    req.body = {

    }
    return res(ctx.json({ message: "Success" }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Step 1 Component with error validation", () => {
  it("render step 1", async () => {
    const { container, getByTestId, getByRole } = render(
     <ThemeProvider theme={theme}>
      <GlobalStateProvider>
        <Step1 />
      </GlobalStateProvider>
 </ThemeProvider>
    )
    console.log("Inner HTML: ", container.innerHTML)
    expect(container.innerHTML).toMatch(/service/i)
    // expect(container.innerHTML).toMatch(/category/i);
  })

  it('handles undefined service', async () => {
    const mockOnClick = jest.fn()
    const { getByTestId, container } = render(
      <ThemeProvider theme={theme}>
        <Context.Provider value={{ globalState: { addListStep: 1, addListService: "", addListCategories: [{ _v: 0, _id: "609428050103971836d6141f", category: "Cuddy Cabins" }] }, globalDispatch: jest.fn() }}>
      <Step1 onClick={mockOnClick()} />
    </Context.Provider>
     </ThemeProvider>
    )

    await act(async () => {
      fireEvent.click(getByTestId("nextBtn"))
    })

    expect(mockOnClick).toHaveBeenCalledTimes(1)
    expect(container.innerHTML).toMatch(/select a service/i)
  })

  it('handles undefined categories', async () => {
    const mockOnClick = jest.fn()
    const { getByTestId, container } = render(
       <ThemeProvider theme={theme}>
        <Context.Provider value={{ globalState: { addListStep: 1, addListService: "Rental", addListCategories: [] }, globalDispatch: jest.fn() }}>
      <Step1 onClick={mockOnClick()} />
    </Context.Provider>
     </ThemeProvider>
    )

    await act(async () => {
      fireEvent.click(getByTestId("nextBtn"))
    })


    expect(mockOnClick).toHaveBeenCalledTimes(1)

    setTimeout(() => {
      expect(container.innerHTML).toMatch(/select a category/i)
    }, 2000)
  })

  it('handles correct input', async () => {
    const mockOnClick = jest.fn()
    const { getByTestId, container } = render(
        <ThemeProvider theme={theme}>
        <Context.Provider value={{ globalState: { addListStep: 1, addListService: "Rental", addListCategories: [{ _v: 0, _id: "609428050103971836d6141f", category: "Cuddy Cabins" }] }, globalDispatch: jest.fn() }}>
      <Step1 onClick={mockOnClick()} />
    </Context.Provider>
     </ThemeProvider>
    )

    await act(async () => {
      fireEvent.click(getByTestId("nextBtn"))
    })

    expect(mockOnClick).toHaveBeenCalledTimes(1)
    expect(container.innerHTML).not.toMatch(/select a service/i)
    expect(container.innerHTML).not.toMatch(/select a category/i)
  })

})
