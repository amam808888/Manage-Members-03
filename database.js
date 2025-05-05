const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = "mongodb+srv://rittidetnpk2:D9dIMpjTbf723mWb@manage-member.oz8jjul.mongodb.net/?retryWrites=true&w=majority&appName=Manage-Member";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

run().catch(console.dir);

const db = client.db('Manage-Member')
const members = db.collection('members')

// ฟังก์ชั่นเพิ่มข้อมูลผู้ใช้งาน
const insertMember = async ({ username, password, securityCode, expiryDate }) => {
    try {
        await client.connect();
        const data = {
            username, 
            password, 
            securityCode, 
            expiryDate
        }
        const result = await members.insertOne(data)
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } catch (e) {
        console.warn(e)
    } finally {
        await client.close()
    }
}

// ฟังก์ชั่นลบข้อมูลผู้ใช้งาน
const deleteMember = async (id) => {
    try {
        await client.connect();
        const query = {
            _id: new ObjectId(id)
        }
        const result = await members.deleteOne(query)
        if (result.deletedCount === 1) {
            console.log("Successfully deleted one document.");
          } else {
            console.log("No documents matched the query. Deleted 0 documents.");
          }
    } catch (e) {
        console.warn(e)
    } finally {
        await client.close()
    }
}

// ฟังก์ชั่นดึงข้อมูลผู้ใช้งานทั้งหมด
const getMembers = async () => {
    try {
        await client.connect();
        const result = await members.find().toArray()
        return result
    } catch (e) {
        console.warn(e)
    } finally {
        await client.close()
    }
}

// ฟังก์ชั่นดึงข้อมูลผู้ใช้งานจากการ Login โดยใช้ Username, Password
const getMember = async (query) => {
    try {
        await client.connect();
        const result = await members.findOne(query)
        return result
    } catch (e) {
        console.warn(e)
    } finally {
        await client.close()
    }
}

module.exports = {
    insertMember,
    deleteMember,
    getMembers,
    getMember
}