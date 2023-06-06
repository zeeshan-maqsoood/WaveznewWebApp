import React from "react"
import { act } from "react-dom/test-utils"
import {render, fireEvent, screen, waitFor, within} from "@testing-library/react"
import {setupServer} from "msw/node"
import {rest} from "msw"
import Users from "../../../../../pages/admin-panel/all-users/users"
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
    rest.put("*/users/list", (req, res, ctx) => {
        return res(ctx.json({
            totalCount: 112,
            pageNumber: 1,
            pageSize: 5,
            sortOrder: '-updatedAt',
            users: [
                {
                    isVesselOwner: true,
                    _id: '608194168e574e00133bf84a',
                    firstName: 'Test',
                    email: 'gsvajsg@gmail.com',
                    lastName: 'Patient',
                    updatedAt: '2021-07-13T00:15:30.543Z'
                },
                {
                    isVesselOwner: true,
                    _id: '60dc62964413490013b35840',
                    firstName: 'hjkuhk',
                    lastName: 'Joel',
                    email: 'yahmeddusky949v@best566.xyz',
                    updatedAt: '2021-07-12T18:37:22.206Z'
                },
                {
                    isVesselOwner: true,
                    _id: '609c1aeb25f7d100131b3950',
                    firstName: 'T',
                    lastName: 'T',
                    email: 'casija9965@mxcdd.com',
                    updatedAt: '2021-07-08T22:59:02.755Z'
                },
                {
                    isVesselOwner: false,
                    _id: '60d2130b2994e6001331a06e',
                    firstName: 'harry',
                    lastName: 'styles',
                    email: 'xeropij549@d4wan.com',
                    updatedAt: '2021-07-08T14:53:45.713Z'
                },
                {
                    isVesselOwner: true,
                    _id: '60dc72fe4413490013b35c4e',
                    firstName: 'hoooo',
                    lastName: 'sasa',
                    email: 'yahmeddusky949v@best566.xyz',
                    updatedAt: '2021-07-07T19:03:36.163Z'
                }
            ]
        }))
    }),
    rest.put("*/users/changeUserStatus", (req, res, ctx) => {
        return res(ctx.json({success:false, message:`User ${req.body.disabled ? 'Disabled' : 'Enabled'}`}))
    }),
    rest.get("*/users/getListings/guest/:id", (req, res, ctx) => {
        return res(ctx.json([]))
    }),
    rest.get("*/users/getListings/history/{userId}", (req, res, ctx) => {
        return res(ctx.json({
            success: true,
            listings: []
        }))
    }),
    rest.get("*/users/:userId", (req, res, ctx) => {
        return res(ctx.json({
            userType: 'USER',
            agreementAccepted: true,
            agreementAcceptedDate: '2021-04-22T14:29:16.311Z',
            dateOfBirth: '2021-07-13T00:33:37.444Z',
            disabled: false,
            isVesselOwner: true,
            _id: '608194168e574e00133bf84a',
            firstName: 'Test',
            email: 'gsvajsg@gmail.com',
            phoneNumber: 789563258,
            __v: 0,
            lastName: 'Patient',
            updatedAt: '2021-07-13T00:32:21.858Z',
            createdAt: '2021-07-01T10:00:00.000Z'
        }))
    }),
    rest.get("*/users/:userId", (req, res, ctx) => {
        return res(ctx.json({
            userType: 'USER',
            agreementAccepted: true,
            agreementAcceptedDate: '2021-04-22T14:29:16.311Z',
            dateOfBirth: '2021-07-13T00:33:37.444Z',
            disabled: false,
            isVesselOwner: true,
            _id: '608194168e574e00133bf84a',
            firstName: 'Test',
            email: 'gsvajsg@gmail.com',
            phoneNumber: 789563258,
            __v: 0,
            lastName: 'Patient',
            updatedAt: '2021-07-13T00:32:21.858Z',
            createdAt: '2021-07-01T10:00:00.000Z'
        }))
    }),
    rest.delete("*/users/:userId", (req, res, ctx) => {
        return res(ctx.json({
            success: true,
            message: 'User and User Listings Deleted.'
        }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Admin Panel - Users Component", () => {
    it("renders", async () => {
        const { container, getByTestId, getByDisplayValue } = render(
              <ThemeProvider theme={theme}>
                  <Users />
              </ThemeProvider>
        )

        expect(container.innerHTML).toMatch(/Users/i)
        
    })
})
