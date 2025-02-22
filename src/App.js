import React, {useState} from 'react';
import GraphHeader from './GraphHeader';
import SideBar from './SideBar'

import DelegationsGraph from './DelegationsGraph';
import RulesGraph from './RulesGraph';

const GraphWrapper = (props) => {  
  let graphElement 
  
  switch (props.type) {
    case "delegations":
      graphElement = <DelegationsGraph targets={props.targets}/>
      break
    case "rules":
      graphElement = <RulesGraph targets={props.targets}/>
      break
    default:
      graphElement = <DelegationsGraph targets={props.targets}/>
      break
  }

  return <>{graphElement}</>
}

const App = () => {
  const [targets, setTargets] = useState({})
  const [graph, setGraph] = useState("delegations")
  
  // protect specific file types, heads (branches), and tags 
  function handleTargetsUpload(event) {
    const uploadedFile = event.target.files[0]
    if (uploadedFile.type !== "application/json") {
      alert("Expected JSON file.")
      return
    }
    const fileReader = new FileReader()
    fileReader.readAsText(uploadedFile, "UTF-8")
    fileReader.onload = e => {
      setTargets(JSON.parse(e.target.result))
    }
  }

  return (
    <>
      <GraphHeader
        handleTargetsUpload={handleTargetsUpload}
        targets={targets}
        setTargets={setTargets}
      />
      <div className='flex flex-row h-screen'>
        {
          Object.keys(targets).length !== 0
          ? 
          <>
            <SideBar
              setGraph={setGraph}
              targets={targets}
            />
            <GraphWrapper
              type={graph}
              targets={targets}
            />
          </>
          :
          <div className='text-4xl flex w-full justify-center items-center text-center'>
            <strong>Start By Uploading a File</strong>
          </div>
        }
      </div>
    </>
  );
};

export default App;
