import React from "react"
import { act } from "react-dom/test-utils"
import { render, unmountComponentAtNode } from "react-dom"
//import { render, cleanup, waitFor } from '@testing-library/react';
import Hint from "../../../pages/addList/hint"

jest.mock("next/router", () => ({
  useRouter() {
      return {
          route: "/",
          pathname: "",
          locale: "en"
      }
  }
}))

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div")
  document.body.appendChild(container)
})

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container)
  container.remove()
  container = null
})

it('Should render correctly hint component', async () => {
  act(() => {
    render(<Hint content="this is a hint" />, container)
  })
  expect(container.textContent).toBe("Hintthis is a hint")

  act(() => {
      render(<Hint/>, container)
  })
  expect(container.textContent).toBe("Hint")
})
