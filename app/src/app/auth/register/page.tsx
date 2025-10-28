"use client"
import { registerUser } from "@/api";
import { useEffect } from "react";

const Register = () => {

    useEffect(() => {
        const name = prompt('Введите имя:');
        const email = prompt('Введите email:');
        const password = prompt('Введите пароль:');
        const password_confirmation = prompt('Повторите пароль:');

        if (name && email && password && password_confirmation) {
            registerUser({ name, email, password, password_confirmation }).then(() => {
                alert('Регистрация выполнена успешно! Вы вошли в систему.');
            }).catch(() => {
                alert('Ошибка регистрации. Проверьте данные.');
        })
        }

    } , []);
    return <></>;
}
export default Register