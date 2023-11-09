import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import { MongoClient, Db, Collection } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { Follower } from '~/models/schemas/Followers.schema'
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@tweetproject.eth4yec.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  // hàm trả về table users, định nghĩa users này là User có những thuộc tính trong User.schema.ts
  get users(): Collection<User> {
    // as string để bỏ qua lỗi, kết quả trả về là 1 string
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  async indexUsers() {
    await this.users.createIndex({ username: 1 }, { unique: true })
    await this.users.createIndex({ email: 1 }, { unique: true })
    await this.users.createIndex({ email: 1, password: 1 })
  }

  async indexRefreshTokens() {
    this.refreshTokens.createIndex({ token: 1 })
    //đây là ttl index , sẽ tự động xóa các document khi hết hạn của exp
    this.refreshTokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
  }

  async indexFollowers() {
    this.followers.createIndex({ user_id: 1, followed_user_id: 1 })
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }
  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWERS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
