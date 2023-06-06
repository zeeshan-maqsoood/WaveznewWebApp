import React from "react"
import { io } from "socket.io-client"
import Session from "../sessionService"

const token = Session.getToken("WaveToken")

export const socket = io(`${process.env.socketBackendUrl  }/user`, { auth: { token } })

export const SocketContext = React.createContext()