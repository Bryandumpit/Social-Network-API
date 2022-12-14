const { User } = require('../models');

const userController = {

    //GET all users
    getAllUsers (req,res) {
        User.find({})
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    } ,
    // GET one user by ID
    getUser({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v',
            })
            .select('-__v')
            .then((dbUserData) => {
                if (!dbUserData) {
                return res
                    .status(404)
                    .json({ message: 'User not found!' });
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // create user
    createUser({ body }, res) {
        User.create(body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.json(err));
    },

    // update user by id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true,
        })
            .then((dbUserData) => {
                if (!dbUserData) {
                res.status(404).json({ message: 'User not found!' });
                return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },

    // delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then((dbUserData) => {
                if (!dbUserData) {
                return res.status(404).json({ message: 'User not found!' });
                }
            })
            .then(() => {
                res.json({ message: 'User and associated thoughts deleted!' });
            })
            .catch((err) => res.json(err));
    },

    // add friend
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .then((dbUserData) => {
                if (!dbUserData) {
                res.status(404).json({ message: 'User not found!' });
                return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },

    // delete friend
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
            .then((dbUserData) => {
                if (!dbUserData) {
                return res.status(404).json({ message: 'User not found!' });
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },
}

module.exports = userController;