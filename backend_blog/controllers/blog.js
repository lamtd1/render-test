const route = require('express').Router()
const Blog = require('../models/blog')

route.get('/', (req, res) => {
    Blog.find({}).then(blog => {
        res.json(blog)
    })
})

route.post('/', (req, res, next) => {
    const newBlog = new Blog({
        title: req.body.title,
        author: req.body.author,
        url: req.body.url,
        likes: req.body.likes,
    })

    newBlog.save().then(result => {
        res.status(201).json(result)
    })


})

module.exports = route