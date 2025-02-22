import React, { useRef, useState, useEffect } from "react"
import { Network } from "vis-network/standalone";
import "vis-network/styles/vis-network.css";
import Modal from "./Modal";

const ModalBody = ({node, type}) => {
    console.log(node);
    
    let body
    switch (type) {
        case "key":
            body = (
                <div>
                    <p><strong>Key ID:</strong>{" "}{node.keyid}</p>
                    <p><strong>Key Type:</strong>{" "}{node.keytype}</p>
                    <p><strong>Scheme:</strong>{" "}{node.scheme}</p>
                    <p><strong>Key ID:</strong>{" "}{node.keyid}</p>
                    {Object.keys(node.keyval).map((key) => (
                        <p>
                            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                            {" "}
                            {   
                                node.keyval[key].length > 100 
                                ? node.keyval[key].substring(0, 100 - 3) + "..." 
                                : node.keyval[key]
                            }
                        </p>
                    ))}
                </div>
            )
            break
        case "rule":
            body = (
                <div>
                    <p><strong>Name:</strong>{" "}{node.name}</p>
                    <p><strong>Paths:</strong></p>
                    {node.paths.map((path) => (
                        <p className="pl-4">{path}</p>
                    ))}
                    <p><strong>Threshold:</strong>{" "}{node.threshold}</p>
                    <p><strong>Terminating:</strong>{" "}{node.terminating.toString()}</p>
                    <p><strong>Key IDs:</strong></p>
                    {node.keyids.map((keyid) => (
                        <p className="pl-4">{keyid}</p>
                    ))}
                </div>
            )
            break
        case "admin":
            body = (
                <div>
                    admin
                </div>
            )
            break;
        default:
            body = <div>unsupported node</div>

    }
    return body

}

const getNodes = (targets) => {
    let nodes = [
        { id: "admin", label: "admin", color: "#ff6666"}
    ]


    console.log(targets.delegations.roles);
    
    for (const role of targets.delegations.roles) {
        if (role.keyids !== null) {
            for (const keyid of role.keyids) {
                if (!nodes.some((node) => node.id === keyid)) {
                    const nodeData = {
                        id: keyid, 
                        label: keyid > 40 ? keyid.substring(0, 40) + "..." : keyid
                    }
    
                    if (targets.delegations.keys[keyid].keyval.identity) {
                        const tempLabel = targets.delegations.keys[keyid].keyval.identity
                        nodeData.label = tempLabel.length > 40 ? tempLabel.substring(0, 47) + "..." : tempLabel
                    }
                    
                    nodes.push(nodeData)
                }
            }
        }
    }
    return nodes
}

const getEdges = (targets) => { 
    let edges = []

    for (const role of targets.delegations.roles) {
        if (role.keyids !== null) {
            for (const keyid of role.keyids) { // we should use the role.name string and role.paths array of strings
                edges.push({ 
                    from: 'admin', 
                    to: keyid,
                    arrows: { to: { enabled: true } },
                    label: `${role.paths[0]}`
                })
            }   
        }
    }

    return edges 
}

const DelegationsGraph = (props) => {
    const [isRulesModalOpen, setModalOpen] = useState(false)
    const [selectedNodeData, setSelectedNodeData] = useState(null)
    const [selectedNodeType, setSelectedNodeType] = useState('')

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const networkRef = useRef(null);
    const networkInstanceRef = useRef(null);

    const nodes = getNodes(props.targets)
    const edges = getEdges(props.targets)
    const options = {
        physics: {
            enabled: false, // Enable physics
            barnesHut: {
                springConstant: 0.02 // Stiffness of the spring
            },
            repulsion: {    
                nodeDistance: 100, // Distance between nodes (larger values = more spacing)
                avoidOverlap: 1 // Avoid node overlap by applying a repulsion force between nodes
            }
        },
        layout: {
            hierarchical: {
                enabled: true,        // Enable hierarchical layout
                levelSeparation: 150, // Space between levels
                treeSpacing: 400, 
                nodeSpacing: 250,     // Space between nodes in a level
                sortMethod: 'directed' // 'directed' or 'hubsize'
            }
        },
        interaction: {
            dragNodes: true, // Allow dragging of nodes
            dragView: true,  // Allow dragging of the entire network view
            zoomView: true,  // Allow zooming of the network
            hover: true,     // Allow hover effects on nodes
        }
    };

    useEffect(() => {
        if (networkRef.current && !networkInstanceRef.current) {
            networkInstanceRef.current = new Network(networkRef.current, { nodes, edges }, options);

            networkInstanceRef.current.on('click', (params) => { // refer to click event: https://visjs.github.io/vis-network/docs/network/#Events
                if (params.nodes.length > 0) {
                    const nodeId = params.nodes[0]
                    
                    if (props.targets.delegations.keys[nodeId]) {
                        setSelectedNodeData(props.targets.delegations.keys[nodeId]) 
                        setSelectedNodeType('key')   
                    } else if (props.targets.delegations.roles.find(o => o.name === nodeId)) {
                        setSelectedNodeData(props.targets.delegations.roles.find(o => o.name === nodeId))
                        setSelectedNodeType('rule')   
                    } else {
                        setSelectedNodeData({ id: "admin", label: "admin", color: "#ff6666"})
                        setSelectedNodeType('admin')   
                    }
                    
                    openModal()
                } else {} // empty space 
            })
        }
    
        return () => {
            if (networkInstanceRef.current) {
                networkInstanceRef.current.destroy();
                networkInstanceRef.current = null;
            }
        };
    }, [networkRef]);

    useEffect(() => {
        if (networkInstanceRef.current) {
            networkInstanceRef.current.setData({ nodes, edges });
        }
    }, [nodes, edges, options])


    return (
        <>
            <div ref={networkRef} style={{ width: '100%', height: '100%' }} />
            <Modal
                isOpen={isRulesModalOpen}
                onClose={closeModal}
                type={selectedNodeType}
            >
                {
                    selectedNodeData !== null
                    &&
                    <ModalBody
                        node={selectedNodeData}
                        type={selectedNodeType}
                    />
                }
            </Modal>
        </>
    );}

export default DelegationsGraph