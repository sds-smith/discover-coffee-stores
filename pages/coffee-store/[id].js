import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { isEmpty } from "../../utils/index.utils";
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
    const router = useRouter();
    const {
        state: {
            coffeeStores
        }
    } = useContext(StoreContext)

    const id = router.query.id

    const handleUpvoteButton = () => {
        console.log('handle upvote')
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
            console.log({dbCoffeeStore})
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

    const {name, imgUrl, location} = coffeeStore
    const {neighborhood, locality, formatted_address} = location ? location : {undefined, undefined, undefined}
    const address = formatted_address

    return (
        <>
        {
        router.isFallback ? (
            <div>Loading...</div>
        ) : (
            <div>
                <Head>
                    <title>{name}</title>
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
                            <Image className={styles.storeImg} src={imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'} width={600} height={360} alt={name}></Image>
                        </div>
                    </div>
                    <div className={cls('glass', styles.col2)}>
                        <div className={styles.iconWrapper}>
                            <Image src='/static/icons/places.svg' width='24' height='24' alt=''/>
                            <p className={styles.text}>{address}</p>
                        </div>
                        <div className={styles.iconWrapper}>
                            <Image src='/static/icons/near-me.svg' width='24' height='24' alt=''/>
                            <p className={styles.text}>{neighborhood ? neighborhood[0] : locality}</p>
                        </div>
                        <div className={styles.iconWrapper}>
                            <Image src='/static/icons/star.svg' width='24' height='24' alt=''/>
                            <p className={styles.text}>1</p>
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