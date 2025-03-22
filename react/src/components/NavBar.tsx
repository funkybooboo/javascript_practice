
interface Props {
    places: {link: string, name: string}[];
    cartItemsCount: number;
}

function NavBar({places, cartItemsCount} : Props) {
  return (
    <nav>
      <ul>
        {places.map(place => (
          <li key={place.link}>
            <a href={place.link}>{place.name}</a>
            </li>
        ))}
        <li>
          <a href="/cart">Cart ({cartItemsCount})</a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;