import React from "react"

const GeneralModal = (props) => {
    if (!props.isOpen) return null

    return (
        <div 
            className="bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full flex justify-center items-center z-50"
            onClick={props.onClose}
        >
            <div
                className="bg-white w-8/12 rounded-md p-4"
                onClick={(e) => e.stopPropagation()}
            >
                {props.children}
            </div>
        </div>
    )
}

export default GeneralModal;