import React from "react"
import { act } from "react-dom/test-utils"
import { render, fireEvent, within } from '@testing-library/react'
import Validation from "../../../components/login/validation"

jest.mock("next/router", () => ({
  useRouter() {
      return {
          route: "/",
          pathname: "",
          locale: "en"
      }
  }
}))

describe("validation Component", () => {
it('render with no props', async () => {
  act(() => {
    render(<Validation />)
  })
})

it("render when valdation is true", async () => {
  const {getAllByTestId, container} = render(<Validation validated="true"/>)
  const checkInValidation=within(container).getAllByTestId("checkicon")

  expect(checkInValidation.length).toBe(1)
})

it("render a validation message", async () => {
  const { container} = render(<Validation validationContent="this is a validation"/>)
  
  expect(container.innerHTML).toMatch(/this is a validation/i)
})

})