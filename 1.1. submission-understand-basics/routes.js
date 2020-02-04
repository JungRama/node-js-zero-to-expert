const requestHandler = (req, res) => {
    const url = req.url
    const method = req.method

    if(url === '/'){
        res.write(
            `
            <html>
                <head><title>Greeting Text</title></head>
                <body>
                    <h1>Greeting Text</h1>
                    <form action="/create-user" method="POST">
                        <input type="text" name="name" placeholder="enter a user ...">
                        <input type="submit" value="SUBMIT">
                    </form>
                </body>
            </html>
            `
        )
        return res.end()
    }

    if(url === '/users'){
        res.write(
            `
            <html>
                <head><title>Greeting Text</title></head>
                <body>
                    <ul>
                        <li>User 1</li>
                    </ul>
                </body>
            </html>
            `
        )
        return res.end()
    }

    if(url === '/create-user' && method === 'POST'){
        const body = []
        req.on('data', (chunk) => {
            body.push(chunk)
        })
        req.on('end', () => {
            const pasedBody = Buffer.concat(body).toString()
            const user = pasedBody.split('=')[1]
            console.log(user);
        })
    }

    res.write(
        `
        <html>
            <head><title>This is node js</title></head>
            <body><h1>Hello There</h1></body>
        </html>
        `
    )
    res.end()
}

module.exports = {
    handler : requestHandler
}