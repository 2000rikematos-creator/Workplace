import { Search } from "lucide-react";
import "./SearchIcon.css"

interface SearchIconProps {
    onClick:()=>void
}

function SearchIcon(props:SearchIconProps){
    return <Search className="search-icon" onClick={props.onClick}/>
}

export default SearchIcon