import Image from "next/image";
import { HeaderStyled} from "./Header.styled";
import { ItemStyled, LinkStyled, TextStyled } from "./Items/Item.styled";
import logo from "@/assets/image.png";
import Link from "next/link";


const Header = () => {
    const showProfile = () => {
        const isAuthToken = localStorage.getItem("authToken");

        if (isAuthToken) return  <LinkStyled href="/profile">Профиль</LinkStyled>
        return <LinkStyled href="/auth/login">Войти</LinkStyled>
    }
    return <HeaderStyled>
        <ItemStyled>
            <Link href={"/"}><Image src={logo} alt={""} height={50} ></Image></Link>
        </ItemStyled>
        <ItemStyled>
            <TextStyled>+7 937 245 14 06</TextStyled>
        </ItemStyled>
        <ItemStyled>
            <LinkStyled href="/catalog">Каталог</LinkStyled>
            <LinkStyled>Контакты</LinkStyled>
            <LinkStyled href="/cart">Корзина</LinkStyled>
            {showProfile()}
        </ItemStyled>
    </HeaderStyled>
}

export default Header;