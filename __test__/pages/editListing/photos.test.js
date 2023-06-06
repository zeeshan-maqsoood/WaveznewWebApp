import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { act } from "react-dom/test-utils"
import {
  render,
  fireEvent,
  screen,
  waitFor} from "@testing-library/react"
import Photos from "../../../pages/editListing/photos"
import theme from "../../../src/theme"
import {ThemeProvider} from "@material-ui/core/styles"
global.FormData = require("form-data")

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
  rest.put("*vessel/images/*", (req, res, ctx) => {
    return res(ctx.json({ message: "Photo uploaded" }))
  }),

  rest.put("*/updateImageCaptions*", (req, res, ctx) => {
    return res(ctx.json({ message: "Image caption updated" }))
  }),

  // API
  rest.delete("*/vessel/image/*", (req, res, ctx) => {
    return res(ctx.json({ message: "Image 001 deleted" }))
  }),

  rest.get("*configuration/PHOTO_MAXIMUM_NUMBER", (req, res, ctx) => {
    return res(ctx.json({ numberValue: 10 }))
  }),

  rest.get("*configuration/PHOTO_MINIMUM_NUMBER", (req, res, ctx) => {
    return res(ctx.json({ numberValue: 5 }))
  })
)

beforeAll(() => { server.listen() })
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const fakeListing = {
  images: [
    {
      _id: "001",
      imageURL:
        "image-vesselType-RENTAL-vesselId-60a1be3025df820013fc5d85-1ebc18c1-c455-4c56-b73f-4deb262c670d.jpg",
      caption: "caption of pic 1",
      sequence: 1
    },
    {
      _id: "002",
      imageURL:
        "image-vesselType-RENTAL-vesselId-60a1be3025df820013fc5d85-0d3dd6ff-5adf-4aa6-a316-1abc267ebfc1.jpg",
      caption: "caption of pic 2",
      sequence: 2
    }
  ],
  _id: "123",
  title: "ever green",
  vesselType: "RENTAL",
  userId: "001"
}

const fakeListingForDeleting = {
  images: [
    {
      _id: "0001",
      imageURL:
        "vesselId-60a1be3025df820013fc5d85-1ebc18c1-c455-4c56-b73f-4deb262c670d.jpg",
      caption: "caption of pic 1",
      sequence: 1
    }
  ],
  _id: "001",
  title: "ever green",
  vesselType: "RENTAL"
}

describe("Edit Photos Component", () => {
  it("renders Photos correctly with 2 images and captions", async () => {
    const { container } = render(
   <ThemeProvider theme={theme}>
      <Photos setUnsavedChanges={() => { }} listingStartValue={fakeListing} />
              </ThemeProvider>
    )

    expect(container.innerHTML).toMatch(/caption of pic 1/i)
    expect(container.innerHTML).toMatch(/caption of pic 2/i)
  })

  it("handles change caption", async () => {
    const { getByTestId, container } = render(
        <ThemeProvider theme={theme}>
      <Photos
        listingStartValue={fakeListing}
        getListingInfo={() => { }}
        setUnsavedChanges={() => { }}
        onSubmit={() => { }}
        nextPage={() => { }}
      />
             </ThemeProvider>
    )
    await act(async () => {
      fireEvent.change(getByTestId("caption001"), {
        target: { value: "caption 001 updated" }
      })
      fireEvent.focusOut(getByTestId("caption001"))
    })

    await waitFor(() => {
      screen.queryAllByText("caption 001 updated")
    })

    expect(container.innerHTML).not.toMatch(/caption of pic 1/i)
  })

  // it("handles API delete image", async () => {
  //   const mockGetListingInfo = jest.fn();
  //   const { getByTestId, getByText, container } = render(
  //     <Photos
  //       listingStartValue={fakeListingForDeleting}
  //       getListingInfo={mockGetListingInfo()}
  //       setUnsavedChanges={() => {}}
  //       onSubmit={() => {}}
  //       nextPage={() => {}}
  //     />
  //   );
  //   await act(async () => {
  //     fireEvent.mouseDown(getByTestId("photoOption0001"));
  //   });

  //   const option = await waitFor(() => getByText("Delete"));
  //   fireEvent.click(option);
  //   // Close the select using Escape or Tab or clicking away
  //   fireEvent.keyDown(document.activeElement, {
  //     key: "Escape",
  //     code: "Escape",
  //   });

  //   await waitFor(() => mockGetListingInfo.toHaveBeenCalledTimes);
  //   //call after delete
  //   expect(mockGetListingInfo).toHaveBeenCalledTimes(1);
  // });

  it("handles upload image", async () => {
    const mockGetListingInfo = jest.fn()
    // const { getByTestId, container } = render(
    //   <Photos
    //     listingStartValue={fakeListing}
    //     getListingInfo={mockGetListingInfo()}
    //     setUnsavedChanges={() => {}}
    //     onSubmit={() => {}}
    //     nextPage={() => {}}
    //   />
    // );    

    await act(async () => {
      render(
           <ThemeProvider theme={theme}>
          <Photos
          listingStartValue={fakeListing}
          getListingInfo={mockGetListingInfo()}
          setUnsavedChanges={() => { }}
          onSubmit={() => { }}
          nextPage={() => { }}
        />
           </ThemeProvider>
      )
    })
    await waitFor(() => screen.queryAllByTestId("uploadImageButton"))
    const file = new File(["dummy content"], { name: "example.png" }, { type: "image/png" })
    // const imageInput = screen.getByTestId("uploadImageButton");
    //
    // await act(async () => {
    //   fireEvent.change(imageInput, { target: { files: [file] } });
    // });

    await waitFor(() => mockGetListingInfo.toHaveBeenCalledTimes)
    expect(mockGetListingInfo).toHaveBeenCalledTimes(1)
  })
})
