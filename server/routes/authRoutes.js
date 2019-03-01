const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId
const passport = require('passport');
const Course = mongoose.model('course');
const User = mongoose.model('user');
const Post = mongoose.model('post');
const FriendRequest = mongoose.model('friendRequest');

module.exports = (app) => {
    app.get("/auth/google", passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
        res.redirect('/dashboard');
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.get('/api/current_user', (req, res) => {
        if (req.user) {
            res.send({
                user: req.user
            });
        } else {
            res.send({
                user: null
            });
        }
    });

    app.get('/api/users/:id', async (req, res) => {
        const user = await User.findById(req.params.id);

        if (user) {
            res.send({
                user,
                message: ""
            });
        } else {
            res.send({
                user: null,
                message: "Could not find user."
            });
        }
    });

    app.get('/api/users', async (req, res) => {
        const users = await User.find({});

        if (users) {
            res.send(users);
        } else {
            res.send([]);
        }
    });

    app.put('/api/users/update', async (req, res) => {
        const {
            name,
            bio
        } = req.body;

        const updatedUser = await User.findByIdAndUpdate(req.query.id, {
            name,
            bio
        }, {
            new: true
        });

        if (updatedUser) {
            res.send({
                user: updatedUser,
                message: "User was updated successfully."
            });
        } else {
            res.send({
                message: "User could not be updated at the moment."
            });
        }
    });

    app.patch('/api/courses', (req, res) => {
        User.findById(req.body.userId).then(user => {
            Course.findOne({
                class_key: req.body.classKey
            }).then(course => {
                if (course) {
                    if (!user.courses.map(id => id.toString()).includes(course._id.toString())) {
                        user.courses.push(course._id);

                        course.numUsers++;

                        course.save().then(() => {
                            user.save(() => {
                                res.send({
                                    message: "You have been enrolled in " + course.name + "!",
                                    course
                                });
                            });
                        });
                    } else {
                        res.send({
                            message: "You are already enrolled in " + course.name + ".",
                            course
                        });
                    }

                } else {
                    //Error
                    res.send({
                        message: "Could not find course with class key: " + req.body.classKey
                    });
                }
            });
        });

    });

    app.patch('/api/courses/:id/unenroll', async (req, res) => {
        const updatedUser = await User.findByIdAndUpdate(req.query.userId, {
            $pull: {
                courses: req.params.id
            }
        }, {
            new: true
        });

        if (updatedUser) {

            const updatedCourse = await Course.findByIdAndUpdate(req.params.id, {
                $inc: {
                    numUsers: -1
                }
            });

            if (updatedCourse) {
                res.send({
                    courseId: req.params.id,
                    message: "Unenrolled from course successfully."
                });
            } else {
                res.send({
                    message: "Could not unenroll from the course at the moment."
                });
            }

        } else {
            res.send({
                message: "Could not unenroll from the course at the moment."
            });
        }
    });

    app.get('/api/courses/:id', (req, res) => {
        Course.findById(req.params.id).then(course => {
            if (course) {
                res.send(course);
            }
        });
    });

    app.post('/api/courses/', (req, res) => {
        const ids = req.body.ids.map(id => ObjectId(id));

        Course.find({
            _id: {
                $in: ids
            }
        }).then(courses => {
            res.send(courses)
        });
    });

    app.post('/api/courses/new', async (req, res) => {
        const course = Course({
            name: req.body.courseName,
            description: req.body.courseDescription,
            category: req.body.courseCategory,
            number: req.body.courseNumber,
            numUsers: 0
        });

        const message = await course.save();

        if (message) {
            res.send({
                message: "Course has been successfully created!"
            })
        } else {
            res.send({
                message: "Course could not be created at this time!"
            });
        }
    });

    app.get('/api/posts', async (req, res) => {
        // const post = Post({
        //     title: "Eigenvalues",
        //     topic: "Electrical Engineering",
        //     content: "Eigenvalues are super important in linear algebra.",
        //     _author: ObjectId("5c15534a5a3bbc261f8f2d34"),
        //     course: req.query.courseId,
        //     likes: 0,
        //     student_votes: 0
        // })

        // const message = post.save();

        // if (message) {
        //     console.log("Post Created");
        // }
        const posts = await Post.find({
            course: req.query.courseId
        }).sort({
            updatedAt: -1
        }).populate('_author');

        if (posts) {
            res.send(posts);
        } else {
            res.send([]);
        }
    });

    app.post('/api/posts/new', async (req, res) => {
        const post = Post({
            topics: req.body.topics,
            content: req.body.content,
            _author: req.body._author,
            course: req.body.course,
            likes: 0,
            student_votes: 0
        });

        const savedPost = await post.save();

        if (savedPost) {
            const populatedPost = await Post.populate(savedPost, {
                path: "_author"
            });

            res.send({
                message: "Post Created",
                post: populatedPost
            });

        } else {
            res.send({
                message: "Post could not be created at this time."
            });
        }
    });

    app.delete('/api/posts/delete/:id', async (req, res) => {

        const response = await Post.findOneAndDelete({
            _author: req.query.authorId,
            _id: req.params.id
        });

        if (response) {
            res.send({
                deletedPostId: req.params.id,
                message: "Post deleted successfully."
            });
        } else {
            res.send({
                message: "Post could not be deleted at the moment."
            });
        }
    });


    app.post('/api/posts/:id/like', async (req, res) => {
        var options = {}
        var pushOrPull = '$pull';
        var incOrDec = -1;

        if (!req.body.liked) {
            pushOrPull = '$push';
            incOrDec = 1
        }

        options[pushOrPull] = {
            likedBy: req.body.userId
        }
        options['$inc'] = {
            likes: incOrDec
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, options, {
            new: true
        });

        if (updatedPost) {
            res.send({
                post: updatedPost,
                message: "Like updated successfully"
            });
        } else {
            res.send({
                message: "Like could not be processed."
            });
        }
    });

    app.get('/api/courses/:id/students', async (req, res) => {

        const users = await User.find({
            courses: req.params.id
        });

        if (users) {
            res.send(users);
        } else {
            res.send([]);
        }
    });

    app.post('/api/friends/new', async (req, res) => {
        const newFriendRequest = new FriendRequest({
            sender: req.body.senderId,
            recipient: req.body.recipientId,
            status: false
        });

        const request = newFriendRequest.save();

        if (request) {
            res.send({
                request,
                message: "Friend request sent."
            });
        } else {
            res.send({
                request: null,
                message: "Friend request could not be sent."
            });
        }
    });

    app.get('/api/friends/request', async (req, res) => {

        const sentRequest = await FriendRequest.findOne({
            sender: req.query.user1Id,
            recipient: req.query.user2Id
        });

        if (sentRequest) {
            res.send({
                request: sentRequest,
                message: "Friend request found."
            });
        } else {
            const receivedRequest = await FriendRequest.findOne({
                sender: req.query.user2Id,
                recipient: req.query.user1Id
            });

            if (receivedRequest) {
                res.send({
                    request: receivedRequest,
                    message: "Friend request found."
                });
            } else {
                res.send({
                    request: null,
                    message: "Friend request does not exist"
                });
            }
        }
    });

    app.delete('/api/friends/request/delete', async (req, res) => {

        const response = await FriendRequest.findOneAndDelete({
            sender: req.query.senderId,
            recipient: req.query.recipientId
        });

        if (response) {
            res.send({
                message: "Friend request canceled"
            });
        } else {
            res.send({
                message: "Friend request could not be canceled."
            });
        }
    });

    app.delete('/api/friends/delete', async (req, res) => {

        var response = await FriendRequest.findOneAndDelete({
            sender: req.query.senderId,
            recipient: req.query.recipientId,
            status: true
        });

        if (!response) {
            response = await FriendRequest.findOneAndDelete({
                sender: req.query.recipientId,
                recipient: req.query.senderId,
                status: true
            });
        }

        if (response) {
            const sender = await User.findByIdAndUpdate(req.query.senderId, {
                $pull: {
                    friends: req.query.recipientId
                }
            }, {
                new: true
            });

            if (sender) {
                const recipient = await User.findByIdAndUpdate(req.query.recipientId, {
                    $pull: {
                        friends: req.query.senderId
                    }
                }, {
                    new: true
                });

                if (recipient) {
                    res.send({
                        friendId: req.query.recipientId,
                        message: "Unfriended successfully."
                    });
                } else {
                    res.send({
                        message: "Could not unfriend at the moment."
                    });
                }
            } else {
                res.send({
                    message: "Could not unfriend at the moment."
                });
            }

        } else {
            res.send({
                message: "Could not unfriend at the moment."
            });
        }
    });

    app.post('/api/friends/request/accept', async (req, res) => {

        const updatedFriendRequest = await FriendRequest.findOneAndUpdate({
            sender: req.query.senderId,
            recipient: req.query.recipientId
        }, {
            status: true
        }, {
            new: true
        });

        if (updatedFriendRequest) {

            const updatedSender = await User.findByIdAndUpdate(req.query.senderId, {
                $push: {
                    friends: req.query.recipientId
                }
            });

            if (updatedSender) {
                const updatedReceiver = await User.findByIdAndUpdate(req.query.recipientId, {
                    $push: {
                        friends: req.query.senderId
                    }
                });

                if (updatedReceiver) {
                    res.send({
                        request: updatedFriendRequest,
                        message: "Accepted friend request successfully."
                    });
                } else {
                    res.send({
                        request: null,
                        message: "Could not accept friend request at the moment"
                    });
                }

            } else {
                res.send({
                    request: null,
                    message: "Could not accept friend request at the moment"
                });
            }

        } else {
            res.send({
                request: null,
                message: "Could not accept friend request at the moment"
            });
        }
    });

    app.delete('/api/friends/request/decline', async (req, res) => {

        const response = await FriendRequest.findOneAndDelete({
            sender: req.query.senderId,
            recipient: req.query.recipientId
        });

        if (response) {
            res.send({
                message: "Declined friend request successfully."
            });
        } else {
            res.send({
                message: "Could not decline friend request at the moment."
            });
        }
    });

    app.get('/api/friends/requests', async (req, res) => {

        const query = {};

        if (req.query.recipientId) {
            query['recipient'] = req.query.recipientId;
        } else {
            query['sender'] = req.query.senderId;
        }

        query['status'] = false

        const requests = await FriendRequest.find(query).populate(req.query.recipientId ? 'sender' : 'recipient');

        if (requests) {
            res.send({
                requests,
                message: "Friend requests found."
            });
        } else {
            res.send({
                requests: [],
                message: "No existing friend requests."
            });
        }
    });

    app.get('/api/friends', async (req, res) => {
        const user = await User.findById(req.query.userId).populate('friends');

        if (user) {
            res.send({
                friends: user.friends,
                message: "Found friends."
            });
        } else {
            res.send({
                message: "Could not find user."
            });
        }
    });
};