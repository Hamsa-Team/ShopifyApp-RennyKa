import React from 'react';
import axios from 'axios';

export default class LogOut extends React.Component {
    render() {
        return (<></>)
    }
}
export async function getServerSideProps(ctx) {
    const res = await axios.get('http://localhost:3000/logout');
    ctx.res.writeHead(301, {
        Location: "/login",
    });
    ctx.res.end();
    return {
        props: {}
    }
}