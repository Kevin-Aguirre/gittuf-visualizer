import React, { useState } from "react"
import AuthorizationChecker from "./AuthorizationChecker"
import GeneralModal from "./GeneralModal"

export default function SideBar(props) {
    const [isRuleCheckerOpen, setIsRuleCheckerOpen] = useState(false)

    const openRuleChecker = () => setIsRuleCheckerOpen(true)
    const closeRuleChecker = () => setIsRuleCheckerOpen(false)

    return (
        <div className="flex flex-col w-72 bg-gray-200 px-4 py-4 text-center">
            <h1 className="text-3xl py-3 px-2 font-bold">Graphs</h1>
            <button 
                className="w-full my-1 py-2 text-2xl rounded-sm bg-blue-200"
                onClick={() => props.setGraph("delegations")}
            >
                Delegations
            </button>
            <button 
                className="w-full my-1 py-1 text-2xl rounded-sm bg-blue-200"
                onClick={() => props.setGraph("rules")}
            >
                Rules
            </button>
            <hr className="border-black my-3 "/>
            <button onClick={openRuleChecker} className="w-full my-1 py-2 text-2xl rounded-sm bg-green-200">
                Check Authorization
            </button>
            <GeneralModal
                isOpen={isRuleCheckerOpen}
                onClose={closeRuleChecker}
            >
                <AuthorizationChecker
                    onClose = {closeRuleChecker}
                    isOpen = {isRuleCheckerOpen}
                    targets = {props.targets}
                />
            </GeneralModal>
        </div>
    )


}