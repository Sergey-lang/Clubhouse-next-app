import '../styles/globals.scss';
import App, { AppContext } from 'next/app';
import withRedux from 'next-redux-wrapper';
import { makeStore } from '../redux/store';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }: AppContext) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return <Component {...pageProps}/>;
  }
}

export default withRedux(makeStore)(MyApp);
