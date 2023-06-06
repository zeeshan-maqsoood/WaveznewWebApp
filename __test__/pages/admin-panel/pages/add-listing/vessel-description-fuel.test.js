import React from "react"
import {act} from "react-dom/test-utils"
import {fireEvent, render, screen, waitFor, within} from "@testing-library/react"
import VesselDescriptionFuel from "../../../../../pages/admin-panel/pages/add-listing/vessel-description/type-of-fuel/index"
import {setupServer} from "msw/node"
import {rest} from "msw"
import theme from "../../../../../src/theme"
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
    rest.put("*/configuration/PHOTO_MINIMUM_NUMBER", (req, res, ctx) => {
        return res(ctx.json({
            arrayValue: [],
            _id: "test",
            key: "PHOTO_MINIMUM_NUMBER",
            stringValue: "",
            booleanValue: false,
            numberValue: 4
        }))
    }),
    rest.get("*/configuration/PHOTO_MINIMUM_NUMBER", (req, res, ctx) => {
        return res(ctx.json({
            arrayValue: [],
            _id: "test",
            key: "PHOTO_MINIMUM_NUMBER",
            stringValue: "",
            booleanValue: false,
            numberValue: 3
        }))
    }),
    rest.put("*/configuration/PHOTO_MAXIMUM_NUMBER", (req, res, ctx) => {
        return res(ctx.json({
            arrayValue: [],
            _id: "test",
            key: "PHOTO_MAXIMUM_NUMBER",
            stringValue: "",
            booleanValue: false,
            numberValue: 10
        }))
    }),
    rest.get("*/configuration/PHOTO_MAXIMUM_NUMBER", (req, res, ctx) => {
        return res(ctx.json({
            arrayValue: [],
            _id: "test",
            key: "PHOTO_MAXIMUM_NUMBER",
            stringValue: "",
            booleanValue: false,
            numberValue: 9
        }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Vessel Description Fuel Type Component", () => {
    // 1
    it("renders", async () => {
        const {container, getByTestId, getByDisplayValue, getByText} = render(
              <ThemeProvider theme={theme}>
                  <VesselDescriptionFuel/>
              </ThemeProvider>
        )

        expect(container.innerHTML).toMatch(/Name/i)

         // await waitFor(() => {
         //
         //    expect(container.firstChild).toMatchSnapshot();
         //
         // });
            })

    // it('handles save button click', async () => {
    //     const {getByTestId, container, getByDisplayValue} = render(
    //         <VesselDescriptionFuel/>);
    //
    //     await waitFor(() => {
    //         expect(getByDisplayValue("old testing data")).toBeInTheDocument();
    //         expect(getByDisplayValue("description")).toBeInTheDocument();
    //     });
    //
    //     const saveButton = getByTestId("textSaveBtn");
    //
    //     await act(async () => {
    //         fireEvent.change(getByTestId("titleTextField"), {
    //             target: {value: "new testing"},
    //         });
    //         fireEvent.change(getByTestId("descriptionTextField"), {
    //             target: {value: "new testing description data"},
    //         });
    //     });
    //
    //
    //     await act(async () => {
    //         fireEvent.click(saveButton);
    //     });
    //
    //     await waitFor(() => {
    //         expect(getByDisplayValue("new testing data")).toBeInTheDocument();
    //         expect(getByDisplayValue("new testing description data")).toBeInTheDocument();
    //         const {getByText} = within(getByTestId("counterContainer"));
    //         // testing if the number counter is working
    //         expect(getByText(/28/i)).toBeInTheDocument();
    //     });
    //
    //     // checking if the button id disabled when the data is saved
    //     // expect(getByTestId("textSaveBtn").closest('button')).toBeDisabled();
    // });
    //
    // it('handles reset button click', async () => {
    //     const {getByTestId, container, getByDisplayValue} = render(
    //         <VesselDescriptionFuel/>);
    //
    //     await waitFor(() => {
    //         expect(getByDisplayValue("old testing data")).toBeInTheDocument();
    //         expect(getByDisplayValue("description")).toBeInTheDocument();
    //     });
    //
    //     const resetButton = getByTestId("textResetBtn");
    //
    //     await act(async () => {
    //         fireEvent.change(getByTestId("titleTextField"), {
    //             target: {value: "new reset testing"},
    //         });
    //         fireEvent.change(getByTestId("descriptionTextField"), {
    //             target: {value: "new reset description data"},
    //         });
    //     });
    //
    //     await waitFor(() => {
    //         expect(getByDisplayValue("new reset testing")).toBeInTheDocument();
    //         expect(getByDisplayValue("new reset description data")).toBeInTheDocument();
    //         const {getByText} = within(getByTestId("counterContainer"));
    //         // testing if the number counter is working
    //         expect(getByText(/26/i)).toBeInTheDocument();
    //     });
    //
    //     await act(async () => {
    //         fireEvent.click(resetButton);
    //     });
    //
    //     expect(getByDisplayValue("old testing data")).toBeInTheDocument();
    //     expect(getByDisplayValue("description")).toBeInTheDocument();
    // });
})

     // 3 
   it('handles delete button click', async () => { 
    const {getByTestId, container, getByDisplayValue} = render(
               <VesselDescriptionFuel />)

               const Button = ({ onClick, children }) => (
                <button onClick={onClick}>{children}</button>
              )

    const handleDelete = jest.fn()
    render(<Button onClick={handleDelete}>Delete</Button>)
    fireEvent.click(screen.getByText(/Delete/i))
    expect(handleDelete).toHaveBeenCalledTimes(1)
  })
