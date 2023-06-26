const Comment = require('../models/Comment.model');
const CommunityPost = require('../models/CommunityPost.model');
const BlogPost = require('../models/BlogPost.model');


exports.createComment = async (req, res) => {
    const { content, author, postType } = req.body;
    const { postId } = req.params;

    try {
        let post;

        if (postType === 'CommunityPost') {
            post = await CommunityPost.findById(postId); 
        } else if (postType === 'BlogPost') {
            post = await BlogPost.findById(postId);
        }

        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }

        const comment = new Comment({
            content,
            author,
            postId,
            postType
        });


        await comment.save();


        if (postType === 'BlogPost') {
            post.comments.push(comment._id);
            await post.save();
        }

        return res.status(201).send(comment);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).send({ error: err.message });
        }
      
        return res.status(500).send({ error: 'Something went wrong' });
    }
};




exports.getAllCommentsByPostId = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await Comment.find({ postId });

        return res.status(200).send(comments);
    } catch (err) {
        console.error('Error in getAllCommentsByPostId:', err);
        return res.status(500).send({ error: 'Something went wrong' });
    }
};


exports.updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }

        comment.content = content;
        await comment.save();

        return res.status(200).send(comment);
    } catch (err) {
        return res.status(500).send({ error: 'Something went wrong' });
    }
};

exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }

        await Comment.deleteOne({ _id: commentId });

        return res.status(200).send({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Something went wrong' });
    }
};
