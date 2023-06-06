import React from 'react'
import PropTypes from 'prop-types'
import theme from "../../src/theme"

class ReadMore extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      charLimit: props.charLimit
    }
    this.initialState = this.state
  }

  getReadMoreContent() {
    const { charLimit } = this.state
    const { children, readMoreText, readLessText } = this.props
    if (children?.length > charLimit) {
      return (<span className="short-text" >
        {children.substr(0, charLimit)}...
        <a
          href="#textSection"
          className="readMoreText"
          style={{ color: theme.palette.userReview.iconFilled, cursor: 'pointer' }}
          role="presentation"
          onClick={this.showLongText.bind(this)}
        >
          {readMoreText}
        </a>
      </span>)
    } else if (children?.length < charLimit) {
      return (<span className="short-text">
        {children}
      </span>)
    }
    return (<span className="short-text" >
      {children}
      <a
        href="#textSection"
        className="readMoreText"
        style={{ color: theme.palette.userReview.iconFilled, cursor: 'pointer' }}
        role="presentation"
        onClick={this.showShortText.bind(this)}
      >
        {readLessText}
      </a>
    </span>)
  };

  showLongText(e) {
    e.preventDefault()
    const { children } = this.props
    this.setState({ charLimit: children.length })
    this.getReadMoreContent()
  }

  showShortText(e) {
      e.preventDefault()
    this.setState(this.initialState)
    this.getReadMoreContent()
  }

  render() {
    return (
      <div>
        {this.getReadMoreContent()}
      </div>
    )
  }
}

ReadMore.propTypes = {
  charLimit: PropTypes.number,
  readMoreText: PropTypes.string,
  readLessText: PropTypes.string
}
ReadMore.defaultProps = {
  charLimit: 150,
  readMoreText: 'Read more',
  readLessText: 'Read less'
}
export default ReadMore
