import React from "react"
import { Carousel } from "react-responsive-carousel"

const ImageGallery = ({ imageArray }) => {
  return (
    <>
      <Carousel autoPlay>
        {imageArray.map((item) => (
          <div>
            <img alt={item} src={item} />
          </div>
        ))}
      </Carousel>
    </>
  )
}

export default ImageGallery
