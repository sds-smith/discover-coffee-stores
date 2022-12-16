import Link from "next/link"
import Image from "next/image"
import cls from 'classnames'

import {cardLink, container, cardHeaderWrapper, cardHeader, cardImageWrapper, cardImage} from './card.module.css'

const Card = ({href, name, imgUrl}) => {
    return (
        <Link className={cardLink} href={href}>
            <div className={cls('glass', container)} >
                <div className={cardHeaderWrapper} >
                    <h2 className={cardHeader}>{name}</h2>
                </div>
                <div className={cardImageWrapper} >
                    <Image className={cardImage} src={imgUrl} width={260} height={160} alt={name || 'coffee store card'}/>
                </div>
            </div>

        </Link>
    )
}

export default Card