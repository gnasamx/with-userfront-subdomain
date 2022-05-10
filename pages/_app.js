import { ChakraProvider } from "@chakra-ui/react";
import Userfront from "@userfront/core";

Userfront.init(`${process.env.NEXT_PUBLIC_TENANT_ID}`);

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
