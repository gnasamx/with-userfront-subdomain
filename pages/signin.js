import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import Userfront from "@userfront/core";
import { Field, Formik } from "formik";
import jwt from "jsonwebtoken";
import NavLink from "next/link";
import nookies from "nookies";
import { useState } from "react";

const publicKey = process.env.USERFRONT_PUBLIC_KEY;

function Signin() {
  const [alertMessage, setAlertMessage] = useState(null);

  const handleFormSubmit = (values, actions) => {
    Userfront.login({
      method: "password",
      emailOrUsername: values.email,
      password: values.password,
    })
      .then(() => {
        actions.resetForm();
      })
      .catch((error) => {
        setAlertMessage(error.message);
      })
      .finally(() => {
        actions.setSubmitting(false);
      });
  };

  return (
    <Flex
      bg="gray.100"
      align="center"
      justify="center"
      h="100vh"
      flexDirection="column"
      gap={6}
    >
      <Box width={96}>
        {alertMessage && (
          <Alert status="error" rounded="md" width="full">
            <AlertIcon />
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}
      </Box>
      <Heading as="h3" size="md">
        Sign in
      </Heading>
      <Box bg="white" p={6} rounded="md" w={96}>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={handleFormSubmit}
        >
          {({ handleSubmit, errors, touched, isSubmitting, isValidating }) => (
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.email && touched.email}>
                  <FormLabel htmlFor="email">Email Address</FormLabel>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    variant="filled"
                    validate={(value) => {
                      let error;
                      if (!value) {
                        error = "Email is required!";
                      } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
                      ) {
                        error = "Invalid email address";
                      }
                      return error;
                    }}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.password && touched.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    variant="filled"
                    validate={(value) => {
                      let error;
                      if (value.length < 6) {
                        error = "Password must contain at least 6 characters";
                      }
                      return error;
                    }}
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="green"
                  isFullWidth
                  isLoading={isSubmitting && !isValidating}
                  loadingText="Sign in"
                >
                  Sign in
                </Button>
              </Stack>
            </form>
          )}
        </Formik>
        <Center paddingTop={4}>
          <Text>
            Already have an account?,&nbsp;
            <NavLink href="/signup" passHref>
              <Link>Sign up</Link>
            </NavLink>
          </Text>
        </Center>
      </Box>
    </Flex>
  );
}

export async function getServerSideProps(context) {
  try {
    const requestCookies = nookies.get(context);
    const accessToken = requestCookies[Userfront.tokens.accessTokenName];
    const isLoggedIn = !!accessToken;

    if (isLoggedIn) {
      const verifiedToken = jwt.verify(accessToken, publicKey);
      if (verifiedToken) {
        return {
          redirect: {
            destination: "/",
            permanent: true,
          },
        };
      }
    } else {
      return { props: {} };
    }
  } catch (error) {
    console.error("Error - getServerSideProps: ", error.message);
    return {
      props: {},
    };
  }
}

export default Signin;
