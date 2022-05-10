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
  FormHelperText,
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

function Signup() {
  const [alertMessage, setAlertMessage] = useState(null);

  const handleSignUpWithEmailAndPassword = (values, actions) => {
    Userfront.signup({
      method: "password",
      email: values.workEmail,
      password: values.password,
      name: values.fullName,
      data: {
        companyName: values.companyName,
      },
      redirect: false,
    })
      .then(() => {
        actions.resetForm();

        console.log("Signup - redirecting to the subdomain");
        let { protocol, host } = window.location;
        window.location.href = `${protocol}//${values.companyName.toLowerCase()}.${host}`;
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
          <Alert status="error" rounded="md">
            <AlertIcon />
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}
      </Box>
      <Heading as="h3" size="md">
        Register
      </Heading>
      <Box bg="white" p={6} rounded="md">
        <Formik
          initialValues={{
            fullName: "",
            companyName: "",
            workEmail: "",
            password: "",
          }}
          onSubmit={handleSignUpWithEmailAndPassword}
        >
          {({ handleSubmit, errors, touched, isSubmitting, isValidating }) => (
            <form onSubmit={handleSubmit}>
              <Stack spacing={4} align="flex-start">
                <FormControl isInvalid={!!errors.fullName && touched.fullName}>
                  <FormLabel htmlFor="name">Full name</FormLabel>
                  <Field
                    as={Input}
                    id="fullName"
                    name="fullName"
                    type="text"
                    variant="filled"
                    validate={(value) => {
                      let error;
                      if (!value.length) {
                        error = "Full name is required!";
                      }
                      return error;
                    }}
                  />
                  <FormErrorMessage>{errors.fullName}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={!!errors.companyName && touched.companyName}
                >
                  <FormLabel htmlFor="name">Company Name</FormLabel>
                  <Field
                    as={Input}
                    id="companyName"
                    name="companyName"
                    type="text"
                    variant="filled"
                    validate={(value) => {
                      let error;
                      if (!value.length) {
                        error = "Company name is required!";
                      }
                      return error;
                    }}
                  />
                  <FormErrorMessage>{errors.companyName}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={!!errors.workEmail && touched.workEmail}
                >
                  <FormLabel htmlFor="email">Work email</FormLabel>
                  <Field
                    as={Input}
                    id="workEmail"
                    name="workEmail"
                    type="email"
                    variant="filled"
                    validate={(value) => {
                      let error;
                      if (!value) {
                        error = "Work email is required!";
                      } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
                      ) {
                        error = "Invalid email address";
                      }
                      return error;
                    }}
                  />
                  <FormErrorMessage>{errors.workEmail}</FormErrorMessage>
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
                  <FormHelperText>
                    At least 6 characters including a number and a letter.
                  </FormHelperText>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="green"
                  isFullWidth
                  isLoading={isSubmitting && !isValidating}
                  loadingText="Create my account"
                >
                  Create my account
                </Button>
              </Stack>
            </form>
          )}
        </Formik>
        <Center paddingTop={4}>
          <Text>
            Already a customer?&nbsp;
            <NavLink href="/signin" passHref>
              <Link>Sign in</Link>
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
      return {
        props: {},
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

export default Signup;
