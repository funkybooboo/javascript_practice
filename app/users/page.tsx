
interface User {
    id: number;
    name: string;
}

const UsersPage = async () => {

    const response = await fetch('https://jsonplaceholder.typicode.com/users', { next: { revalidate: 10 } });
    const users: User[] = await response.json();

    return (
        <>
        <h1>Users</h1>
        <ul>
            {users.map(user => <li key={user.id}>{user.name}</li>)}
        </ul>
        </>
    )
}

export default UsersPage;