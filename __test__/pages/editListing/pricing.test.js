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
import Pricing from "../../../pages/editListing/pricing"
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
  rest.put("*/rentals*", (req, res, ctx) => {
    req.body = {
      vesselPricing: {
        perHour: { amount: 20},
        perDay: { amount: 50 },
        perWeek: { amount: 50 },
        currency: "CAD",
        minimumDeposit: 5000
      }
    }
    return res(ctx.json({ message: "Pricing added" }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const fakeListing = {
  vesselPricing: {
    perHour: { amount: 2.23, minimumTime: 32 },
    perDay: { amount: 70 },
    perWeek: { amount: 7 },
    currency: "CAD",
    minimumDeposit: 5000
  },
  _id: "123",
  title: "ever green",
  vesselType: "RENTAL",
  userId: "001"
}
describe("Edit Pricing Component", () => {
  it("renders pricing correctly", async () => {
    render(
        <ThemeProvider theme={theme}>
            <Pricing setUnsavedChanges={() => {}} />
        </ThemeProvider>)
  })

  it("pricing validation", async () => {
    const { getByTestId, container } = render(
        <ThemeProvider theme={theme}>
          <Pricing
              listingStartValue={fakeListing}
              getListingInfo={() => {}}
              setUnsavedChanges={() => {}}
              onSubmit={() => {}}
              nextPage ={() => {}}
      />
        </ThemeProvider>
    )

    fireEvent.change(getByTestId("amount_PerDay"), { target: { value: "ad" } })
    fireEvent.change(getByTestId("amount_PerHour"), { target: { value: -1 } })
    fireEvent.change(getByTestId("minDeposit"), { target: { value: "" } })

    await act(async () => {
      fireEvent.click(getByTestId("saveBtn"))
    })

    setTimeout(() => {
      expect(container.innerHTML).toMatch(/amount invalid/i)
      expect(container.innerHTML).toMatch(/time invalid/i)
      expect(container.innerHTML).toMatch(/Minimum Deposit Amount Invalid/i)
    }, 5000)
  })

  it("handles call API after click save button", async () => {
    const { getByTestId, container } = render(
    <ThemeProvider theme={theme}>
      <Pricing
        listingStartValue={fakeListing}
        getListingInfo={() => {}}
        setUnsavedChanges={() => {}}
        onSubmit={() => {}}
        nextPage={() => {}}
      />
         </ThemeProvider>
    )

    await act(async () => {      
      fireEvent.change(getByTestId("minimumTime"), {
        target: { value: 78 }
      })
      fireEvent.change(getByTestId("amount_PerHour"), {
        target: { value: 20 }
      })
      fireEvent.change(getByTestId("amount_PerDay"), {
        target: { value: 230 }
      })
      fireEvent.change(getByTestId("amount_PerWeek"), {
        target: { value: 20 }
      })
      fireEvent.change(getByTestId("minDeposit"), { target: { value: 2500 } })

      await act(async () => {
        fireEvent.click(getByTestId("saveBtn"))
      })
    })

    expect(container.innerHTML).not.toMatch(/amount invalid/i)
    expect(container.innerHTML).not.toMatch(/Minimum Deposit Amount Invalid/i)
  })
})
