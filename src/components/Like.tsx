import { FaHeart } from "react-icons/fa"; // Filled
import { CiHeart } from "react-icons/ci";
import {useState} from "react";

interface Props {
    onClick: () => void;
}

function Like({ onClick }: Props) {

    const [clicked, setClicked] = useState(false)

    const click = () => {
        setClicked(!clicked)
        onClick()
    }

    return (
        <div>
            {clicked ? <FaHeart onClick={click} /> : <CiHeart onClick={click} />}
        </div>
    );
}

export default Like;