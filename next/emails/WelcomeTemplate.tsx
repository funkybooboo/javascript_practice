import {Html, Body, Container, Text, Preview, Tailwind} from '@react-email/components';

interface Props {
    name?: string
}

const WelcomeTemplate = ({name}: Props) => {
    return (
        <Html>
            <Preview>Welcome aboard!</Preview>
            <Tailwind>
                <Body className={"bg-white"}>
                    <Container>
                        <Text className={"font-bold text-3xl"}>Hello {name ? name : "You"}</Text>
                        <Text>Hope you enjoy My Next App</Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}

export default WelcomeTemplate;