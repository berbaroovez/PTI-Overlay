import GlobalStyles from "../util/GlobalStyles";

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />

      <Component {...pageProps} />
    </>
  );
}
