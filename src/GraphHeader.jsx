export default function GraphHeader(props) {
    
    return (
        <nav className="text-2xl w-full bg-gray-400 py-4 px-4">
            <label className="p-2 mr-2">
                Upload <strong>targets.json</strong> From Gittuf Repo:
            </label>
            <input
                className="rounded-md text-white font-bold"
                type="file"
                placeholder="Upload targets.json"
                onChange={props.handleTargetsUpload}
            />
        </nav>
    )
}