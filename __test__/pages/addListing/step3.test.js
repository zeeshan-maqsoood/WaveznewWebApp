import React, { useContext } from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { act } from "react-dom/test-utils"
import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import Step3 from "../../../pages/addList/step3"
import Context from "../../../store/context"
import Session from "../../../sessionService"
import GlobalStateProvider from "../../../store/globalStateProvider"
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
        return res(ctx.json({ numberValue: 10 }))
    }),
    rest.put("*", (req, res, ctx) => {
        req.body = {

        }
        return res(ctx.json({ message: "Success" }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Step 3 Component", () => {
    it("renders correctly", async () => {
        render(
   <ThemeProvider theme={theme}>
       <GlobalStateProvider>
           <Step3 />
        </GlobalStateProvider>
   </ThemeProvider>
        )
    })

    it('handles submit button click', async () => {
        const mockOnClick = jest.fn()
        const { getByTestId, container } = render(
               <ThemeProvider theme={theme}>
            <Context.Provider value={{ globalState: { addListVesselMake: "Some Make", addListVesselYear: "Some Year" } }}>
            <Step3 onClick={mockOnClick()} />
        </Context.Provider>
              </ThemeProvider>
        )
        await act(async () => {
            fireEvent.click(getByTestId("submitBtn"))
        })

        expect(mockOnClick).toHaveBeenCalledTimes(1)
        expect(container.innerHTML).not.toMatch(/select a make/i)
        expect(container.innerHTML).not.toMatch(/select a year/i)
    })

    it('handles missing vessel make', async () => {
        const mockOnClick = jest.fn()
        //Session.setToken("123");
        const { getByTestId, container } = render(
              <ThemeProvider theme={theme}>
            <Context.Provider value={{ globalState: { addListStep: 3, addListVesselMake: "", addListVesselYear: "2021" } }}>
            <Step3 onClick={mockOnClick()} />
        </Context.Provider>
              </ThemeProvider>
        )

        await act(async () => {
            fireEvent.click(getByTestId("submitBtn"))
        })

        expect(mockOnClick).toHaveBeenCalledTimes(1)
        setTimeout(() => {
            expect(container.innerHTML).toMatch(/select a make/i)
          }, 2000)        
    })

    it('handles missing vessel year', async () => {
        const mockOnClick = jest.fn()
       // Session.setToken("123");
        const { getByTestId, container } = render(
               <ThemeProvider theme={theme}>
            <Context.Provider value={{ globalState: { addListStep: 3, addListVesselMake: "Some Make", addListVesselYear: "" } }}>
            <Step3 onClick={mockOnClick()} />
            </Context.Provider>
              </ThemeProvider>
        )

        await act(async () => {
            fireEvent.click(getByTestId("submitBtn"))
        })

        expect(mockOnClick).toHaveBeenCalledTimes(1)
       
        setTimeout(() => {
            expect(container.innerHTML).toMatch(/select a year/i)
          }, 2000)   
    })


})
