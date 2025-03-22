
interface Props {
    params: {
        userId: number;
    }
}

const UserDetailPage = ({params: {userId}} : Props) => {
    return (
        <div>User Detail Page {userId}</div>
    );
}

export default UserDetailPage;