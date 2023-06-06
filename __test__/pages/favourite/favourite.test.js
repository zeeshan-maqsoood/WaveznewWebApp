import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { act } from "react-dom/test-utils"
import {
  render,
  fireEvent,
  screen,
  waitFor,
  getAllByText,
  queryAllByTestId
} from "@testing-library/react"
import Favourite from "../../../pages/favourite"
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
  rest.get("*favourite*", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          _id: "001",
          shortListStays: [],
          shortListRentals: [
{
            images: [],
            numberOfPassengers: 8,
            title: "Unit test rental fav demo",
            vesselType: "RENTAL",
            vesselPricing: {
              currency: "CAD",
              minimumDeposit: 500,
              perHour: {
                amount: 4,
                checked: true,
                minimumTime: 3
              }
            },
            _id: "111"}
],
          shortListCharters: [
            {
              images: [],
              numberOfPassengers: 8,
              title: "Unit test charter fav demo",
              vesselType: "CHARTER",
              vesselPricing: {
                currency: "CAD",
                minimumDeposit: 600,
                perHour: {
                  amount: 4,
                  checked: true,
                  minimumTime: 3
                }
              },
              _id: "222"}
],
          favoriteRentals: [],
          favoriteStays: [],
          favoriteCharters: []
        }
      ])
    )
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("favorite screen", () => {
  it("renders favorite correctly", async () => {
    await act(async () => {
      render(
          <ThemeProvider theme={theme}>
            <GlobalStateProvider>
              <Favourite />
            </GlobalStateProvider>
      </ThemeProvider>)
      expect(screen.queryAllByText("Favourites")).toBeInTheDocument
      expect(screen.queryAllByText(/Unit test charter fav demo/i)).toBeInTheDocument
      expect(screen.queryAllByText(/Unit test rental fav demo/i)).toBeInTheDocument
    })
  })
})
