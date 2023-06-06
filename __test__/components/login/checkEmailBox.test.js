import React from "react"
import { act } from "react-dom/test-utils"
import { render, fireEvent } from "@testing-library/react"
import CheckEmailBox from "../../../components/login/checkEmailBox"

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      locale: "en"
    }
  }
}))

describe("Check Email Box component", () => {
  it("render checkEmailBox with no header and message correctly", async () => {
    render(<CheckEmailBox />)
  })

  it("render message content", async () => {
    const { container } = render(
      <CheckEmailBox messageContent={"this is a message content"} />
    )

    expect(container.innerHTML).toMatch(/this is a message content/i) 
  })

})
