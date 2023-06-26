const BlogPost = require('../models/BlogPost.model');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find();
        res.json(posts);
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: err.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id).populate('comments');
        if (post == null) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


exports.createPost = async (req, res) => {
    const { title, content, image } = req.body;

    const newBlogPost = new BlogPost({
        title: title,
        content: content,
        author: "Gerti Hysenaj",
        image: image,
        date: new Date()
    });

    try {
        await newBlogPost.save();
        res.status(201).json(newBlogPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await BlogPost.findByIdAndDelete(req.params.id);
        if (post == null) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Deleted Post' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


exports.updatePost = async (req, res) => {
    try {
        let post = await BlogPost.findById(req.params.id);
        if (post == null) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (req.body.title != null) {
            post.title = req.body.title;
        }

        if (req.body.content != null) {
            post.content = req.body.content;
        }

        if (req.body.image != null) {
            post.image = req.body.image;
        }

        post = await post.save();
        res.json(post);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

