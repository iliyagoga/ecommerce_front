import { defaultTheme } from "@/themes/defaultTheme";
import styled from "styled-components";

export const HeaderStyled = styled.header`
display: flex;
justify-content: space-between;
align-items: center;
background: ${defaultTheme.colors.light.default};
padding: 1rem 2rem;
`