import React from "react"
import ReactDOM from "react-dom"
import { Comments } from "./components"

export const config = {
  username: "saber2pr",
  repo: "rc-gitment",
  client_id: "4bc4348cee52",
  client_secret: "679debf856611c2e88607bc576"
}

ReactDOM.render(<Comments {...config} />, document.querySelector("#root"))
