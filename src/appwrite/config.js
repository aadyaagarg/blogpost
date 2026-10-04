import { Client, ID, Query, Storage, TablesDB } from "appwrite";
import conf from "../conf/conf.js";

export class DatabaseService {
  client = new Client();
  tablesDB;
  storage;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.tablesDB = new TablesDB(this.client);
    this.storage = new Storage(this.client);
  }
  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.tablesDB.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteTableId,
        rowId: ID.unique(),
        data: {
          title,
          slug,
          content,
          featuredImage,
          status,
          userId,
        },
      });
    } catch (error) {
      console.error("Appwrite service :: createPost :: error", error);
    }
  }
  async updatePost(rowId, { title, slug, content, featuredImage, status }) {
    try {
      return await this.tablesDB.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteTableId,
        rowId,
        data: {
          title,
          slug,
          content,
          featuredImage,
          status,
        },
      });
    } catch (error) {
      console.error("Appwrite service :: updatePost :: error", error);
    }
  }
  async deletePost(rowId) {
    try {
      await this.tablesDB.deleteRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteTableId,
        rowId,
      });
      return true;
    } catch (error) {
      console.error("Appwrite service :: deletePost :: error", error);
      return false;
    }
  }
  async getPost(rowId) {
    try {
      return await this.tablesDB.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteTableId,
        rowId,
      });
    } catch (error) {
      console.error("Appwrite service :: getPost :: error", error);
      return false;
    }
  }
  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      const response = await this.tablesDB.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteTableId,
        queries,
      });
      return response.rows;
    } catch (error) {
      console.error("Appwrite service :: getPosts :: error", error);
      return false;
    }
  }
  async uploadFile(file) {
    try {
      return await this.storage.createFile({
        bucketId: conf.appwriteBucketId,
        fileId: ID.unique(),
        file,
      });
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error", error);
      return false;
    }
  }
  async deleteFile(fileId) {
    try {
      await this.storage.deleteFile({
        bucketId: conf.appwriteBucketId,
        fileId,
      });
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }
  getFileView(fileId) {
    return this.storage.getFileView({
      bucketId: conf.appwriteBucketId,
      fileId,
    });
  }
}
const databaseService = new DatabaseService();
export default databaseService;
