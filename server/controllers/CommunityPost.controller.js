const CommunityPost = require('../models/CommunityPost.model'); 

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await CommunityPost.find();
        res.json(posts);
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: err.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await CommunityPost.findById(req.params.id);
        if (post == null) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.createPost = async (req, res) => {
    const { title, content } = req.body;

    const newCommunityPost = new CommunityPost({
        title: title,
        content: content,
        author: "Gerti Hysenaj", 
        date: new Date()
    });

    try {
        await newCommunityPost.save();
        res.status(201).json(newCommunityPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await CommunityPost.findByIdAndDelete(req.params.id);
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
        let post = await CommunityPost.findById(req.params.id);
        if (post == null) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (req.body.title != null) {
            post.title = req.body.title;
        }

        if (req.body.content != null) {
            post.content = req.body.content;
        }

        post = await post.save();
        res.json(post);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
