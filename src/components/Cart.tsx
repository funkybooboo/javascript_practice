
interface Props {
    cartItems: string[];
    onClear: () => void;
}

function Cart( {cartItems, onClear} : Props) {
    
    return (
        <>
            <h1>Cart</h1>
            {cartItems.length === 0 && <p>No items in the cart</p>}
            <ul className={'list-group'}>
                {cartItems.map(item => (
                    <li className={'list-group-item'} key={item}>{item}</li>
                ))}
            </ul>
            <button onClick={onClear}>Clear</button>
        </>
    );
}

export default Cart;