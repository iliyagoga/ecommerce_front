import { defaultTheme } from "@/themes/defaultTheme";
import styled from "styled-components";

export const ItemStyled = styled.div`
display: flex;
gap: 1rem
`
export const TextStyled = styled.p`
color: ${defaultTheme.colors.light.textWhite};
font-size: 1.5rem;`

export const LinkStyled = styled.a`
color: ${defaultTheme.colors.light.textWhite};
font-size: 1.5rem;
cursor: pointer;`