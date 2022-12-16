import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import useSWR from 'swr';

import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { isEmpty, fetcher } from "../../utils/index.utils";
import { StoreContext } from "../../context/store-context";

import styles from '../../styles/coffee-stores.module.css'
import cls from 'classnames'

export async function getStaticProps(staticProps) {
    const params = staticProps.params

    const coffeeStores = await fetchCoffeeStores()
    const findCoffeeStoreById = coffeeStores.find((coffeeStore) => coffeeStore.id.toString() === params.id)
    return {
        props: {
            coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {}
        }
    }
}

export async function getStaticPaths() {
    const coffeeStores = await fetchCoffeeStores()

    return {
        paths: coffeeStores.map(coffeeStore => ({params: {id: coffeeStore.id.toString()}})),
        fallback: true
    }
}

const CoffeeStore = (initialProps) => {
    const [coffeeStore, setCoffeeStore] = useState({})
    const [votingCount, setVotingCount] = useState(0)

    const { name, imgUrl, neighborhood, address } = coffeeStore

    const router = useRouter();
    const id = router.query.id;

    const {
        state: {
            coffeeStores
        }
    } = useContext(StoreContext)

    const {data, error} = useSWR(`/api/get-coffee-store-by-id?id=${id}`, fetcher);


    const handleUpvoteButton = async () => {
        try {
            const response = await fetch('/api/upvote-coffee-store-by-id', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id
                })
            })
            const dbCoffeeStore = await response.json();
            if (dbCoffeeStore && dbCoffeeStore.length) {
                let count = votingCount + 1;
                setVotingCount(count)
            }
        } catch (err) {
            console.error("Error upvoting coffee store", err)
        }

    }

    const handleCreateCoffeeStore = async (coffeeStore) => {
        try {
            const {id, name, imgUrl, neighborhood, address} = coffeeStore
            const response = await fetch('/api/create-coffee-store', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id, 
                    name, 
                    voting: 0, 
                    imgUrl, 
                    neighborhood: neighborhood || "", 
                    address: address || ""
                })
            })
            const dbCoffeeStore = await response.json();
        } catch (err) {
            console.error('Error creating coffee store', err)
        }
    }

    useEffect(() => {
        if (isEmpty(initialProps.coffeeStore)) {
            if (coffeeStores.length) {
                const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => coffeeStore.id.toString() === id)
                if (coffeeStoreFromContext) {
                    setCoffeeStore(coffeeStoreFromContext)
                    handleCreateCoffeeStore(coffeeStoreFromContext)
                }
            }
        } else {
            setCoffeeStore(initialProps.coffeeStore)
            handleCreateCoffeeStore(initialProps.coffeeStore)
        }
    }, [coffeeStore, coffeeStores, id, initialProps.coffeeStore])

    useEffect(() => {
        if (data && data.length) {
            setCoffeeStore(data[0])
            const voting = parseInt(data[0].voting)
            setVotingCount(voting)
        }
    }, [data])

    return (
        <>
        {
        router.isFallback ? (
            <div>Loading...</div>
        ) : (
            <div>
                <Head>
                    <title>{`Coffee Explorer: ${name}`}</title>
                </Head>
                <div className={styles.container}>
                    <div className={styles.col1}>
                        <div className={styles.backToHomeLink}>
                            <Link href='/'>
                                ← Back to home                         
                            </Link>
                        </div>
                        <div className={styles.nameWrapper}>
                            <h1 className={styles.name}>{name}</h1>
                        </div>
                        <div className={styles.storeImgWrapper}>
                            <Image className={styles.storeImg} src={imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'} width={600} height={360} alt={name || 'coffee store image'}></Image>
                        </div>
                    </div>
                    <div className={cls('glass', styles.col2)}>
                        <div className={styles.iconWrapper}>
                            <Image src='/static/icons/places.svg' width='24' height='24' alt='address icon'/>
                            <p className={styles.text}>{address}</p>
                        </div>
                        <div className={styles.iconWrapper}>
                            <Image src='/static/icons/near-me.svg' width='24' height='24' alt='neighborhood icon'/>
                            <p className={styles.text}>{neighborhood}</p>
                        </div>
                        <div className={styles.iconWrapper}>
                            <Image src='/static/icons/star.svg' width='24' height='24' alt='upvotes icon'/>
                            <p className={styles.text}>{votingCount}</p>
                        </div>
                        <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
                            Up vote!
                        </button>
                    </div>
                </div>
            </div>
        )
        }
        </>
    )
}

export default CoffeeStore