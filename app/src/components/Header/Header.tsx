import Image from "next/image";
import { HeaderStyled} from "./Header.styled";
import { ItemStyled, LinkStyled, TextStyled } from "./Items/Item.styled";
import logo from "@/assets/image.png";
import Link from "next/link";
import { useEffect, useState } from 'react';

const Header = () => {

    return <HeaderStyled>
        <ItemStyled>
            <Link href={"/"}><Image src={logo} alt={""} height={50} ></Image></Link>
        </ItemStyled>
        <ItemStyled>
            <TextStyled>+7 937 245 14 06</TextStyled>
        </ItemStyled>
        <ItemStyled>
            <LinkStyled>Каталог</LinkStyled>
            <LinkStyled>Контакты</LinkStyled>
            <LinkStyled>Корзина</LinkStyled>
        </ItemStyled>
    </HeaderStyled>
}

export default Header;