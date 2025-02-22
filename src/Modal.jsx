import React from "react"

const Modal = (props) => {
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
                <h1 className="my-6 text-3xl text-center w-full">
                    <strong>Selected {props.type.charAt(0).toUpperCase() + props.type.slice(1)}</strong>
                </h1>
                <hr className="mb-8"/>
                {props.children}
                <button
                    className="mt-8 text-3xl bg-red-200 w-full rounded-md"
                    onClick={props.onClose}
                >
                    &times;
                </button>
            </div>
        </div>
    )
}

export default Modal;