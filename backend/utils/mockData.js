// Shared mock data for development when database is not connected
const mongoose = require('mongoose');

let mockUsers = [];
let mockUserId = 1;

const addMockUser = (user) => {
  const userId = mockUserId++;
  // Generate a proper ObjectId format for mock users
  const mockObjectId = new mongoose.Types.ObjectId();
  const newUser = {
    ...user,
    _id: mockObjectId,
    id: mockObjectId.toString(),
    createdAt: new Date(),
    getSignedJwtToken: () => `mock-jwt-token-${mockObjectId}-${Date.now()}`
  };
  mockUsers.push(newUser);
  return newUser;
};

const findMockUserByEmail = (email) => {
  return mockUsers.find(user => user.email === email);
};

const findMockUserById = (id) => {
  return mockUsers.find(user => user._id == id);
};

const clearMockUsers = () => {
  mockUsers = [];
  mockUserId = 1;
};

module.exports = {
  get mockUsers() { return mockUsers; },
  addMockUser,
  findMockUserByEmail,
  findMockUserById,
  clearMockUsers
};