exports.getFeed = ( req, res, next ) => {
    res.status(200).json({
        posts: [{
            title: 'first post',
            content: 'test'
        }]
    })
}

exports.postFeed = ( req, res, next ) => {
    const request = req.body
    res.json({
        message: 'Feed successfully created!',
        post: request
    })
}