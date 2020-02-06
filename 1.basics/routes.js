const fileSystem = require('fs')

/* --------------------------------- HANDLER -------------------------------- */
const requestHandler = (req, res) => {

    const url = req.url
    const method = req.method
    res.setHeader('Content-Type', 'text/html')

    if(url === '/'){
        res.write(
            `
            <html>
                <head><title>This is sform page</title></head>
                <body>
                    <form action="/message" method="POST">
                        <input type="text" name="name" placeholder="enter a messages ...">
                        <input type="submit" value="SUBMIT">
                    </form>
                </body>
            </html>
            `
        )
        return res.end()
    }
    
    if(url === '/message' && method === 'POST'){
        const body = []
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk)
        })
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString()
            const message = parsedBody.split('=')[1]
            fileSystem.writeFile('message.txt', message, (err) => {
                res.statusCode = 302
                // res.setHeader('Location', '/')
                return res.end()
            })
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

// module.exports = requestHandler

module.exports = {
    handler : requestHandler,
    sampleText : 'Sample Text'
}
