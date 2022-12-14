
import Footer from '../components/footer'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} />
      <Footer />
    </div>

    )
}

export default MyApp
