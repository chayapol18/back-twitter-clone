const { Tweet, Bookmark, Follow, User, Retweet } = require("../models");

exports.getUserTweets = async (req, res, next) => {
  try {
    const tweets = await Tweet.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "desc"]],
      include: {
        model: User,
        attributes: ["id", "name", "username", "profileImg"],
      },
      attributes: ["id", "content", "createdAt", "like", "retweets"],
    });

    const retweets = await Retweet.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "desc"]],
      include: [
        {
          model: Tweet,
          attributes: ["id", "content", "createdAt", "like", "retweets"],
          include: {
            model: User,
            attributes: ["id", "name", "username", "profileImg"],
          },
        },
        {
          model: User,
          attributes: ["id", "name", "username", "profileImg"],
        },
      ],
    });

    const tweetsIncRetweets = [...tweets, ...retweets];

    const sortTweets = tweetsIncRetweets.sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });
    console.log(JSON.parse(JSON.stringify(sortTweets)));

    res.status(200).json({ tweets: sortTweets });
  } catch (err) {
    next(err);
  }
};

exports.getOtherUserTweets = async (req, res, next) => {
  try {
    const { id } = req.params
    const tweets = await Tweet.findAll({
      where: { userId: id },
      order: [["createdAt", "desc"]],
      include: {
        model: User,
        attributes: ["id", "name", "username", "profileImg"],
      },
      attributes: ["id", "content", "createdAt", "like", "retweets"],
    });

    const retweets = await Retweet.findAll({
      where: { userId: id },
      order: [["createdAt", "desc"]],
      include: [
        {
          model: Tweet,
          attributes: ["id", "content", "createdAt", "like", "retweets"],
          include: {
            model: User,
            attributes: ["id", "name", "username", "profileImg"],
          },
        },
        {
          model: User,
          attributes: ["id", "name", "username", "profileImg"],
        },
      ],
    });

    const tweetsIncRetweets = [...tweets, ...retweets];

    const sortTweets = tweetsIncRetweets.sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });
    console.log(JSON.parse(JSON.stringify(sortTweets)));

    res.status(200).json({ tweets: sortTweets });
  } catch (err) {
    next(err);
  }
};

exports.getAllTweets = async (req, res, next) => {
  try {
    const requestToFollowId = await Follow.findAll({
      where: {
        followByUserId: req.user.id,
      },
      attributes: ["followingUserId"],
    });

    const toIds = requestToFollowId.map((item) => {
      return item.followingUserId;
    });
    console.log(JSON.parse(JSON.stringify(requestToFollowId)));
    console.log(toIds);

    const followsIncludeMe = [req.user.id, ...toIds];

    const tweets = await Tweet.findAll({
      where: { userId: followsIncludeMe },
      order: [["createdAt", "desc"]],
      include: {
        model: User,
        attributes: ["id", "name", "username", "profileImg"],
      },
      attributes: ["id", "content", "createdAt", "like", "retweets"],
    });
    res.status(200).json({ tweets });
  } catch (err) {
    next(err);
  }
};

exports.getTweetsIncReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    const replyTweet = await Tweet.findOne({
      where: {
        replyToTweetId: id,
      },
    });

    const mainTweet = await Tweet.findOne({
      where: {
        id,
      },
      include: {
        model: User,
        attributes: ["id", "name", "username", "profileImg"],
      },
    });

    const ReplyToMainTweet = await Tweet.findAll({
      where: {
        id,
      },
      attributes: [],
      include: [
        {
          model: Tweet,
          as: "replyTo",
          where: {
            replyToTweetId: id,
          },
          include: {
            model: User,
            attributes: ["id", "name", "username", "profileImg"],
          },
        },
      ],
    });

    res.status(200).json({
      tweetWithReply: replyTweet
        ? { mainTweet, ReplyToMainTweet }
        : { mainTweet: mainTweet },
    });
  } catch (err) {
    next(err);
  }
};

exports.retweet = async (req, res, next) => {
  try {
    const { tweetId } = req.body;

    const retweet = await Retweet.create({
      tweetId,
      userId: req.user.id,
    });

    res.status(201).json({ retweet });
  } catch (err) {
    next(err);
  }
};

exports.getTweetInRetweets = async (req, res, next) => {
  try {
    const { id } = req.params
    const retweets = await Retweet.findOne({
      where: { userId: req.user.id, tweetId: id }
    });

    res.status(200).json({ retweets });
  } catch(err) {
    next(err)
  }
}

exports.increaseLike = async (req, res, next) => {
  try {
    const { tweetId } = req.body;
    const tweet = await Tweet.findOne({ where: { id: tweetId } });

    await Tweet.update(
      {
        like: tweet.like + 1,
      },
      {
        where: {
          id: tweetId,
        },
      }
    );

    res.status(200).json({ message: "you like this tweet" });
  } catch (err) {
    next(err);
  }
};

exports.increaseRetweet = async (req, res, next) => {
  try {
    const { tweetId } = req.body;
    const tweet = await Tweet.findOne({ where: { id: tweetId } });

    await Tweet.update(
      {
        retweets: tweet.retweets + 1,
      },
      {
        where: {
          id: tweetId,
        },
      }
    );

    res.status(200).json({ message: "you retweet this tweet" });
  } catch (err) {
    next(err);
  }
};

exports.decreaseRetweet = async (req, res, next) => {
  try {
    const { tweetId } = req.body;
    const tweet = await Tweet.findOne({ where: { id: tweetId } });

    await Tweet.update(
      {
        retweets: tweet.retweets - 1,
      },
      {
        where: {
          id: tweetId,
        },
      }
    );

    res.status(200).json({ message: "you undo retweet this tweet" });
  } catch (err) {
    next(err);
  }
};

exports.getTweetsInBookmark = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.findAll({
      where: {
        userId: req.user.id,
      },
      attributes: [],
      order: [["createdAt", "desc"]],
      include: {
        model: Tweet,
        order: [["createdAt", "desc"]],
        include: {
          model: User,
          attributes: ["id", "name", "username", "profileImg"],
        },

        attributes: ["id", "content", "createdAt", "like", "retweets"],
      },
    });

    res.status(200).json({ tweets: bookmarks });
  } catch (err) {
    next(err);
  }
};

exports.addTweet = async (req, res, next) => {
  try {
    const { content, levelTweetId, replyToTweetId } = req.body;
    const tweet = await Tweet.create({
      levelTweetId,
      userId: req.user.id,
      content,
      replyToTweetId,
    });

    res.status(201).json({ tweet });
  } catch (err) {
    next(err);
  }
};

exports.addBookmark = async (req, res, next) => {
  try {
    const { tweetId } = req.body;
    const tweet = await Tweet.findOne({ where: { id: tweetId } });
    if (!tweet) return res.status(400).json({ message: "tweet is not found" });

    const tweetInBookmark = await Bookmark.findOne({ where: { tweetId } });
    if (tweetInBookmark)
      return res
        .status(400)
        .json({ message: "you already bookmark this tweet" });

    const bookmark = await Bookmark.create({
      tweetId,
      userId: req.user.id,
    });

    res.status(201).json({ bookmark });
  } catch (err) {
    next(err);
  }
};

exports.deleteTweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tweet = await Tweet.findOne({ where: { id } });
    if (!tweet) return res.status(400).json({ message: "tweet not found" });
    if (tweet.userId !== req.user.id)
      return res
        .status(400)
        .json({ message: `cannot delete other user's tweet` });

    await tweet.destroy();

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.cancelRetweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const retweet = await Retweet.findOne({
      where: { tweetId: id, userId: req.user.id },
    });
    if (!retweet)
      return res.status(400).json({ message: "retweet not found" });
    if (retweet.userId !== req.user.id)
      return res
        .status(400)
        .json({ message: `cannot undo other user's retweet` });

    await retweet.destroy();

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.deleteBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bookmark = await Bookmark.findOne({
      where: { tweetId: id, userId: req.user.id },
    });
    if (!bookmark)
      return res.status(400).json({ message: "bookmark not found" });
    if (bookmark.userId !== req.user.id)
      return res
        .status(400)
        .json({ message: `cannot delete other user's bookmark` });

    await bookmark.destroy();

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
