import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mess, setMess] = useState('');
    const LOGIN = gql`
    mutation login($username: String, $password: String) {
            login(user: {
                        username: $username,
                        password: $password
                        }
                )
                         {
    mess
  }
}
    `
    const [addTodo] = useMutation(LOGIN);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await addTodo({
            variables: {
                username: username,
                password: password
            }
        }).then(res => {
            if (res.data.login.mess === "Login successully!") {
                setMess(res.data.login.mess);
                console.log(res.data.login.mess);
                setUsername('');
                setPassword('');
            } else {
                setMess(res.data.login.mess);
            }

        })

    }

    return (
        <div>
            <label>Username</label>
            <br />
            <input type="text" placeholder="Enter username" value={username} onChange={event => setUsername(event.target.value)} />
            <br />
            <br />
            <label>Password</label>
            <br />
            <input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter password" />
            <br />
            <br />
            <p style={{ color: "red" }}>{mess}</p>
            <button type="submit" onClick={handleSubmit}>Login</button>
        </div>
    )
}