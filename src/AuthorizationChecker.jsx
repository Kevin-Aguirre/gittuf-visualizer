import React, { useState } from "react"
import Dropdown from 'react-bootstrap/Dropdown'

const getRoleByPath = (targets, path) => {
    for (const role of targets.delegations.roles) {
        if (role.paths.includes(path)) return role
    }
}

const AuthorizationChecker = (props) => {
    const allPaths = props.targets.delegations.roles.flatMap((role) => role.paths)
    const allActors = Object.keys(props.targets.delegations.keys)
 
    const [selectedPath, setSelectedPath] = useState("")
    const [selectedActors, setSelectedActors] = useState([])
    
    const [filterText, setFilterText] = useState("")
    const [showDropdown, setShowDropdown] = useState(false)
    

    const filteredActors = allActors.filter((actor) => actor.includes(filterText) && !selectedActors.includes(actor))
    
    function clearSelections() {
        setFilterText("")
        setShowDropdown(false)
        setSelectedActors([])
        setSelectedPath("")
    }

    function handleActorChange(e) {
        setFilterText(e.target.value)
        setShowDropdown(true)
    }

    function validateSelections() {
        if (selectedActors.length < getRoleByPath(props.targets, selectedPath).threshold) {
            alert(`Failed. The amount of selected actors is less than the threshold needed for this path.`)
            return
        }

        let validatedActors = 0 
        for (const actor of selectedActors) {
            if (getRoleByPath(props.targets, selectedPath).keyids.includes(actor)) validatedActors += 1
        }

        if (validatedActors >= getRoleByPath(props.targets, selectedPath).threshold) {
            alert(`Success. These keys can make changes to the following path: ${selectedPath}`)
        } else {
            alert(`Failed. These keys cannot make changes to the following path: ${selectedPath}`)
        }

    }

    function handleAddActor(actor) {
        if (!selectedActors.includes(actor)) {
            setSelectedActors((prevActors) => [...prevActors, actor])
        }
        setFilterText("")
        setShowDropdown(false)
    }

    if (!props.isOpen) return null 
    return (
        <div>
            <h1>Check Authorization </h1>
            <p>Use this tool to check if multiple actor(s)/key(s) are authorized to make changes on a certain path.</p>
            <hr/>
            <div className="flex items-center">
                <div className="text-xl pr-2 inline-block"><strong>Select Path: </strong></div>
                <Dropdown 
                    className="!inline-block"
                    onSelect={(eventKey) => setSelectedPath(eventKey)}
                >
                    <Dropdown.Toggle id="dropdown-button" className="!inline-block"> {/**you can do !bg-red-200 to override the bootstrap styling */}
                        Select Path 
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {allPaths.map((path) => {
                            return <Dropdown.Item eventKey={path}>{path}</Dropdown.Item>
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            {
                selectedPath !== ""
                &&
                <>
                    <div className="my-1 flex text-xl">
                        <strong className="pr-2">Selected Path:</strong>{selectedPath}
                    </div>
                    <div className="my-1 flex text-xl">
                        <strong className="pr-2">Path Threshold:</strong>{getRoleByPath(props.targets, selectedPath).threshold}
                    </div>
                    <div className="my-1 flex items-center w-full">
                        <strong className="text-xl pr-2 ">Select Actor: </strong>
                        <div className="flex-grow">
                            <input
                                type="text"
                                className="flex-grow border p-2 w-full rounded-md"
                                placeholder="Select Actor"
                                value={filterText}
                                onChange={handleActorChange}
                                onFocus={() => setShowDropdown(true)}
                            />
                            {
                                showDropdown 
                                && 
                                (
                                    <ul className="w-full border border-gray-300 mt-1 p-0 list-none absolute w-7/12 bg-white">
                                        {
                                            filteredActors.length > 0 
                                            ? 
                                            filteredActors.map((actor, i) => (
                                                <li className="hover:bg-gray-200 w-full" key={i} onClick={() => handleAddActor(actor)}>{actor}</li>    
                                            ))
                                            :
                                            <div className="text-gray-500">No matches</div>
                                        }
                                    </ul>
                                )
                            }
                        </div>
                    </div>
                    {
                        selectedActors.length > 0 
                        &&
                        <div>
                            <strong className="flex text-xl">Selected Actors:</strong>
                            {selectedActors.map((actor, i) => <div className="my-1 p-1 rounded-md w-full bg-gray-200" key={i}>{actor}</div>)}
                        </div>
                    }
                    <button className="mt-4 py-1 text-2xl bg-blue-200 w-full rounded-md" onClick={validateSelections}>Validate</button>
                    <button className="mt-1 py-1 text-2xl bg-blue-200 w-full rounded-md" onClick={clearSelections}>Clear Selections</button>
                </>
            }
        </div>
    )
}

export default AuthorizationChecker