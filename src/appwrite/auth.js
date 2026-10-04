import { Account, Client, ID } from "appwrite";
import conf from "../conf/conf.js";
export class AuthService {
  client = new Client();
  account;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }
  async createAccount({ email, password, name }) {
    try {
      const response = await this.account.create({
        userId: ID.unique(),
        email: email,
        password: password,
        name: name,
      });
      if (response) {
        return this.login({ email, password });
      } else {
        return response;
      }
    } catch (error) {
      throw error;
    }
  }
  async login({ email, password }) {
    try {
      const response = await this.account.createEmailPasswordSession({
        email: email,
        password: password,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("Appwrite service :: getCurrentUser :: error", error);
    }
    return null;
  }
  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.error("Appwrite service :: logout :: error", error);
    }
  }
}
const authService = new AuthService();
export default authService;
