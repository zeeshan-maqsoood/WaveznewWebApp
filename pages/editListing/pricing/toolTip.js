import React from "react"
import { Grid, Tooltip, IconButton } from "@material-ui/core"
import { ErrorOutline } from "@material-ui/icons"

export default function CustomTooltip(props) {
  return (
    <>
      <Grid>
        <Tooltip title={props.title}>
          <IconButton>
            <ErrorOutline />
          </IconButton>
        </Tooltip>
      </Grid>
    </>
  )
}
