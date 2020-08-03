import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [mess, setMess] = useState('');
    const SIGNUP = gql`
    mutation signup($username: String, $password: String, $email: String) {
            signup(user: {
                        username: $username,
                        password: $password,
                        email: $email
                        }
                )
                         {
    mess
  }
}
    `
    const [signup] = useMutation(SIGNUP);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await signup({
            variables: {
                username: username,
                password: password,
                email: email
            }
        }).then(res => {
            if (res.data.signup.mess === "Signup successfully!") {
                setMess(res.data.signup.mess);
                console.log(res.data.signup.mess);
                setUsername('');
                setPassword('');
            } else {
                setMess(res.data.signup.mess);
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
            <label>Username</label>
            <br />
            <input type="email" placeholder="Enter email" value={email} onChange={event => setEmail(event.target.value)} />
            <br />
            <br />
            <label>Password</label>
            <br />
            <input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter password" />
            <br />
            <br />
            <p style={{ color: "red" }}>{mess}</p>
            <button type="submit" onClick={handleSubmit}>Signup</button>
        </div>
    )
}