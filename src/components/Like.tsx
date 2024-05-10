import { FaHeart } from "react-icons/fa"; // Filled
import { CiHeart } from "react-icons/ci";
import {useState} from "react";

interface Props {
    onClick: () => void;
    onUnClick: () => void;
    isSelected?: boolean;
}

function Like({ onClick, onUnClick, isSelected=false }: Props) {

    const [selected, setSelected] = useState(isSelected);

    const toggle = () => {
        setSelected(!selected);
        if (selected) {
            onUnClick();
        } else {
            onClick();
        }
    }

    return (
        <div>
            {selected ? <FaHeart color="#ff6b81" size={20} onClick={toggle} /> : <CiHeart size={20} onClick={toggle} /> }
        </div>
    );
}

export default Like;