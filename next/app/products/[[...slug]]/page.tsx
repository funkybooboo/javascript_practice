
interface Props {
    params: {
        slug: string[];
    };
    searchParams: {
        sortOrder: string;
    };
}

const ProductPage = ({params: {slug}, searchParams: {sortOrder}}: Props) => {
    return <div>Product Page {slug} {sortOrder}</div>
}

export default ProductPage;