
import Image from 'next/image';
import pineapple from '@/public/images/pineapple.jpg';

export default async function Home() {

  return (
    <main className={"relative h-screen"}>
        <p>My Next App home page!</p>
        <Image
            src={pineapple}
            alt={"Pineapple"}
            fill
            className={"object-cover"}
            sizes={"(max-width 480px) 100vw, (max-width: 768) 50vw, 33vw"}
            quality={75}
            priority
        />
    </main>
  );
}
