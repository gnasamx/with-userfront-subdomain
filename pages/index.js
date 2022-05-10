import {
  Box,
  Button,
  Center,
  Code,
  Container,
  Heading,
  Link,
  Stack,
} from "@chakra-ui/react";
import Userfront from "@userfront/core";
import jwt from "jsonwebtoken";
import NavLink from "next/link";
import nookies from "nookies";
import { useEffect, useState } from "react";

const publicKey = process.env.USERFRONT_PUBLIC_KEY;

const handleLogout = () => {
  Userfront.logout();
};

export default function Index() {
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(Userfront.user);
  }, []);

  return (
    <Container maxWidth="container.lg">
      <Center padding={5}>
        <Stack>
          <Heading as="h3" size="md">
            Userfront user
          </Heading>
          <pre>
            <Code>{JSON.stringify(user, null, 2)}</Code>
          </pre>
          <Box marginTop={5}>
            <Button onClick={handleLogout}>Logout</Button>
          </Box>
        </Stack>
      </Center>
    </Container>
  );
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const accessToken = cookies[Userfront.tokens.accessTokenName];
    const isLoggedIn = !!accessToken;

    if (isLoggedIn) {
      const verifiedToken = jwt.verify(accessToken, publicKey);
      if (verifiedToken) {
        return {
          props: {
            isLoggedIn: true,
          },
        };
      }
    } else {
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error("Error - getServerSideProps: ", error.message);
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
}
