import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import Passage from '../models/passageModel.js'
// @desc Auth user & get token
// @route POST /api/user/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  console.log('Here in login')

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      completedPassages: user.completedPassages,
      completedQuestions: user.completedQuestions,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      completedPassages: user.completedPassages,
      completedQuestions: user.completedQuestions,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc Register a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      completedPassages: user.completedPassages,
      completedQuestions: user.completedQuestions,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      completedPassages: updatedUser.completedPassages,
      completedQuestions: updatedUser.completedQuestions,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

const updatePassageInfo = asyncHandler(async (req, res) => {
  if (!req.body.passage) {
    return res.status(400).send({
      Status: 'failed',
      message: 'no passage sent!',
    });
  }
  if (!req.body.fields) {
    return res.status(400).send({
      Status: 'failed',
      message: 'no fields sent!',
    });
  }
  
  const fieldsArray = req.body.fields;

  try {
    const updatePromises = fieldsArray.map(async (field) => {
      const doc = await Passage.findOneAndUpdate(
        { 'paragraphs.context': req.body.passage },
        {
          $push: {
            'paragraphs.qas': field,
          },
        },
        { new: true }
      );

      await doc.save();
      return doc;
    });

    const updatedDocs = await Promise.all(updatePromises);

    const user = await User.findById(req.body.user);
    const userUpdated = await User.updateOne(
      { _id: req.body.user },
      { completedPassages: user.completedPassages + updatedDocs.length }
    );

    if (userUpdated && updatedDocs.length > 0) {
      res.json({
        docs: updatedDocs,
      });
    } else {
      res.status(500).send({
        Status: 'failed',
        message: 'user count could not be updated',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      Status: 'failed',
      message: 'An error occurred',
    });
  }
});

const getPassage = asyncHandler(async (req, res) => {
  Passage.count().exec(async function (err, count) {
    var random = Math.floor(Math.random() * count)

    Passage.findOne()
      .skip(random)
      .exec(function (err, result) {
        if (err) {
          res.status(500).send({
            Status: 'Failed',
            message: 'Unable to get random passage from database.',
          })
        } else{
          // console.log(result)
          res.send({
            title: { title_text: '', url: '' },
            paragraphs: {
              context: 'جناح ایک ہندوستانی سیاستدان تھے جنہوں نے ایک آزاد پاکستان کے لیے کامیابی سے مہم چلائی اور اس کے پہلے رہنما بنے۔ وہ قائد اعظم یا عظیم لیڈر کے نام سے جانے جاتے ہیں۔ محمد علی جناح 25 دسمبر 1876 کو کراچی میں پیدا ہوئے۔ ان کے والد ایک خوشحال مسلمان تاجر تھے۔ جناح نے بمبئی یونیورسٹی اور لندن میں لنکن ان میں تعلیم حاصل کی۔ اس نے بمبئی میں ایک کامیاب قانونی پریکٹس کی۔ وہ پہلے ہی انڈین نیشنل کانگریس کے رکن تھے، جو برطانوی راج سے خودمختاری کے لیے کام کر رہے تھے، جب اس نے 1913 میں مسلم لیگ میں شمولیت اختیار کی۔ جناح نے 1920 میں کانگریس چھوڑ دی کیونکہ سیاسی اختلاف تھا۔ لیگ نے چند  سال قبل ایک بنیادی طور پر ہندو ملک میں ہندوستانی مسلمانوں کے مفادات کی نمائندگی کے لیے تشکیل دی تھی،اور جناح پہلی بار 1916 میںاس کے صدر منتخب ہوئے۔ وہ 1937 میں دوبارہ لیگ کے صدر منتخب ہوئے اور6سال صدر رہے۔',
              passage_type: '',
              comprehension_level: '',
              isAnnotated: false
            },
          })
        } 
      })
  })
})

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getPassage,
  updatePassageInfo,
}
