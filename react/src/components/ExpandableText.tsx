import {useState} from "react";

interface Props {
    children: string;
    maxLength?: number;
}

function ExpandableText({children, maxLength=100} : Props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const text = isExpanded ? children : children.slice(0, maxLength) + '...';

    return (
        <p>{text} <button className={"btn btn-primary"} onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? "Less" : "More"}</button> </p>
    );
}

export default ExpandableText;