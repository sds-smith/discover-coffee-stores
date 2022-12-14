import Head from "next/head";
import { useRouter } from "next/router";

const Dynamic = () => {
    const router = useRouter();

    return (
        <div>
            <Head>
                <title>{router.query.id}</title>
            </Head>
            Page {router.query.id}
        </div>
    )
}

export default Dynamic