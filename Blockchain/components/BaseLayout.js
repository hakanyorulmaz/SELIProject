import React from 'react';
import { initGA, logPageView } from '../utils/analytics';
import Head from 'next/head';

// Trying out loading feature
import NProgress from 'nprogress';
import Router from 'next/router';

Router.onRouteChangeStart = (url) => {
  NProgress.start();
}
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

export default class BaseLayout extends React.Component {
  componentDidMount () {
    if (!window.GA_INITIALIZED) {
      initGA()
      window.GA_INITIALIZED = true
    }
    logPageView()
  }
  render () {
    return (
      <div>
        <Head>
          <link rel="stylesheet" href="/_next/static/style.css" />
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" />
          <link href="https://fonts.googleapis.com/css?family=Libre+Baskerville:400,700|Pinyon+Script|Kaushan+Script|Merienda|Pacifico&display=swap" rel="stylesheet" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta property="og:description"
                content="Your certificate committed to the blockchain"/>
        
          
        </Head>
        {this.props.children}
      </div>
    )
  }
}
