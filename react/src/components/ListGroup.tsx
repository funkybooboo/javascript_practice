import {useState} from "react";

interface Props {
    heading: string;
    items: string[];
    onSelectItem: (item: string) => void;
}

function ListGroup({ heading, items, onSelectItem }: Props) {

    function attributes(index: number) {
        return selectedIndex === index ? 'list-group-item active' : 'list-group-item'
    }

    const [selectedIndex, setSelectedIndex] = useState(-1)

    return (
        <>
            <h1>{heading}</h1>
            {items.length === 0 && <p>No items found</p>}
            <ul className="list-group">
                {
                    items.map(
                        (item, index) => (
                            <li
                                key={item}
                                className={attributes(index)}
                                onClick={() => {
                                    setSelectedIndex(index)
                                    onSelectItem(item)
                                }}
                            >
                                {item}
                            </li>
                        )
                    )
                }
            </ul>
        </>

    );
}

export default ListGroup;