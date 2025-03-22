
interface Props {
    params: {
        userId: number;
        photoId: number;
    }
}

const PhotoDetailPage = ({params: {userId, photoId}}: Props) => {
    return (
        <div>Photo Detail Page {userId} {photoId}</div>
    );
}

export default PhotoDetailPage;