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
import Verification from "../../../pages/editListing/verification"
import theme from "../../../src/theme"
import {ThemeProvider} from "@material-ui/core/styles"
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      locale: "en",
      push: jest.fn()
    }
  }
}))

const server = setupServer(
  rest.get("*vessel/document*", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          verified: false,
          _id: "002",
          fileURL: "60a2762725df820013fc5d8c278dc.pdf",
          fileType: "ProofOfId",
          originalFileName: "sample - Copy.pdf"
        }
      ])
    )
  }),

  rest.delete("*vessel/document*", (req, res, ctx) => {
    return res(ctx.json({ message: "delete success" }))
  }),

  rest.put("*vessel/document*", (req, res, ctx) => {
    return res(ctx.json({ message: "upload image success" }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const fakeListing = {
  _id: "123",
  title: "ever green",
  vesselType: "CHARTER",
  userId: "001"
}

const fakeDocuments = [
  { name: "VSS – (Vulnerable Sector Screenings)", shortForm: "CriminalBackgroundCheck", isRequired: true },
  { name: "Motor Driver’s Licence", shortForm: "ProofOfId", isRequired: true },
  { name: "Master 500 GT", shortForm: "VesselDriversLicense_Master500GT", isRequired: true },
  { name: "MED BST", shortForm: "VesselDriversLicense_MED-BST", isRequired: true }
]

describe("Edit Verification Component", () => {
  it("renders  Verification correctly", async () => {
    await act(async () => {
      render(
       <ThemeProvider theme={theme}>
        <Verification
          documents={fakeDocuments}
          setUnsavedChanges={() => { }}
          listingStartValue={fakeListing}
          getListingInfo={() => { }}
          onSubmit={() => { }}
          updateCheckMark={() => { }} 
          getTransactionStatus={() => { }} />
           </ThemeProvider>
      )
      expect(screen.queryAllByText("All watercraft are required to provide proof of documentation listed here")).toBeInTheDocument
    })
  })

  it("renders charter Verification correctly", async () => {
    await act(async () => {
      render(
        <ThemeProvider theme={theme}>
            <Verification
          setUnsavedChanges={() => { }}
          listingStartValue={fakeListing}
          getListingInfo={() => { }}
          documents={fakeDocuments}
          onSubmit={() => { }}
          updateCheckMark={() => { }}
          getTransactionStatus={() => { }} />
        </ThemeProvider>
      )
    })
    //data det rendered
    expect(screen.queryAllByText("Motor Driver’s Licence")).toBeInTheDocument
    setTimeout(() => {
      expect(screen.getAllByText(/sample - Copy.pdf/i)).toBeTruthy
    }, 2000)
  })

  // it("handles delete files", async () => {
  //   await act(async () => {
  //     render(
  //         <ThemeProvider theme={theme}>
  //         <Verification setUnsavedChanges={() => { }}
  //       listingStartValue={fakeListing}
  //       getListingInfo={() => { }}
  //       documents={fakeDocuments}
  //       onSubmit={() => { }}
  //       updateCheckMark={() => { }} />
  //      </ThemeProvider>
  //     );
  //   });

    // const deleteIcon = screen.queryByTestId("chipProofOfId");

    // await waitFor(() => {
    //   fireEvent.click(deleteIcon);
    // });

  //   await waitFor(() => screen.queryByTestId("chipProofOfId").length === 0);
  //   expect(screen.queryByText("sample - Copy.pdf")).not.toBeTruthy;
  // });

  it("handles uploading files", async () => {
    await act(async () => {
      render(
      <ThemeProvider theme={theme}>
          <Verification setUnsavedChanges={() => { }}
        listingStartValue={fakeListing}
        getListingInfo={() => { }}
        documents={fakeDocuments}
        onSubmit={() => { }}
        updateCheckMark={() => { }}
        getTransactionStatus={() => { }} />
       </ThemeProvider>
      )
    })

    await waitFor(() => screen.queryAllByTestId("chipCriminalBackgroundCheck").length <= 0)

    const file = new File(["dummy content"], { name: "example.png" }, { type: "image/png" })

    await act(async () => {
      setTimeout(() => {
        const fileInput = screen.getByTestId("uploadCriminalBackgroundCheck")
        fireEvent.change(fileInput, { target: { files: [file] } })
      }, 2000)
    })

    await waitFor(() => screen.queryByTestId("chipCriminalBackgroundCheck"))
    expect(screen.queryByTestId("chipCriminalBackgroundCheck")).toBeTruthy
  })
})
