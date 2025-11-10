"use client"
import { registerUser } from "@/api";
import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #202020;
  font-family: Arial, sans-serif;
`;

const Card = styled.div`
  background: #2C2C2C;
  padding: 2rem 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
  color: white;
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: white;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: #FCD25E;
  color: black;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #E0B44B;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Message = styled.p<{ type: 'success' | 'error' }>`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${(props) => (props.type === 'error' ? '#dc3545' : '#28a745')};
`;

const StyledLink = styled(Link)`
  display: block;
  margin-top: 1.5rem;
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage(null);
        if (password !== passwordConfirmation) {
            setMessage({ type: 'error', text: 'Пароли не совпадают.' });
            return;
        }
        try {
            await registerUser({ name, email, password, password_confirmation: passwordConfirmation });
            setMessage({ type: 'success', text: 'Регистрация выполнена успешно! Вы вошли в систему.' });
            router.push('/')
        } catch (error: any) {
            let errorMessage = 'Ошибка регистрации. Проверьте данные.';
            if (error.response && error.response.data && error.response.data.message) {
                if (error.response.data.message === "The password field must be at least 8 characters.") {
                    errorMessage = "Пароль должен содержать не менее 8 символов.";
                } else {
                    errorMessage = error.response.data.message;
                }
            } else if (error.message) {
                if (error.message === "The password field must be at least 8 characters.") {
                    errorMessage = "Пароль должен содержать не менее 8 символов.";
                } else {
                    errorMessage = error.message;
                }
            }
            setMessage({ type: 'error', text: errorMessage });
        }
    };

    return (
        <Page>
            <Card>
                <Title>Регистрация</Title>
                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="name">Имя:</Label>
                        <Input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="email">Email:</Label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="password">Пароль:</Label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="passwordConfirmation">Подтверждение пароля:</Label>
                        <Input
                            type="password"
                            id="passwordConfirmation"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <Button type="submit">Зарегистрироваться</Button>
                </form>
                {message && <Message type={message.type}>{message.text}</Message>}
                <StyledLink href="/auth/login">Уже есть аккаунт? Войти</StyledLink>
            </Card>
        </Page>
    );
}
export default Register