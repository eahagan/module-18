import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      return await User.findById(user._id).populate('savedBooks');
    },
  },

  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return { token, user };
    },

    addUser: async (_, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });

      await newUser.save();
      const token = jwt.sign({ _id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return { token, user: newUser };
    },

    saveBook: async (_, { bookId, authors, description, title, image, link }, { user }) => {
      const newBook = { bookId, authors, description, title, image, link };
      const userData = await User.findById(user._id);
      userData.savedBooks.push(newBook);
      await userData.save();
      return userData;
    },

    removeBook: async (_, { bookId }, { user }) => {
      const userData = await User.findById(user._id);
      userData.savedBooks = userData.savedBooks.filter(book => book.bookId !== bookId);
      await userData.save();
      return userData;
    },
  },
};

export default resolvers;
