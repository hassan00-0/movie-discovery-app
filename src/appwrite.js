import { Client, Databases, ID, Query, Account } from "appwrite";

// Configuration
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// Credentials
const MY_EMAIL = import.meta.env.VITE_MY_EMAIL;
const MY_PASSWORD = import.meta.env.VITE_MY_PASSWORD;
const MY_NAME = import.meta.env.VITE_MY_NAME;

// Initialize Appwrite client with NYC endpoint
const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);
const account = new Account(client);

// Auto-login with existing account
export const autoLogin = async () => {
  try {
    // Check if already logged in
    const user = await account.get();
    return user;
  } catch (error) {
    // Only try to login if no existing session
    try {
      await account.createEmailPasswordSession(MY_EMAIL, MY_PASSWORD);
      const user = await account.get();
      return user;
    } catch (loginError) {
      // Don't try to create account - just throw the login error
      throw new Error(`Login failed: ${loginError.message}`);
    }
  }
};

// Update search count in database
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // Check if search term already exists
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    if (result.total > 0) {
      // Update existing record
      const doc = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      // Create new record
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
          : null,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error.message);
  }
};

// Get trending movies from database
export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return result.documents;
  } catch (error) {
    console.error("Error fetching trending movies:", error.message);
    return [];
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};

export { account };
