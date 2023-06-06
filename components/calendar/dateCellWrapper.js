import PropTypes from 'prop-types'
import theme from "../../src/theme"

export const DateCellWrapper = (props, selected) => {
    const { children, value } = props
    const isSelected = new Date(value).valueOf() === new Date(selected).valueOf()
    const isPastDay = new Date(value).valueOf() < new Date().valueOf()

    return React.cloneElement(Children.only(children), {
        style: {
            ...children.style,
            backgroundColor: isSelected ? theme.palette.background.lightBlue : isPastDay ? theme.palette.background.aliceBlue : theme.palette.background.default,
            borderRight: '1px solid #e5e9f0',
            borderBottom: '1px solid #e5e9f0'
        }
    })
}

DateCellWrapper.propTypes = {
    selected: PropTypes.any.isRequired
}