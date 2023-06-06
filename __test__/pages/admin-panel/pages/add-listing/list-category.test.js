import React from "react"
import {act} from "react-dom/test-utils"
import {fireEvent, render, screen, waitFor, within} from "@testing-library/react"
import ListCategory from "../../../../../pages/admin-panel/pages/add-listing/listing-category/index"
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
    // rest.post("*/vessel/category", (req, res, ctx) => {
    //     return res(ctx.json([
    //         {
    //             _id: "test",
    //             name: "Cabin Cruisers Get",
    //             isRental: true,
    //             isCharter: true,
    //             isStay: true,
    //             isProofOfId: true,
    //             isVesselDriversLicense: true,
    //             isVesselLicense: true,
    //             isVesselSafety: true,
    //             isInsurance: true
    //         }
    //     ]));
    // }),

    // rest.get("*/vessel/category", (req, res, ctx) => {
    //     return res(ctx.json([
    //         {
    //             _id: "test",
    //             name: "Cabin Cruisers Get",
    //             isRental: true,
    //             isCharter: true,
    //             isStay: true,
    //             isProofOfId: true,
    //             isVesselDriversLicense: true,
    //             isVesselLicense: true,
    //             isVesselSafety: true,
    //             isInsurance: true,
    //             stringValue:"old testing data",
    //         }
    //     ]));
    // }),

    // handle update
    // rest.put("*/vessel/category/test", (req, res, ctx) => {
    //     return res(ctx.json([
    //         {
    //             _id: "test",
    //             name: "Cabin Cruisers Put",
    //             isRental: true,
    //             isCharter: true,
    //             isStay: true,
    //             isProofOfId: true,
    //             isVesselDriversLicense: true,
    //             isVesselLicense: true,
    //             isVesselSafety: true,
    //             isInsurance: true,
    //             stringValue:"new testing data",
    //         }
    //     ]));
    // }),

    // rest.delete("*/vessel/category/test", (req, res, ctx) => {
    //     return res(ctx.json([
    //         {
    //             _id: "test",
    //             name: "Cabin Cruisers delete",
    //             isRental: true,
    //             isCharter: true,
    //             isStay: true,
    //             isProofOfId: true,
    //             isVesselDriversLicense: true,
    //             isVesselLicense: true,
    //             isVesselSafety: true,
    //             isInsurance: true,
    //             stringValue:"old testing data",
    //         }
    //     ]));
    // })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Listing Category Component", () => {
    // 1 || get component
    it("renders", async () => {
        const {container, getByTestId, getByDisplayValue} = render(
            <ThemeProvider theme={theme}>
                <ListCategory/>
            </ThemeProvider>
        )

        expect(container.innerHTML).toMatch(/Listing Category/i)

        await waitFor(() => {

            screen.getByText("Listing Category")

            //  expect(getByDisplayValue("Cabin Cruisers Get")).toBeInTheDocument();
        })

        //  checking if the button id disabled when the component renders
        //  expect(getByTestId("textSaveBtn").closest('button').disabled).toBeTruthy();

        //  expect(getByTestId("textSaveBtn").closest('button')).toBeDisabled();
    })

// 2 || post component
//         it('handles save button click', async () => 
//         {
//           const mockOnClick = jest.fn()

//         const { getByTestId, container } = render
//         (<ListCategory onClick={mockOnClick()} 
//         handleSave={() => { }} 
//         setUnsavedChanges={() => { }} />);

//         await act(async () => 
//         {
//             fireEvent.click(getByTestId("textSaveBtn"))
//      })

//      expect(mockOnClick).toHaveBeenCalledTimes(1);
//  });

//     // 3 
//       it('handles delete button click', async () => { 
//         const {getByTestId, container, getByDisplayValue} = render(
//                    <ListCategory />);

//                    const Button = ({ onClick, children }) => (
//                     <button onClick={onClick}>{children}</button>
//                   );

//         const handleDelete = jest.fn()
//         render(<Button onClick={handleDelete}>Delete</Button>)
//         fireEvent.click(screen.getByText(/Delete/i))
//         expect(handleDelete).toHaveBeenCalledTimes(1)
//       });
})
