const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const fs = require('fs');
const cors = require('cors')
const database = require('./database')
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()

app.use(cors())
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// แสดงหน้าเว็บจากไฟล์ index.html
app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('./index.html', null, function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Whoops! File not found!');
        } else {
            res.write(data);
        }
        res.end();
    })
})

// เพิ่มข้อมูลผู้ใช้งาน
app.post('/', jsonParser, async (req, res) => {
    await database.insertMember(req.body)
    res.status(200)
    res.send({ status: 'OK' })
})

// ลบข้อมูลผู้ใช้งาน
app.delete('/:id', async (req, res) => {
    const id = req.params.id
    await database.deleteMember(id)
    res.status(200)
    res.send({ status: 'OK' })
})

// ดึงข้อมูลรายชื่อผู้ใช้งานในระบบ
app.get('/getMembers', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const members = await database.getMembers()
    res.json(members)
})

// Login ผ่าน Username, Password
app.post('/login', jsonParser, async (req, res) => {
    const member = await database.getMember(req.body)
    res.json(member)
})