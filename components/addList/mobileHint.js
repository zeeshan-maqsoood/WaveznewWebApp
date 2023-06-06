import React, { useState, useEffect } from "react"
import Hint from "../../pages/addList/hint"

const MobileHint = ({ content = [], closeHint, closeOnScroll = true }) => {
    useEffect(() => {
        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleScroll = () => {
        closeOnScroll && closeHint()
    }

    return (
        <div style={{ marginTop: 30 }}>
            {content.map((item, index) => (
                <Hint content={item.hint} title={item.title} key={index} cancellation={item.cancellation} />
            ))}
        </div>
    )
}

export default MobileHint
