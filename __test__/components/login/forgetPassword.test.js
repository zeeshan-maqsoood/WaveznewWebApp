import React from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { act } from "react-dom/test-utils"
import { render, fireEvent, screen, waitFor } from "@testing-library/react"
import ForgetPassword from "../../../components/login/forgetPassword"

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
  rest.post("*users/forgetPassword", (req, res, ctx) => {
    return res(ctx.json({ message: "Send to email successfully" }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Forget Password Component", () => {
  it("render forgetpassword correctly", async () => {
    render(<ForgetPassword />)
  })

  // it("call handleForgetPassword function", async () => {
  //   const mockOnClick = jest.fn();
  //   const { getByTestId, container } = render(
  //     <ForgetPassword onClick={mockOnClick()} />
  //   );

  //   await act(async () => {
  //     fireEvent.click(getByTestId("submitBtn"));
  //   });

  //   expect(mockOnClick).toHaveBeenCalledTimes(1);
  //   expect(container.innerHTML).toMatch("Email required");
  // });

  // it("submit when email is in wrong format", async () => {
  //   const { getByTestId, container } = render(<ForgetPassword />);

  //   await act(async () => {
  //     fireEvent.change(getByTestId("email"), {
  //       target: { value: "wrongformatemail" },
  //     });
  //   });

  //   await act(async () => {
  //     fireEvent.click(getByTestId("submitBtn"));
  //   });

  //   expect(container.innerHTML).toMatch(/Invalid Email Id/i);
  //});

  //axios Mock
  it("axios API call", async () => {
    const { getByTestId, container } = render(<ForgetPassword />)
    await act(async () => {
      fireEvent.change(getByTestId("email"), {
        target: { value: "emailtest@com.ca" }
      })
    })
    await act(async () => {
      fireEvent.click(getByTestId("submitBtn"))
    })

    await waitFor(() => {
      screen.getByText("Please check your inbox")
    })
    console.log("current screen: ", container.innerHTML)
    expect(container.innerHTML).toMatch(/Please check your inbox/i)
  })
})
