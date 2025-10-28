"use client"
import { loginUser } from "@/api";
import { useEffect } from "react";

const Login = () => {

    useEffect(() => {
        const email = prompt('Введите email:');
        const password = prompt('Введите пароль:');

        if (email && password) {
            loginUser({ email, password }).then(() => {
                alert('Вы вошли в систему.');
            }).catch(() => {
                alert('Проверьте данные.');
        })
        }

    } , []);
    return <></>;
}
export default Login